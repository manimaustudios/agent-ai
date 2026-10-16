const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Exercise the real application modules with in-memory Stripe/Firestore boundaries.
// These tests cannot contact Stripe, charge cards, or change production accounts.
function harness(overrides = {}) {
  const docs = new Map([
    ["users/u1", { email: "test@example.com", freeMessagesUsed: 0 }],
  ]);
  const env = {
    STRIPE_SECRET_KEY: "sk_live_fixture",
    REAL_SUBSCRIPTION_PRICE_ID: "price_month",
    PRODUCTION_BASE_URL: "https://example.com",
    ...overrides,
  };
  const calls = [];
  let clock = 1800000000;
  const subscription = {
    id: "sub_1",
    metadata: { buyerFirestoreId: "u1" },
    status: "active",
    customer: "cus_1",
    current_period_end: clock + 86400,
    cancel_at_period_end: false,
    created: clock - 100,
  };
  const intent = {
    id: "pi_1",
    status: "succeeded",
    metadata: { buyerFirestoreId: "u1", purchasePlan: "lifetime" },
    latest_charge: {
      id: "ch_1",
      refunded: false,
      disputed: false,
      payment_intent: "pi_1",
    },
  };
  const stripe = {
    prices: {
      retrieve: async (id) => ({
        id,
        active: true,
        currency: "usd",
        unit_amount: id === "price_month" ? 499 : 4999,
        type: id === "price_month" ? "recurring" : "one_time",
        recurring: { interval: "month", interval_count: 1 },
      }),
    },
    checkout: {
      sessions: {
        listLineItems: async () => ({
          data: [
            { quantity: 1, price: { id: "price_1UR8dZGIRNfFNwjggxF0WuaV" } },
          ],
        }),
        create: async (params) => {
          calls.push(params);
          return { url: "https://checkout.stripe.com/test" };
        },
        retrieve: async () => ({ ...session }),
      },
    },
    paymentIntents: { retrieve: async () => intent },
    charges: { retrieve: async () => intent.latest_charge },
    disputes: { list: async () => ({ data: [{ status: "needs_response" }] }) },
    subscriptions: {
      retrieve: async (id) => ({ ...subscription, id }),
      update: async (id, params) => {
        calls.push({ subscription: id, ...params });
        return { ...subscription, id, ...params };
      },
    },
  };
  const snapshot = (ref) => ({
    exists: () => docs.has(ref),
    data: () => docs.get(ref),
  });
  const update = (ref, values) => {
    if (!docs.has(ref)) throw Error("Missing document");
    docs.set(ref, { ...docs.get(ref), ...values });
  };
  let queue = Promise.resolve();
  const firestore = {
    doc: (_db, collection, id) => `${collection}/${id}`,
    getDoc: async (ref) => snapshot(ref),
    updateDoc: async (ref, values) => update(ref, values),
    setDoc: async (ref, values, options) =>
      docs.set(ref, { ...(options?.merge ? docs.get(ref) : {}), ...values }),
    Timestamp: {
      now: () => ({ seconds: clock }),
      fromMillis: (ms) => ({ seconds: ms / 1000 }),
    },
    runTransaction: (_db, callback) => {
      const work = queue.then(() =>
        callback({ get: async (ref) => snapshot(ref), update }),
      );
      queue = work.catch(() => {});
      return work;
    },
  };
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const source = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const requireMock = (name) => {
      if (name === "server-only") return {};
      if (name === "stripe")
        return class Stripe {
          constructor() {
            return stripe;
          }
        };
      if (name === "firebase/firestore") return firestore;
      if (name === "@clerk/nextjs/server")
        return { auth: async () => ({ userId: "u1" }) };
      if (name === "next/navigation")
        return {
          redirect: (url) => {
            throw Error(`REDIRECT:${url}`);
          },
        };
      if (name === "next/cache") return { revalidatePath: () => {} };
      if (name.endsWith("/firebase") || name === "./firebase")
        return { db: {} };
      const resolved = name.startsWith("@/")
        ? path.resolve(name.slice(2))
        : path.resolve(path.dirname(absolute), name);
      return load(resolved + ".ts");
    };
    vm.runInNewContext(
      `(function(require,module,exports,process){${source}\n})`,
      { console, Date, setTimeout },
    )(requireMock, module, module.exports, { env });
    return module.exports;
  }
  docs.set("settings/SITE_SETTINGS", {
    msgAmountLimitMonthly: 5000,
    price: 4.99,
  });
  const session = {
    id: "cs_1",
    created: clock,
    mode: "payment",
    status: "complete",
    livemode: true,
    payment_status: "paid",
    payment_intent: "pi_1",
    metadata: { buyerFirestoreId: "u1", purchasePlan: "lifetime" },
  };
  return {
    docs,
    stripe,
    intent,
    subscription,
    calls,
    session,
    load,
    env,
    setClock: (value) => {
      clock = value;
    },
    billing: load("lib/billing.ts"),
  };
}

test("paid lifetime checkout grants access; replay is safe", async () => {
  const h = harness();
  await h.billing.handleCheckoutSessionCompleted(h.session);
  await h.billing.handleCheckoutSessionCompleted(h.session);
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "active");
  assert.equal(h.docs.get("users/u1").lifetimePaymentIntentId, "pi_1");
});
test("unpaid checkout never grants lifetime", async () => {
  const h = harness();
  await h.billing.handleCheckoutSessionCompleted({
    ...h.session,
    payment_status: "unpaid",
  });
  assert.equal(h.docs.get("users/u1").lifetimeStatus, undefined);
});
test("different price cannot grant lifetime", async () => {
  const h = harness();
  h.stripe.checkout.sessions.listLineItems = async () => ({
    data: [{ quantity: 1, price: { id: "price_wrong" } }],
  });
  await assert.rejects(
    h.billing.handleCheckoutSessionCompleted(h.session),
    /Unexpected/,
  );
});
test("late completion cannot restore a refunded purchase", async () => {
  const h = harness();
  h.intent.latest_charge.refunded = true;
  await h.billing.handleCheckoutSessionCompleted(h.session);
  assert.equal(h.docs.get("users/u1").lifetimeStatus, undefined);
});
test("lifetime upgrade stops monthly renewal and survives old subscription cancellation", async () => {
  const h = harness();
  h.docs.set("users/u1", { subscriptionId: "sub_1" });
  h.session.metadata.previousSubscriptionId = "sub_1";
  await h.billing.handleCheckoutSessionCompleted(h.session);
  assert.equal(h.calls[0].cancel_at_period_end, true);
  h.subscription.status = "canceled";
  await h.billing.handleSubscriptionEvent({
    type: "customer.subscription.deleted",
    data: { object: h.subscription },
  });
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "active");
});
test("full refund revokes lifetime; partial refund preserves it", async () => {
  const h = harness();
  await h.billing.handleCheckoutSessionCompleted(h.session);
  await h.billing.handleLifetimeChargeEvent({
    type: "charge.refunded",
    data: { object: { id: "ch_1" } },
  });
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "active");
  h.intent.latest_charge.refunded = true;
  await h.billing.handleLifetimeChargeEvent({
    type: "charge.refunded",
    data: { object: { id: "ch_1" } },
  });
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "refunded");
});
test("open disputes suspend lifetime; winning restores it", async () => {
  const h = harness();
  await h.billing.handleCheckoutSessionCompleted(h.session);
  h.intent.latest_charge.disputed = true;
  const event = {
    type: "charge.dispute.created",
    data: { object: { charge: "ch_1" } },
  };
  await h.billing.handleLifetimeChargeEvent(event);
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "disputed");
  h.stripe.disputes.list = async () => ({ data: [{ status: "won" }] });
  await h.billing.handleLifetimeChargeEvent({
    ...event,
    type: "charge.dispute.closed",
  });
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "active");
});
test("old subscription events do not change the latest subscription", async () => {
  const h = harness();
  h.docs.set("users/u1", { subscriptionId: "sub_new", status: "active" });
  h.subscription.status = "canceled";
  await h.billing.syncSubscription(h.subscription);
  assert.equal(h.docs.get("users/u1").status, "active");
});
test("test mode requires test lifetime price and never falls back to live ID", () => {
  const h = harness({ STRIPE_SECRET_KEY: "sk_test_fixture" });
  assert.throws(() => h.billing.getPlanPriceId("lifetime"), /not configured/);
});
test("checkout rejects spoofed account IDs", async () => {
  const h = harness();
  const actions = h.load("lib/actions/transaction.ts");
  await assert.rejects(
    actions.checkoutPayment("someone_else", "lifetime"),
    /sign in/,
  );
  assert.equal(h.calls.length, 0);
});
test("lifetime uses one-time checkout; monthly stays recurring", async () => {
  const h = harness();
  const actions = h.load("lib/actions/transaction.ts");
  await assert.rejects(actions.checkoutPayment("u1", "lifetime"), /REDIRECT:/);
  await assert.rejects(actions.checkoutPayment("u1", "monthly"), /REDIRECT:/);
  assert.equal(h.calls[0].mode, "payment");
  assert.equal(h.calls[1].mode, "subscription");
  assert.equal(h.calls[0].payment_intent_data.metadata.buyerFirestoreId, "u1");
});
test("checkout rejects a Stripe price that differs from the advertised amount", async () => {
  const h = harness();
  h.stripe.prices.retrieve = async () => ({
    active: true,
    currency: "usd",
    unit_amount: 9999,
    type: "one_time",
  });
  await assert.rejects(
    h.load("lib/actions/transaction.ts").checkoutPayment("u1", "lifetime"),
    /unavailable/,
  );
});
test("cancellation schedules period end instead of deleting subscription", async () => {
  const h = harness();
  h.docs.set("users/u1", { subscriptionId: "sub_1" });
  await h.load("lib/actions/transaction.ts").cancelSubscription("u1");
  assert.equal(h.calls[0].cancel_at_period_end, true);
  assert.equal(h.docs.get("users/u1").status, "active");
});
test("free allowance never replenishes after waiting or paid cancellation", async () => {
  const h = harness();
  h.docs.set("users/u1", {
    freeMessagesUsed: 10,
    firstMsgTime: { seconds: 1 },
    status: "canceled",
  });
  const usage = h.load("lib/usage.ts");
  await assert.rejects(usage.reserveMessage("u1"), /FREE_LIMIT_REACHED/);
  h.setClock(1900000000);
  await assert.rejects(usage.reserveMessage("u1"), /FREE_LIMIT_REACHED/);
});
test("concurrent requests cannot exceed the remaining free quota", async () => {
  const h = harness();
  h.docs.set("users/u1", { freeMessagesUsed: 9 });
  const usage = h.load("lib/usage.ts");
  const results = await Promise.allSettled([
    usage.reserveMessage("u1"),
    usage.reserveMessage("u1"),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(h.docs.get("users/u1").freeMessagesUsed, 10);
});
test("failed AI request can return its reserved free message", async () => {
  const h = harness();
  const usage = h.load("lib/usage.ts");
  const reserved = await usage.reserveMessage("u1");
  await usage.releaseMessage(reserved);
  assert.equal(h.docs.get("users/u1").freeMessagesUsed, 0);
});
test("paid users retain separate quota without consuming the free allowance", async () => {
  const h = harness();
  h.docs.set("users/u1", {
    lifetimeStatus: "active",
    freeMessagesUsed: 7,
    msgAmountMonthly: 5000,
    firstMsgTimeMonthly: { seconds: 1799999990 },
  });
  const usage = h.load("lib/usage.ts");
  await assert.rejects(usage.reserveMessage("u1"), /PREMIUM_LIMIT_REACHED/);
  h.setClock(1810000000);
  await usage.reserveMessage("u1");
  assert.equal(h.docs.get("users/u1").msgAmountMonthly, 1);
  assert.equal(h.docs.get("users/u1").freeMessagesUsed, 7);
});
test("expired monthly subscription is not an entitlement even with stale active user status", () => {
  const h = harness();
  const { hasPremiumAccess } = h.load("lib/access.ts");
  assert.equal(
    hasPremiumAccess({}, { status: "active", nextBillingDate: "2020-01-01" }),
    false,
  );
  assert.equal(hasPremiumAccess({ lifetimeStatus: "active" }), true);
});

test("checkout return cannot confirm another account payment", async () => {
  const h = harness();
  h.session.metadata.buyerFirestoreId = "someone_else";
  await assert.rejects(
    h.load("lib/actions/transaction.ts").confirmCheckout("cs_1"),
    /does not belong/,
  );
  assert.equal(h.docs.get("users/u1").lifetimeStatus, undefined);
});
test("checkout return never infers payment from success URL alone", async () => {
  const h = harness();
  h.session.payment_status = "unpaid";
  assert.equal(
    await h.load("lib/actions/transaction.ts").confirmCheckout("cs_1"),
    false,
  );
});
test("checkout return can reconcile paid lifetime before webhook delivery", async () => {
  const h = harness();
  assert.equal(
    await h.load("lib/actions/transaction.ts").confirmCheckout("cs_1"),
    true,
  );
  assert.equal(h.docs.get("users/u1").lifetimeStatus, "active");
});

test("free allowance follows Firebase settings in both UI and server enforcement", async () => {
  const h = harness();
  h.docs.set("settings/SITE_SETTINGS", {
    msgAmountLimit: 3,
    msgAmountLimitMonthly: 5000,
    price: 4.99,
    hoursToWait: 24,
  });
  const settings = await h.load("lib/actions/settings.ts").getSettings();
  assert.equal(settings.msgAmountLimit, 3);
  assert.equal(settings.hoursToWait, 0);
  h.docs.set("users/u1", { freeMessagesUsed: 3 });
  const usage = h.load("lib/usage.ts");
  await assert.rejects(usage.reserveMessage("u1"), /FREE_LIMIT_REACHED/);
  h.docs.set("settings/SITE_SETTINGS", {
    msgAmountLimit: 20,
    msgAmountLimitMonthly: 5000,
    price: 4.99,
  });
  await usage.reserveMessage("u1");
  assert.equal(h.docs.get("users/u1").freeMessagesUsed, 4);
});
test("zero allowance is respected; missing or invalid allowance uses fallback", async () => {
  const h = harness();
  h.docs.set("settings/SITE_SETTINGS", {
    msgAmountLimit: 0,
    msgAmountLimitMonthly: 5000,
  });
  await assert.rejects(
    h.load("lib/usage.ts").reserveMessage("u1"),
    /FREE_LIMIT_REACHED/,
  );
  h.docs.set("settings/SITE_SETTINGS", {
    msgAmountLimit: -1,
    msgAmountLimitMonthly: 5000,
  });
  assert.equal(
    (await h.load("lib/actions/settings.ts").getSettings()).msgAmountLimit,
    10,
  );
});

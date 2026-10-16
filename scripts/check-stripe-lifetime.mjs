import Stripe from "stripe";
import { existsSync } from "node:fs";

// No credentials or checkout URLs are printed. --checkout creates and expires
// an isolated, unpayable-by-the-time-we-return session, with no app user ID.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.log(
    JSON.stringify({
      verified: false,
      reason:
        "STRIPE_SECRET_KEY is missing. Set it in .env.local; do not share it in chat.",
    }),
  );
  process.exit(2);
}
const live = /^(sk|rk)_live_/.test(key);
const priceId = live
  ? process.env.REAL_LIFETIME_PRICE_ID || "price_1UR8dZGIRNfFNwjggxF0WuaV"
  : process.env.TEST_LIFETIME_PRICE_ID;
if (!priceId) {
  console.log(
    JSON.stringify({
      verified: false,
      reason:
        "A test key requires TEST_LIFETIME_PRICE_ID. The supplied price is live.",
    }),
  );
  process.exit(2);
}
const stripe = new Stripe(key, {
  apiVersion: "2024-06-20",
  maxRetries: 0,
  timeout: 15000,
});
let session;
try {
  const price = await stripe.prices.retrieve(priceId);
  const valid =
    price.active &&
    price.type === "one_time" &&
    price.unit_amount === 4999 &&
    price.currency === "usd" &&
    price.livemode === live;
  if (!valid) {
    console.log(
      JSON.stringify({
        verified: false,
        reason: "Price does not match the lifetime offer.",
        priceId,
        active: price.active,
        type: price.type,
        amount: price.unit_amount,
        currency: price.currency,
        live: price.livemode,
      }),
    );
    process.exitCode = 1;
  } else if (!process.argv.includes("--checkout")) {
    console.log(
      JSON.stringify({
        verified: true,
        priceId,
        type: price.type,
        amount: price.unit_amount,
        currency: price.currency,
        live: price.livemode,
        paymentAttempted: false,
      }),
    );
  } else {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "http://localhost:3000/agent?checkout_probe=success",
      cancel_url: "http://localhost:3000/agent",
      metadata: { purpose: "local_lifetime_checkout_probe" },
    });
    const checkoutCreated =
      session.mode === "payment" &&
      session.amount_total === 4999 &&
      session.currency === "usd" &&
      Boolean(session.url);
    const expired = await stripe.checkout.sessions.expire(session.id);
    session = undefined;
    console.log(
      JSON.stringify({
        verified: checkoutCreated && expired.status === "expired",
        priceId,
        checkoutCreated,
        checkoutExpired: expired.status === "expired",
        live,
        paymentAttempted: false,
      }),
    );
  }
} catch (error) {
  console.log(
    JSON.stringify({
      verified: false,
      type: error.type || error.name,
      code: error.code,
      status: error.statusCode,
      paymentAttempted: false,
    }),
  );
  process.exitCode = 1;
} finally {
  if (session) {
    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch {
      console.log(
        JSON.stringify({
          cleanupFailed: true,
          sessionId: session.id,
          paymentAttempted: false,
        }),
      );
    }
  }
}

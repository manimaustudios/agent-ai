import "server-only";

import Stripe from "stripe";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { LIVE_LIFETIME_PRICE_ID, type PremiumPlan } from "./plans";

// Fulfillment accepts signed webhook data or sessions retrieved directly from
// Stripe after checking account ownership, never client-supplied payment data.
export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });
}

export function getPlanPriceId(plan: PremiumPlan, live?: boolean) {
  const isLive =
    live ?? !/^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY || "");
  const price =
    plan === "lifetime"
      ? isLive
        ? process.env.REAL_LIFETIME_PRICE_ID || LIVE_LIFETIME_PRICE_ID
        : process.env.TEST_LIFETIME_PRICE_ID
      : isLive
        ? process.env.REAL_SUBSCRIPTION_PRICE_ID
        : process.env.TEST_SUBSCRIPTION_PRICE_ID;
  if (!price)
    throw new Error(
      `The ${plan} price is not configured for this Stripe mode.`,
    );
  return price;
}

export async function syncSubscription(
  subscription: Stripe.Subscription,
  knownUserId?: string,
) {
  const subRef = doc(db, "subscriptions", subscription.id);
  const existing = await getDoc(subRef);
  const userId =
    knownUserId ||
    subscription.metadata.buyerFirestoreId ||
    existing.data()?.userId;
  await setDoc(
    subRef,
    {
      subscriptionId: subscription.id,
      status: subscription.status,
      nextBillingDate: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      currentPeriodEnd: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      ...(userId ? { userId } : {}),
    },
    { merge: true },
  );
  if (userId) {
    const userRef = doc(db, "users", userId);
    const user = (await getDoc(userRef)).data();
    // Old subscription events cannot replace the current account subscription.
    if (user?.subscriptionId === subscription.id) {
      await updateDoc(userRef, {
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    }
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.buyerFirestoreId;
  if (!userId) return;
  const stripe = getStripe();
  if (session.mode === "payment") {
    if (
      session.metadata?.purchasePlan !== "lifetime" ||
      session.payment_status !== "paid"
    )
      return;
    const items = await stripe.checkout.sessions.listLineItems(session.id);
    if (
      items.data.length !== 1 ||
      items.data[0].quantity !== 1 ||
      items.data[0].price?.id !== getPlanPriceId("lifetime", session.livemode)
    ) {
      throw new Error("Unexpected lifetime checkout price.");
    }
    const intentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (!intentId) throw new Error("Lifetime checkout has no payment intent.");
    // Current charge state prevents late completions from restoring refunds.
    const intent = await stripe.paymentIntents.retrieve(intentId, {
      expand: ["latest_charge"],
    });
    const charge = intent.latest_charge as Stripe.Charge | null;
    if (
      intent.status !== "succeeded" ||
      !charge ||
      charge.refunded ||
      charge.disputed
    )
      return;
    const userRef = doc(db, "users", userId);
    const user = (await getDoc(userRef)).data();
    if (!user) throw new Error("Lifetime checkout account was not found.");
    if (
      user.lifetimeStatus === "active" &&
      user.lifetimePaymentIntentId !== intentId
    ) {
      throw new Error("Duplicate lifetime purchase requires review.");
    }
    await updateDoc(userRef, {
      lifetimeStatus: "active",
      lifetimeCheckoutSessionId: session.id,
      lifetimePaymentIntentId: intentId,
      lifetimePurchasedAt: new Date(session.created * 1000).toISOString(),
    });
    // Retry on failure; repeated updates are safe. Old monthly deletion events
    // never clear the independent lifetime entitlement.
    const previousId = session.metadata?.previousSubscriptionId;
    if (previousId && previousId === user.subscriptionId) {
      const previous = await stripe.subscriptions.retrieve(previousId);
      if (!["canceled", "incomplete_expired"].includes(previous.status)) {
        const updated = await stripe.subscriptions.update(previousId, {
          cancel_at_period_end: true,
        });
        await syncSubscription(updated, userId);
      }
    }
    return;
  }
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  if (session.mode !== "subscription" || !subscriptionId) return;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userRef = doc(db, "users", userId);
  const user = (await getDoc(userRef)).data();
  if (!user) throw new Error("Subscription account was not found.");
  if (user.subscriptionId && user.subscriptionId !== subscriptionId) {
    const existing = await stripe.subscriptions.retrieve(user.subscriptionId);
    if (existing.created > subscription.created) return;
  }
  await updateDoc(userRef, { subscriptionId, status: subscription.status });
  await syncSubscription(subscription, userId);
  // Covers a monthly checkout opened before a lifetime purchase completed.
  if (user.lifetimeStatus === "active" && subscription.status !== "canceled") {
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    await syncSubscription(updated, userId);
  }
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  const object = event.data.object;
  const subscriptionId = event.type.startsWith("invoice.")
    ? (object as Stripe.Invoice).subscription
    : (object as Stripe.Subscription).id;
  const id =
    typeof subscriptionId === "string" ? subscriptionId : subscriptionId?.id;
  if (!id) return;
  await syncSubscription(await getStripe().subscriptions.retrieve(id));
}

export async function handleLifetimeChargeEvent(event: Stripe.Event) {
  const stripe = getStripe();
  const object = event.data.object as Stripe.Charge | Stripe.Dispute;
  const disputedCharge = (object as Stripe.Dispute).charge;
  const chargeId =
    event.type === "charge.refunded"
      ? object.id
      : typeof disputedCharge === "string"
        ? disputedCharge
        : disputedCharge.id;
  const charge = await stripe.charges.retrieve(chargeId);
  const intentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!intentId) return;
  const intent = await stripe.paymentIntents.retrieve(intentId);
  const userId = intent.metadata.buyerFirestoreId;
  if (!userId || intent.metadata.purchasePlan !== "lifetime") return;
  const userRef = doc(db, "users", userId);
  const user = (await getDoc(userRef)).data();
  if (user?.lifetimePaymentIntentId !== intentId) return;
  let status: "active" | "refunded" | "disputed" = "active";
  if (charge.refunded) status = "refunded";
  else if (charge.disputed) {
    const disputes = await stripe.disputes.list({ payment_intent: intentId });
    if (
      disputes.data.some(
        (dispute) => !["won", "warning_closed"].includes(dispute.status),
      )
    )
      status = "disputed";
  }
  await updateDoc(userRef, { lifetimeStatus: status });
}

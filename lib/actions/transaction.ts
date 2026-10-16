"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  getStripe,
  getPlanPriceId,
  syncSubscription,
  handleCheckoutSessionCompleted,
} from "../billing";
import {
  isPremiumPlan,
  LIFETIME_PRICE_USD,
  MONTHLY_PRICE_USD,
  type PremiumPlan,
} from "../plans";

export async function checkoutPayment(
  requestedUserId: string | null,
  plan: PremiumPlan = "monthly",
) {
  const { userId } = await auth();
  if (!userId || userId !== requestedUserId)
    throw new Error("Please sign in before choosing a plan.");
  if (!isPremiumPlan(plan)) throw new Error("Please choose a valid plan.");
  const snapshot = await getDoc(doc(db, "users", userId));
  if (!snapshot.exists()) throw new Error("Your account could not be found.");
  const user = snapshot.data();
  if (user.lifetimeStatus === "active")
    throw new Error("You already have lifetime Premium access.");
  const stripe = getStripe();
  let previousSubscriptionId = "";
  let customerId: string | undefined;
  if (user.subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId,
    );
    customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    if (!["canceled", "incomplete_expired"].includes(subscription.status)) {
      if (plan === "monthly")
        throw new Error(
          "You already have a monthly subscription. Manage it in Settings.",
        );
      previousSubscriptionId = subscription.id;
    }
  }
  const priceId = getPlanPriceId(plan);
  const price = await stripe.prices.retrieve(priceId);
  const expectedAmount = Math.round(
    (plan === "lifetime" ? LIFETIME_PRICE_USD : MONTHLY_PRICE_USD) * 100,
  );
  if (
    !price.active ||
    price.currency !== "usd" ||
    price.unit_amount !== expectedAmount ||
    (plan === "lifetime"
      ? price.type !== "one_time"
      : price.type !== "recurring" ||
        price.recurring?.interval !== "month" ||
        price.recurring.interval_count !== 1)
  ) {
    throw new Error("This price is unavailable. Please contact support.");
  }
  const baseUrl =
    process.env.PRODUCTION_BASE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  if (!baseUrl) throw new Error("Checkout is not configured.");
  const metadata = { buyerFirestoreId: userId, purchasePlan: plan };
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: plan === "lifetime" ? "payment" : "subscription",
    client_reference_id: userId,
    metadata: { ...metadata, previousSubscriptionId },
    ...(customerId ? { customer: customerId } : { customer_email: user.email }),
    ...(plan === "lifetime"
      ? { payment_intent_data: { metadata } }
      : { subscription_data: { metadata } }),
    allow_promotion_codes: true,
    success_url: `${baseUrl}/agent?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/agent`,
  });
  if (!session.url) throw new Error("Checkout could not be opened.");
  redirect(session.url);
}

export async function cancelSubscription(requestedUserId: string | null) {
  const { userId } = await auth();
  if (!userId || userId !== requestedUserId) throw new Error("Please sign in.");
  const snapshot = await getDoc(doc(db, "users", userId));
  const subscriptionId = snapshot.data()?.subscriptionId;
  if (!subscriptionId) throw new Error("No monthly subscription was found.");
  const subscription = await getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  await syncSubscription(subscription, userId);
  revalidatePath("/agent");
}

export async function confirmCheckout(sessionId: string) {
  const { userId } = await auth();
  if (!userId || !sessionId.startsWith("cs_") || sessionId.length > 250)
    throw new Error("Invalid checkout.");
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.metadata?.buyerFirestoreId !== userId)
    throw new Error("Checkout does not belong to your account.");
  if (session.status !== "complete" || session.payment_status !== "paid")
    return false;
  await handleCheckoutSessionCompleted(session);
  const user = (await getDoc(doc(db, "users", userId))).data();
  const active =
    session.mode === "payment"
      ? user?.lifetimeStatus === "active"
      : user?.subscriptionId === session.subscription &&
        user?.status === "active";
  if (active) revalidatePath("/agent");
  return active;
}

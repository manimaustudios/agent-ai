"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  setDoc,
  getDoc,
  FirestoreError,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

const price =
  process.env.ENV_NODE === "development"
    ? process.env.TEST_SUBSCRIPTION_PRICE_ID
    : process.env.REAL_SUBSCRIPTION_PRICE_ID;

export async function checkoutPayment(userId: string | null) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    metadata: {
      buyerFirestoreId: userId || "",
    },
    mode: "subscription",
    allow_promotion_codes: true,
    success_url:
      process.env.ENV_NODE === "development"
        ? "http://localhost:3000/agent"
        : `${process.env.PRODUCTION_BASE_URL}/agent`,
    cancel_url:
      process.env.ENV_NODE === "development"
        ? "http://localhost:3000"
        : `${process.env.PRODUCTION_BASE_URL}/agent`,
  });

  redirect(session.url!);
}

interface SubscriptionUpdate {
  status?: string;
  lastPaymentDate?: string;
  amountPaid?: number;
  currency?: string;
  startDate?: string;
  plan?: string | null;
  nextBillingDate?: string;
  endDate?: string;
}

export async function updateSubscription(
  customerId: string | null,
  data: SubscriptionUpdate,
) {
  try {
    if (!customerId) {
      throw new Error("Customer ID is missing.");
    }
    const userDocRef = doc(db, "users", customerId);
    await updateDoc(userDocRef, {
      subscription: {
        ...data,
      },
    });
    console.log("User document updated successfully.");
  } catch (error) {
    console.error("Error updating user document:", error);
    throw new Error("Failed to update user document");
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.buyerFirestoreId;
  const subscriptionId = session.subscription as string;

  if (userId && subscriptionId) {
    let subscriptionDocSnap: DocumentSnapshot<DocumentData> | null =
      await getSubscriptionDocument(subscriptionId);

    if (!subscriptionDocSnap) {
      subscriptionDocSnap = await createSubscriptionDocument(
        subscriptionId,
        userId,
      );
    } else {
      // If the document exists, update it with the userId
      const subscriptionDocRef = subscriptionDocSnap.ref;
      await updateDoc(subscriptionDocRef, { userId: userId });
    }

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      subscriptionId: subscriptionId,
      status: "active",
    });

    console.log("User and subscription documents updated.");
  } else {
    console.error("Missing userId or subscriptionId in session metadata.");
  }
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  let subscriptionId: string;

  switch (event.type) {
    case "invoice.payment_failed":
      const invoice = event.data.object as Stripe.Invoice;
      subscriptionId = invoice.subscription as string;
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      subscriptionId = subscription.id;
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      return;
  }

  try {
    // Check if subscription document exists or create it
    let subscriptionDocSnap: DocumentSnapshot<DocumentData> | null =
      await getSubscriptionDocument(subscriptionId);

    if (!subscriptionDocSnap) {
      subscriptionDocSnap = await createSubscriptionDocument(subscriptionId);
    }

    const updates: Partial<{
      status: string;
      nextBillingDate: string;
      lastPaymentDate: string;
      currentPeriodEnd: string;
      amountPaid: number;
      currency: string;
      endDate: string;
    }> = {};

    // Set updates based on event type
    switch (event.type) {
      case "invoice.payment_failed":
        updates.status = "failed";
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        updates.status = (event.data.object as Stripe.Subscription).status;
        updates.nextBillingDate = new Date(
          (event.data.object as Stripe.Subscription).current_period_end * 1000,
        ).toISOString();
        updates.currentPeriodEnd = new Date(
          (event.data.object as Stripe.Subscription).current_period_end * 1000,
        ).toISOString();
        break;

      case "customer.subscription.deleted":
        updates.status = "canceled";
        updates.endDate = new Date(
          (event.data.object as Stripe.Subscription).current_period_end * 1000,
        ).toISOString();
        updates.currentPeriodEnd = new Date(
          (event.data.object as Stripe.Subscription).current_period_end * 1000,
        ).toISOString();
        break;
    }

    // Update the subscription document with the new data
    if (subscriptionDocSnap && Object.keys(updates).length > 0) {
      const subscriptionDocRef = subscriptionDocSnap.ref;
      await updateDoc(subscriptionDocRef, updates);
    }
  } catch (error) {
    console.error("Error handling subscription event:", error);
  }
}

async function getSubscriptionDocument(subscriptionId: string) {
  const subscriptionDocRef = doc(db, "subscriptions", subscriptionId);

  try {
    const subscriptionDocSnap = await getDoc(subscriptionDocRef);
    if (subscriptionDocSnap.exists()) {
      return subscriptionDocSnap;
    } else {
      return null;
    }
  } catch (error) {
    if ((error as FirestoreError).code === "permission-denied") {
      // Permission denied, possibly because the document does not exist
      return null;
    } else {
      throw error;
    }
  }
}

async function createSubscriptionDocument(
  subscriptionId: string,
  userId?: string,
) {
  const subscriptionDocRef = doc(db, "subscriptions", subscriptionId);

  try {
    await setDoc(subscriptionDocRef, {
      userId: userId ?? "",
      subscriptionId: subscriptionId,
      status: "active",
      createdAt: new Date().toISOString(),
    });

    const subscriptionDocSnap = await getDoc(subscriptionDocRef);
    return subscriptionDocSnap;
  } catch (error) {
    console.error("Error creating subscription document:", error);
    throw error;
  }
}

export async function cancelSubscription(userId: string | null) {
  if (!userId) {
    throw new Error("No user ID provided");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  try {
    // Fetch user document to get their subscription ID
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userDocSnap.data();
    const subscriptionId = userData?.subscriptionId;

    if (!subscriptionId) {
      throw new Error("No subscription found for user");
    }

    await stripe.subscriptions.cancel(subscriptionId);

    await updateDoc(userDocRef, {
      status: "canceled",
    });

    revalidatePath("/agent");
  } catch (error) {
    throw error;
  }
}

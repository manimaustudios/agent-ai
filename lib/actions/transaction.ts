"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  FirestoreError,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

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
    success_url:
      process.env.ENV_NODE === "development"
        ? "http://localhost:3000/agent"
        : `${process.env.PRODUCTION_BASE_URL}/agent`,
    cancel_url:
      process.env.ENV_NODE === "development"
        ? "http://localhost:3000"
        : process.env.PRODUCTION_BASE_URL,
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
    }

    // Update user document with subscriptionId
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      subscriptionId: subscriptionId,
      status: "active", // Initial status, might be updated later
    });

    console.log("User and subscription documents updated.");
  } else {
    console.error("Missing userId or subscriptionId in session metadata.");
  }
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscriptionObject = event.data.object as Stripe.Subscription;
  const subscriptionId = subscriptionObject.id;

  try {
    let subscriptionDocSnap: DocumentSnapshot<DocumentData> | null =
      await getSubscriptionDocument(subscriptionId);

    if (!subscriptionDocSnap) {
      subscriptionDocSnap = await createSubscriptionDocument(subscriptionId);
    }

    const updates: Partial<{
      status: string;
      nextBillingDate: string;
      lastPaymentDate: string;
      amountPaid: number;
      currency: string;
      endDate: string;
    }> = {};

    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        updates.status = "active";
        updates.lastPaymentDate = new Date(
          invoice.created * 1000,
        ).toISOString();
        updates.amountPaid = invoice.amount_paid / 100;
        updates.currency = invoice.currency;
        break;

      case "invoice.payment_failed":
        updates.status = "failed";
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        updates.status = subscription.status;
        updates.nextBillingDate = new Date(
          subscription.current_period_end * 1000,
        ).toISOString();
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        updates.status = "canceled";
        updates.endDate = new Date(
          deletedSubscription.current_period_end * 1000,
        ).toISOString();
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    if (subscriptionDocSnap && Object.keys(updates).length > 0) {
      const subscriptionDocRef = subscriptionDocSnap.ref;
      await updateDoc(subscriptionDocRef, updates);

      console.log("Subscription document updated for event:", event.type);
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

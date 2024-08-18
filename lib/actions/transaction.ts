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
} from "firebase/firestore";

// import { CreateTransactionParams } from "@/types";
// import { connectToDatabase } from "../database";
// import Transaction from "../database/models/transaction.model";
// import { handleError } from "../utils";

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

// export async function createTransaction(transaction: CreateTransactionParams) {
//   try {
//     await connectToDatabase();

//     const newTransaction = await Transaction.create({
//       ...transaction,
//     });

//     return JSON.parse(JSON.stringify(newTransaction));
//   } catch (error) {
//     handleError(error);
//   }
// }

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
  const userId = session.metadata?.buyerFirestoreId; // userId passed via metadata
  const subscriptionId = session.subscription as string;

  if (userId && subscriptionId) {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      subscriptionId: subscriptionId,
      status: "active", // or any other status you want to set
    });
    console.log("User document updated with subscriptionId.");
  } else {
    console.error("Missing userId or subscriptionId in session metadata.");
  }
}

export async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionId = subscription.id;

  // Query the users collection to find the user with this subscriptionId
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("subscriptionId", "==", subscriptionId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error("No user found with the subscriptionId:", subscriptionId);
    return;
  }

  // Assuming one user per subscriptionId
  const userDoc = querySnapshot.docs[0];
  const userId = userDoc.id;

  // Update the user's document based on event type
  const updates: Partial<{
    status: string;
    nextBillingDate: string;
    lastPaymentDate: string;
    amountPaid: number;
    currency: string;
    endDate: string;
    plan?: string | null; // Add the 'plan' property
  }> = {};

  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      updates.status = "active";
      updates.lastPaymentDate = new Date(invoice.created * 1000).toISOString();
      updates.amountPaid = invoice.amount_paid / 100; // Convert cents to dollars
      updates.currency = invoice.currency;
      break;

    case "invoice.payment_failed":
      updates.status = "failed";
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      updates.status = subscription.status;
      updates.nextBillingDate = new Date(
        subscription.current_period_end * 1000,
      ).toISOString();
      updates.plan = subscription.items.data[0].plan.nickname;
      break;

    case "customer.subscription.deleted":
      updates.status = "canceled";
      updates.endDate = new Date(
        subscription.current_period_end * 1000,
      ).toISOString();
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(userDoc.ref, updates);
    console.log("User document updated for event:", event.type);
  }
}

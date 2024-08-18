"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

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

async function updateSubscription(
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

export default updateSubscription;

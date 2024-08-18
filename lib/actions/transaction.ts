"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

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

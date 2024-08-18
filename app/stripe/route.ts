// /* eslint-disable camelcase */
// // import { createTransaction } from "@/lib/actions/transaction.action";
// import updateSubscription from "@/lib/actions/transaction";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

// export async function POST(request: Request) {
//   const body = await request.text();
//   const sig = request.headers.get("stripe-signature") as string;
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
//   } catch (err) {
//     return NextResponse.json({ message: "Webhook error", error: err });
//   }

//   // Get the ID and type
//   const eventType = event.type;

//   switch (eventType) {
//     case "checkout.session.completed":
//       const session = event.data.object as Stripe.Checkout.Session;
//       const subscriptionId = session.subscription as string;
//       const buyerFirestoreId = session.metadata?.buyerFirestoreId || null;

//       if (buyerFirestoreId && subscriptionId) {
//         // Attach the Firestore ID to the subscription
//         await stripe.subscriptions.update(subscriptionId, {
//           metadata: {
//             buyerFirestoreId: buyerFirestoreId,
//           },
//         });
//       }
//       break;

//     case "invoice.payment_succeeded":
//       const invoice = event.data.object;
//       await updateSubscription(invoice.metadata?.buyerFirestoreId || null, {
//         status: "active",
//         lastPaymentDate: new Date(invoice.created * 1000).toISOString(),
//         amountPaid: invoice.amount_paid / 100, // Convert cents to dollars
//         currency: invoice.currency,
//       });
//       break;

//     case "invoice.payment_failed":
//       const failedInvoice = event.data.object;
//       await updateSubscription(
//         failedInvoice.metadata?.buyerFirestoreId || null,
//         {
//           status: "failed",
//         },
//       );
//       break;

//     case "customer.subscription.created":
//     case "customer.subscription.updated":
//       const subscription = event.data.object;
//       await updateSubscription(
//         subscription.metadata?.buyerFirestoreId || null,
//         {
//           status: subscription.status,
//           startDate: new Date(subscription.created * 1000).toISOString(),
//           plan: subscription.items.data[0].plan.nickname,
//           nextBillingDate: new Date(
//             subscription.current_period_end * 1000,
//           ).toISOString(),
//         },
//       );
//       break;

//     case "customer.subscription.deleted":
//       const deletedSubscription = event.data.object;
//       await updateSubscription(
//         deletedSubscription.metadata?.buyerFirestoreId || null,
//         {
//           status: "canceled",
//           endDate: new Date(
//             deletedSubscription.current_period_end * 1000,
//           ).toISOString(),
//         },
//       );
//       break;

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   return NextResponse.json({ message: "OK" });
// }

import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  handleCheckoutSessionCompleted,
  handleSubscriptionEvent,
} from "@/lib/actions/transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling event:", error);
  }

  return NextResponse.json({ message: "OK" });
}

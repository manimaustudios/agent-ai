This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Premium checkout configuration

Premium has monthly ($4.99 USD) and lifetime ($49.99 USD, one-time) options.
The lifetime live price defaults to `price_1UR8dZGIRNfFNwjggxF0WuaV`; it can be
replaced with `REAL_LIFETIME_PRICE_ID`. Checkout validates the current Stripe
price amount, currency, and billing interval before redirecting.

Configure these on the server:

- `STRIPE_SECRET_KEY`: the key for the intended Stripe mode.
- `STRIPE_WEBHOOK_SECRET`: signing secret for `/stripe`.
- `REAL_SUBSCRIPTION_PRICE_ID`: existing live monthly price.
- `REAL_LIFETIME_PRICE_ID`: optional live lifetime price override.
- `TEST_SUBSCRIPTION_PRICE_ID` and `TEST_LIFETIME_PRICE_ID`: required when using
  a test key. A test key never falls back to the live lifetime price.
- `PRODUCTION_BASE_URL`: canonical site URL for checkout return links.

Subscribe the Stripe webhook endpoint to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `invoice.payment_succeeded` and `invoice.payment_failed`
- `customer.subscription.created`, `customer.subscription.updated`, and
  `customer.subscription.deleted`
- `charge.refunded`, `charge.dispute.created`, and `charge.dispute.closed`

Existing webhook endpoints may need the new event types enabled. The route
returns non-2xx on invalid signatures or failed fulfillment so Stripe retries.
Full refunds and disputes revoke lifetime access; successful dispute resolution
restores it. Partial refunds preserve lifetime access. Duplicate lifetime
payments for an already entitled account raise a fulfillment error for review.

The app uses Firestore transactions for quota reservation. Verify deployed
Firestore permissions permit the server integration to update the existing
users/subscriptions collections and prevent untrusted clients from changing
entitlement and usage fields before releasing this change. No rules are changed
by this checkout.

Free messages are now a one-time account allowance configured in Firebase at
`settings/SITE_SETTINGS.msgAmountLimit` (currently 3). Existing accounts get that
allowance on their first use of the new `freeMessagesUsed` counter, independent
of their old resetting counter. The code falls back to 10 only when the setting
is absent or invalid; set the Firebase value to 10 to offer 10. The counter never replenishes when time passes
or a paid plan ends. Paid plans retain the existing allowance from
`settings/SITE_SETTINGS.msgAmountLimitMonthly` (currently 5,000), shown before
purchase. Failed AI requests return their reserved message.

Run `npm run test:billing` for isolated Stripe/Firestore boundary tests (no real
payments). Real Stripe checkout and webhook delivery still require configured
credentials and a separately verified test or live purchase. Updating this code
alone does not validate the supplied live price in Stripe.

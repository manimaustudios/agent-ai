"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ChatHistory from "./ChatHistory";
import NewChatButton from "./NewChatButton";
import { Button } from "./ui/button";
import {
  cancelSubscription,
  handleSubscriptionEvent,
} from "@/lib/actions/transaction";

const dummyCancellEvent = {
  id: "evt_1PskgSDEhU3Y5z2UPUCOFlIk",
  object: "event",
  api_version: "2024-06-20",
  created: 1724846948,
  data: {
    object: {
      id: "sub_1PpUfODEhU3Y5z2UNtpVj4XK",
      object: "subscription",
      application: null,
      application_fee_percent: null,
      automatic_tax: {
        enabled: false,
        liability: null,
      },
      billing_cycle_anchor: 1724070394,
      billing_cycle_anchor_config: null,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: 1724846948,
      cancellation_details: {
        comment: null,
        feedback: null,
        reason: "cancellation_requested",
      },
      collection_method: "charge_automatically",
      created: 1724070394,
      currency: "eur",
      current_period_end: 1726748794,
      current_period_start: 1724070394,
      customer: "cus_QgsQfzi51EwuB1",
      days_until_due: null,
      default_payment_method: "pm_1PpUfMDEhU3Y5z2UusTRFBBd",
      default_source: null,
      default_tax_rates: [],
      description: null,
      discount: null,
      discounts: [],
      ended_at: 1724846948,
      invoice_settings: {
        account_tax_ids: null,
        issuer: {
          type: "self",
        },
      },
      items: {
        object: "list",
        data: [
          {
            id: "si_QgsQLhDJhOcRa7",
            object: "subscription_item",
            billing_thresholds: null,
            created: 1724070394,
            discounts: [],
            metadata: {},
            plan: {
              id: "price_1Pp9LBDEhU3Y5z2UT9GQpXks",
              object: "plan",
              active: true,
              aggregate_usage: null,
              amount: 1000,
              amount_decimal: "1000",
              billing_scheme: "per_unit",
              created: 1723988417,
              currency: "eur",
              interval: "month",
              interval_count: 1,
              livemode: false,
              metadata: {},
              meter: null,
              nickname: null,
              product: "prod_QgWNdfGSQfJea8",
              tiers_mode: null,
              transform_usage: null,
              trial_period_days: null,
              usage_type: "licensed",
            },
            price: {
              id: "price_1Pp9LBDEhU3Y5z2UT9GQpXks",
              object: "price",
              active: true,
              billing_scheme: "per_unit",
              created: 1723988417,
              currency: "eur",
              custom_unit_amount: null,
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: "prod_QgWNdfGSQfJea8",
              recurring: {
                aggregate_usage: null,
                interval: "month",
                interval_count: 1,
                meter: null,
                trial_period_days: null,
                usage_type: "licensed",
              },
              tax_behavior: "unspecified",
              tiers_mode: null,
              transform_quantity: null,
              type: "recurring",
              unit_amount: 1000,
              unit_amount_decimal: "1000",
            },
            quantity: 1,
            subscription: "sub_1PpUfODEhU3Y5z2UNtpVj4XK",
            tax_rates: [],
          },
        ],
        has_more: false,
        total_count: 1,
        url: "/v1/subscription_items?subscription=sub_1PpUfODEhU3Y5z2UNtpVj4XK",
      },
      latest_invoice: "in_1PpUfODEhU3Y5z2UIywguPJY",
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      on_behalf_of: null,
      pause_collection: null,
      payment_settings: {
        payment_method_options: {
          acss_debit: null,
          bancontact: null,
          card: {
            network: null,
            request_three_d_secure: "automatic",
          },
          customer_balance: null,
          konbini: null,
          sepa_debit: null,
          us_bank_account: null,
        },
        payment_method_types: null,
        save_default_payment_method: "off",
      },
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: {
        id: "price_1Pp9LBDEhU3Y5z2UT9GQpXks",
        object: "plan",
        active: true,
        aggregate_usage: null,
        amount: 1000,
        amount_decimal: "1000",
        billing_scheme: "per_unit",
        created: 1723988417,
        currency: "eur",
        interval: "month",
        interval_count: 1,
        livemode: false,
        metadata: {},
        meter: null,
        nickname: null,
        product: "prod_QgWNdfGSQfJea8",
        tiers_mode: null,
        transform_usage: null,
        trial_period_days: null,
        usage_type: "licensed",
      },
      quantity: 1,
      schedule: null,
      start_date: 1724070394,
      status: "canceled",
      test_clock: null,
      transfer_data: null,
      trial_end: null,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "create_invoice",
        },
      },
      trial_start: null,
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: "req_upNIuVbpMSx3ys",
    idempotency_key: null,
  },
  type: "customer.subscription.deleted",
};

type SidebarProps = {
  isAuthenticated: boolean;
  userId: string | null;
  children: React.ReactNode;
};

function Sidebar({ isAuthenticated, userId, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  // const handleTestCancellEvent = async () => {
  //   try {
  //     await handleSubscriptionEvent(dummyCancellEvent);
  //   } catch (error) {
  //     console.log("ERROR CANCELLING:", error);
  //   }
  // };
  return (
    <>
      <div
        className={`${isOpen ? "flex" : "hidden"} h-screen w-56 flex-col bg-secondary/50 p-2`}
      >
        <div className="space-y-4">
          <div className="ml-3 flex items-center justify-between">
            Logo
            <button
              onClick={() => setIsOpen(false)}
              className="-mr-2 flex size-6 items-center justify-center rounded-l-full border-y border-l bg-background"
            >
              <FaChevronLeft className="size-4" />
            </button>
          </div>
          <NewChatButton />

          {isAuthenticated && <ChatHistory userId={userId} />}
        </div>
        <div className="mt-auto space-y-2">
          {/* server components */}
          {children}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(true)}
        className={`${!isOpen ? "flex" : "hidden"} absolute left-0 top-3 size-6 items-center justify-center rounded-r-full border bg-background`}
      >
        <FaChevronRight className="size-4" />
      </button>
    </>
  );
}

export default Sidebar;

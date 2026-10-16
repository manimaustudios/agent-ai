"use client";

import { useRef, useState } from "react";
import { checkoutPayment } from "@/lib/actions/transaction";
import {
  LIFETIME_PRICE_USD,
  MONTHLY_PRICE_USD,
  type PremiumPlan,
} from "@/lib/plans";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import LoadingSpinner from "./LoadingSpinner";

export default function PremiumOffer({
  userId,
  exhausted = false,
  monthlyLimit,
  monthlySubscriber = false,
}: {
  userId: string | null;
  exhausted?: boolean;
  monthlyLimit?: number;
  monthlySubscriber?: boolean;
}) {
  const [plan, setPlan] = useState<PremiumPlan>("lifetime");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      await checkoutPayment(userId, plan);
    } catch {
      setError(
        "Checkout could not be opened. Please try again or contact support.",
      );
      setLoading(false);
    }
  };

  return (
    <DialogContent
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        titleRef.current?.focus();
      }}
      className="max-h-[calc(100dvh_-_1.5rem)] w-[calc(100%_-_1.5rem)] max-w-[30rem] gap-2.5 overflow-y-auto overscroll-contain rounded-2xl p-4 sm:p-6 [&>button]:right-1 [&>button]:top-1 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center"
    >
      <DialogHeader className="space-y-2 pr-5 text-left">
        <DialogTitle
          ref={titleRef}
          tabIndex={-1}
          className="text-xl font-bold leading-tight outline-none sm:text-2xl"
        >
          {exhausted ? "Want to keep talking?" : "Choose your Premium plan"}
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">
          {exhausted
            ? "You’ve used your free messages. Choose a plan."
            : "Monthly flexibility or one payment for lifetime access. Choose what works for you."}
        </DialogDescription>
      </DialogHeader>

      <fieldset className="flex min-w-0 flex-col gap-3" disabled={loading}>
        <legend className="sr-only">Premium plan</legend>
        {(["monthly", "lifetime"] as const).map((option) => {
          const lifetime = option === "lifetime";
          return (
            <label
              key={option}
              className={`relative flex min-h-20 cursor-pointer items-start gap-2.5 rounded-xl border-2 p-3 transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background sm:p-4 ${monthlySubscriber && !lifetime ? "cursor-default opacity-60" : ""} ${plan === option ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <input
                type="radio"
                name="premium-plan"
                value={option}
                checked={plan === option}
                disabled={monthlySubscriber && !lifetime}
                onChange={() => setPlan(option)}
                className={`size-4 shrink-0 accent-primary focus-visible:outline-none ${lifetime ? "mt-9" : "mt-1"}`}
              />
              <span className="min-w-0 flex-1 space-y-1">
                {lifetime && (
                  <span className="block pb-2">
                    <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium leading-4 text-primary-foreground">
                      Recommended
                    </span>
                  </span>
                )}
                <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold sm:text-base">
                    {lifetime ? "Lifetime" : "Monthly"}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold sm:text-base">
                    $
                    {lifetime
                      ? LIFETIME_PRICE_USD.toFixed(2)
                      : MONTHLY_PRICE_USD.toFixed(2)}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {lifetime ? "once" : "/ month"}
                    </span>
                  </span>
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {lifetime
                    ? monthlySubscriber
                      ? "Stops future monthly renewals. For the operating life of this service."
                      : "No renewals. For the operating life of this service."
                    : monthlySubscriber
                      ? "Your current plan."
                      : "Renews monthly. Cancel anytime; keep your paid access."}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="space-y-1 text-center text-xs leading-relaxed text-muted-foreground">
        <p>All AI chat companions included.</p>
        {monthlyLimit !== undefined && (
          <p>{monthlyLimit.toLocaleString()} messages per 30-day period.</p>
        )}
      </div>
      <div className="space-y-2">
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="button"
          className="h-auto min-h-11 w-full whitespace-normal rounded-xl px-3 py-2.5 text-sm font-semibold"
          disabled={loading}
          onClick={checkout}
        >
          {loading ? (
            <>
              <LoadingSpinner className="mr-2 size-4" />
              Opening checkout…
            </>
          ) : plan === "lifetime" ? (
            "Get lifetime access"
          ) : (
            "Subscribe monthly"
          )}
        </Button>
      </div>
      <p className="border-t pt-2 text-center text-xs leading-relaxed text-muted-foreground">
        AI support does not replace professional care or emergency services.
      </p>
    </DialogContent>
  );
}

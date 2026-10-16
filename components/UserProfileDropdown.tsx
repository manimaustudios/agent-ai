"use client";

import { FaCog } from "react-icons/fa";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cancelSubscription } from "@/lib/actions/transaction";
import PaymentButton from "./PaymentButton";
import LoadingSpinner from "./LoadingSpinner";

type UserProfileDropdownProps = {
  userId: string;
  status?: string;
  userEmail?: string;
  hasPremium: boolean;
  lifetime?: boolean;
  cancelAtPeriodEnd?: boolean;
  monthlyLimit?: number;
};

export function UserProfileDropdown({
  userId,
  status,
  userEmail,
  hasPremium,
  lifetime = false,
  cancelAtPeriodEnd = false,
  monthlyLimit,
}: UserProfileDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancellSubscription = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await cancelSubscription(userId);
    } catch (error) {
      setError(
        "Cancellation could not be completed. Please try again or contact support.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FaCog />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-60 space-y-4 px-4 py-4">
        <div>
          <p className="text-xs">Your e-mail:</p>
          <p className="truncate text-sm text-muted-foreground">{userEmail}</p>
        </div>

        <div>
          <p className="text-xs">Help & Support:</p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLScDAOGOXyWDaj3JNi21TDsqvoQRL493sdyC2aLpVdFv7gko3A/viewform"
            className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            Contact Us
          </a>
        </div>

        <div className="text-sm">
          Plan:{" "}
          <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
            {lifetime ? "Lifetime Premium" : hasPremium ? "Premium" : "Free"}
          </span>
        </div>

        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        {!lifetime && hasPremium && (
          <PaymentButton
            userId={userId}
            cta="Switch to lifetime"
            monthlyLimit={monthlyLimit}
            monthlySubscriber
          />
        )}
        {lifetime ? (
          <p className="text-xs">Lifetime access. No recurring payments.</p>
        ) : cancelAtPeriodEnd && hasPremium ? (
          <p className="text-xs">
            Renewal cancelled. Premium remains available until your paid period
            ends.
          </p>
        ) : status === "active" ? (
          <div className="flex items-center justify-start gap-2">
            <Button
              variant="secondary"
              onClick={() => handleCancellSubscription()}
              disabled={isLoading}
            >
              Cancel Subscription
            </Button>
            {isLoading && <LoadingSpinner className="size-4 text-primary" />}
          </div>
        ) : hasPremium ? (
          <p className="text-xs">*Your subscription is cancelled</p>
        ) : (
          <PaymentButton userId={userId} monthlyLimit={monthlyLimit} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

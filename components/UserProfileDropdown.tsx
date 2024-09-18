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
};

export function UserProfileDropdown({
  userId,
  status,
  userEmail,
  hasPremium,
}: UserProfileDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancellSubscription = async () => {
    setIsLoading(true);
    try {
      await cancelSubscription(userId);
    } catch (error) {
      console.log("error cancelling subscription: ", error);
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
          <p className="text-xs">Support e-mail:</p>
          <a
            href="mailto:info@aitherapistfree.com"
            className="text-sm text-muted-foreground hover:text-primary hover:underline"
          >
            info@aitherapistfree.com
          </a>
        </div>

        <div className="text-sm">
          Plan:{" "}
          <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
            {hasPremium ? "Premium" : "Free"}
          </span>
        </div>

        {status === "active" ? (
          <div className="flex items-center justify-start gap-2">
            <Button
              variant="secondary"
              onClick={() => handleCancellSubscription()}
            >
              Cancel Subscription
            </Button>
            {isLoading && <LoadingSpinner className="size-4 text-primary" />}
          </div>
        ) : hasPremium ? (
          <p className="text-xs">*Your subscription is cancelled</p>
        ) : (
          <PaymentButton userId={userId} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

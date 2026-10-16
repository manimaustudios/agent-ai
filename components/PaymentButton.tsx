"use client";

import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import PremiumOffer from "./PremiumOffer";

type PaymentButtonProps = {
  userId: string | null;
  cta?: string;
  monthlyLimit?: number;
  monthlySubscriber?: boolean;
};

function PaymentButton({
  userId,
  cta,
  monthlyLimit,
  monthlySubscriber,
}: PaymentButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">{cta || "Get Premium"}</Button>
      </DialogTrigger>
      <PremiumOffer
        userId={userId}
        monthlyLimit={monthlyLimit}
        monthlySubscriber={monthlySubscriber}
      />
    </Dialog>
  );
}

export default PaymentButton;

"use client";

import { checkoutPayment } from "@/lib/actions/transaction";
import { Button } from "./ui/button";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type PaymentButtonProps = {
  userId: string | null;
  cta?: string;
};

function PaymentButton({ userId, cta }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    await checkoutPayment(userId);
    setIsLoading(false);
  };
  return (
    <div className="flex items-center justify-start gap-3">
      <Button onClick={() => handlePayment()}>
        {cta ? cta : "Get Premium"}
      </Button>
      {isLoading && <LoadingSpinner className="text-primary" />}
    </div>
  );
}

export default PaymentButton;

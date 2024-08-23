"use client";

import { checkoutPayment } from "@/lib/actions/transaction";
import { Button } from "./ui/button";
import { useState } from "react";

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
    <Button onClick={() => handlePayment()}>{cta ? cta : "Get Premium"}</Button>
  );
}

export default PaymentButton;

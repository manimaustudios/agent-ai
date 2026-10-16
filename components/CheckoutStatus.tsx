"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmCheckout } from "@/lib/actions/transaction";
import { Button } from "./ui/button";

export default function CheckoutStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"checking" | "ready" | "pending">(
    "checking",
  );
  useEffect(() => {
    if (params.get("checkout") !== "success" || !sessionId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const check = async () => {
      try {
        const active = await confirmCheckout(sessionId);
        if (cancelled) return;
        if (active) {
          setStatus("ready");
          router.refresh();
          return;
        }
      } catch {
        // Keep payment state pending, never infer access from a redirect alone.
      }
      if (cancelled) return;
      if (++attempts < 5) timer = setTimeout(check, 2000);
      else setStatus("pending");
    };
    void check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [params, router, sessionId]);
  if (params.get("checkout") !== "success" || !sessionId) return null;
  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg rounded-xl border bg-background p-4 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm">
        {status === "ready"
          ? "Premium is active. You can continue your conversation."
          : status === "pending"
            ? "Your payment is still being confirmed. Please refresh shortly or contact support."
            : "Confirming your payment…"}
      </p>
      {status === "ready" && (
        <Button
          type="button"
          variant="link"
          onClick={() => router.replace("/agent")}
        >
          Continue chatting
        </Button>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentFailure } from "@/registry/billingsdk/payment-failure";

export function PaymentFailureDemo() {
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      // TODO: your actual retry logic (redirect to payment, call API, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // e.g. router.push("/checkout");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <PaymentFailure
        isRetrying={isRetrying}
        onRetry={handleRetry}
        onSecondary={() => router.push("/")}
        onTertiary={() => router.push("/support")}
        reasons={[
          "Insufficient funds in your account",
          "Incorrect card details or expired card",
          "Card declined by your bank",
          "Network connection issues",
        ]}
        // Optional overrides:
        // title="Payment declined"
        // subtitle="Your bank declined the transaction."
        // retryButtonText="Retry Payment"
        // secondaryButtonText="Go Home"
        // tertiaryButtonText="Contact Support"
      />
    </div>
  );
}

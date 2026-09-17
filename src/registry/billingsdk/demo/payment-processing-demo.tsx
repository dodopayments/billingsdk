"use client";

import { useState } from "react";
import { PaymentProcessing } from "@/registry/billingsdk/payment-processing";
import { Button } from "@/components/ui/button";

export function PaymentProcessingDemo() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Replace with your real payment confirmation call.
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // aria-busy belongs on the region being loaded, not on the status card.
    <section
      aria-busy={isProcessing}
      className="flex min-h-[320px] w-full items-center justify-center p-4"
    >
      {isProcessing ? (
        <PaymentProcessing />
      ) : (
        <Button onClick={handlePay}>Pay now</Button>
      )}
    </section>
  );
}

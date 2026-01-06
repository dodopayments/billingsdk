"use client";

import { useState } from "react";
import PaymentProcessing from "@/registry/billingsdk/payment-processing";
import { setTimeout } from "timers";
import { Button } from "@/components/ui/button";

export function PaymentProcessingDemo() {
  const [loading, setLoading] = useState(false);
  const handleProcessing = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  };

  const onClickHandler = async () => {
    setLoading(true);
    await handleProcessing();
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Button
        onClick={async () => await onClickHandler()}
        className={`${loading ? "hidden" : "block"}`}
      >
        Pay now!
      </Button>
      <PaymentProcessing status={loading} />
    </div>
  );
}

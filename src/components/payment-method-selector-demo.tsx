"use client";

import { PaymentMethodSelector } from "@/components/billingsdk/payment-method-selector";

export function PaymentMethodSelectorDemo() {
  return (
    <div className="mx-auto flex min-h-[600px] w-full max-w-md items-center justify-center">
      <PaymentMethodSelector
        onProceed={(method, data) => {
          console.log("Demo: Proceed with:", method, data);
        }}
      />
    </div>
  );
}

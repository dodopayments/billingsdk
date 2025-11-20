"use client";

import { UsageBasedPricing } from "@/components/billingsdk/usage-based-pricing";

export function UsageBasedPricingDemo() {
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <UsageBasedPricing className="mx-auto max-w-5xl" />
    </div>
  );
}

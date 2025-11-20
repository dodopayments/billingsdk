"use client";

import { PricingTableFive } from "@/components/billingsdk/pricing-table-five";
import { plans } from "@/lib/billingsdk-config";

export function PricingTableFiveDemo() {
  return (
    <PricingTableFive
      plans={plans}
      theme="classic"
      onPlanSelect={(planId: string) => console.log("Selected plan:", planId)}
      title="Budget-friendly pricing alternatives"
      description="Get started free or upgrade to share your impact for all completed tasks with multiple people"
    />
  );
}

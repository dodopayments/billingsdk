"use client";

import { plans } from "@/lib/billingsdk-config";
import { PricingTableTwo } from "@/components/billingsdk/pricing-table-two";

export function PricingTableTwoMinimalDemo() {
  return (
    <>
      <PricingTableTwo
        plans={plans}
        className="mx-auto w-full max-w-4xl"
        title={`We offer ${plans.length} plans`}
        description="Choose the plan that's right for you"
        onPlanSelect={(planId) => console.log("Selected plan:", planId)}
        size="small" // small, medium, large
        theme="minimal" // minimal or classic
      />
    </>
  );
}

"use client";

import { PricingTableEight } from "@/components/billingsdk/pricing-table-eight";
import { plans as basePlans } from "@/lib/billingsdk-config";

const plans = basePlans.map((plan) => {
  if (plan.id === "starter") {
    return { ...plan, description: "Do you just want to start testing?" };
  }
  if (plan.id === "pro") {
    return {
      ...plan,
      description: "Do you want to unlock full production features?",
    };
  }
  if (plan.id === "enterprise") {
    return {
      ...plan,
      description: "Do you want dedicated security and scale?",
    };
  }
  return plan;
});
export function PricingTableEightDemo() {
  return (
    <PricingTableEight
      plans={plans}
      title="Choose Your Perfect Plan"
      theme="classic"
      description="Transform your project with our comprehensive pricing options designed for every need."
      subtitle="Simple Pricing"
      onPlanSelect={(planId: string) => console.log("Selected plan:", planId)}
      size="medium"
      className="w-full"
      showBillingToggle={true}
      billingToggleLabels={{
        monthly: "Monthly",
        yearly: "Yearly",
      }}
    />
  );
}

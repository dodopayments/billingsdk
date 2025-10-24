
"use client"

import { PricingTableEight } from "@/components/billingsdk/pricing-table-eight"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableEightDemo() {
  const modifiedPlans = plans.map(plan => {
    if (plan.id === 'started') {
      return { ...plan, description: 'Where Do I Just Start Testing?' };
    }
    if (plan.id === 'pro') {
      return { ...plan, description: 'How Do I Unlock Full Production Features?' };
    }
    if (plan.id === 'enterprise') {
      return { ...plan, description: 'What Are My Options for Dedicated Security & Scale?' };
    }
    return plan;
  });

  return (
    <PricingTableEight
      plans={modifiedPlans}
      title="Choose Your Perfect Plan"
      theme="classic"
      description="Transform your project with our comprehensive pricing options designed for every need."
      subtitle="Simple Pricing"
      onPlanSelect={(planId: string) => console.log('Selected plan:', planId)}
      size="medium"
      className="w-full"
      showBillingToggle={true}
      billingToggleLabels={{
        monthly: "Monthly",
        yearly: "Yearly",
      }}
    />
  )
}

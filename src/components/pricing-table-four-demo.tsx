"use client"

import { PricingTableFour } from "@/components/billingsdk/pricing-table-four"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableFourDemo() {
  return (
    <PricingTableFour
      plans={plans}
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

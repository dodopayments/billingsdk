"use client"

import { plans } from "@/lib/billingsdk-config"
import { PricingTableTwo } from "@/components/billingsdk/pricing-table-two"

export function PricingTableTwoDemo() {
  return (
    <PricingTableTwo
      plans={plans}
      className="w-full max-w-4xl mx-auto"
      title={`We offer ${plans.length} plans`}
      description="Choose the plan that's right for you"
      onPlanSelect={(planId) => console.log("Selected plan:", planId)}
      size="small" // small, medium, large
      theme="classic" // minimal or classic
    />
  )
}

"use client"

import { PricingTableSeven } from "@/components/billingsdk/pricing-table-seven"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableSevenDemo() {
  return (
    <PricingTableSeven
      plans={plans}
      onPlanSelect={(planId: string) => console.log("Selected plan:", planId)}
      title="The Perfect Plan For Your Needs"
      description="Our transparent pricing makes it easy to find a plan that works within your financial constraints."
    />
  )
}

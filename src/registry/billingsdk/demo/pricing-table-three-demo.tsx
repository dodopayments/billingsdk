"use client"

import { PricingTableThree } from "@/components/billingsdk/pricing-table-three"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableThreeDemo() {
  return (
    <PricingTableThree
      plans={plans}
      onPlanSelect={(planId) => console.log("Selected plan:", planId)}
      className={"w-full max-w-4xl mx-auto"}
      variant="small"
      showFooter={true}
      footerText="Pre-negotiated discounts are available to early-stage startups and nonprofits."
      footerButtonText="Apply now"
      onFooterButtonClick={() => console.log("Footer button clicked")}
    />
  )
}

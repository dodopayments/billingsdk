"use client"

import { PricingTableSix } from "@/components/billingsdk/pricing-page"

export function PricingTableSixDemo() {
  return (
    <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
      <div className="flex flex-1 flex-col justify-center">
        <PricingTableSix />
      </div>
    </div>
  )
}



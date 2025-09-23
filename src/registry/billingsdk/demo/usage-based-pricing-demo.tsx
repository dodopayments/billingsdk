"use client"

import { useState } from "react"
import { UsageBasedPricing } from "@/components/billingsdk/usage-based-pricing"

export function UsageBasedPricingDemo() {
  const [credits, setCredits] = useState(4000)
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center space-y-6">
      <UsageBasedPricing
        className="w-full max-w-5xl"
        min={4000}
        max={25001}
        snapTo={100}
        currency="$"
        basePrice={39.99}
        includedCredits={4000}
        value={credits}
        onChange={setCredits}
        onChangeEnd={(v) => console.log("Committed:", v)}
        title="Pay-as-you-use pricing"
        subtitle="Start with a flat monthly rate that includes 4,000 credits."
      />
      <div className="text-xs text-muted-foreground">Current value: {credits.toLocaleString()} credits</div>
    </div>
  )
}

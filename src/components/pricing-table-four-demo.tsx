"use client"

import { PricingTableFour } from "@/components/billingsdk/pricing-table-four"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableFourDemo() {
    return (
        <PricingTableFour 
            plans={plans}
            title="Choose Your Perfect Plan"
            description="Transform your project with our comprehensive pricing options designed for every need."
            onPlanSelect={(planId: string) => console.log('Selected plan:', planId)}
            size="medium"
            className="w-full"
        />
    )
}
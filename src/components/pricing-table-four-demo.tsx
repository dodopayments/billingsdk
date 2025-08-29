"use client"

import { PricingTableFour } from "@/components/billingsdk/pricing-table-four"
import { plans } from "@/lib/billingsdk-config"

export function PricingTableFourDemo() {
    return (
        <div className="space-y-16">
            {/* Minimal Theme */}
            <div>
                <h3 className="text-2xl font-bold mb-4 text-center">Minimal Theme</h3>
                <PricingTableFour 
                    plans={plans}
                    title="Choose Your Perfect Plan"
                    description="Transform your project with our comprehensive pricing options designed for every need."
                    onPlanSelect={(planId: string) => console.log('Selected plan:', planId)}
                    size="medium"
                    theme="minimal"
                    className="w-full"
                />
            </div>

            {/* Classic Theme */}
            <div>
                <h3 className="text-2xl font-bold mb-4 text-center">Classic Theme</h3>
                <PricingTableFour 
                    plans={plans}
                    title="Choose Your Perfect Plan"
                    description="Transform your project with our comprehensive pricing options designed for every need."
                    onPlanSelect={(planId: string) => console.log('Selected plan:', planId)}
                    size="medium"
                    theme="classic"
                    className="w-full"
                />
            </div>
        </div>
    )
}
"use client"

import { PlanProps, PricingTableSix } from "@/registry/billingsdk/pricing-table-six"

export function PricingTableSixDemo() {

    const plans: PlanProps[] = [
        {
          id: "basic",
          title: "Starter",
          description: "Best for individuals and small teams",
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            "Core tools with modest usage allowances",
            "Getting-started guides to launch quickly",
            "Fundamental analytics and reports",
            "Standard email assistance",
          ]
        },
        {
          id: "premium",
          title: "Growth",
          description: "Built for expanding teams",
          monthlyPrice: 50,
          yearlyPrice: 500,
          isFeatured: true,
          features: [
            "Advanced tools with priority updates",
            "Onboarding guides to ramp fast",
            "Live chat support access",
            "Automation to streamline workflows",
            "Premium tutorials and webinars access",
          ]
        },
        {
          id: "custom",
          title: "Enterprise",
          description: "Tailored for specialized requirements",
          monthlyPrice: 99,
          yearlyPrice: 990,
          isCustom: true,
          features: [
            "Unlimited users, projects, and data",
            "Resources that scale with your needs",
            "24/7 priority support",
            "White-label reports, dashboards, and UIs",
            "Support for custom API integrations",
            "Works with advanced or proprietary systems",
          ]
        },
      ]

    return (
        <PricingTableSix
            plans={plans}
            onPlanSelect={(planId: string) => console.log('Selected plan:', planId)}
        />
    )
}
"use client"

import { PlanProps } from "../pricing-table-nine"

const plans: PlanProps[] = [
    {
        id: "free",
        title: "Free Plan",
        description: "Everything you need is readily available here.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            "Access special perks by linking your accounts.",
            "Get more our of your experience by connecting your accounts now!",
            "Elevate your experience with our exclusive premium account features.",
            "Elevate your experience with our exclusive premium account features.",
            "Elevate your experience with our exclusive premium account features.",
        ]
    },
    {
        id: "pro",
        title: "Pro Plan",
        description: "AI reviews, advanced exports & much more",
        monthlyPrice: 50,
        yearlyPrice: 500,
        features: [
            "Access special perks by linking your accounts.",
            "Get more our of your experience by connecting your accounts now!",
            "Elevate your experience with our exclusive premium account features.",
            "Elevate your experience with our exclusive premium account features.",
            "Elevate your experience with our exclusive premium account features.",
        ]
    },
    {
        id: "enterprise",
        title: "Enterprise Plan",
        description: "Custom packs, fast support & all included in Pro.",
        monthlyPrice: 69,
        yearlyPrice: 699,
        features: [
            "Unlock exclusive benifits with your linked accounts!",
            "Enjoy enhanced premium features with this plan!",
            "Maximize you experience and share with your other developer, no hassle.",
            "Maximize you experience and share with your other developer, no hassle.",
            "Maximize you experience and share with your other developer, no hassle.",
        ]
    },
    

]

import { PricingTableNine } from "../pricing-table-nine"

export function PricingTableNineDemo() {
    return(
        <PricingTableNine plans={plans} />
    )
}
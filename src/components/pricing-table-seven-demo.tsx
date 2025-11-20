"use client";

import { PricingTableSeven } from "@/components/billingsdk/pricing-table-seven";

const plans = [
  {
    id: "basic",
    name: "Basic plan",
    description: "Our most popular plan.",
    price: 10,
    popular: false,
    users: 5,
  },
  {
    id: "business",
    name: "Business plan",
    description: "Best for growing teams.",
    price: 20,
    popular: true,
    users: 15,
  },
  {
    id: "enterprise",
    name: "Enterprise plan",
    description: "Best for large teams.",
    price: 40,
    popular: false,
    users: 25,
  },
];

const features = [
  {
    category: "Overview",
    items: [
      {
        name: "Basic features",
        tooltip: true,
        basic: true,
        business: true,
        enterprise: true,
      },
      {
        name: "Users",
        tooltip: true,
        basic: "10",
        business: "20",
        enterprise: "Unlimited",
      },
      {
        name: "Individual data",
        tooltip: true,
        basic: "20GB",
        business: "40GB",
        enterprise: "Unlimited",
      },
      {
        name: "Support",
        tooltip: true,
        basic: true,
        business: true,
        enterprise: true,
      },
      {
        name: "Automated workflows",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
      {
        name: "200+ integrations",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Reporting and analytics",
    items: [
      {
        name: "Analytics",
        tooltip: true,
        basic: "Basic",
        business: "Advanced",
        enterprise: "Advanced",
      },
      {
        name: "Export reports",
        tooltip: true,
        basic: true,
        business: true,
        enterprise: true,
      },
      {
        name: "Scheduled reports",
        tooltip: true,
        basic: true,
        business: true,
        enterprise: true,
      },
      {
        name: "API access",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
      {
        name: "Advanced reports",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
      {
        name: "Saved reports",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
      {
        name: "Customer properties",
        tooltip: true,
        basic: false,
        business: false,
        enterprise: true,
      },
      {
        name: "Custom fields",
        tooltip: true,
        basic: false,
        business: false,
        enterprise: true,
      },
    ],
  },
  {
    category: "User access",
    items: [
      {
        name: "SSO/SAML authentication",
        tooltip: true,
        basic: true,
        business: true,
        enterprise: true,
      },
      {
        name: "Advanced permissions",
        tooltip: true,
        basic: false,
        business: true,
        enterprise: true,
      },
      {
        name: "Audit log",
        tooltip: true,
        basic: false,
        business: false,
        enterprise: true,
      },
      {
        name: "Data history",
        tooltip: true,
        basic: false,
        business: false,
        enterprise: true,
      },
    ],
  },
];

export function PricingTableSevenDemo() {
  return (
    <PricingTableSeven
      plans={plans}
      features={features}
      title="Choose a plan that's right for you"
      description="We believe Untitled should be accessible to all companies, no matter the size of your startup."
      onPlanSelect={(planId: string) => console.log("Selected plan:", planId)}
      size="medium"
      theme="classic"
      className="w-full"
    />
  );
}

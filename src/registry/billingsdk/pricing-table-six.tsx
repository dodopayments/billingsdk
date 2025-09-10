"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Plan } from "@/lib/billingsdk-config"

const defaultPlans: Plan[] = [
  {
    id: "basic",
    title: "Basic plan",
    description: "Our most popular plan.",
    currency: "$",
    monthlyPrice: "10",
    yearlyPrice: "100",
    buttonText: "Get started",
    features: [
      { name: "Basic features", icon: "check" },
      { name: "10 users", icon: "check" },
      { name: "20GB storage", icon: "check" },
      { name: "Email support", icon: "check" },
    ],
  },
  {
    id: "business",
    title: "Business plan",
    description: "Best for growing teams.",
    currency: "$",
    monthlyPrice: "20",
    yearlyPrice: "200",
    buttonText: "Get started",
    badge: "Most popular",
    highlight: true,
    features: [
      { name: "Basic features", icon: "check" },
      { name: "20 users", icon: "check" },
      { name: "40GB storage", icon: "check" },
      { name: "Priority support", icon: "check" },
      { name: "Automated workflows", icon: "check" },
      { name: "200+ integrations", icon: "check" },
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise plan",
    description: "Best for large teams.",
    currency: "$",
    monthlyPrice: "40",
    yearlyPrice: "400",
    buttonText: "Get started",
    features: [
      { name: "Basic features", icon: "check" },
      { name: "Unlimited users", icon: "check" },
      { name: "Unlimited storage", icon: "check" },
      { name: "24/7 support", icon: "check" },
      { name: "Automated workflows", icon: "check" },
      { name: "200+ integrations", icon: "check" },
      { name: "Advanced analytics", icon: "check" },
      { name: "Custom fields", icon: "check" },
    ],
  },
]

const features = [
  {
    category: "Overview",
    items: [
      { name: "Basic features", tooltip: true, basic: true, business: true, enterprise: true },
      { name: "Users", tooltip: true, basic: "10", business: "20", enterprise: "Unlimited" },
      { name: "Individual data", tooltip: true, basic: "20GB", business: "40GB", enterprise: "Unlimited" },
      { name: "Support", tooltip: true, basic: true, business: true, enterprise: true },
      { name: "Automated workflows", tooltip: true, basic: false, business: true, enterprise: true },
      { name: "200+ integrations", tooltip: true, basic: false, business: true, enterprise: true },
    ],
  },
  {
    category: "Reporting and analytics",
    items: [
      { name: "Analytics", tooltip: true, basic: "Basic", business: "Advanced", enterprise: "Advanced" },
      { name: "Export reports", tooltip: true, basic: true, business: true, enterprise: true },
      { name: "Scheduled reports", tooltip: true, basic: true, business: true, enterprise: true },
      { name: "API access", tooltip: true, basic: false, business: true, enterprise: true },
      { name: "Advanced reports", tooltip: true, basic: false, business: true, enterprise: true },
      { name: "Saved reports", tooltip: true, basic: false, business: true, enterprise: true },
      { name: "Customer properties", tooltip: true, basic: false, business: false, enterprise: true },
      { name: "Custom fields", tooltip: true, basic: false, business: false, enterprise: true },
    ],
  },
  {
    category: "User access",
    items: [
      { name: "SSO/SAML authentication", tooltip: true, basic: true, business: true, enterprise: true },
      { name: "Advanced permissions", tooltip: true, basic: false, business: true, enterprise: true },
      { name: "Audit log", tooltip: true, basic: false, business: false, enterprise: true },
      { name: "Data history", tooltip: true, basic: false, business: false, enterprise: true },
    ],
  },
]

export interface PricingTableSixProps {
  className?: string;
  title?: string;
  description?: string;
  plans?: Plan[];
  features?: Array<{
    category: string;
    items: Array<{
      name: string;
      tooltip: boolean;
      basic: boolean | string;
      business: boolean | string;
      enterprise: boolean | string;
    }>;
  }>;
  onPlanSelect?: (planId: string) => void;
}

export function PricingTableSix({
  className,
  title = "Choose a plan that's right for you",
  description = "We believe Untitled should be accessible to all companies, no matter the size of your startup.",
  plans: customPlans,
  features: customFeatures,
  onPlanSelect
}: PricingTableSixProps) {
  const [selectedPlan, setSelectedPlan] = useState("business")

  // Use custom plans if provided, otherwise use default plans
  const plansToUse = customPlans || defaultPlans
  const featuresToUse = customFeatures || features

  const currentPlan = plansToUse.find((plan) => plan.id === selectedPlan) || plansToUse[1]
  // For slider, we'll use a simple calculation based on plan index
  const sliderValue = [plansToUse.indexOf(currentPlan) + 1]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? <Check className="h-5 w-5 text-indigo-600" /> : <span className="text-muted-foreground">—</span>
    }
    return <span className="text-sm text-foreground">{value}</span>
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    onPlanSelect?.(planId)
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <div className="relative">
          <Slider value={sliderValue} max={25} min={1} step={1} className="w-full" disabled />
          <div className="mt-2 text-center">
            <span className="text-sm font-medium text-foreground">{currentPlan.title}</span>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div></div>
          {plansToUse.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedPlan === plan.id
                  ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600"
                  : "hover:border-border",
              )}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white px-4 py-1 text-sm font-medium rounded-md shadow-sm">
                    {plan.badge || "Most popular"}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold text-foreground">{plan.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.currency}{plan.monthlyPrice}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className={cn(
                    "w-full",
                    selectedPlan === plan.id
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-background border text-foreground hover:bg-muted",
                  )}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {featuresToUse.map((category, categoryIndex) => (
            <div key={category.category}>
              {categoryIndex > 0 && <div className="border-t border-border" />}

              <div className="bg-muted px-6 py-4">
                <h3 className="text-sm font-semibold text-foreground">{category.category}</h3>
              </div>

              {category.items.map((feature, featureIndex) => (
                <div
                  key={feature.name}
                  className={cn(
                    "grid grid-cols-1 lg:grid-cols-4 gap-4 px-6 py-4",
                    featureIndex > 0 && "border-t border-border",
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground">{feature.name}</span>
                    {feature.tooltip && <Info className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue((feature as any).basic)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue((feature as any).business)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue((feature as any).enterprise)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div></div>
          {plansToUse.map((plan) => (
            <Button
              key={plan.id}
              variant={selectedPlan === plan.id ? "default" : "outline"}
              className={cn(selectedPlan === plan.id && "bg-indigo-600 hover:bg-indigo-700")}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.buttonText}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

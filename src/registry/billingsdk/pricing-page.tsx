"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"

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
    users: "25+",
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

export function PricingTableSix() {
  const [selectedPlan, setSelectedPlan] = useState("business")

  const currentPlan = plans.find((plan) => plan.id === selectedPlan) || plans[1]
  const sliderValue = [typeof currentPlan.users === "string" ? 25 : currentPlan.users]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? <Check className="h-5 w-5 text-indigo-600" /> : <span className="text-muted-foreground">—</span>
    }
    return <span className="text-sm text-foreground">{value}</span>
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
          Choose a plan that's right for you
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We believe Untitled should be accessible to all companies, no matter the size of your startup.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <div className="relative">
          <Slider value={sliderValue} max={25} min={1} step={1} className="w-full" disabled />
          <div className="mt-2 text-center">
            <span className="text-sm font-medium text-foreground">{currentPlan.users} users</span>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div></div>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedPlan === plan.id
                  ? "border-indigo-600 shadow-lg ring-2 ring-indigo-600"
                  : "hover:border-border",
              )}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white px-4 py-1 text-sm font-medium rounded-md shadow-sm">
                    Most popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
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
                  Get started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {features.map((category, categoryIndex) => (
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
          {plans.map((plan) => (
            <Button
              key={plan.name}
              variant={selectedPlan === plan.id ? "default" : "outline"}
              className={cn(selectedPlan === plan.id && "bg-indigo-600 hover:bg-indigo-700")}
              onClick={() => handlePlanSelect(plan.id)}
            >
              Get started
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}



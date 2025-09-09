"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Check, X, Info, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Basic plan",
    description: "Our most popular plan.",
    price: 10,
    popular: false,
  },
  {
    name: "Business plan",
    description: "Best for growing teams.",
    price: 20,
    popular: true,
  },
  {
    name: "Enterprise plan",
    description: "Best for large teams.",
    price: 40,
    popular: false,
  },
]

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
]

const footerLinks = {
  PRODUCT: ["Overview", "Features", "Solutions", "Tutorials", "Pricing", "Releases"],
  COMPANY: ["About us", "Careers", "Press", "News", "Media kit", "Contact"],
  RESOURCES: ["Blog", "Newsletter", "Events", "Help centre", "Tutorials", "Support"],
  "USE CASES": ["Startups", "Enterprise", "Government", "SaaS", "Marketplaces", "Ecommerce"],
  SOCIAL: ["Twitter", "LinkedIn", "Facebook", "GitHub", "AngelList", "Dribbble"],
  LEGAL: ["Terms", "Privacy", "Cookies", "Licenses", "Settings", "Contact"],
}

export function PricingPage() {
  const [users, setUsers] = useState([14])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? <Check className="h-5 w-5 text-indigo-600" /> : <span className="text-gray-400">—</span>
    }
    return <span className="text-sm text-gray-900">{value}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 px-4 py-3 text-center text-sm text-white">
        <span>We've just launched a new feature! Check out the </span>
        <a href="#" className="underline">
          new dashboard
        </a>
        <button className="ml-4 text-white hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                  <span className="text-sm font-semibold text-white">U</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Untitled UI</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-700">
                Home
              </a>
              <div className="relative">
                <button className="flex items-center text-gray-900 hover:text-gray-700">
                  Features
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <a href="#" className="text-gray-900 hover:text-gray-700">
                Pricing
              </a>
              <div className="relative">
                <button className="flex items-center text-gray-900 hover:text-gray-700">
                  Resources
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <a href="#" className="text-gray-900 hover:text-gray-700">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden md:inline-flex">
                Log in
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Get started</Button>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-balance">
            Choose a plan that's right for you
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            We believe Untitled should be accessible to all companies, no matter the size of your startup.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <div className="relative">
            <Slider value={users} onValueChange={setUsers} max={100} min={1} step={1} className="w-full" />
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-gray-900">{users[0]} users</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={cn("relative", plan.popular && "border-indigo-600 shadow-lg")}> 
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">
                  Most popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold">{plan.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${'{'}plan.price{'}'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50",
                  )}
                >
                  Get started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {features.map((category, categoryIndex) => (
              <div key={category.category}>
                {categoryIndex > 0 && <div className="border-t border-gray-200" />}

                <div className="bg-gray-50 px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-900">{category.category}</h3>
                </div>

                {category.items.map((feature, featureIndex) => (
                  <div
                    key={feature.name}
                    className={cn(
                      "grid grid-cols-1 lg:grid-cols-4 gap-4 px-6 py-4",
                      featureIndex > 0 && "border-t border-gray-100",
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{feature.name}</span>
                      {feature.tooltip && <Info className="h-4 w-4 text-gray-400" />}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start">
                      {renderFeatureValue(feature.basic)}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start">
                      {renderFeatureValue(feature.business)}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start">
                      {renderFeatureValue(feature.enterprise)}
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
                variant={plan.popular ? "default" : "outline"}
                className={cn(plan.popular && "bg-indigo-600 hover:bg-indigo-700")}
              >
                Get started
              </Button>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{category}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                <span className="text-xs font-semibold text-white">U</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Untitled UI</span>
            </div>
            <p className="text-sm text-gray-600">© 2077 Untitled UI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



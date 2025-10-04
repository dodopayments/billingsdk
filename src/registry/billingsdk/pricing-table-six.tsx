"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

export interface PlanProps {
  id: string
  title: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  isFeatured?: boolean
  isCustom?: boolean
}

export interface PricingTableSixProps {
  plans: PlanProps[]
  onPlanSelect: (planId: string) => void
}

const gradientFrom = ["from-chart-1/70","from-chart-2/70","from-chart-3/70"];

const getDiscountPercent=(plan: PlanProps) => {
  return Math.min(100, Math.max(0, Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)));
}

export function PricingTableSix({  plans, onPlanSelect}: PricingTableSixProps) {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight text-foreground">
            Tailored plans for<span className="italic font-light">every stage</span>
            </h2>
          </div>

          <div className="lg:pt-4">
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
            No matter where you are in your journey, find a plan that fits your goals and budget.
            </p>

            {/* Toggle */}

          {/* Toggle with layoutId */}
            <div className="relative inline-flex items-center bg-primary-foreground/70 rounded-full p-1.5 dark:!shadow-[inset_0_1.5px_0_color-mix(in_oklch,_var(--primary)_15%,_transparent)]">
              <button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 text-foreground px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  !isYearly ? "text-foreground border border-muted-foreground/10" : "text-muted-foreground "
                }`}
                aria-pressed={!isYearly}
              >
                {!isYearly && (
                  <motion.div
                    layoutId="toggle-indicator"
                    className="absolute inset-0 bg-primary-foreground shadow-sm rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </button>
              
              <button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 text-foreground px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                  isYearly ? "text-foreground border border-muted-foreground/10" : "text-muted-foreground "
                }`}
                aria-pressed={isYearly}
              >
                {isYearly && (
                  <motion.div
                    layoutId="toggle-indicator"
                    className="absolute inset-0 bg-primary-foreground shadow-sm rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Yearly</span>
              </button>
            </div>

          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {plans.map((plan,index) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 border border-primary-foreground transition-all duration-300 hover:-translate-y-1 
                hover:scale-[1.01] shadow-xl  bg-gradient-to-b ${gradientFrom[index]} from-[0%] via-primary-foreground/10 via-[40%] to-primary-foreground to-[100%]`}
            >
              {/* Most Popular Badge */}
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-foreground text-foreground px-3 py-1 rounded-full text-xs font-medium ring-1 ring-muted-foreground/50 whitespace-nowrap">
                    Most popular
                  </div>
                </div>
              )}

              {/* Title and Description */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{plan.title}</h3>
                  {isYearly && plan.monthlyPrice > 0 && plan.yearlyPrice < plan.monthlyPrice * 12 && (
                  <motion.div className=""
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="inline-block bg-primary-foreground text-foreground text-xs px-2 py-1 rounded-full shadow-sm shadow-muted-foreground/40 whitespace-nowrap">
                    Save {getDiscountPercent(plan)}%
                    </span>
                  </motion.div>
                )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-base text-muted-foreground">$</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isYearly ? "yearly-price" : "monthly-price"}
                      className="text-5xl font-bold text-foreground ml-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={isYearly ? "per-year" : "per-month"}
                      className="text-sm text-muted-foreground ml-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      / {isYearly ? "year" : "month"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mb-8">
                <Button
                  className={`w-full h-12 rounded-xl font-medium transition-all duration-200 bg-foreground text-primary-foreground hover:bg-foreground/90 hover:cursor-pointer
                    border border-primary-foreground
                    ${!plan.isFeatured ? "bg-foreground/80 text-primary-foreground hover:bg-foreground/70" : ""}
                  `}
                  aria-label={`Start ${plan.title} plan${(isYearly ? plan.yearlyPrice : plan.monthlyPrice) === 0 ? " — free" : ""}`}
                  onClick={() => onPlanSelect(plan.id)}
                >
                  {plan.isCustom ? "Contact team" : "Get started"}
                </Button>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-foreground flex items-center justify-center mt-0.5 mr-3">
                        <Check className="w-2.5 h-2.5 text-foreground" />
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

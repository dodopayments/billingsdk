"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { type Plan } from "@/lib/billingsdk-config"

export interface PricingTableSevenProps {
  plans: Plan[]
  title: string
  description: string
  onPlanSelect: (planId: string) => void
}

export function PricingTableSeven({
  plans,
  title,
  description,
  onPlanSelect,
}: PricingTableSevenProps) {
  const [isYearly, setIsYearly] = useState(false)

  if (!plans || !Array.isArray(plans)) {
    console.error("PricingTableSeven: plans prop must be an array")
    return null
  }

  return (
    <section className={`py-16 px-4 bg-background min-h-screen flex items-center`}>
      <div className="max-w-6xl mx-auto w-full ">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground text-base mb-8">{description}</p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-primary shadow-lg"
                animate={{ x: isYearly ? 22 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/50 rounded-4xl p-0 bg-muted ${
                plan.highlight ? "shadow-md" : "shadow-sm"
              }`}
            >
              <div className="rounded-b-4xl overflow-hidden shadow-md bg-primary-foreground">
                <div className="rounded-2xl mx-4 mt-4 overflow-hidden">
                  <div className=" px-6 py-8 rounded-3xl relative shadow-sm bg-muted brightness-95">
                    <div className="rounded-3xl inline-flex px-3 py-1 bg-primary-foreground mb-4 brightness-150 relative -top-4 -left-2 ">
                      <h3 className="text-sm font-semibold text-center">{plan.title}</h3>
                    </div>

                    <div className="flex justify-start items-end text-center -left-10 top-4">
                      {plan.monthlyPrice === "Custom" ? (
                        <div className="flex items-baseline justify-center">
                          <div className="text-4xl font-bold mb-2.5 text-primary">Custom</div>
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={isYearly ? "per-year" : "per-month"}
                                className="text-sm text-primary/70 ml-2"
                                initial={{ opacity: 0, y: 7 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                              >
                              / {isYearly ? "year" : "month"}
                              </motion.span>
                            </AnimatePresence>          
                        </div>
                      ) : (
                        <div className="flex items-baseline justify-center">
                              <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                  key={isYearly ? "yearly-price" : "monthly-price"}
                                  className="text-5xl font-bold text-primary ml-1"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="">
                                  {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                  </div>
                                </motion.span>
                             </AnimatePresence>
                             <AnimatePresence mode="wait" initial={false}>
                               <motion.span
                                  key={isYearly ? "per-year" : "per-month"}
                                  className="text-sm text-primary/70 ml-2"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                / {isYearly ? "year" : "month"}
                               </motion.span>
                        </AnimatePresence>          
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-6 text-center">
                    <p className=" text-sm mb-6 -ml-6">{plan.description}</p>
                    <Button 
                      onClick={() => onPlanSelect(plan.id)}
                      className="w-full shadow-[inset_0_6px_6px_-4px_rgba(255,255,255,0.6)] rounded-full py-6 font-medium text-sm"
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 rounded-b-xl mx-4 mb-4">
                
                <ul className="space-y-3">
                  {plan.features?.map((feature, idx) => (
                    <li key={`${plan.id}-feature-${idx}`} className="flex items-start gap-3">
                      <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${feature.iconColor || "text-gray-500"}`} />
                      <span className="text-sm leading-relaxed">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
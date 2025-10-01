"use client"
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"

export interface PlanProps {
    id: string
    title: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
    isBestvalued?: boolean
    isCustom?: boolean
}

export interface PricingTableNineProps {
    plans: PlanProps[]
    onPlanSelect?: (planId: string) => void
}

const getDiscountPercent = (plan: PlanProps) => {
    // Handle free plans or plans with 0 price
    if (plan.monthlyPrice === 0 || plan.yearlyPrice === 0) {
        return 0;
    }
    
    // Calculate discount percentage
    const discount = Math.min(100, Math.max(0, Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)));
    return discount;
}

export function PricingTableNine({ plans, onPlanSelect }: PricingTableNineProps) {

    const [isYearly, setIsYearly] = useState(false)

    return (
        <section className="py-18 px-2 sm:px-4 lg:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-start mb-14">
                    <h2 className="text-4xl sm:text-5xl  font-semibold tracking-tight text-primary">Proffesional plans for <br />
                        <span className="font-light tracking-wide italic">{" "}every business growth !!</span>
                    </h2>
                    <p className="text-primary/60 text-[1.1rem] mt-4 mb-4 ">Start today for free. Pay when your workflow gets bigger.</p>

                    {/* Toggle */}
                    <div className="relative inline-flex items-center bg-primary-foreground/70 rounded-full p-2 dark:!shadow-[inset_0_2.5px_0_color-mix(in_oklch,_var(--primary)_15%,_transparent)]  ">
                        <button
                            className={`relative z-5 px-6 py-2 text-primary rounded-full text-sm font-medium cursor-pointer ${!isYearly ? "text-primary border border-muted-foreground/5" : "text-primary/50"}`}
                            aria-pressed={!isYearly}
                            onClick={() => setIsYearly(false)}
                        >
                            {!isYearly && (
                                <motion.div
                                    layoutId="toggle-indicator"
                                    className="absolute inset-0 bg-primary-foreground shadow-sm rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-5">Monthly</span>
                        </button>
                        <button
                            className={`relative z-5 px-6 py-2 text-primary rounded-full text-sm font-medium cursor-pointer ${isYearly ? "text-primary border border-muted-foreground/5" : "text-primary/50"}`}
                            aria-pressed={isYearly}
                            onClick={() => setIsYearly(true)}
                        >
                            {isYearly && (
                                <motion.div
                                    layoutId="toggle-indicator"
                                    className="absolute inset-0 bg-primary-foreground shadow-sm rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-5">Yearly</span>
                        </button>
                    </div>
                </div>

                {/* Main Cards */}
                <div className="grid md:grid-cols-3 gap-2">
                    {plans.map((plan, index) => (
                        <div key={index} className="flex flex-col py-5 px-4 border border-border bg-card shadow-sm">
                            <div className="mb-5">
                                <h3 className="text-3xl font-light tracking-tight">{plan.title}</h3>
                                <p className="text-sm text-foreground/70 mt-2">{plan.description}</p>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex items-baseline">
                                    <span className="text-xl text-primary/70">$</span>
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={isYearly ? "yearly-price" : "monthly-price"}
                                            className="text-4xl font-semibold ml-1"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {isYearly ? Math.round(plan.yearlyPrice) : Math.round(plan.monthlyPrice)}
                                        </motion.span>
                                    </AnimatePresence>
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span
                                            key={isYearly ? "per-year" : "per-month"}
                                            className="text-md text-muted-foreground ml-1"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            / {isYearly ? "year" : "month"}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                                <div className="mt-1 mb-10 h-6">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isYearly && plan.monthlyPrice > 0 && (
                                            <motion.span
                                                key="discount-text"
                                                className="text-md text-green-500 font-medium"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Save {getDiscountPercent(plan)}%
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <button 
                                onClick={() => onPlanSelect?.(plan.id)}
                                className={`w-40 py-3.5 px-4 rounded-2xl text-sm font-medium transition-colors mb-6 border 
                                ${plan.isBestvalued 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
                            >
                                {plan.isCustom ? "Contact Sales" : "Get Started"}
                            </button>
                            
                            <div className="w-[calc(100%+32px)] h-px bg-border mb-6 -mx-4"></div>
                            
                            <ul className="space-y-4 mb-4 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center font-semibold">
                                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-muted-foreground ml-2">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
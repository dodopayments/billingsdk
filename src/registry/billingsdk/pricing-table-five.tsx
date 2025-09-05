"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Phone } from "lucide-react"
import { type Plan } from "@/lib/billingsdk-config"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

export interface PricingTableFiveProps {
  plans: Plan[]
  title: string
  description: string
  onPlanSelect: (planId: string) => void
  className?: string
  variant?: "default" | "minimal"
}


const switchScaleVariants = cva("transition-all", {
  variants: {
    size: {
      small: "scale-90",
      medium: "scale-95",
      large: "",
    },
    theme: {
      minimal: "",
      classic: "data-[state=checked]:bg-primary",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});


const contactCardVariants = cva("border-border shadow-sm w-full md:!w-[30%]", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      minimal: "bg-card text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const contactIconContainerVariants = cva("w-12 h-12 rounded-lg flex items-center justify-center mx-auto", {
  variants: {
    variant: {
      default: "bg-primary",
      minimal: "bg-card",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


const contactIconVariants = cva("w-9 h-9", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      minimal: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const contactTitleVariants = cva("text-2xl font-bold mb-3", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      minimal: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});


const contactDescriptionVariants = cva("text-sm leading-relaxed", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      minimal: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const contactButtonVariants = cva("w-full", {
  variants: {
    variant: {
      default: "bg-primary-foreground text-foreground hover:bg-foreground/60",
      minimal: "bg-primary text-primary-foreground hover:bg-primary/60",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const contactFooterVariants = cva("text-xs", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      minimal: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function PricingTableFive({ plans, title, description, onPlanSelect,className,variant="default" }: PricingTableFiveProps) {
  const [isAnnual, setIsAnnual] = useState(false)


  function calculateDiscount(monthlyPrice: string, yearlyPrice: string): number {
    const monthly = parseFloat(monthlyPrice);
    const yearly = parseFloat(yearlyPrice);

    if (
      monthlyPrice.toLowerCase() === "custom" ||
      yearlyPrice.toLowerCase() === "custom" ||
      isNaN(monthly) ||
      isNaN(yearly) ||
      monthly === 0
    ) {
      return 0;
    }

    const discount = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
    return Math.round(discount);
  }


  const yearlyPriceDiscount = plans.length
  ? Math.max(
    ...plans.map((plan) =>
      calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)
    )
  )
  : 0;

  const regularPlans = plans.slice(0, -1);
  const contactUsPlan = plans[plans.length - 1];
  return (
    <div className={cn(className,"w-full")}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8 text-pretty">
          {description}
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>MONTHLY</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className={cn(switchScaleVariants({ size: "large", theme: "minimal" }))}
          />
          <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>ANNUAL</span>
        <div className="flex justify-center">
          {yearlyPriceDiscount > 0 && (
            <motion.span
              className={cn(
                "text-xs  text-emerald-500 font-medium bg-emerald-500/10 px-2 py-1 rounded-md"
              )}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Save {yearlyPriceDiscount}%
            </motion.span>
          )}
        </div>
        </div>
      </div>

      <div className="flex flex-col md:!flex-row justify-between gap-4">
        <div className="flex flex-col gap-5 w-full md:!w-[70%]">
          {regularPlans.map((plan) => (
              <Card key={plan.id} className="relative bg-card border border-border shadow-sm  py-4">
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                )}
                <CardContent className="w-full flex flex-col md:!flex-row md:!justify-between gap-6">
                      <div className="flex flex-col justify-center gap-2">
                        <CardTitle className="w-fit text-sm px-2 py-1 font-medium text-foreground uppercase border  border-border rounded-md">{plan.title}</CardTitle>
                        <AnimatePresence mode="wait">
                        {isAnnual ? (
                          <motion.div
                            key="yearly"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-4xl font-bold text-foreground">${plan.yearlyPrice}</span>
                            <span className="text-foreground">/{isAnnual ? "Year" : "Month"}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="monthly"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-4xl font-bold text-foreground">${plan.monthlyPrice}</span>
                            <span className="text-foreground">/{isAnnual ? "Year" : "Month"}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                        <Button onClick={() => onPlanSelect(plan.id)} className="w-full bg-primary text-primary-foreground hover:bg-primary/60">{plan.buttonText}</Button>
                      </div>
                      <div className="grid gap-4">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                              <Check className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-sm text-muted-foreground">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Contact Us Card */}
        <Card className={cn(contactCardVariants({ variant }))} >
          <CardContent className="p-8 text-center space-y-6">
            <div className={cn(contactIconContainerVariants({ variant }))}>
              <Phone className={cn(contactIconVariants({ variant }))} />
            </div>
            <div>
              <h3 className={cn(contactTitleVariants({ variant }))}>{contactUsPlan.title}</h3>
              <p className={cn(contactDescriptionVariants({ variant }))}>
                {contactUsPlan.description}
              </p>
            </div>
            <Button onClick={() => onPlanSelect(plans[plans.length - 1].id)} variant="secondary" className={cn(contactButtonVariants({ variant }))}>
              {contactUsPlan.buttonText}
            </Button>
            <p className={cn(contactFooterVariants({ variant }))}>{contactUsPlan.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

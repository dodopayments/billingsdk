"use client";

import { Check, Zap } from "lucide-react";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { 
  type PricingTableOneProps,
  sectionVariants,
  titleVariants,
  descriptionVariants,
  cardVariants,
  priceTextVariants,
  featureIconVariants,
  highlightBadgeVariants,
  toggleVariants,
  buttonVariants,
  calculateDiscount
} from "./pricing-table-one-utils";

export function PricingTableOne({ 
  className, 
  plans, 
  title, 
  description, 
  onPlanSelect, 
  size,
  theme = "minimal"
}: PricingTableOneProps) {
  const [isAnnually, setIsAnnually] = useState(false);
  const uniqueId = useId(); // Generate unique ID automatically

  const yearlyPriceDiscount = plans.length
    ? Math.max(
      ...plans.map((plan) =>
        calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)
      )
    )
    : 0;

  return (
    <section className={cn(sectionVariants({ size, theme }), className)}>
      {/* Classic theme background elements */}
      {theme === "classic" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
        </>
      )}
      
      <div className={cn("container relative", "p-0 md:p-[1rem]")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className={cn("flex flex-col gap-4", theme === "classic" && "text-center")}>
            <h2 className={cn(titleVariants({ size, theme }))}>
              {title || "Pricing"}
            </h2>
          </div>

          <div className={cn(
            "flex flex-col justify-between gap-5 md:gap-10",
            theme === "classic" ? "md:flex-col md:items-center" : "md:flex-row"
          )}>
            <p className={cn(descriptionVariants({ size, theme }))}>
              {description || "Transparent pricing with no hidden fees. Upgrade or downgrade anytime."}
            </p>
            <div className={cn(toggleVariants({ theme }), theme === "classic" && "mx-auto")}>
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === "annually");
                }}
              >
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="monthly"
                    id={`${uniqueId}-monthly`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${uniqueId}-monthly`}
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center px-2 md:px-7 font-semibold transition-all hover:text-foreground"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="annually"
                    id={`${uniqueId}-annually`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${uniqueId}-annually`}
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 px-2 md:px-7 font-semibold transition-all hover:text-foreground"
                  >
                    Yearly
                    {yearlyPriceDiscount > 0 && (
                      <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary border border-primary/20 font-medium">
                        Save {yearlyPriceDiscount}%
                      </span>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  cardVariants({ 
                    size, 
                    theme, 
                    highlight: plan.highlight 
                  })
                )}
              >
                {/* Classic theme highlight effect */}
                {theme === "classic" && plan.highlight && (
                  <>
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className={highlightBadgeVariants({ theme })}>
                        Most Popular
                      </Badge>
                    </div>
                  </>
                )}
                
                <Badge className={cn(
                  theme === "classic" && !plan.highlight 
                    ? "bg-muted text-muted-foreground border-border/50 mb-8" 
                    : highlightBadgeVariants({ theme })
                )}>
                  {plan.title}
                </Badge>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAnnually ? "year" : "month"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAnnually ? (
                      <>
                        <span className={cn("my-auto", priceTextVariants({ size, theme }))}>
                          {parseFloat(plan.yearlyPrice) >= 0 && (
                            <>
                              {plan.currency}
                            </>
                          )}
                          {plan.yearlyPrice}
                          {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice) > 0 && (
                            <span className={cn(
                              "text-xs ml-2",
                              theme === "classic" ? "text-emerald-500 font-semibold" : "underline"
                            )}>
                              {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)}% off
                            </span>
                          )}
                        </span>
                        <p className="text-muted-foreground">per year</p>
                      </>
                    ) : (
                      <>
                        <span className={cn(priceTextVariants({ size, theme }))}>
                          {parseFloat(plan.monthlyPrice) >= 0 && (
                            <>
                              {plan.currency}
                            </>
                          )}
                          {plan.monthlyPrice}
                        </span>
                        <p className="text-muted-foreground">per month</p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <Separator className={cn(
                  "my-6",
                  theme === "classic" && "bg-gradient-to-r from-transparent via-border to-transparent"
                )} />
                
                <div className="flex h-full flex-col justify-between gap-10">
                  <ul className="text-muted-foreground space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      >
                        <Check className={cn(featureIconVariants({ size, theme }))} />
                        <span className={cn(
                          theme === "classic" && "text-foreground/90"
                        )}>
                          {feature.name}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={buttonVariants({ theme })}
                    onClick={() => onPlanSelect?.(plan.id)}
                    aria-label={`Select ${plan.title} plan`}
                  >
                    {theme === "classic" && plan.highlight && (
                      <Zap className="w-4 h-4 mr-1" />
                    )}
                    {plan.buttonText}
                    {theme === "classic" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
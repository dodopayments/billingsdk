'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Plan } from "@/lib/billingsdk-config"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

const sectionVariants = cva("mt-10 max-w-7xl mx-auto", {
  variants: {
    variant: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
  },
  defaultVariants: {
    variant: "small",
  },
})

const toggleContainerVariants = cva(
  "bg-muted flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg",
  {
    variants: {
      variant: {
        small: "h-9 text-base",
        medium: "h-10 text-lg",
        large: "h-11 text-lg",
      },
    },
    defaultVariants: {
      variant: "large",
    },
  }
)

const labelPaddingVariants = cva("px-7", {
  variants: {
    variant: {
      small: "px-5",
      medium: "px-6",
      large: "px-7",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

const cardTitleVariants = cva("text-xl", {
  variants: {
    variant: {
      small: "text-lg",
      medium: "text-xl",
      large: "text-xl",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

const cardDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-sm",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

const priceTextVariants = cva("text-4xl font-medium", {
  variants: {
    variant: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-4xl",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

const featureIconVariants = cva("w-4 h-4", {
  variants: {
    variant: {
      small: "w-3 h-3",
      medium: "w-4 h-4",
      large: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

const footerWrapperVariants = cva(
  "flex items-center justify-between bg-muted/50 p-6 border-t border-border",
  {
    variants: {
      variant: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
      },
    },
    defaultVariants: {
      variant: "large",
    },
  }
)

const footerTextVariants = cva("text-lg font-medium text-card-foreground text-left w-full my-auto", {
  variants: {
    variant: {
      small: "text-base",
      medium: "text-lg",
      large: "text-lg",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export interface PricingTableProps extends VariantProps<typeof sectionVariants> {
  className?: string
  plans: Plan[]
  onPlanSelect?: (planId: string) => void
  showFooter?: boolean
  footerText?: string
  footerButtonText?: string
  onFooterButtonClick?: () => void
}

export function PricingTableThree({ className, plans, onPlanSelect, showFooter, footerText, footerButtonText, onFooterButtonClick, variant }: PricingTableProps) {
  const [isAnnually, setIsAnnually] = useState(false);

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

  return (
    <div className={cn(sectionVariants({ variant }), className)}>
      {/* Header Section with Toggle */}
      <div className="flex flex-col justify-between md:gap-10 gap-4 md:flex-row mb-8 items-center md:items-start">
        <div className={cn(toggleContainerVariants({ variant }))}>
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
                id="monthly"
                className="peer sr-only"
              />
              <Label
                htmlFor="monthly"
                className={cn(
                  "text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center font-semibold",
                  labelPaddingVariants({ variant })
                )}
              >
                Monthly
              </Label>
            </div>
            <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
              <RadioGroupItem
                value="annually"
                id="annually"
                className="peer sr-only"
              />
              <Label
                htmlFor="annually"
                className={cn(
                  "text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 font-semibold",
                  labelPaddingVariants({ variant })
                )}
              >
                Yearly
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-center">
          {yearlyPriceDiscount > 0 && (
            <span className="text-xs mt-2 text-muted-foreground">
              Save upto {yearlyPriceDiscount}% with yearly plan
            </span>
          )}
        </div>
      </div>

      <div className={cn(
        "grid gap-4 md:gap-0",
        plans.length === 1 && "grid-cols-1 max-w-md mx-auto",
        plans.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto",
        plans.length === 3 && "grid-cols-1 md:grid-cols-3",
        plans.length === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        plans.length >= 5 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}>
        {plans.map((plan) => (
          <Card key={plan.id} className={cn(
            "border rounded-xl md:border-none md:rounded-none text-card-foreground flex flex-col relative transition-all duration-200 shadow-sm md:shadow-none",
            plan.highlight === true
              ? "bg-muted/30 md:-mt-8 shadow-lg z-10 md:border-t md:rounded-md border-border"
              : "bg-card"
          )}>
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground px-3 py-1 text-xs">
                {plan.badge}
              </Badge>
            )}
            <CardHeader className="pb-4">
              <div className="space-y-2">
                <h3 className={cn(cardTitleVariants({ variant }), "font-semibold text-left")}>{plan.title}</h3>
                <p className={cn(cardDescriptionVariants({ variant }), "w-full text-left text-muted-foreground")}>{plan.description}</p>
              </div>
              <div className="space-y-1 text-left">
                <AnimatePresence mode="wait">
                  {isAnnually ? (
                    <motion.div
                      key="yearly"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={cn(priceTextVariants({ variant }), "text-left")}>
                        {parseFloat(plan.yearlyPrice) >= 0 && (
                          <>
                            {plan.currency}
                          </>
                        )}
                        {plan.yearlyPrice}
                        {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice) > 0 && (
                          <span className="text-xs ml-2 underline">
                            {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)}% off
                          </span>
                        )}
                      </span>
                      <p className="text-muted-foreground">Per year</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="monthly"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={cn(priceTextVariants({ variant }), "text-left")}>
                        {parseFloat(plan.monthlyPrice) >= 0 && (
                          <>
                            {plan.currency}
                          </>
                        )}
                        {plan.monthlyPrice}
                      </span>
                      <p className="text-muted-foreground">Per month</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.icon === "check" ? (
                      <div className="w-2 h-2 bg-primary rounded-sm"></div>
                    ) : (
                      <div className={cn(featureIconVariants({ variant }), feature.iconColor || "text-muted-foreground")}>
                        <Check className={cn(featureIconVariants({ variant }))} />
                      </div>
                    )}
                    <span className="text-sm">{feature.name}</span>
                    <span className="ml-auto text-sm text-muted-foreground">Included</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full mt-auto hover:cursor-pointer",
                  plan.highlight === true
                    ? "gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                )}
                onClick={() => onPlanSelect?.(plan.id)}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Section */}
      {showFooter !== false && (
        <div className={cn(
          footerWrapperVariants({ variant }),
          plans.length === 1 && "max-w-md mx-auto",
          plans.length === 2 && "max-w-4xl mx-auto"
        )}>
          <div className="flex flex-col md:flex-row gap-4 justify-between w-full">

              <p className={cn(footerTextVariants({ variant }))}>{footerText || "Pre-negotiated discounts are available to early-stage startups and nonprofits."}</p>
            <Button
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6"
              onClick={onFooterButtonClick}
            >
              {footerButtonText || "Apply now"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

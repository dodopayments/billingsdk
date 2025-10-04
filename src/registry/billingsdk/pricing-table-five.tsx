"use client"

import { useState, useId } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Phone } from "lucide-react"
import { type Plan } from "@/lib/billingsdk-config"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"

const sectionVariants = cva("py-32 relative overflow-hidden", {
  variants: {
    size: {
      small: "py-12",
      medium: "py-20",
      large: "py-32",
    },
    theme: {
      minimal: "bg-background",
      classic: "bg-gradient-to-b from-background to-muted/20",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

const titleVariants = cva("font-bold mb-4 text-foreground", {
  variants: {
    size: {
      small: "text-3xl lg:text-4xl",
      medium: "text-4xl lg:text-5xl",
      large: "text-4xl lg:text-6xl",
    },
    theme: {
      minimal: "",
      classic: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

const descriptionVariants = cva("text-muted-foreground max-w-3xl mx-auto mb-8", {
  variants: {
    size: {
      small: "text-base lg:text-lg",
      medium: "text-lg lg:text-xl",
      large: "lg:text-xl",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const toggleVariants = cva(
  "flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg",
  {
    variants: {
      theme: {
        minimal: "bg-muted",
        classic: "bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg",
      },
    },
    defaultVariants: {
      theme: "minimal",
    },
  }
);

const planCardVariants = cva(
  "relative border transition-all duration-300 rounded-lg",
  {
    variants: {
      size: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
      },
      theme: {
        minimal: "bg-card border-border hover:bg-muted/30 shadow-sm",
        classic: "bg-card border-border/50 hover:shadow-xl hover:border-border backdrop-blur-sm shadow-md",
      },
      highlight: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        theme: "classic",
        highlight: true,
        className: "ring-1 ring-primary/20 border-primary/30 bg-gradient-to-b from-primary/5 to-card shadow-lg",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted/50 border-primary/20 shadow-md",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

const contactCardVariants = cva(
  "border transition-all duration-300 h-full rounded-lg",
  {
    variants: {
      size: {
        small: "p-6",
        medium: "p-7",
        large: "p-8",
      },
      theme: {
        minimal: "bg-muted/50 border-border hover:bg-muted/70 shadow-sm",
        classic: "bg-card border-border/50 hover:shadow-xl hover:border-primary/20 backdrop-blur-sm shadow-md",
      },
    },
    defaultVariants: {
      size: "large",
      theme: "minimal",
    },
  }
);

const priceTextVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-4xl",
    },
    theme: {
      minimal: "text-foreground",
      classic: "font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const featureIconVariants = cva("flex-none", {
  variants: {
    size: {
      small: "w-3 h-3",
      medium: "w-4 h-4",
      large: "w-4 h-4",
    },
    theme: {
      minimal: "text-primary",
      classic: "text-emerald-500",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export interface PricingTableFiveProps extends VariantProps<typeof sectionVariants> {
  plans: Plan[]
  title?: string
  description?: string
  onPlanSelect?: (planId: string) => void
  className?: string
}

export function PricingTableFive({ 
  plans, 
  title = "Pricing Plans", 
  description = "Choose the plan that's right for you",
  onPlanSelect,
  className,
  size = "medium",
  theme = "minimal"
}: PricingTableFiveProps) {
  const [isAnnually, setIsAnnually] = useState(false)
  const uniqueId = useId()

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
    <section className={cn(sectionVariants({ size, theme }), className)}>
      {/* Classic theme background elements */}
      {theme === "classic" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
        </>
      )}

      <div className="container max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={cn(titleVariants({ size, theme }))}>{title}</h2>
          <p className={cn(descriptionVariants({ size }))}>{description}</p>

          {/* Billing Toggle */}
          <div className={cn("flex justify-center mt-8 mx-auto", toggleVariants({ theme }))}>
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
                  Annually
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

        {/* Plans Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Regular Plans */}
          <div className="flex flex-col gap-4 lg:w-2/3">
            {regularPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={cn(planCardVariants({ size, theme, highlight: plan.highlight }))}>
                  {plan.badge && (
                    <Badge className={cn(
                      "absolute -top-3 left-1/2 transform -translate-x-1/2 z-10",
                      theme === "classic" 
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-lg"
                        : "bg-primary text-primary-foreground"
                    )}>
                      {plan.badge}
                    </Badge>
                  )}
                  
                  {theme === "classic" && plan.highlight && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}

                  <CardContent className="p-0 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Plan Info and Price */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <Badge 
                        variant="outline" 
                        className="w-fit text-xs font-medium uppercase"
                      >
                        {plan.title}
                      </Badge>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isAnnually ? "year" : "month"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-baseline gap-1"
                        >
                          <span className={cn(priceTextVariants({ size, theme }))}>
                            {parseFloat(isAnnually ? plan.yearlyPrice : plan.monthlyPrice) >= 0 && (
                              <>{plan.currency}</>
                            )}
                            {isAnnually ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            /{isAnnually ? "year" : "month"}
                          </span>
                        </motion.div>
                      </AnimatePresence>

                      <Button 
                        onClick={() => onPlanSelect?.(plan.id)} 
                        className={cn(
                          "w-full md:w-auto",
                          plan.highlight && theme === "minimal" && "shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-6 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
                        )}
                        variant={plan.highlight ? "default" : "secondary"}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="flex-1 grid gap-3 md:grid-cols-2">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex} 
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                        >
                          <Check className={cn(featureIconVariants({ size, theme }), "mt-0.5")} />
                          <span className={cn(
                            "text-sm",
                            theme === "classic" ? "text-foreground/90" : "text-muted-foreground"
                          )}>
                            {feature.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Card */}
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: regularPlans.length * 0.1 }}
          >
            <Card className={cn(contactCardVariants({ size, theme }), "rounded-lg")}>
              <CardContent className="p-0 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <h3 className={cn(
                    "text-2xl font-bold mb-2",
                    theme === "classic" && "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                  )}>
                    {contactUsPlan.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {contactUsPlan.description}
                  </p>
                </div>

                <Button 
                  onClick={() => onPlanSelect?.(contactUsPlan.id)} 
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {contactUsPlan.buttonText}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Custom pricing and solutions available
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

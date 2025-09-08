"use client";

import { Check, Zap } from "lucide-react";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";

const sectionVariants = cva("py-32", {
  variants: {
    size: {
      small: "py-6 md:py-12",
      medium: "py-10 md:py-20",
      large: "py-16 md:py-32",
    },
    theme: {
      minimal: "",
      classic: "bg-gradient-to-b from-background to-muted/20 relative overflow-hidden",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

const titleVariants = cva("text-pretty text-left font-bold", {
  variants: {
    size: {
      small: "text-3xl lg:text-4xl",
      medium: "text-4xl lg:text-5xl",
      large: "text-4xl lg:text-6xl",
    },
    theme: {
      minimal: "",
      classic: "text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent p-1",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const descriptionVariants = cva("text-muted-foreground max-w-3xl", {
  variants: {
    size: {
      small: "text-base lg:text-lg",
      medium: "text-lg lg:text-xl",
      large: "lg:text-xl",
    },
    theme: {
      minimal: "text-left",
      classic: "text-center mx-auto",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const cardVariants = cva(
  "flex w-full flex-col rounded-lg border text-left h-full transition-all duration-300",
  {
    variants: {
      size: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
      },
      theme: {
        minimal: "",
        classic: "hover:shadow-xl backdrop-blur-sm bg-card/50 border-border/50",
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
        className: "ring-2 ring-primary/20 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

const priceTextVariants = cva("font-medium", {
  variants: {
    size: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-4xl",
    },
    theme: {
      minimal: "",
      classic: "text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const featureIconVariants = cva("flex-none h-[1lh]", {
  variants: {
    size: {
      small: "size-3",
      medium: "size-4",
      large: "size-4",
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

const highlightBadgeVariants = cva("mb-8 block w-fit", {
  variants: {
    theme: {
      minimal: "",
      classic: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

const toggleVariants = cva("flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg", {
  variants: {
    theme: {
      minimal: "bg-muted",
      classic: "bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

const buttonVariants = cva(
  "gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300",
  {
    variants: {
      theme: {
        minimal: "shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer",
        classic: "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:shadow-xl active:scale-95 border border-primary/20",
      },
    },
    defaultVariants: {
      theme: "minimal",
    },
  }
);

export interface PricingTableOneProps extends VariantProps<typeof sectionVariants> {
  className?: string;
  plans: Plan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string) => void;
}

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
                        className="flex gap-3"
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
"use client";

import { Check, Package, Award, Building2 } from "lucide-react";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

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

const descriptionVariants = cva("text-muted-foreground max-w-3xl mx-auto mb-2", {
  variants: {
    size: {
      small: "text-base lg:text-lg",
      medium: "text-lg lg:text-xl",
      large: "lg:text-xl",
    },
    theme: {
      minimal: "",
      classic: "",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

const cardVariants = cva(
  "relative h-full transition-all duration-300 rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      size: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
      },
      theme: {
        minimal: "hover:bg-muted/30",
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
        className: "ring-2 ring-primary/20 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden shadow-xl",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted/50 border-primary/20",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

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

const priceTextVariants = cva("font-medium", {
  variants: {
    size: {
      small: "text-2xl",
      medium: "text-3xl",
      large: "text-4xl",
    },
    theme: {
      minimal: "",
      classic: "font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const buttonVariants = cva(
  "w-full transition-all duration-300 hover:cursor-pointer",
  {
    variants: {
      theme: {
        minimal: "shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay",
        classic: "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:shadow-xl active:scale-95 border border-primary/20",
      },
    },
    defaultVariants: {
      theme: "minimal",
    },
  }
);

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

export interface PricingTableFourProps extends VariantProps<typeof sectionVariants> {
  plans: Plan[];
  title?: string;
  description?: string;
  subtitle?: string;
  onPlanSelect?: (planId: string) => void;
  className?: string;
  showBillingToggle?: boolean;
  billingToggleLabels?: {
    monthly: string;
    yearly: string;
  };
}

const defaultIcons = {
  starter: <Package className="w-4 h-4" />,
  pro: <Award className="w-4 h-4" />,
  enterprise: <Building2 className="w-4 h-4" />,
};

export function PricingTableFour({
  plans,
  title = "Choose Your Perfect Plan",
  description = "Transform your project with our comprehensive pricing options designed for every need.",
  subtitle,
  onPlanSelect,
  className,
  size = "medium",
  theme = "minimal",
  showBillingToggle = true,
  billingToggleLabels = {
    monthly: "Monthly",
    yearly: "Yearly",
  },
}: PricingTableFourProps) {
  const [isAnnually, setIsAnnually] = useState(false);
  const uniqueId = useId();

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

  const handlePlanSelect = (planId: string) => {
    onPlanSelect?.(planId);
  };

  const getPlanIcon = (planId: string) => {
    return defaultIcons[planId as keyof typeof defaultIcons] || <Package className="w-5 h-5" />;
  };

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
          {subtitle && (
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">{subtitle}</p>
          )}
          <h2 className={cn(titleVariants({ size, theme }))}>{title}</h2>
          <p className={cn(descriptionVariants({ size, theme }))}>{description}</p>

          {showBillingToggle && (
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
                    {billingToggleLabels.monthly}
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
                    {billingToggleLabels.yearly}
                    {yearlyPriceDiscount > 0 && (
                      <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary border border-primary/20 font-medium">
                        Save {yearlyPriceDiscount}%
                      </span>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <div className={cn(
          "grid gap-6",
          plans.length === 1 && "grid-cols-1 max-w-md mx-auto",
          plans.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto",
          plans.length === 3 && "grid-cols-1 md:grid-cols-3",
          plans.length >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="relative group h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <Badge className={cn(
                  "absolute -top-3 left-1/2 transform -translate-x-1/2 z-20",
                  theme === "classic" 
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-lg"
                    : "bg-primary text-primary-foreground"
                )}>
                  {plan.badge}
                </Badge>
              )}

              {/* Classic theme highlight effect */}
              {theme === "classic" && plan.highlight && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}

              <div className={cn(cardVariants({ size, theme, highlight: plan.highlight }))}>
                <div className="flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-xl font-bold mb-1",
                        theme === "classic" ? "text-lg" : ""
                      )}>{plan.title}</h3>
                      <p className={cn(
                        "text-sm text-muted-foreground",
                        theme === "classic" && "text-foreground/80"
                      )}>{plan.description}</p>
                    </div>
                    <div className={cn(
                      "w-10 h-10 flex items-center rounded-lg justify-center flex-shrink-0",
                      theme === "classic" 
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-foreground border border-border"
                    )}>
                      {getPlanIcon(plan.id)}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isAnnually ? "year" : "month"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isAnnually ? (
                          <div className="flex items-baseline gap-1">
                            <span className={cn(priceTextVariants({ size, theme }))}>
                              {parseFloat(plan.yearlyPrice) >= 0 && plan.yearlyPrice.toLowerCase() !== 'custom' && (
                                <>{plan.currency}</>
                              )}
                              {plan.yearlyPrice}
                            </span>
                            <span className="text-muted-foreground text-sm">/year</span>
                            {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice) > 0 && (
                              <span className={cn(
                                "text-xs ml-2",
                                theme === "classic" ? "text-emerald-500 font-semibold" : "text-primary font-medium"
                              )}>
                                {calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)}% off
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className={cn(priceTextVariants({ size, theme }))}>
                              {parseFloat(plan.monthlyPrice) >= 0 && plan.monthlyPrice.toLowerCase() !== 'custom' && (
                                <>{plan.currency}</>
                              )}
                              {plan.monthlyPrice}
                            </span>
                            <span className="text-muted-foreground text-sm">/month</span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-6">
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={cn(
                        buttonVariants({ theme }),
                        !plan.highlight && theme === "minimal" && "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      )}
                      variant={plan.highlight ? "default" : "secondary"}
                    >
                      {plan.buttonText}
                      {theme === "classic" && plan.highlight && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                      )}
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex gap-3 items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                        >
                          <Check className={cn(featureIconVariants({ size, theme }))} />
                          <span className={cn(
                            "text-sm",
                            theme === "classic" ? "text-foreground/90" : "text-muted-foreground"
                          )}>
                            {feature.name}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
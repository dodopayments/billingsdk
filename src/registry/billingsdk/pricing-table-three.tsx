"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Plan } from "@/lib/billingsdk-config";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";

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
});

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
  },
);

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
});

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
});

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
});

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
});

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
});

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
  },
);

const footerTextVariants = cva(
  "text-lg font-medium text-card-foreground text-left w-full my-auto",
  {
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
  },
);

export interface PricingTableProps
  extends VariantProps<typeof sectionVariants> {
  className?: string;
  plans: Plan[];
  onPlanSelect?: (planId: string) => void;
  showFooter?: boolean;
  footerText?: string;
  footerButtonText?: string;
  onFooterButtonClick?: () => void;
}

export function PricingTableThree({
  className,
  plans,
  onPlanSelect,
  showFooter,
  footerText,
  footerButtonText,
  onFooterButtonClick,
  variant,
}: PricingTableProps) {
  const [isAnnually, setIsAnnually] = useState(false);

  function calculateDiscount(
    monthlyPrice: string,
    yearlyPrice: string,
  ): number {
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
          calculateDiscount(plan.monthlyPrice, plan.yearlyPrice),
        ),
      )
    : 0;

  return (
    <div className={cn(sectionVariants({ variant }), className)}>
      {/* Header Section with Toggle */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row md:items-start md:gap-10">
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
                  labelPaddingVariants({ variant }),
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
                  labelPaddingVariants({ variant }),
                )}
              >
                Yearly
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-center">
          {yearlyPriceDiscount > 0 && (
            <span className="text-muted-foreground mt-2 text-xs">
              Save upto {yearlyPriceDiscount}% with yearly plan
            </span>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4 md:gap-0",
          plans.length === 1 && "mx-auto max-w-md grid-cols-1",
          plans.length === 2 && "mx-auto max-w-4xl grid-cols-1 md:grid-cols-2",
          plans.length === 3 && "grid-cols-1 md:grid-cols-3",
          plans.length === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
          plans.length >= 5 &&
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "text-card-foreground relative flex flex-col rounded-xl border shadow-sm transition-all duration-200 md:rounded-none md:border-none md:shadow-none",
              plan.highlight === true
                ? "bg-muted/30 border-border z-10 shadow-lg md:-mt-8 md:rounded-md md:border-t"
                : "bg-card",
            )}
          >
            {plan.badge && (
              <Badge className="bg-secondary text-secondary-foreground absolute -top-3 left-1/2 -translate-x-1/2 transform px-3 py-1 text-xs">
                {plan.badge}
              </Badge>
            )}
            <CardHeader className="pb-4">
              <div className="space-y-2">
                <h3
                  className={cn(
                    cardTitleVariants({ variant }),
                    "text-left font-semibold",
                  )}
                >
                  {plan.title}
                </h3>
                <p
                  className={cn(
                    cardDescriptionVariants({ variant }),
                    "text-muted-foreground w-full text-left",
                  )}
                >
                  {plan.description}
                </p>
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
                      <span
                        className={cn(
                          priceTextVariants({ variant }),
                          "text-left",
                        )}
                      >
                        {parseFloat(plan.yearlyPrice) >= 0 && (
                          <>{plan.currency}</>
                        )}
                        {plan.yearlyPrice}
                        {calculateDiscount(
                          plan.monthlyPrice,
                          plan.yearlyPrice,
                        ) > 0 && (
                          <span className="ml-2 text-xs underline">
                            {calculateDiscount(
                              plan.monthlyPrice,
                              plan.yearlyPrice,
                            )}
                            % off
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
                      <span
                        className={cn(
                          priceTextVariants({ variant }),
                          "text-left",
                        )}
                      >
                        {parseFloat(plan.monthlyPrice) >= 0 && (
                          <>{plan.currency}</>
                        )}
                        {plan.monthlyPrice}
                      </span>
                      <p className="text-muted-foreground">Per month</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-6">
              <div className="flex-1 space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.icon === "check" ? (
                      <div className="bg-primary h-2 w-2 rounded-sm"></div>
                    ) : (
                      <div
                        className={cn(
                          featureIconVariants({ variant }),
                          feature.iconColor || "text-muted-foreground",
                        )}
                      >
                        <Check
                          className={cn(featureIconVariants({ variant }))}
                        />
                      </div>
                    )}
                    <span className="text-sm">{feature.name}</span>
                    <span className="text-muted-foreground ml-auto text-sm">
                      Included
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "mt-auto w-full hover:cursor-pointer",
                  plan.highlight === true
                    ? "focus-visible:ring-ring hover:bg-primary/90 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex h-9 w-full items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-left text-sm font-medium whitespace-nowrap shadow ring-1 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
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
        <div
          className={cn(
            footerWrapperVariants({ variant }),
            plans.length === 1 && "mx-auto max-w-md",
            plans.length === 2 && "mx-auto max-w-4xl",
          )}
        >
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <p className={cn(footerTextVariants({ variant }))}>
              {footerText ||
                "Pre-negotiated discounts are available to early-stage startups and nonprofits."}
            </p>
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
  );
}

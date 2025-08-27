"use client";

import { Check, Minus, Zap } from "lucide-react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";

import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const sectionVariants = cva("py-32", {
  variants: {
    size: {
      small: "py-12",
      medium: "py-20",
      large: "py-32",
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

const titleVariants = cva("mb-2 font-semibold", {
  variants: {
    size: {
      small: "text-2xl lg:text-3xl",
      medium: "text-3xl lg:text-4xl",
      large: "text-3xl lg:text-5xl",
    },
    theme: {
      minimal: "",
      classic: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent font-bold",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const descriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      small: "text-sm lg:text-base",
      medium: "text-base lg:text-lg",
      large: "lg:text-lg",
    },
    theme: {
      minimal: "",
      classic: "text-center max-w-2xl mx-auto",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const toggleWrapperVariants = cva("flex justify-center items-center gap-3", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-7",
      large: "mt-8",
    },
    theme: {
      minimal: "",
      classic: "mt-10",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const toggleLabelVariants = cva("font-medium text-sm transition-all", {
  variants: {
    size: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-sm",
    },
    theme: {
      minimal: "",
      classic: "font-semibold",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

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

const plansWrapperVariants = cva("flex", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
    theme: {
      minimal: "",
      classic: "mt-12",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const cardVariants = cva(
  "bg-card text-card-foreground border shadow-sm flex w-full flex-col justify-between text-center rounded-xl md:rounded-none transition-all duration-300",
  {
    variants: {
      size: {
        small: "py-4 gap-6",
        medium: "py-5 gap-7",
        large: "py-6 gap-8",
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
        className: "bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden shadow-2xl",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted/30 shadow-lg",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

const priceTextVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-5xl",
    },
    theme: {
      minimal: "",
      classic: "text-6xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const priceSubTextVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      small: "mt-2",
      medium: "mt-3",
      large: "mt-3",
    },
    theme: {
      minimal: "",
      classic: "font-medium",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const tableWrapperVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
    theme: {
      minimal: "",
      classic: "mt-16 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const featureIconVariants = cva("mx-auto", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
      large: "size-5",
    },
    theme: {
      minimal: "",
      classic: "text-emerald-500",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const firstColWidthVariants = cva("", {
  variants: {
    size: {
      small: "w-[140px]",
      medium: "w-[180px]",
      large: "w-[200px]",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

const buttonVariants = cva("w-full hover:cursor-pointer transition-all duration-300", {
  variants: {
    theme: {
      minimal: "",
      classic: "hover:shadow-xl active:scale-95",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

export interface PricingTableTwoProps extends VariantProps<typeof sectionVariants> {
  className?: string;
  plans: Plan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string) => void;
}

export function PricingTableTwo({
  className,
  plans,
  title,
  description,
  onPlanSelect,
  size,
  theme = "minimal"
}: PricingTableTwoProps) {
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
    <section className={cn(sectionVariants({ size, theme }), className)}>
      {/* Classic theme background elements */}
      {theme === "classic" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
        </>
      )}

      <div className="container max-w-5xl relative">
        <motion.div
          className={cn(
            "flex flex-col items-center gap-4",
            theme === "classic" ? "text-center" : ""
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={cn(titleVariants({ size, theme }))}>
            {title || "We offer 3 plans"}
          </h2>

          <p className={cn(descriptionVariants({ size, theme }))}>
            {description || "Lorem ipsum dolor sit amet consectetur adipisicing."}
          </p>
        </motion.div>

        {/* Monthly/Yearly Toggle */}
        <div className={cn(toggleWrapperVariants({ size, theme }))}>
          <span className={cn(
            toggleLabelVariants({ size, theme }),
            !isAnnually ? "text-foreground" : "text-muted-foreground"
          )}>
            Monthly
          </span>
          <Switch
            checked={isAnnually}
            onCheckedChange={setIsAnnually}
            className={cn(switchScaleVariants({ size, theme }))}
          />
          <span className={cn(
            toggleLabelVariants({ size, theme }),
            isAnnually ? "text-foreground" : "text-muted-foreground"
          )}>
            Yearly
          </span>
        </div>

        <div className="flex justify-center">
          {yearlyPriceDiscount > 0 && (
            <motion.span
              className={cn(
                "text-xs mt-2 text-muted-foreground",
                theme === "classic" && "text-emerald-500 font-medium"
              )}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Save upto {yearlyPriceDiscount}% with yearly plan
            </motion.span>
          )}
        </div>

        <div className={cn(
          plansWrapperVariants({ size, theme }),
          "gap-4 md:gap-0",
          plans.length === 1 && "flex-col max-w-md mx-auto",
          plans.length === 2 && "flex-col md:flex-row max-w-4xl mx-auto",
          plans.length >= 3 && "flex-col lg:flex-row max-w-7xl mx-auto"
        )}>
          {plans.map((plan: Plan, index: number) => (
            <motion.div
              key={plan.id}
              className={cn(
                cardVariants({
                  size,
                  theme,
                  highlight: plan.highlight
                }),
                index === 0 && "md:rounded-l-xl md:border-r-0",
                index === plans.length - 1 && "md:rounded-r-xl md:border-l-0",
                index > 0 && index < plans.length - 1 && "md:border-l-0 md:border-r-0",
                plans.length === 1 && "rounded-xl"
              )}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
            >
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
                <div className="flex items-center gap-2 justify-center">
                  <div className={cn(
                    "leading-none font-semibold",
                    theme === "classic" && "text-lg font-bold"
                  )}>
                    {plan.title}
                  </div>
                </div>
                <p className={cn(
                  "text-muted-foreground text-center",
                  theme === "classic" && "text-foreground/80"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className="px-6">
                <AnimatePresence mode="wait">
                  {isAnnually ? (
                    <motion.div
                      key="yearly"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={cn(priceTextVariants({ size, theme }))}>
                        {parseFloat(plan.yearlyPrice) >= 0 && (
                          <>{plan.currency}</>
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
                      <p className={cn(priceSubTextVariants({ size, theme }))}>per year</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="monthly"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={cn(priceTextVariants({ size, theme }))}>
                        {parseFloat(plan.monthlyPrice) >= 0 && (
                          <>{plan.currency}</>
                        )}
                        {plan.monthlyPrice}
                      </span>
                      <p className={cn(priceSubTextVariants({ size, theme }))}>per month</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center px-6">
                <Button
                  className={cn(
                    buttonVariants({ theme }),
                    plan.highlight && theme === "minimal" && "gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay",
                    plan.highlight && theme === "classic" && "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-lg border border-primary/20"
                  )}
                  variant={plan.highlight ? "default" : "secondary"}
                  onClick={() => onPlanSelect?.(plan.id)}
                >
                  {theme === "classic" && plan.highlight && (
                    <Zap className="w-4 h-4 mr-1" />
                  )}
                  {plan.buttonText}
                  {theme === "classic" && plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={cn(tableWrapperVariants({ size, theme }))}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Table className={cn(theme === "classic" && "bg-transparent")}>
            <TableHeader>
              <TableRow className={cn(theme === "classic" && "border-border/30")}>
                <TableHead className={firstColWidthVariants({ size })}></TableHead>
                {plans.map((plan: Plan) => (
                  <TableHead key={plan.id} className={cn(
                    "text-center font-bold text-primary",
                    theme === "classic" && "text-lg"
                  )}>
                    {plan.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const allFeatures = new Set<string>();
                plans.forEach(plan => {
                  plan.features.forEach(feature => {
                    allFeatures.add(feature.name);
                  });
                });
                return Array.from(allFeatures).map((featureName, featureIndex) => (
                  <TableRow key={featureIndex} className={cn(
                    theme === "classic" && "border-border/20 hover:bg-muted/30"
                  )}>
                    <TableCell className={cn(
                      "font-medium text-left",
                      theme === "classic" && "font-semibold text-foreground/90"
                    )}>
                      {featureName}
                    </TableCell>
                    {plans.map((plan: Plan) => {
                      const feature = plan.features.find(f => f.name === featureName);
                      return (
                        <TableCell key={plan.id} className="text-center">
                          {feature ? (
                            feature.icon === "check" ? (
                              <Check className={cn(featureIconVariants({ size, theme }))} />
                            ) : feature.icon === "minus" ? (
                              <Minus className={cn(featureIconVariants({ size, theme }))} />
                            ) : (
                              <span className={cn(
                                "text-sm text-muted-foreground",
                                theme === "classic" && "font-medium text-foreground/70"
                              )}>
                                {feature.name}
                              </span>
                            )
                          ) : (
                            <Minus className={cn(featureIconVariants({ size, theme }))} />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </section>
  );
}
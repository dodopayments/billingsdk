"use client";

import { ChevronRight, Package, Award, Building2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";

// Animated Price Container
function AnimatedPriceContainer({ 
  price, 
  period, 
  isHighlight
}: { 
  price: string; 
  period: string; 
  isHighlight?: boolean;
}) {
  return (
    <motion.div
      className="flex items-end justify-end min-h-[3rem]"
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{
          scale: isHighlight ? 1.1 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.span 
            className={cn(
              "text-3xl font-bold text-foreground relative inline-block",
              isHighlight && "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            )}
            key={`${price}-${period}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {price}
          </motion.span>
        </AnimatePresence>
        
        {/* Highlight glow effect */}
        {isHighlight && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.span 
          className="text-muted-foreground ml-2 flex items-center"
          key={`period-${price}-${period}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="mx-1">/</span>
          <span >{period}</span>
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

const sectionVariants = cva("px-4 py-20 relative overflow-hidden bg-background", {
  variants: {
    size: {
      small: "py-10",
      medium: "py-20",
      large: "py-32",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const titleVariants = cva("font-bold mb-6 text-foreground", {
  variants: {
    size: {
      small: "text-3xl lg:text-4xl",
      medium: "text-4xl lg:text-5xl",
      large: "text-5xl lg:text-6xl",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const descriptionVariants = cva("text-muted-foreground max-w-3xl mx-auto leading-tight mb-8", {
  variants: {
    size: {
      small: "text-base sm:text-lg",
      medium: "text-lg sm:text-xl",
      large: "text-xl sm:text-2xl",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const cardVariants = cva(
  "relative h-full transition-all rounded-lg duration-300 border bg-card border-border hover:bg-muted/50",
  {
    variants: {
      highlight: {
        true: "bg-primary/5 border-primary/20",
        false: "",
      },
    },
    defaultVariants: {
      highlight: false,
    },
  }
);

const toggleVariants = cva(
  "inline-flex items-center p-2 rounded-lg border bg-muted border-border"
);

const buttonVariants = cva(
  "w-full py-3 px-4 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg hover:cursor-pointer",
  {
    variants: {
      highlight: {
        true: "bg-primary text-primary-foreground hover:bg-primary/90",
        false: "bg-muted/5 text-muted-foreground hover:bg-muted/80 border border-border",
      },
    },
    defaultVariants: {
      highlight: false,
    },
  }
);

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
  starter: <Package className="w-5 h-5" />,
  pro: <Award className="w-5 h-5" />,
  enterprise: <Building2 className="w-5 h-5" />,
};

export function PricingTableFour({
  plans,
  title = "Choose Your Perfect Plan",
  description = "Transform your project with our comprehensive pricing options designed for every need.",
  subtitle = "Simple Pricing",
  onPlanSelect,
  className,
  size = "medium",
  showBillingToggle = true,
  billingToggleLabels = {
    monthly: "Monthly",
    yearly: "Yearly",
  },
}: PricingTableFourProps) {
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanSelect = (planId: string) => {
    onPlanSelect?.(planId);
  };

  const getPlanIcon = (planId: string) => {
    return defaultIcons[planId as keyof typeof defaultIcons] || <Package className="w-5 h-5" />;
  };

  const getPlanPrice = (plan: Plan) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    // Don't add currency symbol for "Custom" pricing
    if (price.toLowerCase() === 'custom') {
      return price;
    }
    return `${plan.currency || '$'}${price}`;
  };

  const getPlanPeriod = (plan: Plan) => {
    if (plan.monthlyPrice === '0' || plan.yearlyPrice === '0') {
      return 'Free';
    }
    return isYearly ? 'year' : 'month';
  };

  return (
    <section className={cn(sectionVariants({ size }), className)}>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-muted-foreground italic text-lg mb-4">{subtitle}</p>
          )}
          <h2 className={cn(titleVariants({ size }))}>{title}</h2>
          <p className={cn(descriptionVariants({ size }))}>{description}</p>

          {showBillingToggle && (
            <div className={cn(toggleVariants())}>
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
                  !isYearly ? "bg-primary text-primary-foreground shadow-lg hover:cursor-pointer" : "hover:cursor-pointer text-muted-foreground hover:text-foreground"
                }`}
              >
                {billingToggleLabels.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
                  isYearly ? "bg-primary text-primary-foreground shadow-lg hover:cursor-pointer" : "hover:cursor-pointer text-muted-foreground hover:text-foreground"
                }`}
              >
                {billingToggleLabels.yearly}
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="relative group h-full"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}

            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={cn(cardVariants({ highlight: plan.highlight }))}>
                <div className="p-4 flex flex-col h-full min-h-[500px]">
                  <div className="space-y-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 flex items-center rounded-lg justify-center text-foreground bg-muted border border-border">
                        {getPlanIcon(plan.id)}
                      </div>
                      <div className="text-right">
                        <AnimatedPriceContainer
                          price={getPlanPrice(plan)}
                          period={getPlanPeriod(plan)}
                          isHighlight={plan.highlight}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-foreground">{plan.title}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="rounded-lg p-4 bg-muted/50 border border-border/50 mt-4 flex flex-col flex-grow">
                    <div className="mb-4 flex-shrink-0">
                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        className={cn(buttonVariants({ highlight: plan.highlight }))}
                      >
                        {plan.buttonText}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Features */}
                    <div className="flex-grow">
                      <h4 className="text-foreground font-semibold mb-4">Features:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-muted-foreground">
                            <div className="w-5 h-5 flex rounded items-center justify-center mr-3 flex-shrink-0 bg-primary/10 border border-primary/20">
                              <ChevronRight className="w-3 h-3 text-primary rotate-90" />
                            </div>
                            <span className="text-sm">{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
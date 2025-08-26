"use client";

import { Check, Minus, Zap } from "lucide-react";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

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

import {
  sectionVariants,
  titleVariants,
  descriptionVariants,
  toggleWrapperVariants,
  toggleLabelVariants,
  switchScaleVariants,
  plansWrapperVariants,
  cardVariants,
  priceTextVariants,
  priceSubTextVariants,
  tableWrapperVariants,
  featureIconVariants,
  firstColWidthVariants,
  buttonVariants,
  type PricingTableTwoProps,
  calculateDiscount
} from "./pricing-table-two-utils";

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
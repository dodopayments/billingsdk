"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calendar, CreditCard, Calculator, Clock } from "lucide-react";
import { type Plan, type CurrentPlan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const prorationPreviewVariants = cva("w-full max-w-4xl mx-auto", {
  variants: {
    theme: {
      minimal: "",
      classic: "relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm",
    },
    size: {
      small: "text-sm",
      medium: "text-base", 
      large: "text-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
    size: "medium",
  },
});

const cardVariants = cva("transition-all duration-300", {
  variants: {
    theme: {
      minimal: "border border-border bg-card",
      classic: "border border-border/30 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm shadow-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

export interface ProrationPreviewProps extends VariantProps<typeof prorationPreviewVariants> {
  className?: string;
  currentPlan: CurrentPlan;
  newPlan: Plan;
  billingCycle: 'monthly' | 'yearly';
  daysRemaining?: number;
  effectiveDate?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ProrationPreview({
  className,
  currentPlan,
  newPlan,
  billingCycle,
  daysRemaining = 15,
  effectiveDate = "immediately",
  onConfirm,
  onCancel,
  confirmText = "Confirm Change",
  cancelText = "Cancel",
  theme = "minimal",
  size = "medium",
}: ProrationPreviewProps) {
  
  // Prices & proration (robust) - Fixed CodeRabbit issues
  const currentCycleDays = currentPlan.type === 'yearly' ? 365 : 30;
  const newCycleDays = billingCycle === 'yearly' ? 365 : 30;
  const isNumericValue = (v?: string) => {
    if (v == null) return false;
    const s = String(v).replace(/[^\d.\-]/g, "");
    const n = Number.parseFloat(s);
    return Number.isFinite(n);
  };
  const toNumber = (v?: string) => {
    if (v == null) return undefined;
    const s = String(v).replace(/[^\d.\-]/g, "");
    const n = Number.parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  };
  const currentRaw =
    currentPlan.type === 'monthly' ? currentPlan.plan.monthlyPrice :
    currentPlan.type === 'yearly' ? currentPlan.plan.yearlyPrice :
    currentPlan.price;
  const newRaw = billingCycle === 'monthly' ? newPlan.monthlyPrice : newPlan.yearlyPrice;
  const currentPrice = toNumber(currentRaw);
  const newPrice = toNumber(newRaw);
  const isCustomCurrent = !isNumericValue(currentRaw);
  const isCustomNew = !isNumericValue(newRaw);
  const chargeCurrency = newPlan.currency ?? currentPlan.plan.currency ?? "$";
  const creditCurrency = currentPlan.plan.currency ?? newPlan.currency ?? "$";
  const clampedUnusedDays = Math.max(0, Math.min(daysRemaining, currentCycleDays));
  const isNextCycle = typeof effectiveDate === 'string' && effectiveDate.toLowerCase().includes('next');
  
  const prorationDays = isNextCycle ? 0 : clampedUnusedDays;
  const canCompute = !isNextCycle && !isCustomCurrent && !isCustomNew && currentPrice !== undefined && newPrice !== undefined;
  const creditAmount = canCompute ? (currentPrice! / currentCycleDays) * clampedUnusedDays : 0;
  const proratedCharge = canCompute ? (newPrice! / newCycleDays) * prorationDays : 0;
  const netAmount = proratedCharge - creditAmount;
  
  const normalizedCurrentMonthly = currentPlan.type === 'yearly' && currentPrice !== undefined ? currentPrice / 12 : (currentPrice ?? 0);
  const normalizedNewMonthly = billingCycle === 'yearly' && newPrice !== undefined ? newPrice / 12 : (newPrice ?? 0);
  const hasComparablePrices = !isCustomCurrent && !isCustomNew && currentPrice !== undefined && newPrice !== undefined;
  const isUpgrade = hasComparablePrices && normalizedNewMonthly > normalizedCurrentMonthly;
  const isDowngrade = hasComparablePrices && normalizedNewMonthly < normalizedCurrentMonthly;

  return (
    <div className={cn(prorationPreviewVariants({ theme, size }), className)}>
      {theme === "classic" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </>
      )}
      
      <Card className={cn(cardVariants({ theme }))}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            Plan Change Preview
          </CardTitle>
          <p className="text-muted-foreground">
            Review the charges and credits for your plan change
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* From/To Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "p-4 rounded-lg border",
                theme === "classic" 
                  ? "bg-gradient-to-br from-muted/50 to-background/50 border-border/50"
                  : "bg-muted/50 border-border"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Current</Badge>
                {isDowngrade && (
                  <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-700 border-orange-200">
                    Downgrading
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{currentPlan.plan.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isCustomCurrent ? 'Custom' : `${creditCurrency}${currentPrice}/${currentPlan.type}`}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {daysRemaining} days remaining
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={cn(
                  "p-2 rounded-full",
                  theme === "classic" 
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
                    : "bg-primary/10 text-primary"
                )}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>

            {/* New Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(
                "p-4 rounded-lg border",
                theme === "classic"
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
                  : "bg-primary/5 border-primary/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="text-xs">New Plan</Badge>
                {isUpgrade && (
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-200">
                    Upgrading
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{newPlan.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isCustomNew ? 'Custom' : `${chargeCurrency}${newPrice}/${billingCycle}`}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Effective {effectiveDate}
              </div>
            </motion.div>
          </div>

          <Separator className={cn(
            theme === "classic" && "bg-gradient-to-r from-transparent via-border to-transparent"
          )} />

          {/* Calculation Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={cn(
              "p-4 rounded-lg border",
              theme === "classic"
                ? "bg-gradient-to-br from-muted/30 to-background/30 border-border/50"
                : "bg-muted/30 border-border"
            )}
          >
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing Breakdown
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Credit for unused time</span>
                <span className="text-green-600 font-medium">
                  {canCompute ? `-${creditCurrency}${Math.abs(creditAmount).toFixed(2)}` : "—"}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Prorated charge ({prorationDays} days)
                </span>
                <span className="font-medium">
                  {canCompute ? `+${chargeCurrency}${proratedCharge.toFixed(2)}` : "—"}
                </span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center font-semibold">
                <span>{canCompute ? (netAmount >= 0 ? "Amount to charge" : "Credit to account") : "Amount due will be calculated at checkout"}</span>
                <span className={cn(
                  "text-lg",
                  canCompute ? (netAmount >= 0 ? "text-foreground" : "text-green-600") : "text-muted-foreground"
                )}>
                  {canCompute ? `${netAmount >= 0 ? "+" : ""}${chargeCurrency}${netAmount.toFixed(2)}` : "—"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="text-center p-3 bg-muted/20 rounded-lg border border-border/50"
          >
            <p className="text-sm text-muted-foreground">
              Your plan will change {effectiveDate}. 
              {isNextCycle ? ' No immediate charge.' : (hasComparablePrices
                ? (netAmount >= 0
                    ? ` You'll be charged ${chargeCurrency}${Math.abs(netAmount).toFixed(2)}.`
                    : ` You'll receive a ${chargeCurrency}${Math.abs(netAmount).toFixed(2)} credit.`)
                : ' Amount will be finalized at checkout.')}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <Button
              onClick={onConfirm}
              className={cn(
                "flex-1",
                theme === "classic" && "bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg active:scale-95 transition-all duration-200"
              )}
              size="lg"
            >
              {confirmText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              size="lg"
            >
              {cancelText}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
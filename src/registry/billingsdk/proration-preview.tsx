"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Calculator,
  Clock,
} from "lucide-react";
import { type Plan, type CurrentPlan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const prorationPreviewVariants = cva("w-full max-w-3xl mx-auto", {
  variants: {
    theme: {
      minimal: "",
      classic:
        "relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm",
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
      classic:
        "border border-border/30 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm shadow-md",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

/**
 * Props for `ProrationPreview`.
 *
 * Combines visual variants from `prorationPreviewVariants` with
 * the billing context needed to compute proration math.
 *
 * - `currentPlan` and `newPlan` supply pricing and labels
 * - `billingCycle` controls the target cycle for the new plan
 * - `daysRemaining` and `effectiveDate` influence credit/charge math
 * - `onConfirm`/`onCancel` wire user actions
 */
export interface ProrationPreviewProps
  extends VariantProps<typeof prorationPreviewVariants> {
  className?: string;
  currentPlan: CurrentPlan;
  newPlan: Plan;
  billingCycle: "monthly" | "yearly";
  daysRemaining?: number;
  effectiveDate?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

/**
 * ProrationPreview
 *
 * Renders a detailed, accessible preview of billing changes when a user switches
 * subscription plans. It calculates and displays credits for unused time,
 * prorated charges for the new plan, and the resulting net amount, with clear
 * visual hierarchy and responsive styles.
 *
 * Key UI sections:
 * - From/To plan summary with upgrade/downgrade badges
 * - Billing breakdown (credit, prorated charge, net amount)
 * - Timeline note describing when changes take effect
 * - Primary/secondary actions to confirm or cancel
 *
 * Props accept both monthly and yearly cycles and support custom pricing
 * scenarios (e.g., enterprise). Visual appearance can be adjusted via
 * `theme` and `size` variants.
 *
 * @param props.className Optional container className override.
 * @param props.currentPlan Current subscription context including plan and cycle.
 * @param props.newPlan Target plan the user is moving to.
 * @param props.billingCycle Billing cycle for the new plan (monthly/yearly).
 * @param props.daysRemaining Remaining days in the current cycle (defaults to 15).
 * @param props.effectiveDate When the change takes effect (e.g., "immediately" or "next billing cycle").
 * @param props.onConfirm Callback invoked when user confirms the change.
 * @param props.onCancel Callback invoked when user cancels the change.
 * @param props.confirmText Custom label for the confirm action.
 * @param props.cancelText Custom label for the cancel action.
 * @param props.theme Visual theme variant (minimal | classic). Defaults to minimal.
 * @param props.size Component size (small | medium | large). Defaults to medium.
 */
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
  const currentCycleDays = currentPlan.type === "yearly" ? 365 : 30;
  const newCycleDays = billingCycle === "yearly" ? 365 : 30;
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
    currentPlan.type === "monthly"
      ? currentPlan.plan.monthlyPrice
      : currentPlan.type === "yearly"
        ? currentPlan.plan.yearlyPrice
        : currentPlan.price;
  const newRaw =
    billingCycle === "monthly" ? newPlan.monthlyPrice : newPlan.yearlyPrice;
  const currentPrice = toNumber(currentRaw);
  const newPrice = toNumber(newRaw);
  const isCustomCurrent = !isNumericValue(currentRaw);
  const isCustomNew = !isNumericValue(newRaw);
  const chargeCurrency = newPlan.currency ?? currentPlan.plan.currency ?? "$";
  const creditCurrency = currentPlan.plan.currency ?? newPlan.currency ?? "$";
  const clampedUnusedDays = Math.max(
    0,
    Math.min(daysRemaining, currentCycleDays),
  );
  const isNextCycle =
    typeof effectiveDate === "string" &&
    effectiveDate.toLowerCase().includes("next");

  const prorationDays = isNextCycle ? 0 : clampedUnusedDays;
  const canCompute =
    !isNextCycle &&
    !isCustomCurrent &&
    !isCustomNew &&
    currentPrice !== undefined &&
    newPrice !== undefined;
  const creditAmount = canCompute
    ? (currentPrice! / currentCycleDays) * clampedUnusedDays
    : 0;
  const proratedCharge = canCompute
    ? (newPrice! / newCycleDays) * prorationDays
    : 0;
  const netAmount = proratedCharge - creditAmount;

  const normalizedCurrentMonthly =
    currentPlan.type === "yearly" && currentPrice !== undefined
      ? currentPrice / 12
      : (currentPrice ?? 0);
  const normalizedNewMonthly =
    billingCycle === "yearly" && newPrice !== undefined
      ? newPrice / 12
      : (newPrice ?? 0);
  const hasComparablePrices =
    !isCustomCurrent &&
    !isCustomNew &&
    currentPrice !== undefined &&
    newPrice !== undefined;
  const isUpgrade =
    hasComparablePrices && normalizedNewMonthly > normalizedCurrentMonthly;
  const isDowngrade =
    hasComparablePrices && normalizedNewMonthly < normalizedCurrentMonthly;

  return (
    <div className={cn(prorationPreviewVariants({ theme, size }), className)}>
      {theme === "classic" && (
        <>
          <div className="bg-grid-pattern absolute inset-0 opacity-5" />
          <div className="bg-primary/5 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        </>
      )}

      <Card className={cn(cardVariants({ theme }))}>
        <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <div className="bg-primary/10 ring-primary/20 rounded-lg p-2 ring-1">
              <Calculator className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            Plan Change Preview
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Review the charges and credits for your plan change
          </p>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:space-y-6 sm:px-6">
          {/* From/To Plans */}
          <div className="grid grid-cols-1 items-center gap-3 sm:gap-4 md:grid-cols-3">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "rounded-lg border p-3 sm:p-4",
                theme === "classic"
                  ? "from-muted/50 to-background/50 border-border/50 bg-gradient-to-br"
                  : "bg-muted/50 border-border",
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  Current
                </Badge>
                {isDowngrade && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    Downgrading
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-semibold sm:text-lg">
                {currentPlan.plan.title}
              </h3>
              <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
                {isCustomCurrent
                  ? "Custom"
                  : `${creditCurrency}${currentPrice}/${currentPlan.type}`}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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
                  "rounded-full p-2",
                  theme === "classic"
                    ? "from-primary to-primary/80 text-primary-foreground bg-gradient-to-r shadow-lg"
                    : "bg-primary/10 text-primary",
                )}
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </div>

            {/* New Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(
                "rounded-lg border p-3 sm:p-4",
                theme === "classic"
                  ? "from-primary/5 to-primary/10 border-primary/30 bg-gradient-to-br"
                  : "bg-primary/5 border-primary/30",
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="default" className="text-[10px] sm:text-xs">
                  New Plan
                </Badge>
                {isUpgrade && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    Upgrading
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-semibold sm:text-lg">
                {newPlan.title}
              </h3>
              <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
                {isCustomNew
                  ? "Custom"
                  : `${chargeCurrency}${newPrice}/${billingCycle}`}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Effective {effectiveDate}
              </div>
            </motion.div>
          </div>

          <Separator
            className={cn(
              theme === "classic" &&
                "via-border bg-gradient-to-r from-transparent to-transparent",
            )}
          />

          {/* Calculation Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={cn(
              "rounded-lg border p-3 sm:p-4",
              theme === "classic"
                ? "from-muted/30 to-background/30 border-border/50 bg-gradient-to-br"
                : "bg-muted/30 border-border",
            )}
          >
            <h4 className="mb-3 flex items-center gap-2 font-medium sm:mb-4">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              Billing Breakdown
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Credit for unused time
                </span>
                <span className="font-medium text-green-600">
                  {canCompute
                    ? `-${creditCurrency}${Math.abs(creditAmount).toFixed(2)}`
                    : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Prorated charge ({prorationDays} days)
                </span>
                <span className="font-medium">
                  {canCompute
                    ? `+${chargeCurrency}${proratedCharge.toFixed(2)}`
                    : "—"}
                </span>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between font-semibold">
                <span>
                  {canCompute
                    ? netAmount >= 0
                      ? "Amount to charge"
                      : "Credit to account"
                    : "Amount due will be calculated at checkout"}
                </span>
                <span
                  className={cn(
                    "text-base sm:text-lg",
                    canCompute
                      ? netAmount >= 0
                        ? "text-foreground"
                        : "text-green-600"
                      : "text-muted-foreground",
                  )}
                >
                  {canCompute
                    ? `${netAmount >= 0 ? "+" : ""}${chargeCurrency}${netAmount.toFixed(2)}`
                    : "—"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-muted/20 border-border/50 rounded-lg border p-3 text-center sm:p-4"
          >
            <p className="text-muted-foreground text-xs sm:text-sm">
              Your plan will change {effectiveDate}.
              {isNextCycle
                ? " No immediate charge."
                : hasComparablePrices
                  ? netAmount >= 0
                    ? ` You'll be charged ${chargeCurrency}${Math.abs(netAmount).toFixed(2)}.`
                    : ` You'll receive a ${chargeCurrency}${Math.abs(netAmount).toFixed(2)} credit.`
                  : " Amount will be finalized at checkout."}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="flex flex-col gap-3 pt-3 sm:flex-row sm:pt-4"
          >
            <Button
              onClick={onConfirm}
              className={cn(
                "flex-1",
                theme === "classic" &&
                  "from-primary to-primary/90 bg-gradient-to-r transition-all duration-200 hover:shadow-md active:scale-95",
              )}
              size="lg"
            >
              {confirmText}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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

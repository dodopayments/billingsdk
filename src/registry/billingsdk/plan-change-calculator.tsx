"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calendar, CreditCard, Calculator, Clock, Loader2, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Plan, Subscription, Coupon, Tax, ProrationQuote, BillingProvider } from "@/lib/billing-core/types";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";
import { mockProvider, mockPlans, MockBillingProvider } from "@/lib/providers/mock-adapter";

const planChangeCalculatorVariants = cva("w-full max-w-4xl mx-auto", {
  variants: {
    variant: {
      default: "space-y-6",
      compact: "space-y-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface PlanChangeCalculatorProps extends VariantProps<typeof planChangeCalculatorVariants> {
  className?: string;
  provider?: BillingProvider;
  subscription?: Subscription;
  currentPlan?: Plan;
  newPlan?: Plan;
  changeDate?: Date;
  coupon?: Coupon;
  tax?: Tax;
  onConfirm?: (quote: ProrationQuote) => void;
  onCancel?: () => void;
  showControls?: boolean;
  showDatePicker?: boolean;
}

export function PlanChangeCalculator({
  className,
  provider = mockProvider,
  subscription,
  currentPlan,
  newPlan,
  changeDate,
  coupon,
  tax,
  onConfirm,
  onCancel,
  showControls = true,
  showDatePicker = true,
  variant = "default",
}: PlanChangeCalculatorProps) {
  const [quote, setQuote] = useState<ProrationQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChangeDate, setSelectedChangeDate] = useState<Date>(changeDate || new Date());
  const [showDateInput, setShowDateInput] = useState(false);

  // Use memoized defaults to prevent infinite re-renders
  const defaultSubscription = useMemo(() => 
    subscription || MockBillingProvider.createMockSubscription('starter'), 
    [subscription]
  );
  const defaultCurrentPlan = useMemo(() => 
    currentPlan || mockPlans[0], 
    [currentPlan]
  );
  const defaultNewPlan = useMemo(() => 
    newPlan || mockPlans[1], 
    [newPlan]
  );

  useEffect(() => {
    async function computeQuote() {
      if (!defaultCurrentPlan || !defaultNewPlan) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await provider.computeProrationQuote(
          defaultSubscription,
          defaultCurrentPlan,
          defaultNewPlan,
          selectedChangeDate,
          coupon,
          tax
        );
        setQuote(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to compute quote');
      } finally {
        setLoading(false);
      }
    }

    computeQuote();
  }, [provider, defaultSubscription, defaultCurrentPlan, defaultNewPlan, selectedChangeDate, coupon, tax]);

  const planDifference = defaultCurrentPlan && defaultNewPlan 
    ? ProrationEngine.calculatePlanDifference(defaultCurrentPlan, defaultNewPlan)
    : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString);
    if (!isNaN(newDate.getTime())) {
      setSelectedChangeDate(newDate);
      setShowDateInput(false);
    }
  };

  const getQuickDateOptions = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    return [
      { label: 'Today', value: today, description: 'Immediate change' },
      { label: 'Tomorrow', value: tomorrow, description: 'Next business day' },
      { label: 'Next Week', value: nextWeek, description: 'In 7 days' },
      { label: 'Next Month', value: nextMonth, description: 'Start of next month' },
    ];
  };

  if (loading) {
    return (
      <div className={cn(planChangeCalculatorVariants({ variant }), className)}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing plan change quote...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(planChangeCalculatorVariants({ variant }), className)}>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              <p>Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div className={cn(planChangeCalculatorVariants({ variant }), className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Plan Change Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Review the charges and credits for your plan change
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date Picker Section */}
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border bg-muted/20"
            >
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Change Effective Date
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDateInput(!showDateInput)}
                  className="text-xs"
                >
                  {showDateInput ? 'Quick Options' : 'Custom Date'}
                </Button>
              </div>

              {showDateInput ? (
                <div className="space-y-3">
                  <Input
                    type="date"
                    value={selectedChangeDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {getQuickDateOptions().map((option) => (
                    <Button
                      key={option.label}
                      variant={selectedChangeDate.toDateString() === option.value.toDateString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedChangeDate(option.value)}
                      className="flex flex-col items-center p-3 h-auto"
                    >
                      <span className="text-xs font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(option.value)}</span>
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg border bg-muted/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Current</Badge>
                {planDifference?.type === 'downgrade' && (
                  <Badge variant="secondary" className="text-xs">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Downgrade
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold">{quote.currentPlan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {ProrationEngine.formatCurrency(quote.currentPlan.price, quote.currentPlan.currency)}/{quote.currentPlan.interval}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3" />
                {Math.ceil((quote.nextBillingDate.getTime() - quote.changeDate.getTime()) / (1000 * 60 * 60 * 24))} days remaining
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-2 rounded-full bg-primary/10 text-primary"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </div>

            {/* New Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg border bg-primary/5 border-primary/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge className="text-xs">New Plan</Badge>
                {planDifference?.type === 'upgrade' && (
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Upgrade
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold">{quote.newPlan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {ProrationEngine.formatCurrency(quote.newPlan.price, quote.newPlan.currency)}/{quote.newPlan.interval}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                Effective {formatDate(selectedChangeDate)}
              </div>
            </motion.div>
          </div>

          <Separator />

          {/* Billing Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg border bg-muted/30"
          >
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing Breakdown
            </h4>
            
            <div className="space-y-3">
              {quote.adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{adjustment.description}</span>
                  <span className={cn(
                    "font-medium",
                    adjustment.type === 'credit' ? "text-green-600" : "text-foreground"
                  )}>
                    {adjustment.type === 'credit' ? '-' : '+'}
                    {ProrationEngine.formatCurrency(adjustment.amount, quote.currency)}
                  </span>
                </div>
              ))}
              
              {quote.couponDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Coupon discount</span>
                  <span className="text-green-600 font-medium">
                    -{ProrationEngine.formatCurrency(quote.couponDiscount, quote.currency)}
                  </span>
                </div>
              )}
              
              {quote.taxAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    +{ProrationEngine.formatCurrency(quote.taxAmount, quote.currency)}
                  </span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold">
                <span>
                  {quote.total >= 0 ? "Amount to charge" : "Credit to account"}
                </span>
                <span className={cn(
                  "text-lg",
                  quote.total >= 0 ? "text-foreground" : "text-green-600"
                )}>
                  {ProrationEngine.formatCurrency(Math.abs(quote.total), quote.currency)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center p-3 bg-muted/20 rounded-lg border"
          >
            <p className="text-sm text-muted-foreground">
              Your plan will change on {formatDate(selectedChangeDate)}. 
              {quote.total > 0 
                ? ` You'll be charged ${ProrationEngine.formatCurrency(quote.total, quote.currency)}.`
                : quote.total < 0
                ? ` You'll receive a ${ProrationEngine.formatCurrency(Math.abs(quote.total), quote.currency)} credit.`
                : ' No additional charge.'
              }
            </p>
          </motion.div>

          {/* Action Buttons */}
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={() => onConfirm?.(quote)}
                className="flex-1"
                size="lg"
              >
                Confirm Change
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

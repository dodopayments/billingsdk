"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calendar, CreditCard, Calculator, Clock, Loader2, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Simplified types
interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  features: string[];
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

interface Tax {
  id: string;
  name: string;
  rate: number;
}

interface Adjustment {
  type: 'credit' | 'charge';
  description: string;
  amount: number;
}

interface ProrationQuote {
  currentPlan: Plan;
  newPlan: Plan;
  changeDate: Date;
  nextBillingDate: Date;
  adjustments: Adjustment[];
  couponDiscount: number;
  taxAmount: number;
  total: number;
  currency: string;
}

interface BillingProvider {
  computeProrationQuote(
    subscription: Subscription,
    currentPlan: Plan,
    newPlan: Plan,
    changeDate: Date,
    coupon?: Coupon,
    tax?: Tax
  ): Promise<ProrationQuote>;
}

// Simplified proration engine
class ProrationEngine {
  static calculatePlanDifference(currentPlan: Plan, newPlan: Plan) {
    const priceDiff = newPlan.price - currentPlan.price;
    return {
      type: priceDiff > 0 ? 'upgrade' : priceDiff < 0 ? 'downgrade' : 'same',
      amount: Math.abs(priceDiff)
    };
  }

  static formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

// Mock provider
const mockProvider: BillingProvider = {
  async computeProrationQuote(
    subscription: Subscription,
    currentPlan: Plan,
    newPlan: Plan,
    changeDate: Date,
    coupon?: Coupon,
    tax?: Tax
  ): Promise<ProrationQuote> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const planDiff = ProrationEngine.calculatePlanDifference(currentPlan, newPlan);
    const daysRemaining = Math.ceil((subscription.nextBillingDate.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = currentPlan.price / 30; // Assuming monthly billing
    const creditAmount = Math.max(0, daysRemaining * dailyRate);
    
    const adjustments: Adjustment[] = [];
    
    if (creditAmount > 0) {
      adjustments.push({
        type: 'credit',
        description: `Unused time on ${currentPlan.name}`,
        amount: creditAmount
      });
    }
    
    if (planDiff.type === 'upgrade') {
      adjustments.push({
        type: 'charge',
        description: `Upgrade to ${newPlan.name}`,
        amount: newPlan.price
      });
    } else if (planDiff.type === 'downgrade') {
      adjustments.push({
        type: 'credit',
        description: `Downgrade to ${newPlan.name}`,
        amount: newPlan.price
      });
    }
    
    const subtotal = adjustments.reduce((sum, adj) => 
      sum + (adj.type === 'credit' ? -adj.amount : adj.amount), 0
    );
    
    const couponDiscount = coupon ? 
      (coupon.discountType === 'percentage' ? subtotal * (coupon.discountValue / 100) : coupon.discountValue) : 0;
    
    const taxAmount = tax ? (subtotal - couponDiscount) * (tax.rate / 100) : 0;
    const total = subtotal - couponDiscount + taxAmount;
    
    return {
      currentPlan,
      newPlan,
      changeDate,
      nextBillingDate: subscription.nextBillingDate,
      adjustments,
      couponDiscount,
      taxAmount,
      total,
      currency: currentPlan.currency
    };
  }
};

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
  variant = "default",
}: PlanChangeCalculatorProps) {
  const [quote, setQuote] = useState<ProrationQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateOption, setSelectedDateOption] = useState<'today' | 'tomorrow' | 'nextWeek' | 'nextMonth' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const getEffectiveDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (selectedDateOption) {
      case 'today':
        return today;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow;
      case 'nextWeek':
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek;
      case 'nextMonth':
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        return nextMonth;
      case 'custom':
        return customDate ? new Date(customDate) : today;
      default:
        return today;
    }
  }, [selectedDateOption, customDate]);

  // Use memoized defaults to prevent infinite re-renders
  const defaultSubscription = useMemo(() => 
    subscription || {
      id: 'sub_123',
      planId: 'starter',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }, 
    [subscription]
  );
  
  const defaultCurrentPlan = useMemo(() => 
    currentPlan || {
      id: 'starter',
      name: 'Starter',
      price: 9,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: ['100 requests', 'Basic support', '1 project']
    }, 
    [currentPlan]
  );
  
  const defaultNewPlan = useMemo(() => 
    newPlan || {
      id: 'pro',
      name: 'Pro',
      price: 29,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      features: ['Unlimited requests', 'Priority support', '10 projects']
    }, 
    [newPlan]
  );
  
  const memoizedChangeDate = useMemo(() => 
    changeDate || getEffectiveDate, 
    [changeDate, getEffectiveDate]
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
          memoizedChangeDate,
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
  }, [provider, defaultSubscription, defaultCurrentPlan, defaultNewPlan, memoizedChangeDate, coupon, tax]);

  const planDifference = defaultCurrentPlan && defaultNewPlan 
    ? ProrationEngine.calculatePlanDifference(defaultCurrentPlan, defaultNewPlan)
    : null;

  if (loading) {
    return (
      <div className={cn(planChangeCalculatorVariants({ variant }), className)}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing proration quote...
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

  const formattedChangeDate = memoizedChangeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

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
          {/* Date Picker Controls */}
          {showControls && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Change Effective Date</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedDateOption === 'today' ? 'default' : 'outline'}
                  onClick={() => setSelectedDateOption('today')}
                  size="sm"
                >
                  Today
                </Button>
                <Button 
                  variant={selectedDateOption === 'tomorrow' ? 'default' : 'outline'}
                  onClick={() => setSelectedDateOption('tomorrow')}
                  size="sm"
                >
                  Tomorrow
                </Button>
                <Button 
                  variant={selectedDateOption === 'nextWeek' ? 'default' : 'outline'}
                  onClick={() => setSelectedDateOption('nextWeek')}
                  size="sm"
                >
                  Next Week
                </Button>
                <Button 
                  variant={selectedDateOption === 'nextMonth' ? 'default' : 'outline'}
                  onClick={() => setSelectedDateOption('nextMonth')}
                  size="sm"
                >
                  Next Month
                </Button>
                <Button 
                  variant={selectedDateOption === 'custom' ? 'default' : 'outline'}
                  onClick={() => setSelectedDateOption('custom')}
                  size="sm"
                >
                  Custom Date
                </Button>
              </div>
              {selectedDateOption === 'custom' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-date" className="sr-only">Custom Date</Label>
                  <Input 
                    id="custom-date"
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              )}
            </div>
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
                Effective {formattedChangeDate}
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
              Your plan will change effective {formattedChangeDate}. 
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
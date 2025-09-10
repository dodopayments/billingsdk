"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PiggyBank, Calendar, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan } from "@/lib/billing-core/types";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";
import { RecommendationEngine } from "@/lib/billing-core/usage-patterns";

interface SavingsCalculatorProps {
  monthlyPlan: Plan;
  yearlyPlan?: Plan;
  onSelectYearly?: () => void;
  className?: string;
}

export function SavingsCalculator({
  monthlyPlan,
  yearlyPlan,
  onSelectYearly,
  className
}: SavingsCalculatorProps) {
  if (!yearlyPlan) return null;

  const annualSavings = RecommendationEngine.calculateAnnualSavings(monthlyPlan.price);
  const savingsPercentage = Math.round((annualSavings / (monthlyPlan.price * 12)) * 100);
  const monthlyEquivalent = yearlyPlan.price / 12;

  return (
    <Card className={cn("border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PiggyBank className="h-5 w-5 text-green-600" />
          Annual Savings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Savings Highlight */}
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-green-600">
            Save {ProrationEngine.formatCurrency(annualSavings, monthlyPlan.currency)}
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <TrendingDown className="h-3 w-3 mr-1" />
            {savingsPercentage}% off
          </Badge>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-3 rounded-lg border bg-background">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="font-medium">Monthly</div>
            <div className="text-muted-foreground">
              {ProrationEngine.formatCurrency(monthlyPlan.price * 12, monthlyPlan.currency)}/year
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <Calendar className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <div className="font-medium text-green-700 dark:text-green-400">Yearly</div>
            <div className="text-green-600 dark:text-green-400">
              {ProrationEngine.formatCurrency(yearlyPlan.price, yearlyPlan.currency)}/year
            </div>
          </div>
        </div>

        {/* Monthly Equivalent */}
        <div className="text-center text-sm text-muted-foreground">
          Equivalent to {ProrationEngine.formatCurrency(monthlyEquivalent, monthlyPlan.currency)}/month
        </div>

        {/* Action Button */}
        {onSelectYearly && (
          <Button 
            onClick={onSelectYearly}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Switch to Annual Billing
          </Button>
        )}

        {/* Benefits */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-green-500" />
            <span>2 months free with annual billing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-green-500" />
            <span>Lock in current pricing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan, ProrationQuote } from "@/lib/billing-core/types";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";

interface PlanComparisonProps {
  currentPlan: Plan;
  plans: Plan[];
  prorationQuotes: Record<string, ProrationQuote>;
  onSelectPlan: (planId: string) => void;
  recommendedPlanId?: string;
  className?: string;
}

export function PlanComparison({
  currentPlan,
  plans,
  prorationQuotes,
  onSelectPlan,
  recommendedPlanId,
  className
}: PlanComparisonProps) {
  const displayPlans = plans.slice(0, 3); // Show max 3 plans to avoid clutter

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Compare Plans</h3>
        <p className="text-sm text-muted-foreground">
          See how much each plan change would cost with proration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayPlans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan.id;
          const isRecommended = plan.id === recommendedPlanId;
          const quote = prorationQuotes[plan.id];
          
          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative",
                isCurrentPlan && "border-blue-500 bg-blue-50/30 dark:border-blue-200 dark:bg-blue-950/20",
                isRecommended && !isCurrentPlan && "border-green-200 bg-green-50/30 dark:border-green-200 dark:bg-green-950/20"
              )}
            >
              {/* Badges */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                {isCurrentPlan && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Current
                  </Badge>
                )}
                {isRecommended && !isCurrentPlan && (
                  <Badge className="bg-green-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>

              <CardHeader className="text-center pb-3 pt-6">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-2xl font-bold">
                  {ProrationEngine.formatCurrency(plan.price, plan.currency)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.interval}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs text-muted-foreground">
                      +{plan.features.length - 4} more features
                    </div>
                  )}
                </div>

                {/* Proration Cost */}
                {quote && !isCurrentPlan && (
                  <div className="border-t pt-3">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Change cost</div>
                      <div className={cn(
                        "font-semibold",
                        quote.total >= 0 ? "text-foreground" : "text-green-600"
                      )}>
                        {quote.total >= 0 ? '+' : ''}
                        {ProrationEngine.formatCurrency(quote.total, quote.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quote.total > 0 ? "Charged today" : quote.total < 0 ? "Credit applied" : "No charge"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectPlan(plan.id);
                      }}
                      className={cn(
                        "w-full",
                        isRecommended && "bg-green-600 hover:bg-green-700 text-white"
                      )}
                      variant={isRecommended ? "default" : "outline"}
                      disabled={false}
                    >
                      {isRecommended ? "Switch (Recommended)" : "Switch Plan"}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
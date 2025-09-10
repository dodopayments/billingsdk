"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan } from "@/lib/billing-core/types";
import { PlanRecommendation, UsagePattern } from "@/lib/billing-core/usage-patterns";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";

interface PlanRecommendationProps {
  recommendations: PlanRecommendation[];
  plans: Plan[];
  usage: UsagePattern;
  onSelectPlan: (planId: string) => void;
  className?: string;
}

export function PlanRecommendationComponent({
  recommendations,
  plans,
  usage,
  onSelectPlan,
  className
}: PlanRecommendationProps) {
  const topRecommendation = recommendations[0];
  const recommendedPlan = plans.find(p => p.id === topRecommendation?.planId);

  if (!topRecommendation || !recommendedPlan) {
    return null;
  }

  return (
    <Card className={cn("border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Usage Pattern */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{usage.name}</p>
            <p className="text-xs text-muted-foreground">{usage.description}</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Star className="h-3 w-3 mr-1" />
            {topRecommendation.score}% match
          </Badge>
        </div>

        {/* Recommended Plan */}
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">{recommendedPlan.name}</h4>
              <p className="text-sm text-muted-foreground">
                {ProrationEngine.formatCurrency(recommendedPlan.price, recommendedPlan.currency)}/{recommendedPlan.interval}
              </p>
            </div>
            {topRecommendation.isCurrentPlan && (
              <Badge variant="outline">Current Plan</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {topRecommendation.reason}
          </p>

          {/* Usage Fit Indicators */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{usage.monthlyApiCalls.toLocaleString()} API calls/mo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{usage.monthlyUsers} users</span>
            </div>
          </div>

          {!topRecommendation.isCurrentPlan && (
            <Button 
              onClick={() => onSelectPlan(recommendedPlan.id)}
              size="sm" 
              className="w-full"
            >
              Switch to {recommendedPlan.name}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        {/* Alternative Recommendations */}
        {recommendations.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Other options:</p>
            {recommendations.slice(1, 3).map((rec) => {
              const plan = plans.find(p => p.id === rec.planId);
              if (!plan) return null;
              
              return (
                <div key={rec.planId} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {ProrationEngine.formatCurrency(plan.price, plan.currency)}/{plan.interval}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSelectPlan(plan.id)}
                    className="h-6 px-2 text-xs"
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

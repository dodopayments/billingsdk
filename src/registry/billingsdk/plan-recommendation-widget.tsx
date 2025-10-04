'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Plan } from '@/lib/billingsdk-config';
import { cn } from '@/lib/utils';
import { Database, Users, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export interface PlanRecommendationWidgetProps {
  className?: string;
  currentPlan?: Plan;
  plans: Plan[];
  recommendedPlan?: Plan;
  recommendedPlanId?: string;
  usageData?: {
    apiCalls: number;
    storage: number;
    teamSize: number;
  };
  limits?: {
    apiCalls?: number;
    storage?: number;
    teamSize?: number;
  };
  onPlanSelect?: (planId: string) => void;
  onComparePlans?: () => void;
  onLearnMore?: () => void;
}

export function PlanRecommendationWidget({
  className,
  currentPlan: _currentPlan, // Renamed to _currentPlan to indicate it's intentionally unused
  plans,
  recommendedPlan,
  recommendedPlanId,
  usageData,
  limits: propLimits,
  onPlanSelect,
  onComparePlans,
  onLearnMore
}: PlanRecommendationWidgetProps) {
  const [animatedApiUsage, setAnimatedApiUsage] = useState(0);
  const [animatedStorageUsage, setAnimatedStorageUsage] = useState(0);
  const [animatedTeamUsage, setAnimatedTeamUsage] = useState(0);
  
  // Select recommended plan: direct prop > ID lookup > fallback strategy
  const selectedRecommendedPlan = useMemo(() => {
    // If recommendedPlan is directly provided, use it
    if (recommendedPlan) {
      return recommendedPlan;
    }
    
    // If recommendedPlanId is provided, find it in plans
    if (recommendedPlanId) {
      const plan = plans.find(plan => plan.id === recommendedPlanId);
      if (plan) return plan;
    }
    
    // Fallback strategy: 
    // 1. Try to find a plan with highlight=true (typically the featured plan)
    // 2. Default to the middle plan (if more than 2 plans)
    // 3. Fallback to the first plan
    const highlightedPlan = plans.find(plan => plan.highlight);
    if (highlightedPlan) return highlightedPlan;
    
    // If we have more than 2 plans, pick the middle one
    if (plans.length > 2) {
      return plans[Math.floor(plans.length / 2)];
    }
    
    // Default to first plan if available
    return plans[0];
  }, [recommendedPlan, recommendedPlanId, plans]);
  
  // Calculate usage percentages with dynamic limits
  const getUsagePercentage = (used: number, limit: number) => {
    // If limit is 0, undefined, or Infinity, treat as unlimited (0% usage)
    if (!limit || limit === Infinity) return 0;
    return Math.min(100, (used / limit) * 100);
  };
  
  // Extract limits from props with fallback to Infinity (unlimited)
  const limits = {
    apiCalls: propLimits?.apiCalls ?? Infinity,
    storage: propLimits?.storage ?? Infinity,
    teamSize: propLimits?.teamSize ?? Infinity
  };
  
  // Calculate usage percentages based on provided limits
  const apiUsage = usageData ? getUsagePercentage(usageData.apiCalls, limits.apiCalls) : 0;
  const storageUsage = usageData ? getUsagePercentage(usageData.storage, limits.storage) : 0;
  const teamUsage = usageData ? getUsagePercentage(usageData.teamSize, limits.teamSize) : 0;
  
  // Check if a resource is truly unlimited (limit is Infinity)
  const isApiUnlimited = limits.apiCalls === Infinity;
  const isStorageUnlimited = limits.storage === Infinity;
  const isTeamUnlimited = limits.teamSize === Infinity;
  
  // Animate usage bars on mount
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedApiUsage(apiUsage), 300);
    const timer2 = setTimeout(() => setAnimatedStorageUsage(storageUsage), 600);
    const timer3 = setTimeout(() => setAnimatedTeamUsage(teamUsage), 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [apiUsage, storageUsage, teamUsage]);
  
  // Get status color based on usage
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-400';
    if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-green-500 to-green-400';
  };
  
  return (
    <Card className={cn('w-full max-w-md mx-auto overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-base">Plan Usage Overview</div>
            <div className="text-xs font-normal text-muted-foreground">Real-time analytics</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Metrics */}
        <div className="space-y-5">
          {/* API Calls */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-blue-500/10">
                  <Zap className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">API Calls</div>
                  <div className="text-xs text-muted-foreground">Requests per month</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-500">
                  {usageData?.apiCalls.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isApiUnlimited ? 'Unlimited' : `${(limits.apiCalls / 1000000).toFixed(0)}M limit`}
                </div>
              </div>
            </div>
            {!isApiUnlimited && (
              <div className="w-full h-2.5 bg-secondary/30 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    getStatusColor(apiUsage)
                  )}
                  style={{ width: `${animatedApiUsage}%` }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Storage */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-purple-500/10">
                  <Database className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Storage</div>
                  <div className="text-xs text-muted-foreground">Data storage</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-purple-500">
                  {usageData?.storage || 0}GB
                </div>
                <div className="text-xs text-muted-foreground">
                  {isStorageUnlimited ? 'Unlimited' : `${limits.storage}GB limit`}
                </div>
              </div>
            </div>
            {!isStorageUnlimited && (
              <div className="w-full h-2.5 bg-secondary/30 rounded-full overflow-hidden relative">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    getStatusColor(storageUsage)
                  )}
                  style={{ width: `${animatedStorageUsage}%` }}
                ></div>
                {storageUsage >= 90 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                      CRITICAL
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Team Size */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-amber-500/10">
                  <Users className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Team Size</div>
                  <div className="text-xs text-muted-foreground">Active members</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-500">
                  {usageData?.teamSize || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isTeamUnlimited ? 'Unlimited' : `${limits.teamSize} limit`}
                </div>
              </div>
            </div>
            {!isTeamUnlimited && (
              <div className="w-full h-2.5 bg-secondary/30 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    getStatusColor(teamUsage)
                  )}
                  style={{ width: `${animatedTeamUsage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendation Panel */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-bold text-foreground">
                  {selectedRecommendedPlan?.title || 'Recommended Plan'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRecommendedPlan?.description || 'Consider upgrading your plan'}
                </p>
              </div>
              <div className="flex items-center gap-2">
              {selectedRecommendedPlan && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">${selectedRecommendedPlan.monthlyPrice}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              )}
              </div>
              <div className="flex gap-2 pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={onLearnMore}
                >
                  Learn More
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={onComparePlans}
                >
                  Compare Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="py-2">
          <Button 
            className="w-full h-12 text-base font-semibold rounded-xl"
            onClick={() => selectedRecommendedPlan && onPlanSelect?.(selectedRecommendedPlan.id)}
          >
            Upgrade to {selectedRecommendedPlan?.title || 'Recommended Plan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
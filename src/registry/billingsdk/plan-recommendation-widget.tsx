'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Plan } from '@/lib/billingsdk-config';
import { cn } from '@/lib/utils';
import { Database, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface PlanRecommendationWidgetProps {
  className?: string;
  currentPlan?: Plan;
  plans: Plan[];
  usageData?: {
    apiCalls: number;
    storage: number;
    teamSize: number;
  };
  onPlanSelect?: (planId: string) => void;
  onComparePlans?: () => void;
  onLearnMore?: () => void;
}

export function PlanRecommendationWidget({
  className,
  currentPlan,
  plans,
  usageData,
  onPlanSelect,
  onComparePlans,
  onLearnMore
}: PlanRecommendationWidgetProps) {
  const [animatedApiUsage, setAnimatedApiUsage] = useState(0);
  const [animatedStorageUsage, setAnimatedStorageUsage] = useState(0);
  const [animatedTeamUsage, setAnimatedTeamUsage] = useState(0);
  
  // Find the recommended plan (Pro plan in this case)
  const proPlan = plans.find(plan => plan.id === 'pro');
  
  // Calculate usage percentages
  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min(100, (used / limit) * 100);
  };
  
  // Usage data with limits
  const apiUsage = usageData ? getUsagePercentage(usageData.apiCalls, 1000000) : 0; // Unlimited
  const storageUsage = usageData ? getUsagePercentage(usageData.storage, 1000) : 0; // 1TB = 1000GB
  const teamUsage = usageData ? getUsagePercentage(usageData.teamSize, 200) : 0; // 200 members
  
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
                <div className="text-xs text-muted-foreground">Unlimited</div>
              </div>
            </div>
            <div className="w-full h-2.5 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  getStatusColor(apiUsage)
                )}
                style={{ width: `${animatedApiUsage}%` }}
              ></div>
            </div>
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
                <div className="text-xs text-muted-foreground">1TB limit</div>
              </div>
            </div>
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
                <div className="text-xs text-muted-foreground">200 limit</div>
              </div>
            </div>
            <div className="w-full h-2.5 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  getStatusColor(teamUsage)
                )}
                style={{ width: `${animatedTeamUsage}%` }}
              ></div>
            </div>
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
                <h3 className="font-bold text-foreground">Pro Plan Recommended</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade for more storage and team capacity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">${proPlan?.monthlyPrice}</span>
                <span className="text-sm text-muted-foreground">/month</span>
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
            onClick={() => proPlan && onPlanSelect?.(proPlan.id)}
          >
            Upgrade to Pro Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
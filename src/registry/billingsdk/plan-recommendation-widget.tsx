'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type Plan } from '@/lib/billingsdk-config';
import { cn } from '@/lib/utils';
import { ArrowUpDown, Check, Database, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';

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
  title?: string;
  description?: string;
}

export function PlanRecommendationWidget({
  className,
  currentPlan,
  plans,
  usageData,
  onPlanSelect,
  title = 'Plan Recommendation',
  description = 'Based on your usage, we recommend the following plan for you'
}: PlanRecommendationWidgetProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(currentPlan?.id);
  
  // Calculate usage percentages for a specific plan
  const getUsageForPlan = (plan: Plan) => {
    if (!usageData) return { api: 0, storage: 0, team: 0 };
    
    // These are the limits for each plan
    const apiLimit = plan.id === 'starter' ? 20000 : plan.id === 'pro' ? 100000 : 1000000;
    const storageLimit = plan.id === 'starter' ? 100 : plan.id === 'pro' ? 1000 : 10000;
    const teamLimit = plan.id === 'starter' ? 5 : plan.id === 'pro' ? 20 : 100;
    
    return {
      api: Math.min(100, (usageData.apiCalls / apiLimit) * 100),
      storage: Math.min(100, (usageData.storage / storageLimit) * 100),
      team: Math.min(100, (usageData.teamSize / teamLimit) * 100)
    };
  };
  
  // Get usage for current plan and selected plan
  const currentPlanUsage = currentPlan ? getUsageForPlan(currentPlan) : { api: 0, storage: 0, team: 0 };
  const selectedPlanObj = plans.find(plan => plan.id === selectedPlan);
  const selectedPlanUsage = selectedPlanObj ? getUsageForPlan(selectedPlanObj) : currentPlanUsage;
  
  // Simple recommendation algorithm based on usage data
  const getRecommendedPlan = (): Plan | undefined => {
    if (!usageData || plans.length === 0) return undefined;
    
    // Check if current usage is approaching limits
    const needsUpgrade = currentPlanUsage.api > 80 || currentPlanUsage.storage > 80 || currentPlanUsage.team > 80;
    
    if (!needsUpgrade && currentPlan) {
      return currentPlan; // Current plan is sufficient
    }
    
    // Recommend based on team size and usage
    if (usageData.teamSize <= 5 && currentPlanUsage.api < 50 && currentPlanUsage.storage < 50) {
      return plans.find(plan => plan.id === 'starter') || plans[0];
    } else if (usageData.teamSize <= 20) {
      return plans.find(plan => plan.id === 'pro') || plans[1];
    } else {
      return plans.find(plan => plan.id === 'enterprise') || plans[2];
    }
  };
  
  const recommendedPlan = getRecommendedPlan();
  
  // Calculate savings/upgrade value
  const calculatePlanImpact = (plan: Plan): { 
    monthlyChange: number; 
    isUpgrade: boolean; 
    impactText: string;
    featureDifference: number;
  } | null => {
    if (!currentPlan || currentPlan.id === plan.id) return null;
    
    const currentPrice = parseFloat(currentPlan.monthlyPrice) || 0;
    const newPrice = parseFloat(plan.monthlyPrice) || 0;
    
    const priceDifference = newPrice - currentPrice;
    const featureDifference = plan.features.length - (currentPlan.features?.length || 0);
    
    let impactText = "";
    if (priceDifference > 0) {
      impactText = `+$${Math.abs(priceDifference).toFixed(0)}/month`;
    } else if (priceDifference < 0) {
      impactText = `Save $${Math.abs(priceDifference).toFixed(0)}/month`;
    } else {
      impactText = `${featureDifference > 0 ? '+' : ''}${featureDifference} features`;
    }
    
    return {
      monthlyChange: priceDifference,
      isUpgrade: priceDifference > 0 || featureDifference > 0,
      impactText,
      featureDifference
    };
  };
  
  // Get recommendation reason
  const getRecommendationReason = (plan: Plan): string => {
    if (!usageData) return "Based on your usage patterns";
    
    if (currentPlanUsage.api > 80) {
      return "Approaching API call limit";
    } else if (currentPlanUsage.storage > 80) {
      return "Approaching storage limit";
    } else if (currentPlanUsage.team > 80) {
      return "Approaching team limit";
    } else if (usageData.teamSize > 10 && plan.id === 'pro') {
      return "Optimal for your team size";
    } else {
      return "Best value for your usage";
    }
  };
  
  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Usage Insights */}
          <div className="space-y-4">
            {/* Usage Comparison */}
            {usageData && (
              <div className="rounded-lg border bg-muted/50 p-3 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {selectedPlanObj ? `${selectedPlanObj.title} Plan Usage` : 'Current Usage'}
                </h4>
                
                {/* Current Usage Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      API Calls
                    </span>
                    <span>{usageData.apiCalls.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full",
                        selectedPlan === currentPlan?.id 
                          ? "bg-blue-500" 
                          : selectedPlanUsage.api > 80 
                            ? "bg-red-500" 
                            : "bg-primary"
                      )}
                      style={{ width: `${selectedPlanUsage.api}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      Storage
                    </span>
                    <span>{usageData.storage} GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full",
                        selectedPlan === currentPlan?.id 
                          ? "bg-blue-500" 
                          : selectedPlanUsage.storage > 80 
                            ? "bg-red-500" 
                            : "bg-primary"
                      )}
                      style={{ width: `${selectedPlanUsage.storage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Team Size
                    </span>
                    <span>{usageData.teamSize} members</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full",
                        selectedPlan === currentPlan?.id 
                          ? "bg-blue-500" 
                          : selectedPlanUsage.team > 80 
                            ? "bg-red-500" 
                            : "bg-primary"
                      )}
                      style={{ width: `${selectedPlanUsage.team}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Usage Warning */}
                {(selectedPlanUsage.api > 80 || selectedPlanUsage.storage > 80 || selectedPlanUsage.team > 80) && (
                  <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                    {selectedPlanUsage.api > 80 && "⚠️ API calls approaching limit\n"}
                    {selectedPlanUsage.storage > 80 && "⚠️ Storage approaching limit\n"}
                    {selectedPlanUsage.team > 80 && "⚠️ Team size approaching limit"}
                  </div>
                )}
                
                {/* Plan Features */}
                {selectedPlanObj && (
                  <div className="pt-2 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Plan Features</h4>
                    <div className="space-y-1">
                      {selectedPlanObj.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-xs">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Column - Plan Selection */}
          <div className="space-y-4">
            {/* Plan Selection */}
             <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
               {plans.map((plan) => {
              {plans.map((plan) => {
                const planImpact = calculatePlanImpact(plan);
                const isRecommended = recommendedPlan?.id === plan.id;
                const isCurrent = currentPlan?.id === plan.id;
                
                return (
                  <div key={plan.id} className="space-y-2">
                    <div
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        'p-3 rounded-lg border transition-all duration-200 cursor-pointer relative',
                        selectedPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50',
                        isCurrent
                          ? 'border-2 border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20'
                          : ''
                      )}
                    >
                      {/* Plan Badges */}
                      {isCurrent && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs hover:bg-blue-700">
                          Current
                        </Badge>
                      )}
                      {isRecommended && !isCurrent && (
                        <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs hover:bg-purple-700">
                          Recommended
                        </Badge>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className="flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <Label htmlFor={plan.id} className="font-medium text-sm cursor-pointer">
                              {plan.title}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {plan.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {plan.currency}
                            {plan.monthlyPrice}
                          </div>
                          <div className="text-xs text-muted-foreground">/month</div>
                        </div>
                      </div>
                      
                      {/* Plan Impact */}
                      {planImpact && !isCurrent && (
                        <div className="mt-2 flex items-center gap-1">
                          <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              planImpact.monthlyChange > 0
                                ? "text-red-500"
                                : planImpact.monthlyChange < 0
                                  ? "text-green-500"
                                  : "text-muted-foreground"
                            )}
                          >
                            {planImpact.impactText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </div>
        
        {/* Full Width Action Button */}
        <div className="pt-2">
          <Button 
            className="w-full"
            size="sm"
            disabled={!selectedPlan}
            onClick={() => selectedPlan && onPlanSelect?.(selectedPlan)}
          >
            {currentPlan?.id === selectedPlan 
              ? `Continue with ${currentPlan?.title || 'Current Plan'}` 
              : selectedPlan 
                ? (recommendedPlan?.id === selectedPlan 
                    ? `Upgrade to ${recommendedPlan.title}` 
                    : `Switch to ${plans.find(p => p.id === selectedPlan)?.title || 'Plan'}`)
                : 'Select a Plan'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
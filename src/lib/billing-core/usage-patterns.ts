export interface UsagePattern {
  id: string;
  name: string;
  description: string;
  monthlyApiCalls: number;
  monthlyStorage: number; // GB
  monthlyUsers: number;
  features: string[];
}

export interface PlanRecommendation {
  planId: string;
  score: number; // 0-100
  reason: string;
  savings?: number;
  isCurrentPlan?: boolean;
}

export const usagePatterns: UsagePattern[] = [
  {
    id: 'light-user',
    name: 'Light User',
    description: 'Occasional usage, small projects',
    monthlyApiCalls: 1000,
    monthlyStorage: 0.5,
    monthlyUsers: 1,
    features: ['basic-support', 'standard-analytics']
  },
  {
    id: 'growing-startup',
    name: 'Growing Startup',
    description: 'Scaling business with moderate usage',
    monthlyApiCalls: 25000,
    monthlyStorage: 5,
    monthlyUsers: 5,
    features: ['priority-support', 'advanced-analytics', 'team-collaboration']
  },
  {
    id: 'established-business',
    name: 'Established Business',
    description: 'High volume, enterprise needs',
    monthlyApiCalls: 100000,
    monthlyStorage: 50,
    monthlyUsers: 25,
    features: ['dedicated-support', 'custom-integrations', 'sso', 'advanced-security']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Large scale operations',
    monthlyApiCalls: 500000,
    monthlyStorage: 200,
    monthlyUsers: 100,
    features: ['white-label', 'custom-contracts', 'dedicated-account-manager']
  }
];

export class RecommendationEngine {
  static recommendPlans(usage: UsagePattern, currentPlanId?: string): PlanRecommendation[] {
    const recommendations: PlanRecommendation[] = [];
    
    // Starter plan recommendation
    if (usage.monthlyApiCalls <= 5000 && usage.monthlyUsers <= 2) {
      recommendations.push({
        planId: 'starter',
        score: 85,
        reason: 'Perfect for your current usage level',
        isCurrentPlan: currentPlanId === 'starter'
      });
    }
    
    // Pro plan recommendation
    if (usage.monthlyApiCalls > 2000 && usage.monthlyApiCalls <= 50000) {
      const score = usage.monthlyApiCalls > 10000 ? 95 : 75;
      recommendations.push({
        planId: 'pro',
        score,
        reason: usage.monthlyApiCalls > 10000 
          ? 'Ideal for your growing needs with advanced features'
          : 'Room to grow with better features',
        isCurrentPlan: currentPlanId === 'pro'
      });
    }
    
    // Enterprise plan recommendation
    if (usage.monthlyApiCalls > 25000 || usage.monthlyUsers > 10) {
      recommendations.push({
        planId: 'enterprise',
        score: 90,
        reason: 'Enterprise features for your scale',
        isCurrentPlan: currentPlanId === 'enterprise'
      });
    }
    
    return recommendations.sort((a, b) => b.score - a.score);
  }
  
  static calculateAnnualSavings(monthlyPrice: number): number {
    const monthlyTotal = monthlyPrice * 12;
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    return monthlyTotal - yearlyPrice;
  }
}

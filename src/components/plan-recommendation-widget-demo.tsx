'use client';

import { PlanRecommendationWidget } from '@/components/billingsdk/plan-recommendation-widget';

// Define plans with different features for demo purposes
const demoPlans = [
  {
    id: 'starter',
    title: 'Starter',
    description: 'For individuals getting started',
    currency: '$',
    monthlyPrice: '0',
    yearlyPrice: '0',
    buttonText: 'Start today for free',
    features: [
      { name: 'Up to 100 API calls/day', icon: "check" },
      { name: '1GB Storage', icon: "check" },
      { name: 'Basic Support', icon: "check" },
      { name: 'Community Access', icon: "check" }
    ]
  },
  {
    id: 'pro',
    title: 'Pro',
    description: 'For growing teams',
    currency: '$',
    monthlyPrice: '29',
    yearlyPrice: '290',
    buttonText: 'Get Started',
    highlight: true,
    features: [
      { name: 'Up to 10,000 API calls/day', icon: "check" },
      { name: '100GB Storage', icon: "check" },
      { name: 'Priority Support', icon: "check" },
      { name: 'Advanced Analytics', icon: "check" },
      { name: 'Team Collaboration', icon: "check" },
      { name: 'API Access', icon: "check" }
    ]
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'For large organizations',
    currency: '$',
    monthlyPrice: '99',
    yearlyPrice: '990',
    buttonText: 'Contact Sales',
    features: [
      { name: 'Unlimited API calls', icon: "check" },
      { name: '1TB Storage', icon: "check" },
      { name: '24/7 Dedicated Support', icon: "check" },
      { name: 'Custom Integrations', icon: "check" },
      { name: 'Advanced Security', icon: "check" },
      { name: 'SLA Guarantee', icon: "check" },
      { name: 'Personal Account Manager', icon: "check" }
    ]
  }
];

export function PlanRecommendationWidgetDemo() {
  // Using starter plan as current plan for demo
  const currentPlan = demoPlans.find(plan => plan.id === 'starter') || demoPlans[0];
  
  return (
    <PlanRecommendationWidget
      currentPlan={currentPlan}
      plans={demoPlans}
      usageData={{ apiCalls: 5000, storage: 50, teamSize: 5 }}
      onPlanSelect={(planId) => console.log('Selected plan:', planId)}
    />
  );
}
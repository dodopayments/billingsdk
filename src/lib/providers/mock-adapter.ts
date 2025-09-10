import { BillingProvider, Plan, Subscription, Coupon, Tax, ProrationQuote } from '../billing-core/types';
import { ProrationEngine } from '../billing-core/proration-engine';

// Mock data fixtures
export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    features: ['5 projects', 'Basic support', '1GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    features: ['Unlimited projects', 'Priority support', '10GB storage', 'Advanced analytics'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    currency: 'usd',
    interval: 'month',
    intervalCount: 1,
    features: ['Everything in Pro', 'Dedicated support', '100GB storage', 'Custom integrations', 'SSO'],
  },
  {
    id: 'pro-yearly',
    name: 'Pro (Yearly)',
    price: 299.99,
    currency: 'usd',
    interval: 'year',
    intervalCount: 1,
    features: ['Unlimited projects', 'Priority support', '10GB storage', 'Advanced analytics', '2 months free'],
  },
];

export const mockCoupons: Coupon[] = [
  {
    id: 'SAVE20',
    name: '20% Off',
    type: 'percent',
    value: 20,
  },
  {
    id: 'WELCOME10',
    name: '$10 Off',
    type: 'fixed',
    value: 10,
    currency: 'usd',
  },
  {
    id: 'EXPIRED',
    name: 'Expired Coupon',
    type: 'percent',
    value: 50,
    expiresAt: new Date('2023-01-01'),
  },
];

export const mockTaxRates: Tax[] = [
  {
    rate: 0.21,
    name: 'VAT',
    country: 'NL',
    region: 'Netherlands',
  },
  {
    rate: 0.19,
    name: 'VAT',
    country: 'DE',
    region: 'Germany',
  },
  {
    rate: 0.0875,
    name: 'Sales Tax',
    country: 'US',
    region: 'NY',
  },
  {
    rate: 0.10,
    name: 'GST',
    country: 'AU',
    region: 'Australia',
  },
];

export class MockBillingProvider implements BillingProvider {
  name = 'Mock Provider';

  async computeProrationQuote(
    subscription: Subscription,
    currentPlan: Plan,
    newPlan: Plan,
    changeDate: Date,
    coupon?: Coupon,
    tax?: Tax
  ): Promise<ProrationQuote> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Use the core engine for calculation
    return ProrationEngine.computeProrationQuote(
      subscription,
      currentPlan,
      newPlan,
      changeDate,
      coupon,
      tax
    );
  }

  // Helper methods for demo scenarios
  static createMockSubscription(planId: string, daysIntoCurrentPeriod = 10): Subscription {
    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setDate(now.getDate() - daysIntoCurrentPeriod);
    
    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodStart.getMonth() + 1);
    
    return {
      id: 'sub_mock_123',
      planId,
      status: 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    };
  }

  static getScenarios() {
    const subscription = this.createMockSubscription('starter', 10);
    // Use a fixed date to prevent re-renders from creating new Date objects
    const changeDate = new Date('2024-01-15T10:00:00Z');
    
    return [
      {
        id: 'upgrade-mid-cycle',
        name: 'Mid-cycle Upgrade',
        description: 'Upgrade from Starter to Pro in the middle of billing cycle',
        fromPlan: mockPlans[0], // Starter
        toPlan: mockPlans[1], // Pro
        changeDate,
        subscription,
      },
      {
        id: 'upgrade-with-coupon',
        name: 'Upgrade with Coupon',
        description: 'Upgrade to Pro with 20% off coupon',
        fromPlan: mockPlans[0], // Starter
        toPlan: mockPlans[1], // Pro
        changeDate,
        coupon: mockCoupons[0], // SAVE20
        subscription,
      },
      {
        id: 'upgrade-with-tax',
        name: 'Upgrade with VAT',
        description: 'Upgrade to Enterprise with Netherlands VAT',
        fromPlan: mockPlans[1], // Pro
        toPlan: mockPlans[2], // Enterprise
        changeDate,
        tax: mockTaxRates[0], // Netherlands VAT
        subscription: this.createMockSubscription('pro', 15),
      },
      {
        id: 'downgrade',
        name: 'Downgrade',
        description: 'Downgrade from Pro to Starter',
        fromPlan: mockPlans[1], // Pro
        toPlan: mockPlans[0], // Starter
        changeDate,
        subscription: this.createMockSubscription('pro', 5),
      },
      {
        id: 'annual-upgrade',
        name: 'Switch to Annual',
        description: 'Upgrade from monthly Pro to yearly Pro',
        fromPlan: mockPlans[1], // Pro monthly
        toPlan: mockPlans[3], // Pro yearly
        changeDate,
        subscription: this.createMockSubscription('pro', 20),
      },
    ];
  }
}

export const mockProvider = new MockBillingProvider();

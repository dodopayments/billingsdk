export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  intervalCount: number;
  features: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

export interface Coupon {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  value: number;
  currency?: string; // required for fixed coupons
  maxRedemptions?: number;
  expiresAt?: Date;
}

export interface Tax {
  rate: number; // e.g., 0.21 for 21%
  name: string; // e.g., "VAT", "GST"
  country: string;
  region?: string;
}

export interface ProrationAdjustment {
  type: 'credit' | 'charge';
  amount: number;
  description: string;
  periodStart: Date;
  periodEnd: Date;
}

export interface ProrationQuote {
  currentPlan: Plan;
  newPlan: Plan;
  changeDate: Date;
  
  // Breakdown
  adjustments: ProrationAdjustment[];
  subtotal: number;
  couponDiscount: number;
  taxAmount: number;
  total: number;
  
  // Meta
  currency: string;
  nextBillingDate: Date;
  immediateCharge: number;
}

export interface BillingProvider {
  name: string;
  computeProrationQuote(
    subscription: Subscription,
    currentPlan: Plan,
    newPlan: Plan,
    changeDate: Date,
    coupon?: Coupon,
    tax?: Tax
  ): Promise<ProrationQuote>;
}

export interface ProrationScenario {
  id: string;
  name: string;
  description: string;
  fromPlan: Plan;
  toPlan: Plan;
  changeDate: Date;
  coupon?: Coupon;
  tax?: Tax;
}

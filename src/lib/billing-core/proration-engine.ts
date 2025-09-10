import { Plan, Subscription, Coupon, Tax, ProrationQuote, ProrationAdjustment } from './types';

export class ProrationEngine {
  /**
   * Computes proration quote for plan changes
   * Pure function - no side effects, deterministic output
   */
  static computeProrationQuote(
    subscription: Subscription,
    currentPlan: Plan,
    newPlan: Plan,
    changeDate: Date,
    coupon?: Coupon,
    tax?: Tax
  ): ProrationQuote {
    const adjustments: ProrationAdjustment[] = [];
    
    // Calculate remaining time in current period
    const periodStart = subscription.currentPeriodStart;
    const periodEnd = subscription.currentPeriodEnd;
    const totalPeriodMs = periodEnd.getTime() - periodStart.getTime();
    const remainingMs = periodEnd.getTime() - changeDate.getTime();
    const remainingRatio = Math.max(0, remainingMs / totalPeriodMs);
    
    // Credit for unused time on current plan
    if (remainingRatio > 0) {
      const creditAmount = Math.round(currentPlan.price * remainingRatio * 100) / 100;
      adjustments.push({
        type: 'credit',
        amount: creditAmount,
        description: `Credit for unused time on ${currentPlan.name}`,
        periodStart: changeDate,
        periodEnd: periodEnd,
      });
    }
    
    // Charge for remaining time on new plan
    if (remainingRatio > 0) {
      const chargeAmount = Math.round(newPlan.price * remainingRatio * 100) / 100;
      adjustments.push({
        type: 'charge',
        amount: chargeAmount,
        description: `Prorated charge for ${newPlan.name}`,
        periodStart: changeDate,
        periodEnd: periodEnd,
      });
    }
    
    // Calculate subtotal
    const credits = adjustments
      .filter(adj => adj.type === 'credit')
      .reduce((sum, adj) => sum + adj.amount, 0);
    const charges = adjustments
      .filter(adj => adj.type === 'charge')
      .reduce((sum, adj) => sum + adj.amount, 0);
    
    let subtotal = charges - credits;
    
    // Apply coupon discount
    let couponDiscount = 0;
    if (coupon && this.isCouponValid(coupon, changeDate)) {
      if (coupon.type === 'percent') {
        couponDiscount = Math.round(subtotal * (coupon.value / 100) * 100) / 100;
      } else if (coupon.type === 'fixed' && coupon.currency === currentPlan.currency) {
        couponDiscount = Math.min(coupon.value, subtotal);
      }
      
      if (couponDiscount > 0) {
        adjustments.push({
          type: 'credit',
          amount: couponDiscount,
          description: `Coupon: ${coupon.name}`,
          periodStart: changeDate,
          periodEnd: periodEnd,
        });
      }
    }
    
    // Calculate tax
    let taxAmount = 0;
    if (tax) {
      const taxableAmount = Math.max(0, subtotal - couponDiscount);
      taxAmount = Math.round(taxableAmount * tax.rate * 100) / 100;
    }
    
    const total = Math.max(0, subtotal - couponDiscount + taxAmount);
    
    // Next billing date is the end of current period
    const nextBillingDate = new Date(periodEnd);
    
    return {
      currentPlan,
      newPlan,
      changeDate,
      adjustments,
      subtotal,
      couponDiscount,
      taxAmount,
      total,
      currency: currentPlan.currency,
      nextBillingDate,
      immediateCharge: total,
    };
  }
  
  /**
   * Check if coupon is valid for the given date
   */
  private static isCouponValid(coupon: Coupon, date: Date): boolean {
    if (coupon.expiresAt && date > coupon.expiresAt) {
      return false;
    }
    return true;
  }
  
  /**
   * Format currency amount for display
   */
  static formatCurrency(amount: number, currency: string, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  /**
   * Calculate savings/cost difference between plans
   */
  static calculatePlanDifference(currentPlan: Plan, newPlan: Plan): {
    type: 'upgrade' | 'downgrade' | 'same';
    monthlyDifference: number;
    yearlyDifference: number;
  } {
    // Normalize to monthly pricing for comparison
    const currentMonthly = this.normalizeToMonthly(currentPlan);
    const newMonthly = this.normalizeToMonthly(newPlan);
    
    const monthlyDifference = newMonthly - currentMonthly;
    const yearlyDifference = monthlyDifference * 12;
    
    let type: 'upgrade' | 'downgrade' | 'same';
    if (monthlyDifference > 0) {
      type = 'upgrade';
    } else if (monthlyDifference < 0) {
      type = 'downgrade';
    } else {
      type = 'same';
    }
    
    return {
      type,
      monthlyDifference: Math.abs(monthlyDifference),
      yearlyDifference: Math.abs(yearlyDifference),
    };
  }
  
  /**
   * Normalize plan price to monthly equivalent
   */
  private static normalizeToMonthly(plan: Plan): number {
    if (plan.interval === 'month') {
      return plan.price / plan.intervalCount;
    } else if (plan.interval === 'year') {
      return plan.price / (plan.intervalCount * 12);
    }
    return plan.price;
  }
}

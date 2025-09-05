"use client";

import { ProrationPreview } from "@/registry/billingsdk/proration-preview";
import { plans } from "@/lib/billingsdk-config";
import type { CurrentPlan } from "@/lib/billingsdk-config";

// Mock current plan data
const currentPlan: CurrentPlan = {
  plan: plans[0], // Starter plan
  type: 'monthly',
  nextBillingDate: 'December 15, 2024',
  paymentMethod: '•••• •••• •••• 4242',
  status: 'active'
};

export function ProrationPreviewDemo() {
  return (
    <div className="space-y-8">
      {/* Upgrade Scenario - Classic Theme */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upgrade Preview</h3>
        <ProrationPreview
          currentPlan={currentPlan}
          newPlan={plans[1]} // Pro plan
          billingCycle="monthly"
          daysRemaining={15}
          effectiveDate="immediately"
          theme="classic"
          size="medium"
          onConfirm={() => console.log('Plan change confirmed')}
          onCancel={() => console.log('Plan change cancelled')}
          className="mb-6"
        />
      </div>

      {/* Downgrade Scenario - Minimal Theme */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Downgrade Preview</h3>
        <ProrationPreview
          currentPlan={{
            plan: plans[1], // Pro plan
            type: 'monthly',
            nextBillingDate: 'December 15, 2024',
            paymentMethod: '•••• •••• •••• 4242',
            status: 'active'
          }}
          newPlan={plans[0]} // Starter plan
          billingCycle="monthly"
          daysRemaining={8}
          effectiveDate="at next billing cycle"
          theme="minimal"
          size="medium"
          onConfirm={() => console.log('Downgrade confirmed')}
          onCancel={() => console.log('Downgrade cancelled')}
          confirmText="Confirm Downgrade"
          className="mb-6"
        />
      </div>

      {/* Yearly Billing Scenario */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Switch to Yearly Billing</h3>
        <ProrationPreview
          currentPlan={{
            plan: plans[1], // Pro plan
            type: 'monthly',
            nextBillingDate: 'December 15, 2024', 
            paymentMethod: '•••• •••• •••• 4242',
            status: 'active'
          }}
          newPlan={plans[1]} // Same Pro plan but yearly
          billingCycle="yearly"
          daysRemaining={20}
          effectiveDate="immediately"
          theme="classic"
          size="large"
          onConfirm={() => console.log('Yearly billing confirmed')}
          onCancel={() => console.log('Yearly billing cancelled')}
          confirmText="Switch to Yearly"
        />
      </div>
    </div>
  );
}
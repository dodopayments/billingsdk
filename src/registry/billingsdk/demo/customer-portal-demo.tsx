"use client";

import { CustomerPortal } from "@/components/billingsdk/customer-portal";
import { BillingProvider } from "@/lib/i18n-provider";
import { AnalyticsDashboard } from "@/components/billingsdk/analytics-dashboard";

const userData = {
  name: "Alex Contributor",
  email: "alex@example.com",
};

const analyticsData = {
  metrics: [
    { title: "Monthly Recurring Revenue", value: 12450.5, trend: 12.5 },
    { title: "Churn Rate", value: "2.4%", trend: -0.5 },
  ],
  revenue: [
    { label: "Jan", value: 8200 },
    { label: "Feb", value: 9400 },
    { label: "Mar", value: 10100 },
  ],
};

export default function CustomerPortalDemo() {
  return (
    <BillingProvider>
      <div className="bg-muted/20 w-full rounded-xl p-6">
        <CustomerPortal user={userData} theme="classic">
          {{
            overview: (
              <div className="space-y-8">
                <AnalyticsDashboard data={analyticsData} theme="minimal" />
                <div className="bg-primary/5 border-primary/10 rounded-xl border p-8">
                  <h4 className="mb-2 font-bold">Welcome to your Portal</h4>
                  <p className="text-muted-foreground text-sm">
                    Manage your subscription, update payment methods, and view
                    your billing history all in one place.
                  </p>
                </div>
              </div>
            ),
          }}
        </CustomerPortal>
      </div>
    </BillingProvider>
  );
}

export function CustomerPortalMinimalDemo() {
  return (
    <BillingProvider>
      <div className="w-full p-6">
        <CustomerPortal user={userData} theme="minimal">
          {{
            overview: (
              <div className="text-muted-foreground flex items-center justify-center rounded-xl border border-dashed p-12">
                Welcome to the minimal portal overview.
              </div>
            ),
          }}
        </CustomerPortal>
      </div>
    </BillingProvider>
  );
}

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
        { title: "Monthly Recurring Revenue", value: 12450.50, trend: 12.5 },
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
            <div className="w-full p-6 bg-muted/20 rounded-xl">
                <CustomerPortal user={userData} theme="classic">
                    {{
                        overview: (
                            <div className="space-y-8">
                                <AnalyticsDashboard
                                    data={analyticsData}
                                    theme="minimal"
                                />
                                <div className="p-8 border rounded-xl bg-primary/5 border-primary/10">
                                    <h4 className="font-bold mb-2">Welcome to your Portal</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Manage your subscription, update payment methods, and view your billing history all in one place.
                                    </p>
                                </div>
                            </div>
                        )
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
                            <div className="p-12 border border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
                                Welcome to the minimal portal overview.
                            </div>
                        )
                    }}
                </CustomerPortal>
            </div>
        </BillingProvider>
    );
}

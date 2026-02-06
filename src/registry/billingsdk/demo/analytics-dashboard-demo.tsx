"use client";

import { AnalyticsDashboard } from "@/components/billingsdk/analytics-dashboard";
import { BillingProvider, useBilling } from "@/lib/i18n-provider";

const data = {
    metrics: [
        {
            title: "Monthly Recurring Revenue",
            value: 12450.50,
            trend: 12.5,
            description: "Based on active subscriptions"
        },
        {
            title: "Churn Rate",
            value: "2.4%",
            trend: -0.5,
            description: "30-day rolling average"
        },
        {
            title: "Active Customers",
            value: 1240,
            trend: 8.4,
            description: "Paid subscribers"
        },
        {
            title: "Trial Conversion",
            value: "14.2%",
            trend: 2.1,
            description: "Last 30 days"
        },
    ],
    revenue: [
        { label: "Jan", value: 8200 },
        { label: "Feb", value: 9400 },
        { label: "Mar", value: 10100 },
        { label: "Apr", value: 11200 },
        { label: "May", value: 11900 },
        { label: "Jun", value: 12450 },
    ],
};

export default function AnalyticsDashboardDemo() {
    return (
        <BillingProvider>
            <div className="w-full p-6">
                <AnalyticsDashboard data={data} theme="classic" />
            </div>
        </BillingProvider>
    );
}

export function AnalyticsDashboardMinimalDemo() {
    return (
        <BillingProvider>
            <div className="w-full p-6">
                <AnalyticsDashboard data={data} theme="minimal" />
            </div>
        </BillingProvider>
    );
}

"use client";
// Force re-evaluation


import { useMemo } from "react";
import { BillingProvider } from "@/lib/i18n-provider";
import { AnalyticsDashboard } from "../../components/billingsdk/analytics-dashboard";
import { BillingSettingsThree } from "@/components/billingsdk/billing-settings-three";
import { Button } from "@/components/ui/button";
import { useBilling } from "@/lib/i18n-provider";
import {
    PricingTableOne
} from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";

function DemoContent() {
    const { locale, currency, setLocale, setCurrency } = useBilling();

    const analyticsData = useMemo(() => ({
        metrics: [
            { title: "Monthly Recurring Revenue", value: 12450.50, trend: 12.5, description: "Based on active subscriptions", isCurrency: true },
            { title: "Churn Rate", value: 2.4, trend: -0.5, description: "30-day rolling average", unit: "%" },
            { title: "Average Revenue Per User", value: 45.00, trend: 2.1, description: "Across all paid tiers", isCurrency: true },
            { title: "Total Customers", value: 1240, trend: 8.4, description: "Active subscribers" },
        ],
        revenue: [
            { label: "Jan", value: 8200 },
            { label: "Feb", value: 9400 },
            { label: "Mar", value: 10100 },
            { label: "Apr", value: 11200 },
            { label: "May", value: 11900 },
            { label: "Jun", value: 12450 },
        ],
    }), []);

    const userData = {
        name: "Alex Contributor",
        email: "alex@example.com",
    };

    return (
        <div className="container mx-auto py-12 space-y-24">
            {/* i18n Controls */}
            <section className="bg-muted p-8 rounded-2xl border flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">i18n & Multi-Currency Demo</h2>
                    <p className="text-muted-foreground">Current: {locale} / {currency}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={() => { setLocale("en-US"); setCurrency("USD"); }}>🇺🇸 US (USD)</Button>
                    <Button onClick={() => { setLocale("de-DE"); setCurrency("EUR"); }}>🇩🇪 DE (EUR)</Button>
                    <Button onClick={() => { setLocale("ja-JP"); setCurrency("JPY"); }}>🇯🇵 JP (JPY)</Button>
                    <Button onClick={() => { setLocale("en-GB"); setCurrency("GBP"); }}>🇬🇧 GB (GBP)</Button>
                </div>
            </section>

            {/* Analytics Dashboard */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold">Billing Analytics</h3>
                    <p className="text-muted-foreground">Comprehensive insights into your business growth.</p>
                </div>
                <AnalyticsDashboard data={analyticsData} theme="classic" />
            </section>

            {/* Billing Settings 3 (User Dashboard) */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold">Billing Settings (User)</h3>
                    <p className="text-muted-foreground">A unified interface for your customers to manage their billing, wallet, and payment methods.</p>
                </div>
                <div className="p-6 bg-muted/20 border rounded-xl">
                    <BillingSettingsThree
                        theme="classic"
                        balance={1250.00}
                        balanceTrend={15.4}
                        spend={432.50}
                        spendTrend={-5.2}
                    />
                </div>
            </section>

            {/* Re-using Existing Pricing Table with i18n */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-center">Localized Pricing</h3>
                    <p className="text-muted-foreground text-center">Existing components now support localized currencies through the BillingProvider.</p>
                </div>
                <PricingTableOne
                    plans={plans}
                    title="Choose your localized plan"
                    theme="classic"
                />
            </section>

            <footer className="text-center text-muted-foreground pt-12">
                <p>BillingSDK - Premium Contribution Demonstration</p>
            </footer>
        </div>
    );
}

export default function NewFeaturesDemo() {
    return (
        <BillingProvider>
            <DemoContent />
        </BillingProvider>
    );
}

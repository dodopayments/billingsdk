"use client";

import React from "react";
import { useBilling, BillingProvider } from "@/lib/i18n-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function I18nDemo() {

    return (
        <BillingProvider>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl">Currency Conversion Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Select Currency</label>
                        <DemoControls />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Base Price (USD)</span>
                            <span className="font-medium">$99.00</span>
                        </div>
                        <PriceDisplay />
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Automatic Conversions</p>
                        <AutomaticConversions />
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                        Rates are fetched in real-time from the Frankfurter API.
                    </p>
                </CardContent>
            </Card>
        </BillingProvider>
    );
}

function DemoControls() {
    const { currency, setCurrency } = useBilling();
    const currencies = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD"];

    return (
        <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
                <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
                {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                        {c}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function PriceDisplay() {
    const { currency, formatCurrency } = useBilling();
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Local Price ({currency})</span>
            <span className="text-2xl font-bold text-primary">
                {formatCurrency(99.00, { from: "USD" })}
            </span>
        </div>
    );
}

function AutomaticConversions() {
    const { formatCurrency } = useBilling();
    return (
        <>
            <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Starter Monthly</span>
                <span className="font-mono font-medium">{formatCurrency(29.00, { from: "USD" })}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Pro Annual</span>
                <span className="font-mono font-medium">{formatCurrency(1990.00, { from: "USD" })}</span>
            </div>
        </>
    );
}

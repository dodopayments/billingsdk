"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Locale = string;
export type Currency = string;

interface BillingContextType {
    locale: Locale;
    currency: Currency;
    rates: Record<string, number>;
    setLocale: (locale: Locale) => void;
    setCurrency: (currency: Currency) => void;
    formatCurrency: (amount: number | string, options?: { from?: Currency }) => string;
    convert: (amount: number, from: Currency, to: Currency) => number;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const STATIC_RATES = {
    "USD": 1.0,
    "AUD": 1.4312,
    "BRL": 5.2372,
    "CAD": 1.3666,
    "CHF": 0.77794,
    "CNY": 6.939,
    "CZK": 20.553,
    "DKK": 6.3314,
    "EUR": 0.84789,
    "GBP": 0.73588,
    "HKD": 7.8135,
    "HUF": 320.46,
    "IDR": 16873,
    "ILS": 3.1301,
    "INR": 90.66,
    "ISK": 123.11,
    "JPY": 157.09,
    "KRW": 1467.42,
    "MXN": 17.3639,
    "MYR": 3.9475,
    "NOK": 9.7249,
    "NZD": 1.6681,
    "PHP": 58.544,
    "PLN": 3.5768,
    "RON": 4.3174,
    "SEK": 9.0499,
    "SGD": 1.2732,
    "THB": 31.6,
    "TRY": 43.615,
    "ZAR": 16.1243
};

export function BillingProvider({
    children,
    defaultLocale = "en-US",
    defaultCurrency = "USD",
}: {
    children: React.ReactNode;
    defaultLocale?: Locale;
    defaultCurrency?: Currency;
}) {
    const [locale, setLocale] = useState<Locale>(defaultLocale);
    const [currency, setCurrency] = useState<Currency>(defaultCurrency);
    const [rates, setRates] = useState<Record<string, number>>(STATIC_RATES);

    // Fetch exchange rates from Frankfurter
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch("https://api.frankfurter.dev/v1/latest?base=USD");
                const data = await response.json();
                if (data.rates) {
                    setRates({ USD: 1, ...data.rates });
                }
            } catch (error) {
                console.error("Failed to fetch exchange rates:", error);
            }
        };
        fetchRates();
    }, []);

    const convert = useMemo(() => {
        return (amount: number, from: Currency, to: Currency) => {
            if (from === to) return amount;

            // Fallback: If rates aren't loaded or currency missing, return original amount
            if (!rates[from] && from !== "USD") return amount;
            if (!rates[to] && to !== "USD") return amount;

            // Convert to USD (base) first, then to target
            const amountInUSD = from === "USD" ? amount : amount / (rates[from] || 1);
            const targetAmount = to === "USD" ? amountInUSD : amountInUSD * (rates[to] || 1);

            return targetAmount;
        };
    }, [rates]);

    const formatCurrency = useMemo(() => {
        return (amount: number | string, options?: { from?: Currency }) => {
            let value = typeof amount === "string" ? parseFloat(amount) : amount;
            if (isNaN(value)) return amount.toString();

            // Auto-convert if 'from' is specified and different from current currency
            if (options?.from && options.from !== currency) {
                value = convert(value, options.from, currency);
            }

            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: currency,
            }).format(value);
        };
    }, [locale, currency, convert]);

    const value = useMemo(
        () => ({
            locale,
            currency,
            rates,
            setLocale,
            setCurrency,
            formatCurrency,
            convert,
        }),
        [locale, currency, rates, formatCurrency, convert]
    );

    return (
        <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
    );
}

export function useBilling() {
    const context = useContext(BillingContext);
    if (context === undefined) {
        throw new Error("useBilling must be used within a BillingProvider");
    }
    return context;
}

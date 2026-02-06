"use client";

import { useState, ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "motion/react";
import {
    CreditCard,
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    MoreHorizontal,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBilling } from "@/lib/i18n-provider";

// --- Components ---

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
    value: number
    startValue?: number
    direction?: "up" | "down"
    delay?: number
    decimalPlaces?: number
}

function NumberTicker({
    value,
    startValue = 0,
    direction = "up",
    delay = 0,
    className,
    decimalPlaces = 0,
    ...props
}: NumberTickerProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(direction === "down" ? value : startValue)
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    })
    const isInView = useInView(ref, { once: true, margin: "0px" })

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                motionValue.set(direction === "down" ? startValue : value)
            }, delay * 1000)
            return () => clearTimeout(timer)
        }
    }, [motionValue, isInView, delay, value, direction, startValue])

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = Intl.NumberFormat("en-US", {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces,
            }).format(direction === "down" ? value : startValue)
        }
    }, [decimalPlaces, direction, startValue, value])

    useEffect(
        () =>
            springValue.on("change", (latest) => {
                if (ref.current) {
                    ref.current.textContent = Intl.NumberFormat("en-US", {
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces,
                    }).format(Number(latest.toFixed(decimalPlaces)))
                }
            }),
        [springValue, decimalPlaces]
    )

    return (
        <span
            ref={ref}
            className={cn(
                "inline-block tracking-wider tabular-nums",
                className
            )}
            {...props}
        />
    )
}

// --- Card Logo Helper ---

const CardLogo = ({ type }: { type: string }) => {
    const [error, setError] = useState(false);

    const icons: Record<string, string> = {
        visa: "https://img.icons8.com/color/48/visa.png",
        mastercard: "https://img.icons8.com/color/48/mastercard-logo.png",
        amex: "https://img.icons8.com/color/48/amex.png",
        rupay: "https://img.icons8.com/color/48/rupay.png",
    };

    const logo = icons[type.toLowerCase()];

    if (!logo || error) {
        return (
            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground/60" />
            </div>
        );
    }

    return (
        <img
            src={logo}
            alt={type}
            className="h-6 w-auto object-contain"
            onError={() => setError(true)}
        />
    );
};

// --- Variants ---

const containerVariants = cva("w-full max-w-4xl mx-auto space-y-8", {
    variants: {
        theme: {
            minimal: "",
            classic: "p-6 bg-muted/10 rounded-xl border border-border/50",
        },
    },
    defaultVariants: {
        theme: "minimal",
    },
});

const cardVariants = cva("overflow-hidden transition-all duration-300", {
    variants: {
        theme: {
            minimal: "bg-background border-border shadow-sm hover:shadow-md",
            classic: "bg-card/50 backdrop-blur-sm border-border/50 shadow-md hover:shadow-xl",
        },
    },
    defaultVariants: {
        theme: "minimal",
    },
});

// --- Types ---

interface PaymentMethod {
    id: string;
    type: "visa" | "mastercard" | "amex" | "rupay";
    last4: string;
    expiry: string;
    isDefault: boolean;
}

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    status: "completed" | "pending" | "failed";
}

export interface BillingSettingsThreeProps extends VariantProps<typeof containerVariants> {
    balance?: number;
    balanceTrend?: number;
    balanceTrendLabel?: string;
    spend?: number;
    spendTrend?: number;
    spendTrendLabel?: string;
    currency?: string;
    paymentMethods?: PaymentMethod[];
    transactions?: Transaction[];
    addNewHref?: string;
    onAddNew?: () => void;
    className?: string;
}

// --- Component ---

export function BillingSettingsThree({
    balance = 1250.00,
    balanceTrend = 12.5,
    balanceTrendLabel = "from last month",
    spend = 432.50,
    spendTrend = -2.4,
    spendTrendLabel = "Current billing cycle",
    currency = "USD",
    paymentMethods: initialPaymentMethods,
    transactions: initialTransactions,
    addNewHref,
    onAddNew,
    theme = "minimal",
    className,
}: BillingSettingsThreeProps) {
    const { formatCurrency, currency: currentCurrency, convert } = useBilling();

    // Convert values from USD if needed
    const convertedBalance = convert(balance, "USD", currentCurrency || currency);
    const convertedSpend = convert(spend, "USD", currentCurrency || currency);

    // Mock Data if not provided
    const [methods, setMethods] = useState<PaymentMethod[]>(initialPaymentMethods || [
        { id: "1", type: "visa", last4: "4242", expiry: "12/25", isDefault: true },
        { id: "2", type: "mastercard", last4: "8899", expiry: "08/26", isDefault: false },
    ]);

    const [history] = useState<Transaction[]>(initialTransactions || [
        { id: "t1", description: "Pro Subscription", amount: 29.00, date: "Oct 24, 2024", status: "completed" },
        { id: "t2", description: "Credits Top-up", amount: 50.00, date: "Oct 12, 2024", status: "completed" },
        { id: "t3", description: "Usage Overage", amount: 5.20, date: "Sep 28, 2024", status: "completed" },
    ]);

    const handleDeleteMethod = (id: string) => {
        setMethods(prev => prev.filter(m => m.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    };

    const handleAddNew = () => {
        if (onAddNew) {
            onAddNew();
        } else if (addNewHref) {
            window.location.href = addNewHref;
        }
    };

    // Helper for currency symbol
    const getCurrencySymbol = () => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currentCurrency || currency,
        })
            .format(0)
            .replace(/[0. \d]/g, "");
    };

    return (
        <div className={cn(containerVariants({ theme }), className)}>

            {/* Top Cards: Balance & Spend */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className={cn(cardVariants({ theme }), "relative overflow-hidden")}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Wallet Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold flex items-baseline">
                            <span className="text-xl mr-1 opacity-70 font-medium">{getCurrencySymbol()}</span>
                            <NumberTicker value={convertedBalance} decimalPlaces={2} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span className={cn(
                                "flex items-center",
                                balanceTrend >= 0 ? "text-emerald-500" : "text-destructive"
                            )}>
                                {balanceTrend >= 0 ? (
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                ) : (
                                    <ArrowDownLeft className="w-3 h-3 mr-0.5" />
                                )}
                                {balanceTrend >= 0 ? "+" : ""}
                                <NumberTicker value={Math.abs(balanceTrend)} decimalPlaces={1} />%
                            </span>
                            {balanceTrendLabel}
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(cardVariants({ theme }), "relative overflow-hidden")}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ArrowDownLeft className="w-4 h-4" />
                            Total Spend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold flex items-baseline">
                            <span className="text-xl mr-1 opacity-70 font-medium">{getCurrencySymbol()}</span>
                            <NumberTicker value={convertedSpend} decimalPlaces={2} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span className={cn(
                                "flex items-center",
                                spendTrend >= 0 ? "text-emerald-500" : "text-destructive"
                            )}>
                                {spendTrend >= 0 ? (
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                ) : (
                                    <ArrowDownLeft className="w-3 h-3 mr-0.5" />
                                )}
                                {spendTrend >= 0 ? "+" : ""}
                                <NumberTicker value={Math.abs(spendTrend)} decimalPlaces={1} />%
                            </span>
                            {spendTrendLabel}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Methods - Liquid List */}
            <Card className={cn(cardVariants({ theme }))}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Manage your saved cards and payment details.</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2" onClick={handleAddNew}>
                        <Plus className="w-4 h-4" /> Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {methods.map((method) => (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className={cn(
                                        "group flex items-center justify-between p-4 rounded-xl border transition-all",
                                        method.isDefault
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-background border-border hover:border-border/80"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center bg-muted rounded">
                                                <CardLogo type={method.type} />
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    •••• •••• •••• {method.last4}
                                                    {method.isDefault && (
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/20">Default</Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Expires {method.expiry}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!method.isDefault && (
                                                <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)}>
                                                    Make Default
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDeleteMethod(method.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className={cn(cardVariants({ theme }))}>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Recent billing activity and invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {history.map((tx, i) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        tx.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                                    )}>
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground">{tx.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="font-medium text-sm">{formatCurrency(tx.amount, { from: "USD" })}</div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

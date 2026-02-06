"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBilling } from "@/lib/i18n-provider";

const cardVariants = cva("relative overflow-hidden transition-all duration-300", {
    variants: {
        theme: {
            minimal: "bg-muted/30 border-border/50 hover:bg-muted/50",
            classic: "bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-xl",
        },
    },
    defaultVariants: {
        theme: "minimal",
    },
});

const trendVariants = cva("flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full", {
    variants: {
        type: {
            up: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            down: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            neutral: "bg-muted text-muted-foreground",
        },
    },
});

interface AnalyticsCardProps extends VariantProps<typeof cardVariants> {
    title: string;
    value: number | string;
    trend?: number;
    description?: string;
    isCurrency?: boolean;
    unit?: string;
    className?: string;
}

export function AnalyticsCard({
    title,
    value,
    trend,
    description,
    isCurrency = false,
    unit = "",
    theme,
    className,
}: AnalyticsCardProps) {
    const { formatCurrency, currency: currentCurrency, convert } = useBilling();

    const trendType = useMemo(() => {
        if (!trend || trend === 0) return "neutral";
        return trend > 0 ? "up" : "down";
    }, [trend]);

    // Only convert if it's a currency and we have a number
    const displayValue = useMemo(() => {
        if (typeof value !== "number") return value;
        if (!isCurrency) return value;
        return convert(value, "USD", currentCurrency);
    }, [value, currentCurrency, convert, isCurrency]);

    const currencySymbol = useMemo(() => {
        if (!isCurrency) return "";
        return new Intl.NumberFormat("en-US", {
            style: 'currency',
            currency: currentCurrency,
            currencyDisplay: 'narrowSymbol'
        }).format(0).replace(/[0-9.,]/g, '').trim();
    }, [isCurrency, currentCurrency]);

    return (
        <Card className={cn(cardVariants({ theme }), "flex flex-col min-h-[160px]", className)}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground leading-tight min-h-[2.5rem] flex items-start">
                    {title}
                </CardTitle>
                {trend !== undefined && (
                    <div className={cn(trendVariants({ type: trendType }), "mt-1 shrink-0")}>
                        {trendType === "up" && <ArrowUpRight className="size-3.5" />}
                        {trendType === "down" && <ArrowDownRight className="size-3.5" />}
                        {trendType === "neutral" && <Minus className="size-3.5" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-between">
                <div>
                    <div className="text-3xl font-bold flex items-baseline tabular-nums tracking-tight">
                        {isCurrency && (
                            <span className="text-xl font-medium opacity-70 mr-1">
                                {currencySymbol}
                            </span>
                        )}
                        {typeof value === "number" ? (
                            <NumberTicker
                                value={displayValue as number}
                                decimalPlaces={
                                    (title.toLowerCase().includes('customer') || title.toLowerCase().includes('count')) ? 0 :
                                        (unit === "%" || title.toLowerCase().includes('churn') || title.toLowerCase().includes('rate')) ? 1 : 2
                                }
                            />
                        ) : (
                            value
                        )}
                        {unit && (
                            <span className="text-lg font-medium opacity-70">
                                {unit}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed min-h-[2.5rem] flex items-start">
                            {description}
                        </p>
                    )}
                </div>

                {theme === "classic" && (
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                )}
            </CardContent>
        </Card>
    );
}

// Internal NumberTicker for Analytics (to avoid duplicate imports if registry items are used standalone)
import { useEffect, useRef, ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

function NumberTicker({
    value,
    direction = "up",
    delay = 0,
    decimalPlaces = 0,
    className,
    ...props
}: { value: number; direction?: "up" | "down"; delay?: number; decimalPlaces?: number; className?: string } & ComponentPropsWithoutRef<"span">) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(direction === "down" ? value : 0)
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    })
    const isInView = useInView(ref, { once: true, margin: "0px" })

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value)
            }, delay * 1000)
        }
    }, [motionValue, isInView, delay, value, direction])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US", {
                    minimumFractionDigits: decimalPlaces,
                    maximumFractionDigits: decimalPlaces,
                }).format(Number(Number(latest).toFixed(decimalPlaces)))
            }
        })
    }, [springValue, decimalPlaces])

    return (
        <span
            ref={ref}
            className={cn("inline-block tabular-nums", className)}
            {...props}
        />
    )
}

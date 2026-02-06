"use client";

import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const chartVariants = cva("relative h-[200px] w-full flex items-end gap-1 px-2 pb-2", {
    variants: {
        theme: {
            minimal: "bg-transparent",
            classic: "bg-card/30 backdrop-blur-sm border rounded-lg",
        },
    },
    defaultVariants: {
        theme: "minimal",
    },
});

interface RevenueChartProps extends VariantProps<typeof chartVariants> {
    data: { label: string; value: number }[];
    title?: string;
    className?: string;
}

export function RevenueChart({
    data = [],
    title = "Revenue over time",
    theme,
    className,
}: RevenueChartProps) {
    if (!data || data.length === 0) return null;
    const maxValue = Math.max(...data.map((d) => d.value)) || 1;

    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={chartVariants({ theme })}>
                    {data.map((item, index) => (
                        <div
                            key={item.label}
                            className="group relative flex flex-1 flex-col items-center justify-end h-full"
                        >
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                                className={cn(
                                    "w-full rounded-t-sm transition-colors",
                                    theme === "classic"
                                        ? "bg-primary/80 hover:bg-primary"
                                        : "bg-primary/60 hover:bg-primary/80"
                                )}
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-popover px-1.5 py-0.5 text-[10px] text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                                {item.value}
                            </div>
                        </div>
                    ))}

                    {theme === "classic" && (
                        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]" />
                    )}
                </div>
                <div className="mt-2 flex justify-between px-2">
                    {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((item) => (
                        <span key={item.label} className="text-[10px] text-muted-foreground">
                            {item.label}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

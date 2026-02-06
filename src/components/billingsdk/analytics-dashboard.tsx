"use client";

import { AnalyticsCard } from "./analytics-card";
import { RevenueChart } from "./revenue-chart";
import { cn } from "@/lib/utils";
import { CheckCircle2, UserPlus, CreditCard, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsDashboardProps {
    data: {
        metrics: {
            title: string;
            value: number | string;
            trend?: number;
            description?: string;
            isCurrency?: boolean;
            unit?: string;
        }[];
        revenue: { label: string; value: number }[];
        activities?: {
            type: "signup" | "payment" | "upgrade" | "issue";
            user: string;
            time: string;
            description: string;
        }[];
    };
    theme?: "minimal" | "classic";
    className?: string;
}

export function AnalyticsDashboard({
    data = { metrics: [], revenue: [] },
    theme = "minimal",
    className,
}: AnalyticsDashboardProps) {
    if (!data) return null;

    const activities = data?.activities || [
        { type: "payment", user: "John Doe", time: "2 min ago", description: "Successfully paid $29.00" },
        { type: "signup", user: "Jane Smith", time: "1 hour ago", description: "Started a Pro trial" },
        { type: "upgrade", user: "Bob Johnson", time: "3 hours ago", description: "Upgraded to Enterprise" },
        { type: "payment", user: "Alice Brown", time: "5 hours ago", description: "Successfully paid $199.00" },
    ];

    return (
        <div className={cn("mx-auto max-w-5xl flex flex-col gap-8", className)}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.metrics.map((metric, index) => (
                    <AnalyticsCard
                        key={index}
                        title={metric.title}
                        value={metric.value}
                        trend={metric.trend}
                        description={metric.description}
                        isCurrency={metric.isCurrency}
                        unit={metric.unit}
                        theme={theme}
                    />
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <RevenueChart
                    data={data.revenue}
                    theme={theme}
                    className="lg:col-span-4"
                />
                <div className={cn(
                    "lg:col-span-3 rounded-lg border p-6 flex flex-col gap-4",
                    theme === "classic" ? "bg-card/30 backdrop-blur-sm shadow-xl" : "bg-muted/30"
                )}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
                    <div className="flex flex-col gap-3">
                        {activities.map((activity, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <div className="mt-0.5">
                                    {activity.type === "payment" && <CreditCard className="size-4 text-foreground/70" />}
                                    {activity.type === "signup" && <UserPlus className="size-4 text-foreground/70" />}
                                    {activity.type === "upgrade" && <CheckCircle2 className="size-4 text-foreground/70" />}
                                    {activity.type === "issue" && <AlertCircle className="size-4 text-foreground/70" />}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between gap-2">
                                        <span className="font-medium text-foreground">{activity.user}</span>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-auto w-full group/btn border-dashed hover:border-solid transition-all">
                        View activity log
                        <ChevronRight className="ml-1 size-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

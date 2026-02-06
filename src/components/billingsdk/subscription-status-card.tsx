"use client";

import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionStatusCardProps {
    planName: string;
    status: "active" | "canceled" | "past_due";
    renewalDate: string;
    features?: string[];
    onManageSubscription?: () => void;
    className?: string;
}

export function SubscriptionStatusCard({
    planName,
    status,
    renewalDate,
    features = [],
    onManageSubscription,
    className,
}: SubscriptionStatusCardProps) {
    return (
        <Card className={cn("overflow-hidden border-l-4 border-l-primary", className)}>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{planName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant={status === "active" ? "default" : "destructive"}>
                            {status === "active" ? "Active" : "Inode"}
                        </Badge>
                        <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            Renews {renewalDate}
                        </span>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onManageSubscription}>
                    Manage Plan
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="size-3 text-primary" />
                            </div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

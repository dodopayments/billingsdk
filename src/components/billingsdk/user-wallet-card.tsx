"use client";

import { useBilling } from "@/lib/i18n-provider";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const walletCardVariants = cva("relative overflow-hidden transition-all duration-300", {
    variants: {
        theme: {
            minimal: "bg-muted/30 border-border/50 hover:bg-muted/50",
            liquid: "bg-gradient-to-br from-primary/10 via-background to-background backdrop-blur-md border-primary/10 shadow-xl",
        },
    },
    defaultVariants: {
        theme: "liquid",
    },
});

export interface UserWalletCardProps extends VariantProps<typeof walletCardVariants> {
    balance: number;
    currency?: string;
    onAddFunds?: () => void;
    className?: string;
}

export function UserWalletCard({
    balance,
    currency = "USD",
    onAddFunds,
    theme,
    className,
}: UserWalletCardProps) {
    const { formatCurrency } = useBilling();

    return (
        <Card className={cn(walletCardVariants({ theme }), className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Wallet Balance
                </CardTitle>
                {theme === "liquid" && (
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                        <div className="size-4 rounded-full bg-primary/40" />
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div className="text-4xl font-bold tracking-tight">
                        {formatCurrency(balance)}
                    </div>
                    <Button
                        onClick={onAddFunds}
                        className={cn(
                            "rounded-full gap-2 transition-all active:scale-95",
                            theme === "liquid" ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-none border border-primary/20" : ""
                        )}
                    >
                        <Plus className="size-4" />
                        <span>Add Funds</span>
                    </Button>
                </div>

                {theme === "liquid" && (
                    <>
                        <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -left-12 -bottom-12 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

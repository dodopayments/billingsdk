"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle } from "lucide-react";
import { BiSupport } from "react-icons/bi";

export interface CancelSubscriptionCardTwoProps {
    title: string;
    description: string;
    plan: Plan;
    warningText?: string;
    supportText?: string;
    supportLink?:string;
    keepButtonText?: string;
    continueButtonText?: string;
    finalTitle?: string;
    finalSubtitle?: string;
    goBackButtonText?: string;
    confirmButtonText?: string;
    onCancel: (planId: string) => Promise<void> | void;
    onKeepSubscription?: (planId: string) => Promise<void> | void;
    className?: string;
}

export function CancelSubscriptionCardTwo({
    title,
    description,
    plan,
    warningText,
    supportText,
    keepButtonText,
    continueButtonText,
    finalTitle,
    finalSubtitle,
    supportLink,
    goBackButtonText,
    confirmButtonText,
    onCancel,
    onKeepSubscription,
    className,
}: CancelSubscriptionCardTwoProps) {
    const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBenefits, setShowBenefits] = useState(true); // collapse 

    const handleContinueCancellation = () => {
        setShowFinalConfirmation(true);
        setError(null);
    };

    const handleKeepSubscription = async () => {
        try {
            setIsLoading(true);
            setError(null);
            if (onKeepSubscription) {
                await onKeepSubscription(plan.id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to keep subscription');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setShowFinalConfirmation(false);
        setError(null);
    };

    const handleConfirmCancellation = async () => {
        try {
            setIsLoading(true);
            setError(null);
            if (onCancel) {
                await onCancel(plan.id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={cn("max-w-2xl mx-auto w-full", className)}>
            <CardHeader className="space-y-4">
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
              
                {/* Subscription Details */}
                {!showFinalConfirmation && (
                    <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-lg">{plan.title} Plan</span>
                                <span className="text-sm text-muted-foreground">Current subscription</span>
                            </div>
                            <Badge variant="secondary">
                                {parseFloat(plan.monthlyPrice) >= 0 ? `${plan.currency}${plan.monthlyPrice}/monthly` : `${plan.monthlyPrice}/monthly`}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button 
                                variant="ghost"
                                className="w-full justify-between p-0 h-auto font-medium text-sm hover:bg-transparent"
                                onClick={() => setShowBenefits(!showBenefits)}
                            >
                                <span>Your Current Plan Benefits</span>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showBenefits && "rotate-180")} />
                            </Button>
                            {showBenefits && (
                                <div className="space-y-2 pl-2">
                                    {plan.features.slice(0, 4).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Circle className="w-2 h-2 fill-primary text-primary" />
                                            <span className="text-sm text-muted-foreground">{feature.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Support Section */}
                {!showFinalConfirmation && (supportText || supportLink) && (
                    <div className="rounded-lg border p-4 bg-muted/10">
                        {supportText && (
                            <p className="text-sm text-muted-foreground mb-3">{supportText}</p>
                        )}
                        {supportLink && (
                            <div className="flex items-center gap-2">
                                <BiSupport className="w-4 h-4 text-muted-foreground" />
                                <a 
                                    href={supportLink}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Contact Support
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {!showFinalConfirmation ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            className="flex-1"
                            onClick={handleKeepSubscription}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : (keepButtonText || "Keep My Subscription")}
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleContinueCancellation}
                            disabled={isLoading}
                        >
                            {continueButtonText || "Continue Cancellation"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <h3 className="font-semibold mb-2 text-foreground">
                                {finalTitle || "Final Step - Confirm Cancellation"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {finalSubtitle || "You'll lose access to all Pro features and your data will be permanently deleted after 30 days."}
                            </p>
                            <p className="text-sm text-destructive">
                                {warningText || "This action cannot be undone and you'll lose access to all premium features."}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleBack}
                                disabled={isLoading}
                            >
                                {goBackButtonText || "Go Back"}
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleConfirmCancellation}
                                disabled={isLoading}
                            >
                                {isLoading ? "Cancelling..." : (confirmButtonText || "Yes, Cancel Subscription")}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
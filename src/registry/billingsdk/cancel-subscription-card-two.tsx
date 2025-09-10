"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, Info,  Zap } from "lucide-react";
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
        <Card className={cn(" sm:max-w-[500px] flex flex-col md:flex-row overflow-hidden w-full", className)}>
            <CardContent className={cn("px-4 flex flex-col gap-4 w-full")}>
                {!showFinalConfirmation &&(
                    <>
                      <div className="flex justify-end">
                    <span className="text-destructive">Cancel Plan</span>
                </div>
                
                <div className="flex flex-col gap-2 text-center md:text-left pl-4">
                    <h2 className="text-lg sm:text-2xl font-semibold">{title}</h2>
                    <p className="md:text-sm text-xs text-muted-foreground">{description}</p>
                </div>
                    </>
                )}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
                )}
              
                {/* Subscription Details */}
                {!showFinalConfirmation && (
                    <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                           <div className="flex text-left">
                            <p className=" text-sm sm:text-lg ">
                                Current Subscription:
                            </p>
                           </div>
                           <div className="flex flex-col gap-1">
                            <p className="font-semibold text-sm sm:text-lg">{plan.title} Plan </p>
                            <Badge variant="secondary">
                                {parseFloat(plan.monthlyPrice) >= 0 ? `${plan.currency}${plan.monthlyPrice}/monthly` : `${plan.monthlyPrice}/monthly`}
                            </Badge>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {/* Features */}
                            <Button 
                                variant="ghost"
                                className="flex justify-between items-center text-sm font-medium cursor-pointer transition-colors"
                                onClick={() => setShowBenefits(!showBenefits)}
                            >
                                <span>Your Current Plan Benefits:</span>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showBenefits && "rotate-180")} />
                            </Button>
                            {showBenefits && (
                                <>
                                    {plan.features.slice(0, 4).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 pl-3">
                                            <Zap className="w-4 h-4 fill-primary text-primary" />
                                            <span className="text-sm text-muted-foreground">{feature.name}</span>
                                        </div>
                                    ))}
                                </>
                               
                            )}
                               <div className="mt-5 border-t border-border pt-5">
                                {supportText && (
                                <div className="flex justify-end ">
                                    <p className="text-sm text-muted-foreground ">
                                        {supportText}
                                    </p>
                                </div>
                                )}
                                {supportLink && (
                                <div className="flex items-center gap-2 justify-end pt-5 ">
                                <BiSupport className="w-4 h-4"/>
                                    <a 
                                    href={supportLink?.toString()}
                                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
                                       Contact Support
                                    </a>   
                                </div>
                                )}
                               
                                  
                                </div>
                        </div>
                    </div>
                )}
              

                {!showFinalConfirmation ? (
                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <Button
                            className="flex-1"
                            onClick={handleKeepSubscription}
                            disabled={isLoading}
                        >
                             {isLoading ? "Processing..." : (keepButtonText || "Keep My Subscription")}
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={handleContinueCancellation}
                            disabled={isLoading}
                        >
                          {continueButtonText || "Continue Cancellation"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 ">
                        <div className="p-1  rounded-lg">
                            <div className="border-b">
                                  <h4 className="font-semibold text-lg sm:text-xl mb-2 text-foreground text-center">
                                {finalTitle || "You are about to cancel your subscription"}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center">
                                {finalSubtitle || "You'll lose access to all Pro features and your data will be permanently deleted after 30 days."}
                            </p>
                            </div>
                          {/* Features */}
                            <div className="flex flex-col gap-2 sm:ml-6 py-4">
                                <p className="text-base font-medium text-foreground py-2.5">
                                 Keep your plan to continue enjoying these benefits:
                                </p>
                             {plan.features.slice(0, 4).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 pl-3">
                                            <Zap className="w-4 h-4 fill-primary text-primary" />
                                            <p className="text-sm text-muted-foreground">{feature.name}</p>
                                        </div>
                                    ))}
                                </div>
                                  <div className="flex items-start mt-6 p-2 bg-destructive/10 border border-red-400/20 rounded-lg gap-3">
                                    <Info className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                                    <p className="text-sm text-destructive ">
                                      {warningText || "This action will immediately cancel your subscription."}  
                                    </p>
                                </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="w-full"
                                onClick={handleBack}
                                disabled={isLoading}
                            >
                                {goBackButtonText || "Never mind"}
                            </Button>

                            <div className="flex justify-center">
                                  <Button
                                variant="ghost"
                                onClick={handleConfirmCancellation}
                                disabled={isLoading}
                                className="w-fit text-muted-foreground hover:text-destructive"
                            >
                                <span className="flex items-center gap-2">
                                    {isLoading ? "Cancelling..." : (confirmButtonText || "Cancel My Subscription")}
                                    {!isLoading && <ArrowRight className="w-3 h-3 mt-1" />}
                                </span>
                            </Button>
                            </div>
                          
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
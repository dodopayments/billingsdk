"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, CreditCard } from "lucide-react"
import { CurrentPlan } from "@/lib/billingsdk-config"
import { cn } from "@/lib/utils"
import { CancelSubscriptionDialog, type CancelSubscriptionDialogProps } from "@/components/billingsdk/cancel-subscription-dialog"
import { UpdatePlanDialog, type UpdatePlanDialogProps } from "@/components/billingsdk/update-plan-dialog"

export interface SubscriptionManagementProps {
    className?: string
    currentPlan: CurrentPlan
    cancelSubscription: CancelSubscriptionDialogProps
    updatePlan: UpdatePlanDialogProps
}

export function SubscriptionManagement({ className, currentPlan, cancelSubscription, updatePlan }: SubscriptionManagementProps) {

    return (<div className={cn("text-left w-full", className)}>
        <Card className="shadow-lg">
            <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    Current Subscription
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Manage your billing and subscription settings</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
                {/* Current Plan Details with highlighted styling */}
                <div className="relative p-3 sm:p-4 rounded-xl bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 border border-border/50 overflow-hidden">
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg sm:text-xl font-semibold">{currentPlan.plan.title} Plan</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant={currentPlan.status === "active" ? "default" : "outline"}
                                            className="shadow-sm text-xs sm:text-sm bg-primary/90 hover:bg-primary border-0 font-medium"
                                        >
                                            {currentPlan.type === `monthly` ? `${currentPlan.plan.currency}${currentPlan.plan.monthlyPrice}/month` : currentPlan.type === `yearly` ? `${currentPlan.plan.yearlyPrice}/year` : `${currentPlan.price}`}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="shadow-sm text-xs sm:text-sm border-border/60 bg-background/50 backdrop-blur-sm"
                                        >
                                            {currentPlan.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="relative">
                                    <p className="text-xs sm:text-sm text-muted-foreground relative z-10">
                                        {currentPlan.plan.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-4 sm:my-6 bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="space-y-3 sm:space-y-4">
                    <h4 className="font-medium flex items-center gap-2 text-base sm:text-lg">
                        <div className="p-1 sm:p-1.5 rounded-md bg-muted ring-1 ring-border/50">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        Billing Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <div className="group p-2.5 sm:p-3 rounded-lg md:bg-gradient-to-tl bg-gradient-to-b from-muted to-background/10 border border-border/30 hover:border-border/60 transition-all duration-200">
                            <span className="text-xs sm:text-sm text-muted-foreground block mb-1">Next billing date</span>
                            <div className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors duration-200">{currentPlan.nextBillingDate}</div>
                        </div>
                        <div className="group p-2.5 sm:p-3 rounded-lg md:bg-gradient-to-tr bg-gradient-to-b from-muted to-background/10 border border-border/30 hover:border-border/60 transition-all duration-200">
                            <span className="text-xs sm:text-sm text-muted-foreground block mb-1">Payment method</span>
                            <div className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors duration-200">{currentPlan.paymentMethod}</div>
                        </div>
                    </div>
                </div>

                <Separator className="my-4 sm:my-6 bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="flex flex-col sm:flex-row gap-3">
                    <UpdatePlanDialog
                        className="mx-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        {...updatePlan}
                    />

                    <CancelSubscriptionDialog
                        className="mx-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        {...cancelSubscription}
                    />
                </div>

                <div className="pt-4 sm:pt-6">
                    <h4 className="font-medium mb-3 sm:mb-4 text-base sm:text-lg">Current Plan Features</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {currentPlan.plan.features.map((feature, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-2 p-2 sm:p-2 rounded-lg border border-border/80 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                            >
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary flex-shrink-0 group-hover:bg-primary group-hover:scale-125 transition-all duration-200"></div>
                                <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{feature.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}
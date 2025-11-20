"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard } from "lucide-react";
import { CurrentPlan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import {
  CancelSubscriptionDialog,
  type CancelSubscriptionDialogProps,
} from "@/components/billingsdk/cancel-subscription-dialog";
import {
  UpdatePlanDialog,
  type UpdatePlanDialogProps,
} from "@/components/billingsdk/update-plan-dialog";

export interface SubscriptionManagementProps {
  className?: string;
  currentPlan: CurrentPlan;
  cancelSubscription: CancelSubscriptionDialogProps;
  updatePlan: UpdatePlanDialogProps;
}

export function SubscriptionManagement({
  className,
  currentPlan,
  cancelSubscription,
  updatePlan,
}: SubscriptionManagementProps) {
  return (
    <div className={cn("w-full text-left", className)}>
      <Card className="shadow-lg">
        <CardHeader className="px-4 pb-4 sm:px-6 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:gap-3 sm:text-xl">
            <div className="bg-primary/10 ring-primary/20 rounded-lg p-1.5 ring-1 sm:p-2">
              <CreditCard className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            Current Subscription
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage your billing and subscription settings
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:space-y-8 sm:px-6">
          {/* Current Plan Details with highlighted styling */}
          <div className="from-muted/30 via-muted/20 to-muted/30 border-border/50 relative overflow-hidden rounded-xl border bg-gradient-to-r p-3 sm:p-4">
            <div className="relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <div className="w-full">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold sm:text-xl">
                        {currentPlan.plan.title} Plan
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          currentPlan.status === "active"
                            ? "default"
                            : "outline"
                        }
                        className="bg-primary/90 hover:bg-primary border-0 text-xs font-medium shadow-sm sm:text-sm"
                      >
                        {currentPlan.type === `monthly`
                          ? `${currentPlan.plan.currency}${currentPlan.plan.monthlyPrice}/month`
                          : currentPlan.type === `yearly`
                            ? `${currentPlan.plan.yearlyPrice}/year`
                            : `${currentPlan.price}`}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-border/60 bg-background/50 text-xs shadow-sm backdrop-blur-sm sm:text-sm"
                      >
                        {currentPlan.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="text-muted-foreground relative z-10 text-xs sm:text-sm">
                      {currentPlan.plan.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="via-border my-4 bg-gradient-to-r from-transparent to-transparent sm:my-6" />

          <div className="space-y-3 sm:space-y-4">
            <h4 className="flex items-center gap-2 text-base font-medium sm:text-lg">
              <div className="bg-muted ring-border/50 rounded-md p-1 ring-1 sm:p-1.5">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              Billing Information
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
              <div className="group from-muted to-background/10 border-border/30 hover:border-border/60 rounded-lg border bg-gradient-to-b p-2.5 transition-all duration-200 sm:p-3 md:bg-gradient-to-tl">
                <span className="text-muted-foreground mb-1 block text-xs sm:text-sm">
                  Next billing date
                </span>
                <div className="group-hover:text-primary text-sm font-medium transition-colors duration-200 sm:text-base">
                  {currentPlan.nextBillingDate}
                </div>
              </div>
              <div className="group from-muted to-background/10 border-border/30 hover:border-border/60 rounded-lg border bg-gradient-to-b p-2.5 transition-all duration-200 sm:p-3 md:bg-gradient-to-tr">
                <span className="text-muted-foreground mb-1 block text-xs sm:text-sm">
                  Payment method
                </span>
                <div className="group-hover:text-primary text-sm font-medium transition-colors duration-200 sm:text-base">
                  {currentPlan.paymentMethod}
                </div>
              </div>
            </div>
          </div>

          <Separator className="via-border my-4 bg-gradient-to-r from-transparent to-transparent sm:my-6" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <UpdatePlanDialog
              className="mx-0 shadow-lg transition-all duration-200 hover:shadow-xl"
              {...updatePlan}
            />

            <CancelSubscriptionDialog
              className="mx-0 shadow-lg transition-all duration-200 hover:shadow-xl"
              {...cancelSubscription}
            />
          </div>

          <div className="pt-4 sm:pt-6">
            <h4 className="mb-3 text-base font-medium sm:mb-4 sm:text-lg">
              Current Plan Features
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {currentPlan.plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="group border-border/80 hover:border-primary/30 hover:bg-primary/5 flex items-center gap-2 rounded-lg border p-2 transition-all duration-200 sm:p-2"
                >
                  <div className="bg-primary group-hover:bg-primary h-1 w-1 flex-shrink-0 rounded-full transition-all duration-200 group-hover:scale-125 sm:h-1.5 sm:w-1.5"></div>
                  <span className="text-muted-foreground group-hover:text-foreground text-xs transition-colors duration-200 sm:text-sm">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

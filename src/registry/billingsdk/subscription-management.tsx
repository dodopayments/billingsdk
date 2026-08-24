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
            <div className="rounded-lg bg-primary/10 p-1.5 ring-1 ring-primary/20 sm:p-2">
              <CreditCard className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
            Current Subscription
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage your billing and subscription settings
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:space-y-8 sm:px-6">
          {/* Current Plan Details with highlighted styling */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 p-3 sm:p-4">
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
                        className="border-0 bg-primary/90 text-xs font-medium shadow-sm hover:bg-primary sm:text-sm"
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
                    <p className="relative z-10 text-xs text-muted-foreground sm:text-sm">
                      {currentPlan.plan.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent sm:my-6" />

          <div className="space-y-3 sm:space-y-4">
            <h4 className="flex items-center gap-2 text-base font-medium sm:text-lg">
              <div className="rounded-md bg-muted p-1 ring-1 ring-border/50 sm:p-1.5">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              Billing Information
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
              <div className="group rounded-lg border border-border/30 bg-gradient-to-b from-muted to-background/10 p-2.5 transition-all duration-200 hover:border-border/60 sm:p-3 md:bg-gradient-to-tl">
                <span className="mb-1 block text-xs text-muted-foreground sm:text-sm">
                  Next billing date
                </span>
                <div className="text-sm font-medium transition-colors duration-200 group-hover:text-primary sm:text-base">
                  {currentPlan.nextBillingDate}
                </div>
              </div>
              <div className="group rounded-lg border border-border/30 bg-gradient-to-b from-muted to-background/10 p-2.5 transition-all duration-200 hover:border-border/60 sm:p-3 md:bg-gradient-to-tr">
                <span className="mb-1 block text-xs text-muted-foreground sm:text-sm">
                  Payment method
                </span>
                <div className="text-sm font-medium transition-colors duration-200 group-hover:text-primary sm:text-base">
                  {currentPlan.paymentMethod}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent sm:my-6" />

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
                  className="group flex items-center gap-2 rounded-lg border border-border/80 p-2 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 sm:p-2"
                >
                  <div className="h-1 w-1 flex-shrink-0 rounded-full bg-primary transition-all duration-200 group-hover:scale-125 group-hover:bg-primary sm:h-1.5 sm:w-1.5"></div>
                  <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground sm:text-sm">
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

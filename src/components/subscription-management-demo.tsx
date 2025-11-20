"use client";

import { SubscriptionManagement } from "@/components/billingsdk/subscription-management";
import { type CurrentPlan, plans } from "@/lib/billingsdk-config";

export function SubscriptionManagementDemo() {
  const currentPlan: CurrentPlan = {
    plan: plans[1],
    type: "monthly",
    price: "$121",
    nextBillingDate: "January 15, 2025",
    paymentMethod: "Credit Card",
    status: "active",
  };
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <SubscriptionManagement
        className="mx-auto max-w-2xl"
        currentPlan={currentPlan}
        updatePlan={{
          currentPlan: currentPlan.plan,
          plans: plans,
          onPlanChange: (planId) => {
            console.log("update plan", planId);
          },
          triggerText: "Update Plan",
        }}
        cancelSubscription={{
          title: "Cancel Subscription",
          description: "Are you sure you want to cancel your subscription?",
          leftPanelImageUrl:
            "https://img.freepik.com/free-vector/abstract-paper-cut-shape-wave-background_474888-4649.jpg?semt=ais_hybrid&w=740&q=80",
          plan: currentPlan.plan,
          warningTitle: "You will lose access to your account",
          warningText:
            "If you cancel your subscription, you will lose access to your account and all your data will be deleted.",
          onCancel: async (planId) => {
            console.log("cancel subscription", planId);
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(void 0);
              }, 1000);
            });
          },
          onKeepSubscription: async (planId) => {
            console.log("keep subscription", planId);
          },
        }}
      />
    </div>
  );
}

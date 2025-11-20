"use client";

import { CancelSubscriptionCard } from "@/components/billingsdk/cancel-subscription-card";
import { plans } from "@/lib/billingsdk-config";

export function CancelSubscriptionCardDemo() {
  return (
    <div className="flex w-full flex-col">
      <CancelSubscriptionCard
        title="We're sorry to see you go..."
        description={`Before you cancel, we hope you'll consider upgrading to a ${plans[1].title} plan again.`}
        plan={plans[1]}
        leftPanelImageUrl="https://framerusercontent.com/images/GWE8vop9hubsuh3uWWn0vyuxEg.webp"
        warningTitle="You will lose access to your account"
        warningText="If you cancel your subscription, you will lose access to your account and all your data will be deleted."
        keepButtonText={`Keep My ${plans[1].title} Plan`}
        continueButtonText="Continue with Cancellation"
        finalTitle="Final Step - Confirm Cancellation"
        finalSubtitle="This action will immediately cancel your subscription"
        finalWarningText="You'll lose access to all Pro features and your data will be permanently deleted after 30 days."
        goBackButtonText="Wait, Go Back"
        confirmButtonText="Yes, Cancel My Subscription"
        onCancel={async (planId) => {
          console.log("Cancelling subscription for plan:", planId);
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(void 0);
            }, 1000);
          });
        }}
        onKeepSubscription={async (planId) => {
          console.log("Keeping subscription for plan:", planId);
        }}
        className="max-w-4xl"
      />
    </div>
  );
}

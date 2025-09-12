"use client";

import { CancelSubscriptionCardTwo } from "@/components/billingsdk/cancel-subscription-card-two";
import { plans } from "@/lib/billingsdk-config";


export function CancelSubscriptionCardTwoDemo() {
    return(
        <div className="flex flex-col w-full">
    <CancelSubscriptionCardTwo
    title="We're sorry to see you go..."
    description={`Before you cancel, we hope you'll consider upgrading to a ${plans[1].title} plan again.`}
    plan={plans[1]}
    warningText="If you cancel your subscription, you will lose access to your account and all your data will be deleted."
    supportText="Need help? Our team is here to assist you."
    supportLink="https://chatgpt.com/"
    finalTitle="Final Step - Confirm Cancellation"
    finalSubtitle="You'll lose access to all Pro features and your data will be permanently deleted after 30 days."
    keepButtonText={`Keep My ${plans[1].title} Plan`}
    continueButtonText="Continue with Cancellation"
    goBackButtonText="Wait, Go Back"
    confirmButtonText="Yes, Cancel My Subscription"
    onCancel={async (planId) => {
        console.log('cancel subscription', planId);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(void 0);
            }, 2000); 
        });
    }}
    onKeepSubscription={async (planId) => {
        console.log('keep subscription', planId);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(void 0);
            }, 1000);
        });
    }}
    className="max-w-4xl"
/>
        </div>
    )
}
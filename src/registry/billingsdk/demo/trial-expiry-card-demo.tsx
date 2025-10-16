"use client";

import { TrialExpiryCard } from "@/components/billingsdk/trial-expiry-card";

export default function TrialExpiryCardDemo() {
  // Set trial to expire in 5 days
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 5);

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[500px] rounded-lg bg-background border-2 p-6">
      <TrialExpiryCard
        trialEndDate={trialEndDate}
        onUpgrade={() => {
          console.log("Upgrade clicked");
        }}
        features={[
          "Unlimited API requests",
          "Advanced analytics dashboard",
          "Priority email support",
          "Custom domain integration",
        ]}
        className="max-w-md w-full"
      />
    </div>
  );
}


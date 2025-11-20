"use client";

import { LimitedOfferDialog } from "@/components/billingsdk/limited-offer-dialog";

// Sample offer data
const sampleOffer = {
  id: "limited-offer-dialog",
  title: "Special Offer",
  description: "Limited time deal",
  discount: "50% OFF",
  features: [
    { name: "50% off your first month" },
    { name: "Valid until December 31, 2024" },
    { name: "First 100 users only" },
  ],
};

export function LimitedOfferDialogDemo() {
  const handleClaimOffer = async (offerId: string) => {
    console.log("Claiming offer:", offerId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Offer claimed successfully!");
  };

  const handleDeclineOffer = async (offerId: string) => {
    console.log("Declining offer:", offerId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert("Offer declined. You can always come back later!");
  };

  const handleDialogClose = () => {
    console.log("Dialog closed");
  };

  return (
    <div className="mx-auto flex min-h-[300px] flex-1 flex-col justify-center p-4 text-center">
      <LimitedOfferDialog
        title="🔥 Limited Time Offer!"
        description="Grab this deal before it's gone"
        offer={sampleOffer}
        triggerButtonText="Open Offer Dialog"
        warningTitle="Don't miss out!"
        warningText="This exclusive offer won't last long. Claim it now before it's gone forever."
        claimButtonText="👉 Claim Offer Now"
        declineButtonText="No thanks, I'll pay full price"
        onClaimOffer={handleClaimOffer}
        onDeclineOffer={handleDeclineOffer}
        onDialogClose={handleDialogClose}
        className="w-auto"
      />
    </div>
  );
}

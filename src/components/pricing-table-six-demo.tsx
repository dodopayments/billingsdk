"use client";

import { PricingTableSix } from "@/components/billingsdk/pricing-table-six";
import { plans } from "@/lib/billingsdk-config";

export function PricingTableSixDemo() {
  return (
    <>
      <PricingTableSix
        plans={plans}
        title="Image-Enhanced Pricing Cards"
        description="Hover to flip and explore features with comprehensive image support and theme-aware gradients"
        onPlanSelect={(planId) => console.log("Selected plan:", planId)}
        size="large" // small, medium, large
        theme="minimal" // minimal or classic
        className="w-full"
        imageHeight={200} // Custom image height in pixels
        showFeatureTable={true} // Show feature comparison table
        // backgroundImages={{
        //   'starter': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&h=400',
        //   'pro': 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&h=400',
        //   'enterprise': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&h=400'
        // }} // Optional: Add custom images (PNG, JPG, JPEG, WebP, GIF, BMP, TIFF)
      />
    </>
  );
}

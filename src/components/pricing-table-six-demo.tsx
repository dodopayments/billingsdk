"use client";

import { PricingTableSix } from "@/components/billingsdk/pricing-table-six";
import { plans } from "@/lib/billingsdk-config";

export function PricingTableSixDemo() {
  return (
    <>
      <PricingTableSix
        plans={plans}
        title="Interactive Pricing Cards"
        description="Hover over any card to flip and reveal detailed features while keeping pricing intact"
        onPlanSelect={(planId) => console.log("Selected plan:", planId)}
        size="large" // small, medium, large
        theme="minimal" // minimal or classic
        className="w-full"
        imageHeight={200} // Custom image height in pixels
        showFeatureTable={true} // Show feature comparison table
        backgroundImages={{
          starter:
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><radialGradient id="grad1" cx="30%" cy="30%" r="60%"><stop offset="0%" style="stop-color:%23f59e0b;stop-opacity:0.8" /><stop offset="50%" style="stop-color:%23f97316;stop-opacity:0.6" /><stop offset="100%" style="stop-color:%23dc2626;stop-opacity:0.4" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad1)" /><circle cx="80" cy="60" r="40" fill="%23fbbf24" opacity="0.4" /><circle cx="320" cy="140" r="60" fill="%23fb923c" opacity="0.3" /></svg>',
          pro: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><radialGradient id="grad2" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23a855f7;stop-opacity:0.8" /><stop offset="50%" style="stop-color:%233b82f6;stop-opacity:0.6" /><stop offset="100%" style="stop-color:%236366f1;stop-opacity:0.4" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad2)" /><circle cx="100" cy="80" r="60" fill="%23ec4899" opacity="0.3" /><circle cx="300" cy="120" r="80" fill="%23f59e0b" opacity="0.2" /></svg>',
          enterprise:
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><radialGradient id="grad3" cx="70%" cy="70%" r="50%"><stop offset="0%" style="stop-color:%2306b6d4;stop-opacity:0.8" /><stop offset="50%" style="stop-color:%230891b2;stop-opacity:0.6" /><stop offset="100%" style="stop-color:%230e7490;stop-opacity:0.4" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad3)" /><circle cx="120" cy="100" r="70" fill="%2322d3ee" opacity="0.3" /><circle cx="280" cy="80" r="50" fill="%2367e8f9" opacity="0.4" /></svg>',
        }}
      />
    </>
  );
}

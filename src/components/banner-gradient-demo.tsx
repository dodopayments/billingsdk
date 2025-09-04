"use client";

import { Banner } from "@/components/billingsdk/banner";
import { useState } from "react";
import { Button } from "./ui/button";
export const gradientColors = [
  "rgba(0,149,255,0.56)",
  "rgba(231,77,255,0.77)",
  "rgba(255,0,0,0.73)",
  "rgba(131,255,166,0.66)",
];
export default function BannerGradientDemo() {
  const [showBanner, setShowBanner] = useState(false);

  return (
    <div className="w-full space-y-8">
      {/* Default Variant */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Default Banner</h3>
        <Banner
          title="🌈 Experience the magic of gradients!"
          description="Beautiful animated gradient background with custom colors"
          buttonText="Start Free Trial"
          buttonLink="https://example.com/signup"
          variant="default"
          gradientColors={gradientColors}
          className="w-full"
        />
      </div>

      {/* Minimal Variant */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Minimal Banner</h3>
        <Banner
          title="🎉 Start your free trial today!"
          description="Get 30 days free access"
          variant="minimal"
          gradientColors={gradientColors}
        />
      </div>

      {/* Interactive Popup Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Popup Banner</h3>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setShowBanner(true)}>
            Show Gradient Banner
          </Button>
        </div>
        {showBanner && (
          <Banner
            title="🎉 Start your free trial today!"
            description="Get 30 days free access to all premium features"
            variant="popup"
            gradientColors={gradientColors}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { Banner } from "@/components/billingsdk/banner";
import { useState } from "react";
import { Button } from "./ui/button";

export default function FreeTrialBannerDemoThree() {
  const [showBanner, setShowBanner] = useState(false);
  return (
    <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center gap-4 rounded-lg border">
      {showBanner && (
        <Banner
          title="🎉 Start your free trial today!"
          description="Get 30 days free access to all premium features"
          variant="popup" // default, minimal, popup
        />
      )}
      <div className="flex h-full w-full flex-row items-center justify-center gap-4">
        <Button onClick={() => setShowBanner(true)}>Show Banner</Button>
      </div>
    </div>
  );
}

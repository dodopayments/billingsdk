"use client";

import { BillingSettingsThree } from "@/components/billingsdk/billing-settings-three";
import { BillingProvider } from "@/lib/i18n-provider";

export default function BillingSettingsThreeDemo() {
  return (
    <BillingProvider>
      <div className="bg-muted/20 flex min-h-screen w-full items-center justify-center p-6">
        <BillingSettingsThree theme="classic" />
      </div>
    </BillingProvider>
  );
}

"use client";

import { BillingSettingsThree } from "@/components/billingsdk/billing-settings-three";
import { BillingProvider } from "@/lib/i18n-provider";

export default function BillingSettingsThreeDemo() {
    return (
        <BillingProvider>
            <div className="w-full p-6 bg-muted/20 min-h-screen flex items-center justify-center">
                <BillingSettingsThree theme="classic" />
            </div>
        </BillingProvider>
    );
}

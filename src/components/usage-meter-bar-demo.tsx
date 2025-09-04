'use client'

import { UsageMeterBar } from "@/components/billingsdk/usage-meter-bar";

export default function UsageMeterBarDemo() {

  return (
    <div className="flex flex-col gap-4 mx-auto w-full">
      <UsageMeterBar
            title="Storage"
            currentUsage={45.2}
            maxUsage={100}
            unit="GB"
            description="Cloud storage capacity"
          />
    </div>

  );
}

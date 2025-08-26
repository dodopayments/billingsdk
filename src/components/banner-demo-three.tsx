"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Banner } from "@/registry/billingsdk/banner"

export default function FreeTrialBannerDemoThree() {
    const [showBanner, setShowBanner] = useState(false)
    return (
        <div className="w-full h-full flex flex-col gap-4 min-h-[500px] justify-center items-center border rounded-lg">
            {showBanner && (
                <Banner
                    title="🎉 Start your free trial today!"
                    description="Get 30 days free access to all premium features"
                    variant="popup" // default, minimal, popup
                />
            )}
            <div className="w-full h-full justify-center items-center flex flex-row gap-4">
                <Button onClick={() => setShowBanner(true)}>Show Banner</Button>
            </div>
        </div>

    )
}

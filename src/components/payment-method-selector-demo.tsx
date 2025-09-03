"use client"

import { PaymentMethodSelector } from "@/components/billingsdk/payment-method-selector"

export function PaymentMethodSelectorDemo() {
    return (
        <div className="w-full max-w-md mx-auto min-h-[600px] flex items-center justify-center">
            <PaymentMethodSelector
                onProceed={(method, data) => {
                    console.log("Demo: Proceed with:", method, data)
                }}
            />
        </div>
    )
}



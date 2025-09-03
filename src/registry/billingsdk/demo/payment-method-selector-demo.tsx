import { PaymentMethodSelector } from "@/components/billingsdk/payment-method-selector"

export function PaymentMethodSelectorDemo() {
    return (
        <div className="w-full h-full flex flex-col gap-6 min-h-[500px] rounded-lg overflow-hidden bg-background-secondary border-2">
            <div className="flex flex-1 flex-col justify-center text-center">
                <PaymentMethodSelector
                    onProceed={(method, data) => {
                        console.log("Selected method:", method)
                        console.log("Form data:", data)
                    }}
                />
            </div>
        </div>
    )
}

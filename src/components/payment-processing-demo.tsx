"use client";

import { useState } from "react";
import PaymentProcessing from "@/registry/billingsdk/payment-processing";
import { Button } from "@/components/ui/button";

export function PaymentProcessingDemo() {
    const [loading, setLoading] = useState(false);
    const handleProcessing = async () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setLoading(false);
                resolve();
            }, 8000);
        });
    };
    const onClickHandler = async () => {
        setLoading(true);
        await handleProcessing();
    };

    return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
            <Button
                onClick={async () => await onClickHandler()}
                className={`${loading ? "hidden" : "block"}`}
            >
                Pay now!
            </Button>
            <PaymentProcessing status={loading} />
        </div>
    );
}
"use client";

import { useState } from "react";
import { PaymentSuccessDialog } from "@/components/billingsdk/payment-success-dialog";
import { Card, CardContent } from "@/components/ui/card";

export function PaymentSuccessDialogDemo() {
  const [, setLastAction] = useState<string>("");
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-muted/40">
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="text-muted-foreground text-sm">
          Click the button to preview the success dialog.
        </div>
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen(true)}
        >
          Simulate Payment Success
        </button>
        <PaymentSuccessDialog
          open={open}
          onOpenChange={setOpen}
          price="29"
          currencySymbol="$"
          productName="Pro Plan (Monthly)"
          proceedButtonText="Go to Dashboard"
          backButtonText="Back to Pricing"
          onProceed={() => setLastAction("proceed")}
          onBack={() => setLastAction("back")}
        />
      </CardContent>
    </Card>
  );
}

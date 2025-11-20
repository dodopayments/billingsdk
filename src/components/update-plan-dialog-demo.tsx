"use client";

import { UpdatePlanDialog } from "@/components/billingsdk/update-plan-dialog";
import { plans } from "@/lib/billingsdk-config";

export function UpdatePlanDialogDemo() {
  return (
    <div className="mx-auto flex min-h-[300px] flex-1 flex-col justify-center p-4 text-center">
      <UpdatePlanDialog
        currentPlan={plans[1]}
        plans={plans}
        onPlanChange={(planId) => {
          console.log(planId);
        }}
        triggerText="Update Plan"
      />
    </div>
  );
}

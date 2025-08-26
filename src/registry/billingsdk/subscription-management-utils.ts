import { CurrentPlan } from "@/lib/billingsdk-config"
import { CancelSubscriptionDialogProps } from "./cancel-subscriptiondialog"
import { UpdatePlanDialogProps } from "./update-plan-dialog"

export interface SubscriptionManagementProps {
    className?: string
    currentPlan: CurrentPlan
    cancelSubscription: CancelSubscriptionDialogProps
    updatePlan: UpdatePlanDialogProps
}
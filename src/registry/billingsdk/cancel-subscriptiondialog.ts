import { type Plan } from "@/lib/billingsdk-config";

export interface CancelSubscriptionDialogProps {
    title: string;
    description: string;
    plan: Plan;
    triggerButtonText?: string;
    leftPanelImageUrl?: string;
    warningTitle?: string;
    warningText?: string;
    keepButtonText?: string;
    continueButtonText?: string;
    finalTitle?: string;
    finalSubtitle?: string;
    finalWarningText?: string;
    goBackButtonText?: string;
    confirmButtonText?: string;
    onCancel: (planId: string) => Promise<void> | void;
    onKeepSubscription?: (planId: string) => Promise<void> | void;
    onDialogClose?: () => void;
    className?: string;
}

export const getDialogContainerClass = (leftPanelImageUrl?: string, className?: string) => {
    const baseClasses = "flex flex-col md:flex-row p-0 overflow-hidden text-foreground w-[95%] md:w-[100%]"
    const maxWidthClass = leftPanelImageUrl ? "sm:max-w-[1000px]" : "sm:max-w-[500px]"
    
    return `${baseClasses} ${maxWidthClass} ${className || ""}`
}

export const getDefaultDialogTexts = () => {
    return {
        triggerButton: "Cancel Subscription",
        keepButton: "Keep My Subscription", 
        continueButton: "Continue Cancellation",
        finalTitle: "Final Confirmation",
        finalSubtitle: "Are you sure you want to cancel your subscription?",
        finalWarning: "This action cannot be undone and you'll lose access to all premium features.",
        goBackButton: "Go Back",
        confirmButton: "Yes, Cancel Subscription",
        processingText: "Processing...",
        cancellingText: "Cancelling..."
    }
}

export const formatDialogPlanPrice = (price?: string, currency?: string) => {
    if (!price) return "Price not available"
    if (!currency) return `${price}/monthly`
    
    const numericPrice = parseFloat(price)
    return numericPrice >= 0 ? `${currency}${price}/monthly` : `${price}/monthly`
}
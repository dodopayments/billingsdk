import { type Plan } from "@/lib/billingsdk-config";

export interface CancelSubscriptionCardProps {
    title: string;
    description: string;
    plan: Plan;
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
    className?: string;
}

export const getCancelCardContainerClass = (leftPanelImageUrl?: string, className?: string) => {
    const baseClasses = "flex flex-col md:flex-row p-0 overflow-hidden w-full"
    const maxWidthClass = leftPanelImageUrl ? "sm:max-w-[1000px]" : "sm:max-w-[500px]"
    
    return `${baseClasses} ${maxWidthClass} ${className || ""}`
}

export const getDefaultCancelCardTexts = () => {
    return {
        keepButton: "Keep My Subscription",
        continueButton: "Continue Cancellation",
        finalTitle: "Final Confirmation", 
        finalSubtitle: "Are you sure you want to cancel your subscription?",
        finalWarning: "This action cannot be undone and you'll lose access to all premium features.",
        goBackButton: "Go Back",
        confirmButton: "Yes, Cancel Subscription"
    }
}
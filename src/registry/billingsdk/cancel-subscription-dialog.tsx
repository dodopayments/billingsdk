"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";
import { X, Circle } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/lib/themes";

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

export function CancelSubscriptionDialog({
  title,
  description,
  plan,
  triggerButtonText,
  leftPanelImageUrl,
  warningTitle,
  warningText,
  keepButtonText,
  continueButtonText,
  finalTitle,
  finalSubtitle,
  finalWarningText,
  goBackButtonText,
  confirmButtonText,
  onCancel,
  onKeepSubscription,
  onDialogClose,
  className,
}: CancelSubscriptionDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTheme, previewDarkMode } = useTheme();
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode);

  const handleContinueCancellation = () => {
    setShowConfirmation(true);
    setError(null);
  };

  const handleConfirmCancellation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onCancel(plan.id);
      handleDialogClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeepSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (onKeepSubscription) {
        await onKeepSubscription(plan.id);
      }
      handleDialogClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to keep subscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setShowConfirmation(false);
    setError(null);
    setIsLoading(false);
    onDialogClose?.();
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
    setError(null);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        handleDialogClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setIsOpen(true);
        } else {
          handleDialogClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          {triggerButtonText || "Cancel Subscription"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "text-foreground flex w-[95%] flex-col overflow-hidden p-0 sm:max-w-[1000px] md:w-[100%] md:flex-row",
          leftPanelImageUrl ? "" : "sm:max-w-[500px]",
          className,
        )}
        style={themeStyles}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogClose
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          onClick={handleDialogClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {leftPanelImageUrl && (
          <div className="relative hidden min-h-[500px] w-full overflow-hidden md:block md:w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leftPanelImageUrl}
              alt="Cancel Subscription"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="via-background/30 to-background/90 absolute inset-0 hidden bg-gradient-to-r from-transparent dark:block"></div>
            <div className="from-background/80 to-background/20 absolute inset-0 hidden bg-gradient-to-t via-transparent dark:block"></div>
          </div>
        )}
        <div
          className={cn(
            "flex flex-col gap-4 px-4 py-6",
            leftPanelImageUrl ? "w-full md:w-1/2" : "w-full",
          )}
        >
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              {description}
            </p>
            {error && (
              <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Plan Details */}
          {!showConfirmation && (
            <div className="bg-muted/50 flex flex-col gap-4 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">
                    {plan.title} Plan
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Current subscription
                  </span>
                </div>
                <Badge variant="secondary">
                  {parseFloat(plan.monthlyPrice) >= 0
                    ? `${plan.currency}${plan.monthlyPrice}/monthly`
                    : `${plan.monthlyPrice}/monthly`}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Circle className="fill-primary text-primary h-2 w-2" />
                    <span className="text-muted-foreground text-sm">
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Section */}
          {!showConfirmation && (warningTitle || warningText) && (
            <div className="bg-muted/30 border-border rounded-lg border p-4">
              {warningTitle && (
                <h3 className="text-foreground mb-2 font-semibold">
                  {warningTitle}
                </h3>
              )}
              {warningText && (
                <p className="text-muted-foreground text-sm">{warningText}</p>
              )}
            </div>
          )}
          {/* Action Buttons */}
          {!showConfirmation ? (
            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handleKeepSubscription}
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : keepButtonText || "Keep My Subscription"}
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleContinueCancellation}
                disabled={isLoading}
              >
                {continueButtonText || "Continue Cancellation"}
              </Button>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <h3 className="text-foreground mb-2 font-semibold">
                  {finalTitle || "Final Confirmation"}
                </h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  {finalSubtitle ||
                    "Are you sure you want to cancel your subscription?"}
                </p>
                <p className="text-destructive text-sm">
                  {finalWarningText ||
                    "This action cannot be undone and you'll lose access to all premium features."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleGoBack}
                  disabled={isLoading}
                >
                  {goBackButtonText || "Go Back"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirmCancellation}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Cancelling..."
                    : confirmButtonText || "Yes, Cancel Subscription"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

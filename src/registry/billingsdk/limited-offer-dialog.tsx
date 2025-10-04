"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/lib/themes";

// Plan interface for type safety
export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  features: Array<{ name: string; icon?: string; iconColor?: string }>;
}

// Component props interface
export interface LimitedOfferDialogProps {
  title?: string;
  description?: string;
  offer?: Offer;
  triggerButtonText?: string;
  warningTitle?: string;
  warningText?: string;
  claimButtonText?: string;
  declineButtonText?: string;
  onClaimOffer?: (offerId: string) => Promise<void> | void;
  onDeclineOffer?: (offerId: string) => Promise<void> | void;
  onDialogClose?: () => void;
  className?: string;
}

// Default offer object
const defaultOffer: Offer = {
  id: "limited-offer-dialog",
  title: "Special Offer",
  description: "Limited time deal",
  discount: "50% OFF",
  features: [
    { name: "50% off your first month" },
    { name: "Valid until December 31, 2024" },
    { name: "First 100 users only" }
  ]
};

export function LimitedOfferDialog({
  title = "🔥 Limited Time Offer!",
  description = "Grab this deal before it's gone",
  offer = defaultOffer,
  triggerButtonText = "Open Offer Dialog",
  warningTitle = "Don't miss out!",
  warningText = "This exclusive offer won't last long. Claim it now before it's gone forever.",
  claimButtonText = "👉 Claim Offer Now",
  declineButtonText = "No thanks, I'll pay full price",
  onClaimOffer,
  onDeclineOffer,
  onDialogClose,
  className,
}: LimitedOfferDialogProps) {
  // State management
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Theme integration
  const { currentTheme, previewDarkMode } = useTheme();
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode);

  // Event handlers
  const handleClaimOffer = async () => {
    if (!onClaimOffer) {
      console.log("Claim offer clicked");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onClaimOffer(offer.id);
      setIsOpen(false);
      onDialogClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim offer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineOffer = async () => {
    if (!onDeclineOffer) {
      console.log("Decline offer clicked");
      setIsOpen(false);
      onDialogClose?.();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onDeclineOffer(offer.id);
      setIsOpen(false);
      onDialogClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setError(null);
    onDialogClose?.();
  };

  // Keyboard navigation (ESC key)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
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
        <Button variant="outline" className={className}>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-[calc(100vw-2rem)] sm:max-w-lg p-0 gap-0", className)} style={themeStyles}>
        <div className="space-y-6 p-6">
          {/* Dialog Title for accessibility */}
          <DialogTitle className="sr-only">
            {title} - {description}
          </DialogTitle>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>

          {/* Offer Card */}
          <div className="bg-muted rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  {offer.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {offer.description}
                </p>
              </div>
              <Badge variant="secondary" className="font-semibold text-foreground">
                {offer.discount}
              </Badge>
            </div>

            <div className="space-y-3">
              {offer.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Circle className="w-2 h-2 fill-current text-foreground" />
                  <span className="text-sm text-foreground">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Section */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-destructive">
              {warningTitle}
            </h4>
            <p className="text-sm text-destructive/80">
              {warningText}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleClaimOffer}
              disabled={isLoading}
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background"
            >
              {isLoading ? "Processing..." : claimButtonText}
            </Button>
            <Button
              onClick={handleDeclineOffer}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              {declineButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

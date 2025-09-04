"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface BannerProps {
  variant?: "default" | "minimal" | "popup" | "destructive";
  title: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonLink?: string;
  dismissable?: boolean;
  className?: string;
  autoDismiss?: number; // in ms
  onDismiss?: () => void;
  gradientColors?: string[];
}

export function Banner({
  variant = "default",
  title,
  description,
  buttonText,
  buttonIcon,
  buttonLink,
  dismissable = true,
  className,
  autoDismiss,
  onDismiss,
  gradientColors,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible && autoDismiss) {
      const timer = setTimeout(() => handleDismiss(), autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getVariantStyles = () => {
    const hasGradient = gradientColors && gradientColors.length > 0;

    switch (variant) {
      case "minimal":
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-card/60"
            : "sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row md:items-start items-center justify-center px-3 sm:px-4 py-2 gap-2 sm:gap-4 max-w-2xl",
          content:
            "flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2",
          title: "text-sm font-medium text-card-foreground leading-tight",
          description: "text-xs text-muted-foreground sm:ml-2",
          actions: "flex items-center justify-center md:justify-start gap-2 sm:self-auto",
        };
      case "popup":
        return {
          container: hasGradient
            ? "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-[90%] sm:w-auto border border-border rounded-lg shadow-lg backdrop-blur"
            : "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-[90%] sm:w-auto bg-popover border border-border rounded-lg shadow-lg backdrop-blur",
          wrapper:
            "relative flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 gap-3 sm:gap-4",
          content:
            "flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1",
          title: "text-sm font-medium text-popover-foreground leading-snug",
          description: "text-xs text-muted-foreground",
          actions:
            "flex items-center justify-center md:justify-start gap-2 sm:self-auto flex-shrink-0 pr-8 md:pr-0",
        };
      case "destructive":
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b border-destructive/20 backdrop-blur supports-[backdrop-filter]:bg-destructive/10"
            : "sticky top-0 z-50 w-full border-b bg-destructive text-destructive-foreground shadow-sm backdrop-blur",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row md:items-start items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4",
          content:
            "flex flex-col sm:flex-row md:items-start items-center gap-2 w-full",
          title: hasGradient
            ? "text-sm font-medium text-destructive leading-tight"
            : "text-sm font-medium text-destructive-foreground leading-tight",
          description: hasGradient
            ? "text-xs text-destructive/80"
            : "text-xs text-destructive-foreground/80",
          actions:
            "flex items-center justify-center md:justify-start gap-2 sm:self-auto pr-8 md:pr-0",
        };
      default:
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b text-primary-foreground shadow-sm text-left backdrop-blur"
            : "sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm text-left backdrop-blur",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row md:items-start items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4",
          content:
            "flex flex-col sm:flex-row md:items-start items-center gap-2 w-full",
          title: hasGradient
            ? "text-sm font-medium text-foreground leading-tight"
            : "text-sm font-medium text-primary-foreground leading-tight",
          description: hasGradient
            ? "text-xs text-foreground/80"
            : "text-xs text-primary-foreground/80",
          actions:
            "flex items-center justify-center md:justify-start gap-2 sm:self-auto pr-8 md:pr-0",
        };
    }
  };

  const styles = getVariantStyles();

  const getGradientBackground = () => {
    if (!gradientColors || gradientColors.length === 0) return null;

    // Use the exact gradient from the example or custom colors with proper spacing
    let gradientStops;
    if (gradientColors.length === 4) {
      // Match the original example exactly
      gradientStops = `${gradientColors[0]} 0%, ${gradientColors[1]} 12.5%, ${gradientColors[2]} 25%, ${gradientColors[3]} 37.5%, ${gradientColors[0]} 50%`;
    } else {
      // For other numbers of colors, use equal spacing
      gradientStops = gradientColors
        .map((color, index) => {
          const percentage = (index / gradientColors.length) * 100;
          return `${color} ${percentage}%`;
        })
        .join(", ");
    }

    // Use consistent filter for better visibility
    const filterValue = "saturate(1.8) brightness(1.2)";

    return (
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          maskImage:
            "linear-gradient(to bottom, white, transparent), radial-gradient(circle at top center, white, transparent)",
          maskComposite: "intersect",
          animation: "fd-moving-banner 30s linear infinite",
          backgroundImage: `repeating-linear-gradient(70deg, ${gradientStops})`,
          backgroundSize: "200% 100%",
          filter: filterValue,
        }}
      />
    );
  };

  const getAnimationProps = () => {
    switch (variant) {
      case "popup":
        return {
          initial: { opacity: 0, scale: 0.95, y: -20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -20 },
        };
      default:
        return {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
        };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...getAnimationProps()}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(styles.container, className)}
        >
          {getGradientBackground()}
          <div className={styles.wrapper}>
            {/* Content */}
            <div className={styles.content}>
              <div
                className={
                  variant === "minimal"
                    ? "flex flex-col md:flex-row gap-0.5 md:gap-2"
                    : ""
                }
              >
                <p className={styles.title}>{title}</p>
                {description && (
                  <p className={styles.description}>{description}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {buttonText && variant !== "minimal" && (
                <Button
                  variant={variant === "default" ? "secondary" : "default"}
                  size="sm"
                  onClick={() => window.open(buttonLink, "_blank")}
                  className={"h-8"}
                >
                  {buttonIcon && (
                    <div className="flex-shrink-0 mr-1">{buttonIcon}</div>
                  )}
                  {buttonText}
                </Button>
              )}
            </div>

            {/* Close button (always top-right) */}
            {dismissable && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8",
                  gradientColors && gradientColors.length > 0
                    ? "hover:bg-foreground/20 text-foreground"
                    : variant === "default" &&
                        "hover:bg-primary-foreground/20 text-primary-foreground",
                  variant === "popup" &&
                    !gradientColors &&
                    "hover:bg-accent text-popover-foreground",
                  variant === "minimal" &&
                    !gradientColors &&
                    "hover:bg-accent text-card-foreground"
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add CSS keyframes for the moving banner animation
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fd-moving-banner {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogCustom = DialogPrimitive.Root;

const DialogCustomTrigger = DialogPrimitive.Trigger;

const DialogCustomPortal = DialogPrimitive.Portal;

const DialogCustomClose = DialogPrimitive.Close;

const DialogCustomOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogCustomOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogCustomContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  gradientColors?: string[];
  showCloseButton?: boolean;
}

const DialogCustomContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogCustomContentProps
>(({ className, children, gradientColors, showCloseButton = true, ...props }, ref) => {
  const getGradientBackground = () => {
    if (!gradientColors || gradientColors.length === 0) return null;

    let gradientStops;
    if (gradientColors.length === 4) {
      gradientStops = `${gradientColors[0]} 0%, ${gradientColors[1]} 12.5%, ${gradientColors[2]} 25%, ${gradientColors[3]} 37.5%, ${gradientColors[0]} 50%`;
    } else {
      gradientStops = gradientColors
        .map((color, index) => {
          const percentage = (index / gradientColors.length) * 100;
          return `${color} ${percentage}%`;
        })
        .join(", ");
    }

    return (
      <div
        className="absolute inset-0 z-[-1] rounded-lg"
        style={{
          maskImage:
            "linear-gradient(to bottom, white, transparent), radial-gradient(circle at top center, white, transparent)",
          maskComposite: "intersect",
          animation: "fd-moving-banner 30s linear infinite",
          backgroundImage: `repeating-linear-gradient(70deg, ${gradientStops})`,
          backgroundSize: "200% 100%",
          filter: "saturate(1.8) brightness(1.2)",
        }}
      />
    );
  };

  return (
    <DialogCustomPortal>
      <DialogCustomOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          gradientColors && gradientColors.length > 0 && "relative overflow-hidden backdrop-blur",
          className
        )}
        {...props}
      >
        {getGradientBackground()}
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogCustomPortal>
  );
});
DialogCustomContent.displayName = DialogPrimitive.Content.displayName;

const DialogCustomHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogCustomHeader.displayName = "DialogCustomHeader";

const DialogCustomFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogCustomFooter.displayName = "DialogCustomFooter";

const DialogCustomTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogCustomTitle.displayName = DialogPrimitive.Title.displayName;

const DialogCustomDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogCustomDescription.displayName = DialogPrimitive.Description.displayName;

export {
  DialogCustom,
  DialogCustomPortal,
  DialogCustomOverlay,
  DialogCustomTrigger,
  DialogCustomClose,
  DialogCustomContent,
  DialogCustomHeader,
  DialogCustomFooter,
  DialogCustomTitle,
  DialogCustomDescription,
};

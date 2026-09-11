"use client";

import * as React from "react";
import { Loader2, Shield, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface PaymentProcessingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Heading at the top of the card.
   * @default "Processing Payment"
   */
  title?: string;

  /**
   * Supporting line under the title.
   * @default "This may take a few moments"
   */
  description?: string;

  /**
   * Trust marker rendered beside the process label.
   * @default Shield
   */
  icon?: LucideIcon;

  /**
   * Short reassurance label beside the icon.
   * @default "Secure Transaction"
   */
  processLabel?: string;

  /**
   * Warning shown in the footer.
   * @default "Please do not close this window"
   */
  warning?: string;
}

export const PaymentProcessing = React.forwardRef<
  HTMLDivElement,
  PaymentProcessingProps
>(
  (
    {
      className,
      title = "Processing Payment",
      description = "This may take a few moments",
      icon: Icon = Shield,
      processLabel = "Secure Transaction",
      warning = "Please do not close this window",
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn("w-full max-w-md text-center", className)}
        {...props}
      >
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Loader2 className="text-primary h-12 w-12 animate-spin motion-reduce:animate-none" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-center gap-2 text-sm">
            <Icon className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">{processLabel}</span>
          </div>
          <Separator />
        </CardContent>

        <CardFooter>
          <p className="text-muted-foreground w-full text-xs">{warning}</p>
        </CardFooter>
      </Card>
    );
  },
);

PaymentProcessing.displayName = "PaymentProcessing";

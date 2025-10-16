"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface TrialExpiryCardProps {
  trialEndDate?: Date | string | number;
  daysRemaining?: number;
  onUpgrade?: () => void | Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  upgradeButtonText?: string;
  features?: string[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeRemaining = (endDate: Date | string | number): TimeRemaining => {
  try {
    let end: Date;
    if (typeof endDate === "string") {
      end = new Date(endDate);
    } else if (typeof endDate === "number") {
      end = new Date(endDate);
    } else if (endDate instanceof Date) {
      end = endDate;
    } else {
      // Fallback for any other type
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Validate that we have a valid date
    if (isNaN(end.getTime())) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  } catch (error) {
    console.error("Error calculating time remaining:", error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};

export function TrialExpiryCard({
  trialEndDate,
  daysRemaining: propDaysRemaining,
  onUpgrade,
  className,
  title = "Trial Period",
  description,
  upgradeButtonText = "Upgrade Now",
  features = ["Unlimited projects", "Priority support", "Advanced analytics", "Custom integrations"],
}: TrialExpiryCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    if (trialEndDate) {
      return calculateTimeRemaining(trialEndDate);
    }
    return { days: propDaysRemaining || 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    if (!trialEndDate) return;

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(trialEndDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [trialEndDate]);

  const daysRemaining = propDaysRemaining ?? timeRemaining.days;

  const handleUpgrade = async () => {
    if (onUpgrade) {
      setIsLoading(true);
      try {
        await onUpgrade();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusBadge = () => {
    if (daysRemaining <= 0) return <Badge variant="destructive">Expired</Badge>;
    if (daysRemaining <= 2) return <Badge variant="destructive">Expiring Soon</Badge>;
    if (daysRemaining <= 6) return <Badge variant="secondary">Active</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {getStatusBadge()}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown Timer */}
        {trialEndDate && daysRemaining > 0 && (
          <div 
            className="rounded-lg border bg-muted/30 p-4"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Trial time remaining: ${timeRemaining.days} days, ${timeRemaining.hours} hours, ${timeRemaining.minutes} minutes, ${timeRemaining.seconds} seconds`}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <TimeUnit value={timeRemaining.days} label="Days" />
              <span className="text-muted-foreground">:</span>
              <TimeUnit value={timeRemaining.hours} label="Hours" />
              <span className="text-muted-foreground">:</span>
              <TimeUnit value={timeRemaining.minutes} label="Min" />
              <span className="text-muted-foreground">:</span>
              <TimeUnit value={timeRemaining.seconds} label="Sec" />
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Included with upgrade</h3>
          <div className="space-y-2">
            {features.slice(0, 4).map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        {onUpgrade && (
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processing..." : upgradeButtonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl sm:text-3xl font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

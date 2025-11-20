"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useSpring, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import type React from "react";

export interface Usage {
  name: string;
  usage: number;
  limit: number;
}

export interface UsageMeterProps {
  usage: Usage[];
  className?: string;
  variant?: "linear" | "circle";
  size?: "sm" | "md" | "lg";
  title?: string;
  description?: string;
  progressColor?: "default" | "usage";
}

function CircleUsageItem({
  item,
  config,
  radius,
  circumference,
  progressColor,
  getUsageClasses,
  getStatus,
}: {
  item: Usage;
  config: { circle: number; stroke: number; text: string; label: string };
  radius: number;
  circumference: number;
  progressColor: "default" | "usage";
  getUsageClasses: (
    percentage: number,
    variant: "circle" | "linear",
  ) => string[];
  getStatus: (percentage: number) => React.ReactNode;
}) {
  const percentage = Math.min((item.usage / item.limit) * 100, 100);
  const remaining = Math.max(item.limit - item.usage, 0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const display = useTransform(
    springValue,
    (latest) => `${Math.round(latest)}%`,
  );

  useEffect(() => {
    motionValue.set(percentage);
  }, [percentage, motionValue]);

  return (
    <div className="bg-muted/20 flex flex-col items-center space-y-3 rounded-xl p-4 text-center">
      <span className="w-full truncate text-sm font-medium">{item.name}</span>
      <div className="relative">
        <svg
          width={config.circle}
          height={config.circle}
          className="-rotate-90"
        >
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            strokeWidth={config.stroke}
            className="text-muted stroke-current"
            fill="transparent"
          />
          <motion.circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            strokeWidth={config.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={cn(
              "stroke-current",
              progressColor === "usage"
                ? getUsageClasses(percentage, "circle")
                : "text-primary",
            )}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference - (percentage / 100) * circumference,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className={cn("font-semibold", config.text)}>
            {display}
          </motion.span>
          <span className={cn("text-muted-foreground", config.label)}>
            used
          </span>
        </div>
      </div>
      <span className="text-muted-foreground text-xs">
        {remaining.toLocaleString()} / {item.limit.toLocaleString()} left
      </span>
      {getStatus(percentage)}
    </div>
  );
}

function LinearUsageItem({
  item,
  config,
  progressColor,
  getUsageClasses,
  getStatus,
}: {
  item: Usage;
  config: { bar: string; text: string };
  progressColor: "default" | "usage";
  getUsageClasses: (
    percentage: number,
    variant: "circle" | "linear",
  ) => string[];
  getStatus: (percentage: number) => React.ReactNode;
}) {
  const percentage = Math.min((item.usage / item.limit) * 100, 100);
  const remaining = Math.max(item.limit - item.usage, 0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const display = useTransform(
    springValue,
    (latest) => `${Math.round(latest)}%`,
  );

  useEffect(() => {
    motionValue.set(percentage);
  }, [percentage, motionValue]);

  return (
    <div className="bg-muted/20 space-y-2 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-medium">{item.name}</span>
        <motion.span className="text-muted-foreground text-xs">
          {display}
        </motion.span>
      </div>
      <div
        className={cn(
          "bg-muted w-full overflow-hidden rounded-full",
          config.bar,
        )}
      >
        <motion.div
          className={cn(
            "rounded-full bg-gradient-to-r",
            config.bar,
            progressColor === "usage"
              ? getUsageClasses(percentage, "linear")
              : "from-primary to-primary/70",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          {remaining.toLocaleString()} / {item.limit.toLocaleString()} left
        </span>
        {getStatus(percentage)}
      </div>
    </div>
  );
}

export function UsageMeter({
  usage,
  className,
  variant = "linear",
  size = "md",
  title,
  description,
  progressColor = "default",
}: UsageMeterProps) {
  if (!usage?.length) return null;

  const getStatus = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="destructive">Critical</Badge>;
    if (percentage >= 75) return <Badge variant="secondary">High</Badge>;
    return null;
  };
  const getUsageClasses = (
    percentage: number,
    variant: "circle" | "linear",
  ): string[] => {
    const thresholds = [
      {
        min: 90,
        circle: "text-red-500",
        linear: ["from-red-500", "to-red-400"],
      },
      {
        min: 75,
        circle: "text-yellow-500",
        linear: ["from-yellow-500", "to-yellow-400"],
      },
      {
        min: 50,
        circle: "text-emerald-500",
        linear: ["from-emerald-500", "to-emerald-400"],
      },
      {
        min: 25,
        circle: "text-blue-500",
        linear: ["from-blue-500", "to-blue-400"],
      },
      {
        min: 0,
        circle: "text-gray-500",
        linear: ["from-gray-500", "to-gray-400"],
      },
    ];
    const match = thresholds.find((t) => percentage >= t.min);

    if (match) {
      return variant === "circle" ? [match.circle] : match.linear;
    }

    return variant === "circle"
      ? ["text-gray-500"]
      : ["from-gray-500", "to-gray-400"];
  };

  if (variant === "circle") {
    const sizeConfig = {
      sm: { circle: 100, stroke: 6, text: "text-lg", label: "text-xs" },
      md: { circle: 140, stroke: 10, text: "text-xl", label: "text-sm" },
      lg: { circle: 180, stroke: 12, text: "text-2xl", label: "text-base" },
    };

    const config = sizeConfig[size];
    const radius = (config.circle - config.stroke) / 2;
    const circumference = radius * 2 * Math.PI;

    return (
      <Card className={cn("w-auto", className)}>
        {(title || description) && (
          <CardHeader className="space-y-1">
            {title && (
              <CardTitle className="truncate text-base leading-tight font-medium">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-muted-foreground text-sm">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent
          className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"}
        >
          {usage.map((item, i) => (
            <CircleUsageItem
              key={item.name || i}
              item={item}
              config={config}
              radius={radius}
              circumference={circumference}
              progressColor={progressColor}
              getUsageClasses={getUsageClasses}
              getStatus={getStatus}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Linear variant
  const sizeConfig = {
    sm: { bar: "h-2", text: "text-xs" },
    md: { bar: "h-3", text: "text-sm" },
    lg: { bar: "h-4", text: "text-base" },
  };

  const config = sizeConfig[size];

  return (
    <Card className={cn("w-full max-w-md", className)}>
      {(title || description) && (
        <CardHeader className="space-y-1">
          {title && (
            <CardTitle className="truncate text-base leading-tight font-medium">
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-muted-foreground text-sm">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={"grid grid-cols-1 gap-4"}>
        {usage.map((item, i) => (
          <LinearUsageItem
            key={item.name || i}
            item={item}
            config={config}
            progressColor={progressColor}
            getUsageClasses={getUsageClasses}
            getStatus={getStatus}
          />
        ))}
      </CardContent>
    </Card>
  );
}

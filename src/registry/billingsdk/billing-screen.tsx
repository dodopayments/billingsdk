"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

// Internal CreditCard component (not exported)
function CreditCard({
  balance,
  username,
  className,
}: {
  balance: string;
  username: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const shineX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={cn("relative mx-auto w-full max-w-md font-sans", className)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full overflow-hidden bg-zinc-950 p-6 shadow-xl ring ring-black/10 dark:bg-zinc-900"
        style={{
          aspectRatio: "190/123",
          alignSelf: "stretch",
          borderRadius: "12px",
          rotateX,
          rotateY,
          transformPerspective: 1000,
          scale: 1,
          transition: "box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            width: "60%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(128,128,128,0.1) 30%, rgba(128,128,128,0.2) 50%, rgba(128,128,128,0.1) 70%, transparent 80%, transparent 100%)",
            filter: "blur(2px)",
            mixBlendMode: "normal",
            opacity: 0.7,
            x: shineX,
            skewX: -15,
          }}
        />

        {/* Top edge highlight */}
        <motion.div
          className="pointer-events-none absolute top-0 right-0 left-0 h-1"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            borderRadius: "12px 12px 0 0",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Left edge highlight */}
        <motion.div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-1"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
            borderRadius: "12px 0 0 12px",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Bottom edge highlight */}
        <motion.div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-1"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
            borderRadius: "0 0 12px 12px",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Right edge highlight */}
        <motion.div
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-1"
          style={{
            background:
              "linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
            borderRadius: "0 12px 12px 0",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full">
          {/* Centered amount and username */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold tracking-tight text-zinc-200">
              {balance}
            </div>
            <div className="mt-1 text-base font-medium text-zinc-400">
              {username}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export interface BillingScreenProps {
  className?: string;
  // Plan details
  planName?: string;
  planPrice?: string;
  renewalDate?: string;
  // Credit details
  totalBalance?: string;
  username?: string;
  giftedCredits?: string;
  monthlyCredits?: string;
  monthlyCreditsLimit?: string;
  purchasedCredits?: string;
  // Settings
  resetDays?: number;
  autoRechargeEnabled?: boolean;
  // Callbacks
  onViewPlans?: () => void;
  onCancelPlan?: () => void;
  onBuyCredits?: () => void;
  onEnableAutoRecharge?: () => void;
}

export function BillingScreen({
  className,
  planName = "Premium Plan",
  planPrice = "$20/mo",
  renewalDate = "Oct 7, 2025",
  totalBalance = "$6.59",
  username = "rajoninternet",
  giftedCredits = "$1.73",
  monthlyCredits = "$3.13",
  monthlyCreditsLimit = "$20.00",
  purchasedCredits = "$0.00",
  resetDays = 4,
  autoRechargeEnabled = false,
  onViewPlans,
  onCancelPlan,
  onBuyCredits,
  onEnableAutoRecharge,
}: BillingScreenProps) {
  return (
    <div
      className={cn(
        "bg-background text-foreground min-h-screen p-6 md:p-12",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Billing</h1>
        </div>

        {/* Current Plan Section */}
        <section className="space-y-4">
          <h2 className="text-muted-foreground text-lg">Current Plan</h2>
          <div className="border-border flex flex-col gap-4 rounded-xl border p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 flex items-baseline gap-2">
                <span className="text-xl font-semibold">{planName}</span>
                <span className="text-muted-foreground">{planPrice}</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Renews on {renewalDate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onViewPlans}>
                View Plans
              </Button>
              <Button variant="outline" onClick={onCancelPlan}>
                Cancel Plan
              </Button>
            </div>
          </div>
        </section>

        {/* Credit Balance Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-lg">Credit Balance</h2>
            <Button onClick={onBuyCredits}>Buy Credits</Button>
          </div>

          <div className="border-border overflow-hidden rounded-xl border">
            {/* Credit info header */}
            <div className="border-border border-b p-6">
              <p className="text-muted-foreground text-sm">
                Your monthly credits reset in{" "}
                <span className="text-foreground font-semibold">
                  {resetDays} days
                </span>
                . Credits are used in the following order: gifted, monthly,
                purchased.
              </p>
            </div>

            {/* Credit card and breakdown */}
            <div className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {/* Credit Card Visual */}
                <div className="w-52 flex-shrink-0">
                  <CreditCard balance={totalBalance} username={username} />
                </div>

                {/* Credit Breakdown */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">
                      Gifted Credits
                    </span>
                    <span className="font-mono">{giftedCredits}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Monthly Credits
                      </span>
                      <InfoIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <span className="font-mono">
                      {monthlyCredits} / {monthlyCreditsLimit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Purchased Credits
                      </span>
                      <InfoIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                    <span className="font-mono">{purchasedCredits}</span>
                  </div>

                  <div className="border-border mt-2 flex items-center justify-between border-t py-3">
                    <span className="font-semibold">
                      Total Available Credits
                    </span>
                    <span className="font-mono font-semibold">
                      {totalBalance}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-recharge notice */}
            <div className="bg-muted/30 border-border border-t p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <InfoIcon className="text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Auto-recharge is{" "}
                      {autoRechargeEnabled ? "enabled" : "not enabled"}.
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {autoRechargeEnabled
                        ? "Credits will be automatically added when your balance is low."
                        : "Enable to automatically add credits when your balance is low."}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="bg-transparent md:flex-shrink-0"
                  onClick={onEnableAutoRecharge}
                >
                  {autoRechargeEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

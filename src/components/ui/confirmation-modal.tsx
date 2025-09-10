"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  DialogCustom, 
  DialogCustomContent, 
  DialogCustomHeader, 
  DialogCustomTitle, 
  DialogCustomDescription, 
  DialogCustomFooter 
} from "@/components/ui/dialog-custom";
import { CheckCircle, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProrationQuote } from "@/lib/billing-core/types";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: ProrationQuote;
  onConfirm: () => void;
  onCancel: () => void;
  _type?: 'upgrade' | 'downgrade' | 'change';
}

export function ConfirmationModal({
  open,
  onOpenChange,
  quote,
  onConfirm,
  onCancel,
  _type = 'change'
}: ConfirmationModalProps) {
  const isUpgrade = quote.newPlan.price > quote.currentPlan.price;
  const isDowngrade = quote.newPlan.price < quote.currentPlan.price;
  
  const gradientColors = isUpgrade 
    ? ["rgba(0,149,255,0.56)", "rgba(231,77,255,0.77)", "rgba(255,0,0,0.73)", "rgba(131,255,166,0.66)"]
    : isDowngrade
    ? ["rgba(255,165,0,0.56)", "rgba(255,69,0,0.77)", "rgba(255,20,147,0.73)", "rgba(255,215,0,0.66)"]
    : ["rgba(100,100,100,0.56)", "rgba(150,150,150,0.77)", "rgba(200,200,200,0.73)", "rgba(180,180,180,0.66)"];

  const getIcon = () => {
    if (isUpgrade) return <TrendingUp className="h-6 w-6 text-green-500" />;
    if (isDowngrade) return <TrendingDown className="h-6 w-6 text-orange-500" />;
    return <CheckCircle className="h-6 w-6 text-blue-500" />;
  };

  const getTitle = () => {
    if (isUpgrade) return `🚀 Upgrade to ${quote.newPlan.name}`;
    if (isDowngrade) return `📉 Downgrade to ${quote.newPlan.name}`;
    return `🔄 Switch to ${quote.newPlan.name}`;
  };

  const getDescription = () => {
    const action = isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'change';
    return `Confirm your plan ${action}. This change will take effect immediately.`;
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <DialogCustom open={open} onOpenChange={onOpenChange}>
      <DialogCustomContent 
        className="sm:max-w-md"
        gradientColors={gradientColors}
        showCloseButton={false}
      >
        <DialogCustomHeader className="text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 backdrop-blur"
          >
            {getIcon()}
          </motion.div>
          
          <DialogCustomTitle className="text-xl font-bold">
            {getTitle()}
          </DialogCustomTitle>
          
          <DialogCustomDescription className="text-base">
            {getDescription()}
          </DialogCustomDescription>
        </DialogCustomHeader>

        {/* Plan Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Current Plan */}
            <div className="rounded-lg border bg-background/50 p-3 text-center backdrop-blur">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="font-semibold text-sm">{quote.currentPlan.name}</p>
              <p className="text-xs text-muted-foreground">
                {ProrationEngine.formatCurrency(quote.currentPlan.price, quote.currentPlan.currency)}/{quote.currentPlan.interval}
              </p>
            </div>

            {/* New Plan */}
            <div className="rounded-lg border bg-background/50 p-3 text-center backdrop-blur">
              <p className="text-xs text-muted-foreground mb-1">New Plan</p>
              <p className="font-semibold text-sm">{quote.newPlan.name}</p>
              <p className="text-xs text-muted-foreground">
                {ProrationEngine.formatCurrency(quote.newPlan.price, quote.newPlan.currency)}/{quote.newPlan.interval}
              </p>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="rounded-lg border bg-background/50 p-4 backdrop-blur">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {quote.total >= 0 ? "Amount to charge" : "Credit to account"}
              </span>
              <span className={cn(
                "text-lg font-bold",
                quote.total >= 0 ? "text-foreground" : "text-green-600"
              )}>
                {quote.total >= 0 ? '+' : ''}
                {ProrationEngine.formatCurrency(quote.total, quote.currency)}
              </span>
            </div>
            
            {quote.total !== 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {quote.total > 0 
                  ? "This amount will be charged immediately to your payment method."
                  : "This credit will be applied to your account balance."
                }
              </p>
            )}
          </div>
        </motion.div>

        <DialogCustomFooter className="pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col-reverse sm:flex-row gap-2 w-full"
          >
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={cn(
                "flex-1 relative overflow-hidden",
                isUpgrade && "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                isDowngrade && "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              )}
            >
              {isUpgrade && <Sparkles className="h-4 w-4 mr-2" />}
              Confirm {isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Change'}
            </Button>
          </motion.div>
        </DialogCustomFooter>
      </DialogCustomContent>
    </DialogCustom>
  );
}

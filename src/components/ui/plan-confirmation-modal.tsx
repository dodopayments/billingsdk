"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, ArrowRight } from "lucide-react";
import { ProrationQuote } from "@/lib/billing-core/types";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";

interface PlanConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  quote: ProrationQuote;
  onConfirm: () => void;
}

export function PlanConfirmationModal({
  open,
  onClose,
  quote,
  onConfirm
}: PlanConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <Card className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardHeader className="text-center pb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                  >
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </motion.div>
                  
                  <CardTitle className="text-xl">
                    Plan Change Confirmed!
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Plan Change Summary */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>{quote.currentPlan.name}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{quote.newPlan.name}</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {quote.total >= 0 ? '+' : ''}
                        {ProrationEngine.formatCurrency(quote.total, quote.currency)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quote.total > 0 
                          ? "Charged to your account"
                          : quote.total < 0
                          ? "Credit applied to your account"
                          : "No additional charge"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Change applied immediately
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleConfirm}
                    className="w-full"
                    size="lg"
                  >
                    Got it!
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/lib/themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PaymentSuccessDialogProps {
  title?: string;
  subtitle?: string;
  currencySymbol?: string;
  price: string;
  productName: string;
  proceedButtonText?: string;
  backButtonText?: string;
  onProceed?: () => void;
  onBack?: () => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PaymentSuccessDialogRef {
  open: () => void;
  close: () => void;
}

type ConfettiPiece = {
  id: number;
  x: number;
  xEnd: number;
  delay: number;
  rotation: number;
  size: number;
  colorVar: string; // CSS var name like --primary, --accent
};

export const PaymentSuccessDialog = forwardRef<
  PaymentSuccessDialogRef,
  PaymentSuccessDialogProps
>(function PaymentSuccessDialog(
  {
    title = "Congratulations!",
    subtitle = "Your payment was successful.",
    currencySymbol = "$",
    price,
    productName,
    proceedButtonText = "Proceed",
    backButtonText = "Back",
    onProceed,
    onBack,
    className,
    open,
    onOpenChange,
  },
  ref,
) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const openState = isControlled ? (open as boolean) : internalOpen;
  const setOpenState = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };
  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpenState(true),
      close: () => setOpenState(false),
    }),
    [isControlled, onOpenChange],
  );
  const [confettiActive, setConfettiActive] = useState(false);
  const { currentTheme, previewDarkMode } = useTheme();
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode);

  useEffect(() => {
    if (openState) {
      setConfettiActive(true);
      const t = setTimeout(() => setConfettiActive(false), 2200);
      return () => clearTimeout(t);
    }
    setConfettiActive(false);
  }, [openState]);

  const confetti: ConfettiPiece[] = useMemo(() => {
    const pieces: ConfettiPiece[] = [];
    const colors = ["--primary", "--accent", "--secondary"];
    for (let i = 0; i < 42; i++) {
      const startX = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 24; // -12% to +12%
      pieces.push({
        id: i,
        x: startX,
        xEnd: Math.max(0, Math.min(100, startX + drift)),
        delay: Math.random() * 0.4,
        rotation: Math.random() * 360,
        size: 6 + Math.round(Math.random() * 6),
        colorVar: colors[i % colors.length],
      });
    }
    return pieces;
  }, []);

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogContent
        className={cn(
          "text-foreground w-[95%] overflow-hidden p-0 sm:max-w-[560px]",
          className,
        )}
        style={themeStyles}
      >
        <div className="relative">
          <div className="flex flex-col items-center gap-5 p-7 text-center">
            <div className="relative">
              <motion.div
                className="absolute inset-0 -z-10 mx-auto size-20 rounded-full blur-xl"
                style={{ background: "var(--primary)", opacity: 0.12 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <div className="relative">
                <div className="bg-primary/10 border-primary/30 flex size-16 items-center justify-center rounded-full border shadow-sm">
                  <CheckCircle2 className="text-primary size-10" />
                </div>
                <motion.span
                  className="border-primary/30 absolute inset-0 rounded-full border-2"
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.25, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.span
                  className="border-accent/30 absolute inset-0 rounded-full border-2"
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.2,
                  }}
                />
              </div>
            </div>

            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-semibold">
                {title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground max-w-[38ch] text-sm">
              {subtitle}
            </p>

            <div className="flex flex-col items-center gap-1">
              <motion.div
                className="text-4xl font-semibold tracking-tight"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                {currencySymbol}
                {price}
              </motion.div>
              <div className="text-muted-foreground text-xs">
                Paid for {productName}
              </div>
            </div>

            <DialogFooter className="mt-1 w-full flex-col gap-3 sm:flex-col">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onBack?.();
                  setOpenState(false);
                }}
              >
                {backButtonText}
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  onProceed?.();
                  setOpenState(false);
                }}
              >
                {proceedButtonText}
              </Button>
            </DialogFooter>
          </div>

          <AnimatePresence>
            {confettiActive && (
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {confetti.map((c) => (
                  <motion.span
                    key={c.id}
                    className="absolute block rounded-[2px]"
                    style={{
                      left: `${c.x}%`,
                      top: "-16px",
                      width: c.size,
                      height: c.size * 0.6,
                      backgroundColor: `var(${c.colorVar})`,
                    }}
                    initial={{ y: -20, rotate: c.rotation }}
                    animate={{
                      y: 360 + Math.random() * 80,
                      x: `${c.xEnd}%`,
                      rotate: c.rotation + 720,
                    }}
                    transition={{
                      duration: 1.8 + Math.random() * 0.8,
                      delay: c.delay,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
});

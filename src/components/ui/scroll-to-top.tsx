"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
  showAfter?: number; // pixels to scroll before showing button
}

export function ScrollToTop({ className, showAfter = 300 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed right-6 top-1/2 -translate-y-1/2 z-50",
            className
          )}
        >
          <Button
            onClick={scrollToTop}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-2 h-auto rounded-md shadow-md hover:shadow-lg transition-all duration-300",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "border border-primary/20 backdrop-blur-sm",
              "group hover:scale-105 active:scale-95"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
            <span className="text-[10px] font-medium whitespace-nowrap">
              Scroll to Top
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

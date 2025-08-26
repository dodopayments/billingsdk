"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  type BannerProps,
  getBannerVariantStyles,
  getBannerGradientBackground,
  getBannerAnimationProps,
  injectBannerStyles
} from "./banner-utils"

export type { BannerProps } from "./banner-utils"

export function Banner({
  variant = "default",
  title,
  description,
  buttonText,
  buttonIcon,
  buttonLink,
  className,
  autoDismiss,
  onDismiss,
  gradientColors,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isVisible && autoDismiss) {
      const timer = setTimeout(() => handleDismiss(), autoDismiss)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoDismiss])

  useEffect(() => {
    injectBannerStyles()
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const styles = getBannerVariantStyles(variant, gradientColors)
  const gradientBg = getBannerGradientBackground(gradientColors)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...getBannerAnimationProps(variant)}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(styles.container, className)}
        >
          {gradientBg && (
            <div className={gradientBg.className} style={gradientBg.style} />
          )}
          <div className={styles.wrapper}>
            {/* Content */}
            <div className={styles.content}>
              <div className={variant === "minimal" ? "flex flex-col md:flex-row gap-0.5 md:gap-2" : ""}>
                <p className={styles.title}>{title}</p>
                {description && <p className={styles.description}>{description}</p>}
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
                  {buttonIcon && <div className="flex-shrink-0 mr-1">{buttonIcon}</div>}
                  {buttonText}
                </Button>
              )}
            </div>

            {/* Close button (always top-right) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8",
                gradientColors && gradientColors.length > 0
                  ? "hover:bg-foreground/20 text-foreground"
                  : variant === "default" && "hover:bg-primary-foreground/20 text-primary-foreground",
                variant === "popup" && !gradientColors && "hover:bg-accent text-popover-foreground",
                variant === "minimal" && !gradientColors && "hover:bg-accent text-card-foreground",
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
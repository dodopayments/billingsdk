"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, Wrench, Gift, Megaphone, Shield, Beaker, Calendar, Signal, MessageCircle, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"


export interface BannerProps {
  variant?: "default" | "minimal" | "popup" | "destructive"
  style?: "warning" | "product-announcement" | "success" | "info" | "error" | "maintenance" | "promotional" | "security" | "beta" | "holiday" | "system-status" | "feedback" | "migration"
  title: string
  description?: string
  buttonText?: string
  buttonIcon?: React.ReactNode
  buttonLink?: string
  className?: string
  autoDismiss?: number // in ms
  onDismiss?: () => void
  gradientColors?: string[]
}

export function Banner({
  variant = "default",
  style,
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

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const getVariantStyles = () => {
    const hasGradient = gradientColors && gradientColors.length > 0

    switch (variant) {
      case "minimal":
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-card/60"
            : "sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-center px-3 sm:px-4 py-2 gap-2 sm:gap-4 max-w-2xl",
          content: "flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2",
          title: "text-sm font-medium text-card-foreground leading-tight",
          description: "text-xs text-muted-foreground sm:ml-2",
          actions: "flex items-center gap-2 self-end sm:self-auto",
        }
      case "popup":
        return {
          container: hasGradient
            ? "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-[90%] sm:w-auto border border-border rounded-lg shadow-lg backdrop-blur"
            : "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-[90%] sm:w-auto bg-popover border border-border rounded-lg shadow-lg backdrop-blur",
          wrapper:
            "relative flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 gap-3 sm:gap-4",
          content: "flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1",
          title:"text-sm font-medium text-popover-foreground leading-snug",
          description:"text-xs text-muted-foreground",
          actions: "flex items-center gap-2 self-end sm:self-auto flex-shrink-0 pr-8",
        }
      case "destructive":
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b border-destructive/20 backdrop-blur supports-[backdrop-filter]:bg-destructive/10"
            : "sticky top-0 z-50 w-full border-b bg-destructive text-destructive-foreground shadow-sm backdrop-blur",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4",
          content: "flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full",
          title: hasGradient
            ? "text-sm font-medium text-destructive leading-tight"
            : "text-sm font-medium text-destructive-foreground leading-tight",
          description: hasGradient
            ? "text-xs text-destructive/80"
            : "text-xs text-destructive-foreground/80",
          actions: "flex items-center gap-2 self-end sm:self-auto pr-8",
        }
      default:
        return {
          container: hasGradient
            ? "sticky top-0 z-50 w-full border-b text-primary-foreground shadow-sm text-left backdrop-blur"
            : "sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm text-left backdrop-blur",
          wrapper:
            "relative container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4",
          content: "flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full",
          title: hasGradient
            ? "text-sm font-medium text-foreground leading-tight"
            : "text-sm font-medium text-primary-foreground leading-tight",
          description: hasGradient
            ? "text-xs text-foreground/80"
            : "text-xs text-primary-foreground/80",
          actions: "flex items-center gap-2 self-end sm:self-auto pr-8",
        }
    }
  }

  const styles = getVariantStyles()
  
  // Style configuration for semantic banner styles
  const getStyleConfig = () => {
    if (!style) return null
    
    const styleConfigs = {
      warning: {
        icon: <AlertTriangle className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-100",
          title: "text-amber-900 dark:text-amber-100",
          description: "text-amber-700 dark:text-amber-200"
        }
      },
      "product-announcement": {
        icon: <Megaphone className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100",
          title: "text-blue-900 dark:text-blue-100",
          description: "text-blue-700 dark:text-blue-200"
        }
      },
      success: {
        icon: <CheckCircle className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-800 dark:text-green-100",
          title: "text-green-900 dark:text-green-100",
          description: "text-green-700 dark:text-green-200"
        }
      },
      info: {
        icon: <Info className="h-4 w-4" />,
        defaultVariant: "minimal",
        colors: {
          container: "bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-950/50 dark:border-slate-800 dark:text-slate-100",
          title: "text-slate-900 dark:text-slate-100",
          description: "text-slate-700 dark:text-slate-200"
        }
      },
      error: {
        icon: <AlertCircle className="h-4 w-4" />,
        defaultVariant: "destructive",
        colors: {
          container: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100",
          title: "text-red-900 dark:text-red-100",
          description: "text-red-700 dark:text-red-200"
        }
      },
      maintenance: {
        icon: <Wrench className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-100",
          title: "text-orange-900 dark:text-orange-100",
          description: "text-orange-700 dark:text-orange-200"
        }
      },
      promotional: {
        icon: <Gift className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-100",
          title: "text-purple-900 dark:text-purple-100",
          description: "text-purple-700 dark:text-purple-200"
        }
      },
      security: {
        icon: <Shield className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-100",
          title: "text-indigo-900 dark:text-indigo-100",
          description: "text-indigo-700 dark:text-indigo-200"
        }
      },
      beta: {
        icon: <Beaker className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-violet-50 border-violet-200 text-violet-900 dark:bg-violet-950/50 dark:border-violet-800 dark:text-violet-100",
          title: "text-violet-900 dark:text-violet-100",
          description: "text-violet-700 dark:text-violet-200"
        }
      },
      holiday: {
        icon: <Calendar className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-100",
          title: "text-rose-900 dark:text-rose-100",
          description: "text-rose-700 dark:text-rose-200"
        }
      },
      "system-status": {
        icon: <Signal className="h-4 w-4" />,
        defaultVariant: "minimal",
        colors: {
          container: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100",
          title: "text-emerald-900 dark:text-emerald-100",
          description: "text-emerald-700 dark:text-emerald-200"
        }
      },
      feedback: {
        icon: <MessageCircle className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-teal-50 border-teal-200 text-teal-900 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-100",
          title: "text-teal-900 dark:text-teal-100",
          description: "text-teal-700 dark:text-teal-200"
        }
      },
      migration: {
        icon: <ArrowUp className="h-4 w-4" />,
        defaultVariant: "default",
        colors: {
          container: "bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950/50 dark:border-cyan-800 dark:text-cyan-100",
          title: "text-cyan-900 dark:text-cyan-100",
          description: "text-cyan-700 dark:text-cyan-200"
        }
      }
    }
    
    return styleConfigs[style]
  }
  
  const styleConfig = getStyleConfig()

  const getGradientBackground = () => {
    if (!gradientColors || gradientColors.length === 0) return null

    // Use the exact gradient from the example or custom colors with proper spacing
    let gradientStops
    if (gradientColors.length === 4) {
      // Match the original example exactly
      gradientStops = `${gradientColors[0]} 0%, ${gradientColors[1]} 12.5%, ${gradientColors[2]} 25%, ${gradientColors[3]} 37.5%, ${gradientColors[0]} 50%`
    } else {
      // For other numbers of colors, use equal spacing
      gradientStops = gradientColors.map((color, index) => {
        const percentage = (index / gradientColors.length) * 100
        return `${color} ${percentage}%`
      }).join(', ')
    }

    // Use consistent filter for better visibility
    const filterValue = 'saturate(1.8) brightness(1.2)'

    return (
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          maskImage: 'linear-gradient(to bottom, white, transparent), radial-gradient(circle at top center, white, transparent)',
          maskComposite: 'intersect',
          animation: 'fd-moving-banner 30s linear infinite',
          backgroundImage: `repeating-linear-gradient(70deg, ${gradientStops})`,
          backgroundSize: '200% 100%',
          filter: filterValue
        }}
      />
    )
  }

  const getAnimationProps = () => {
    switch (variant) {
      case "popup":
        return {
          initial: { opacity: 0, scale: 0.95, y: -20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -20 },
        }
      default:
        return {
          initial: { opacity: 0, y: -12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
        }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...getAnimationProps()}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            styles.container,
            styleConfig?.colors.container,
            className
          )}
        >
          {getGradientBackground()}
          <div className={styles.wrapper}>
            {/* Content */}
            <div className={styles.content}>
              <div className={variant === "minimal" ? "flex flex-col md:flex-row gap-0.5 md:gap-2" : ""}>
                <div className="flex items-center gap-2">
                  {styleConfig?.icon && !buttonIcon && (
                    <span className="flex-shrink-0">
                      {styleConfig.icon}
                    </span>
                  )}
                  <p className={cn(styles.title, styleConfig?.colors.title)}>{title}</p>
                </div>
                {description && (
                  <p className={cn(styles.description, styleConfig?.colors.description)}>
                    {description}
                  </p>
                )}
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

// Add CSS keyframes for the moving banner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes fd-moving-banner {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `
  document.head.appendChild(styleSheet)
}

"use client"

import type React from "react"

export interface BannerProps {
  variant?: "default" | "minimal" | "popup"
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

export const getBannerVariantStyles = (variant: BannerProps["variant"], gradientColors?: string[]) => {
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

export const getBannerGradientBackground = (gradientColors?: string[]) => {
  if (!gradientColors || gradientColors.length === 0) return null

  let gradientStops
  if (gradientColors.length === 4) {
    gradientStops = `${gradientColors[0]} 0%, ${gradientColors[1]} 12.5%, ${gradientColors[2]} 25%, ${gradientColors[3]} 37.5%, ${gradientColors[0]} 50%`
  } else {
    gradientStops = gradientColors.map((color, index) => {
      const percentage = (index / gradientColors.length) * 100
      return `${color} ${percentage}%`
    }).join(', ')
  }

  const filterValue = 'saturate(1.8) brightness(1.2)'

  return {
    className: "absolute inset-0 z-[-1]",
    style: {
      maskImage: 'linear-gradient(to bottom, white, transparent), radial-gradient(circle at top center, white, transparent)',
      maskComposite: 'intersect' as const,
      animation: 'fd-moving-banner 30s linear infinite',
      backgroundImage: `repeating-linear-gradient(70deg, ${gradientStops})`,
      backgroundSize: '200% 100%',
      filter: filterValue
    }
  }
}

export const getBannerAnimationProps = (variant: BannerProps["variant"]) => {
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

export const injectBannerStyles = () => {
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
}
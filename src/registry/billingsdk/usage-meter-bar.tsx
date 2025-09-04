"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface UsageMeterBarProps {
  title: string
  currentUsage: number
  maxUsage: number
  unit: string
  description?: string
  animation?: "on" | "off"
}

export function UsageMeterBar({ title, currentUsage, maxUsage, unit, description, animation = "on" }: UsageMeterBarProps) {
  const [animatedUsage, setAnimatedUsage] = useState(0)
  const percentage = Math.min((currentUsage / maxUsage) * 100, 100)
  const isAnimationOn = animation !== "off"

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedUsage(currentUsage)
    }, 100)
    return () => clearTimeout(timer)
  }, [currentUsage])

  const getStatusColor = () => {
    if (percentage >= 90) return "bg-destructive"
    if (percentage >= 70) return "bg-secondary"
    return "bg-primary"
  }

  const getStatusText = () => {
    if (percentage >= 90) return "Critical"
    if (percentage >= 70) return "Warning"
    return "Good"
  }

  // Create segments for the wave-like meter
  const segments = Array.from({ length: 20 }, (_, i) => {
    const segmentPercentage = ((i + 1) / 20) * 100
    const isActive = segmentPercentage <= percentage
    const height = Math.sin((i / 20) * Math.PI * 2) * 8 + 24 // Wave pattern

    return {
      isActive,
      height,
      delay: i * 50, // Staggered animation
    }
  })

  return (
    <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-card border-border shadow-lg">
      <CardContent className="p-3 sm:p-4">
        {/* Compact header info in single row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-card-foreground">{title}</h3>
            <Badge
              variant={percentage >= 90 ? "destructive" : percentage >= 70 ? "secondary" : "default"}
              className="text-xs"
            >
              {getStatusText()}
            </Badge>
          </div>
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-card-foreground">
              {animatedUsage.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              / {maxUsage.toLocaleString()} {unit}
            </span>
          </div>
        </div>

        {/* Wave-like Usage Meter - more compact */}
        <div className="relative">
          <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-6 sm:h-8 bg-transparent rounded-md p-1 overflow-hidden">
            {segments.map((segment, index) => (
              <motion.div
                key={index}
                className={`
                  flex-1 rounded-sm
                  ${segment.isActive ? getStatusColor() : "bg-muted/50"}
                `}
                initial={{ scaleY: 0.3, height: `${segment.height * 0.3}px` }}
                animate={
                  isAnimationOn
                    ? {
                        scaleY: segment.isActive ? [0.3, 1, 0.7, 1] : 0.3,
                        height: segment.isActive
                          ? [
                              `${segment.height * 0.3}px`,
                              `${segment.height * 0.5}px`,
                              `${segment.height * 0.4}px`,
                              `${segment.height * 0.5}px`,
                            ]
                          : `${segment.height * 0.3}px`,
                      }
                    : {
                        scaleY: segment.isActive ? 1 : 0.3,
                        height: segment.isActive
                          ? `${segment.height * 0.5}px`
                          : `${segment.height * 0.3}px`,
                      }
                }
                transition={{
                  duration: isAnimationOn ? 2 : 0,
                  repeat: isAnimationOn && segment.isActive ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: isAnimationOn ? segment.delay / 1000 : 0,
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute inset-0 bg-transparent rounded-md"
            initial={{ x: "-100%" }}
            animate={{ x: `${percentage - 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Compact usage info */}
        <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-muted-foreground">
          <span>{percentage.toFixed(1)}% used</span>
          <span>
            {(maxUsage - currentUsage).toLocaleString()} {unit} remaining
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

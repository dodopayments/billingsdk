"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className, disabled }: SliderProps) {
  const current = value?.[0] ?? min
  const progress = ((current - min) / (max - min)) * 100

  const sliderStyle: React.CSSProperties = {
    background: `linear-gradient(to right, var(--slider-active) ${progress}%, var(--slider-inactive) ${progress}%)`,
  }

  return (
    <input
      type="range"
      className={cn(
        "w-full h-2 appearance-none rounded-lg bg-transparent outline-none",
        // Center the thumb on the 8px track (thumb 20px → offset -6px)
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:-mt-1.5",
        // Firefox centers by default with these sizes
        "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-indigo-500",
        "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-lg",
        "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-0",
        className,
      )}
      style={sliderStyle}
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      disabled={disabled}
    />
  )
}

export default Slider



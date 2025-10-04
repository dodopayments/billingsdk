"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { motion, useSpring, useTransform, useMotionValueEvent } from "motion/react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type UsageBasedPricingProps = {
  className?: string
  min?: number
  max?: number
  step?: number
  snapTo?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  currency?: string
  basePrice?: number
  includedCredits?: number
  unitPricePerCredit?: number
  title?: string
  subtitle?: string
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}
function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
}

export function UsageBasedPricing({
  className,
  min = 4000,
  max = 25001,
  step = 1,
  snapTo,
  value: valueProp,
  defaultValue = 4000,
  onChange,
  onChangeEnd,
  currency = "$",
  basePrice = 39.99,
  includedCredits = 4000,
  title = "Pay as you use pricing",
  subtitle = "Start with a flat monthly rate that includes 4,000 credits.",
}: UsageBasedPricingProps) {
  const isControlled = typeof valueProp === 'number'
  const [uncontrolled, setUncontrolled] = useState(clamp(defaultValue, min, max))
  const value = isControlled ? clamp(valueProp as number, min, max) : uncontrolled
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [posPct, setPosPct] = useState(() => ((value - min) / (max - min)) * 100)
  const animRef = useRef<number | null>(null)
  const animStartRef = useRef<number>(0)
  const animFromPctRef = useRef<number>(0)
  const animToPctRef = useRef<number>(0)
  const animDurationMs = 300
  const isPointerDownRef = useRef(false)
  const hasMovedRef = useRef(false)
  const suppressClickRef = useRef(false)

  // measure track width for ticks
  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setTrackWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const price = useMemo(() => {
    // Pricing: basePrice covers includedCredits. For every additional 1,000 credits, add $10.
    const extra = Math.max(0, value - includedCredits)
    const thousandsOver = Math.ceil(extra / 1000)
    const extraCost = thousandsOver * 10
    return basePrice + extraCost
  }, [value, includedCredits, basePrice])

  const priceSpring = useSpring(price, { stiffness: 140, damping: 18, mass: 0.6 })
  useEffect(() => {
    priceSpring.set(price)
  }, [price, priceSpring])
  const priceRounded = useTransform(priceSpring, (p: number) => Math.max(0, p))
  const [priceText, setPriceText] = useState(price.toFixed(2))
  useMotionValueEvent(priceRounded, "change", (v) => {
    setPriceText((v as number).toFixed(2))
  })

  // keep visual position in sync with external value changes (controlled)
  useEffect(() => {
    // avoid interrupting during user interactions
    if (isPointerDownRef.current) return
    if (animRef.current) return
    const pctFromValue = ((value - min) / (max - min)) * 100
    setPosPct(clamp(pctFromValue, 0, 100))
  }, [value, min, max])

  const pct = posPct
  const tickCount = useMemo(() => Math.max(80, Math.floor((trackWidth || 1) / 6)), [trackWidth])
  const currentTickIndexFloat = useMemo(() => (posPct / 100) * (tickCount - 1), [posPct, tickCount])

  const commitValue = (v: number, fireEnd = false) => {
    const clamped = clamp(v, min, max)
    if (!isControlled) setUncontrolled(clamped)
    onChange?.(clamped)
    if (fireEnd) onChangeEnd?.(clamped)
  }

  const quantize = (raw: number) => {
    const stepped = Math.round(raw / step) * step
    return clamp(stepped, min, max)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    isPointerDownRef.current = true
    hasMovedRef.current = false
    // do not update immediately; wait for move to avoid jump on simple click
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || !isPointerDownRef.current) return
    hasMovedRef.current = true
    updateFromEvent(e, false)
  }
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only commit if there was a drag; a simple click will be handled by onClick animation
    if (hasMovedRef.current) {
      updateFromEvent(e, true)
      // skip the trailing synthetic click fired after a drag
      suppressClickRef.current = true
    }
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    isPointerDownRef.current = false
    hasMovedRef.current = false
  }
  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    isPointerDownRef.current = false
    hasMovedRef.current = false
  }
  // easing function for dot click animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
  // animate to target value (used by clickable dots)
  const animateTo = (targetValue: number) => {
    // cancel any existing animation
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const tnorm = (targetValue - min) / (max - min)
    animFromPctRef.current = posPct
    animToPctRef.current = clamp(tnorm * 100, 0, 100)
    animStartRef.current = performance.now()
    const step = (now: number) => {
      const elapsed = now - animStartRef.current
      const p = Math.min(1, elapsed / animDurationMs)
      const k = easeOutCubic(p)
      const currPct = animFromPctRef.current + (animToPctRef.current - animFromPctRef.current) * k
      setPosPct(currPct)
      // live update the value with 100/snapTo increments during animation
      const liveValue = min + (currPct / 100) * (max - min)
      const moveSnap = (snapTo && snapTo > 0) ? snapTo : 100
      let next = Math.round(liveValue / moveSnap) * moveSnap
      next = clamp(next, min, max)
      commitValue(next, false)
      if (p < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        // finalize exactly on target and fire end
        commitValue(targetValue, true)
        animRef.current = null
      }
    }
    animRef.current = requestAnimationFrame(step)
  }
  const updateFromEvent = (e: React.PointerEvent<HTMLDivElement>, isEnd: boolean) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, rect.width)
    const t = x / rect.width
    const raw = min + t * (max - min)
    // update transient visual percent immediately
    setPosPct(t * 100)
    // During move: update visuals and value in live increments (default 100 or snapTo)
    if (!isEnd) {
      const moveSnap = (snapTo && snapTo > 0) ? snapTo : 100
      let next = Math.round(raw / moveSnap) * moveSnap
      next = clamp(next, min, max)
      commitValue(next, false)
      return
    }
    // On end: snap to snapTo (if provided) or to step (>1) else to 100
    let next = raw
    if (snapTo && snapTo > 0) {
      next = Math.round(raw / snapTo) * snapTo
    } else if (step && step > 1) {
      next = quantize(raw)
    } else {
      next = Math.round(raw / 100) * 100
    }
    commitValue(next, true)
  }

  // Positions for labels centered under first and last 1000-multiple dots
  const firstThousand = useMemo(() => Math.ceil(min / 1000) * 1000, [min])
  const lastThousand = useMemo(() => Math.floor(max / 1000) * 1000, [max])
  const startLabel = `${formatNumber(firstThousand)} credits`
  const endLabel = `${formatNumber(lastThousand)} credits`

  // Keyboard Accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let delta = 0
    const baseStep = snapTo && snapTo > 0 ? snapTo : 100
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -(e.shiftKey ? baseStep * 5 : baseStep)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        delta = (e.shiftKey ? baseStep * 5 : baseStep)
        break
      case 'Home':
        commitValue(Math.round(min / baseStep) * baseStep, true)
        e.preventDefault()
        return
      case 'End':
        commitValue(Math.round(max / baseStep) * baseStep, true)
        e.preventDefault()
        return
      default:
        return
    }
    e.preventDefault()
    const next = clamp(value + delta, min, max)
    const snapped = Math.round(next / baseStep) * baseStep
    commitValue(snapped, true)
  }

  return (
    <Card className={cn("w-full max-w-3xl min-w-lg mx-auto", className)}>
      <CardHeader className="text-left">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold tabular-nums">{currency}{priceText}</span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(value)} credits per month
          </p>
        </div>

        <div className="space-y-6">
          <div className="mb-6 relative h-0">
            <div className="absolute -top-10" style={{ left: `${pct}%` }}>
              <div className="-translate-x-1/2 rounded-md border bg-background px-3 py-1 text-xs shadow-sm">
                {formatNumber(value)}
              </div>
            </div>
          </div>

          <div
            ref={trackRef}
            className="relative h-12 select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={(e) => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false
                return
              }
              if (!trackRef.current) return
              const rect = trackRef.current.getBoundingClientRect()
              const x = clamp(e.clientX - rect.left, 0, rect.width)
              const t = x / rect.width
              const raw = min + t * (max - min)
              const baseSnap = (snapTo && snapTo > 0) ? snapTo : 100
              const target = clamp(Math.round(raw / baseSnap) * baseSnap, min, max)
              animateTo(target)
            }}
          >
            {/* Animated ruler ticks */}
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: tickCount }).map((_, i) => {
                const left = (i / (tickCount - 1)) * 100
                const distFloat = Math.abs(currentTickIndexFloat - i)
                const base = 10
                const peak = 12
                const spread = 2
                const factor = Math.max(0, 1 - distFloat / spread)
                const height = base + peak * factor
                let color = 'bg-muted-foreground/40'
                if (distFloat < 0.5) color = 'bg-primary'
                else if (distFloat < 1.5) color = 'bg-primary/90'
                else if (distFloat < 2.5) color = 'bg-primary/70'
                const widthClass = distFloat < 0.5
                  ? 'w-[3px]'
                  : (distFloat < 3.5 ? 'w-[2px]' : 'w-px')
                return (
                  <motion.div
                    key={i}
                    className={`absolute top-1/2 -translate-y-full ${widthClass} rounded-full ${color}`}
                    style={{ left: `${left}%` }}
                    animate={{ height }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  />
                )
              })}
            </div>

            {/* Clickable dots every 1000 credits */}
            <div className="pointer-events-auto absolute inset-0">
              {(() => {
                const first = Math.ceil(min / 1000) * 1000
                const dots: ReactNode[] = []
                for (let v = first; v <= max; v += 1000) {
                  const t = (v - min) / (max - min)
                  const left = `${t * 100}%`
                  const isActive = Math.round(value) === v
                  dots.push(
                    <div
                      key={`dot-${v}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${v.toLocaleString()} credits`}
                      onClick={() => { animateTo(v) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); animateTo(v) } }}
                      className={`absolute rounded-full outline-none ${isActive ? 'bg-primary' : 'bg-muted-foreground/70'} focus:ring-2 focus:ring-primary/50`}
                      style={{
                        left,
                        top: 'calc(50% + 14px)',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        cursor: 'pointer',
                      }}
                    />
                  )
                }
                return dots
              })()}
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={`${formatNumber(value)} credits`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="sr-only"
              />
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UsageBasedPricing

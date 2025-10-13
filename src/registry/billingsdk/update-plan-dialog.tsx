'use client';

import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Toggle } from "@/components/ui/toggle"
import { Label } from "@/components/ui/label"
import { type Plan } from "@/lib/billingsdk-config"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState, useCallback } from "react"
import { useTheme } from "@/contexts/theme-context"
import { getThemeStyles } from "@/lib/themes"

export interface UpdatePlanDialogProps {
    currentPlan: Plan
    plans: Plan[]
    triggerText: string
    onPlanChange: (planId: string) => void
    className?: string
    title?: string
}

const easing = [0.4, 0, 0.2, 1] as const

export function UpdatePlanDialog({ currentPlan, plans, onPlanChange, className, title, triggerText }: UpdatePlanDialogProps) {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const { currentTheme, previewDarkMode } = useTheme();
    const themeStyles = getThemeStyles(currentTheme, previewDarkMode);

    const getCurrentPrice = useCallback((plan: Plan) =>
        isYearly ? `${plan.yearlyPrice}` : `${plan.monthlyPrice}`, [isYearly]
    );

    const handlePlanChange = useCallback((planId: string) => {
        setSelectedPlan((prev) => (prev === planId ? undefined : planId));
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSelectedPlan(undefined);
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>{triggerText || "Update Plan"}</Button>
            </DialogTrigger>
            <DialogContent className={cn(
                "gap-3 sm:gap-4 max-h-[95vh] sm:max-h-[90vh] flex flex-col text-foreground",
                "w-[calc(100vw-2rem)] sm:w-full max-w-2xl",
                "p-4 sm:p-6",
                className
            )} style={themeStyles}>
                <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-2 sm:pb-0">
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                        {title || "Upgrade Plan"}
                    </DialogTitle>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-sm">
                        <Toggle
                            size="sm"
                            pressed={!isYearly}
                            onPressedChange={(pressed) => setIsYearly(!pressed)}
                            className="px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                        >
                            Monthly
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={isYearly}
                            onPressedChange={(pressed) => setIsYearly(pressed)}
                            className="px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                        >
                            Yearly
                        </Toggle>
                    </div>
                </DialogHeader>
                <div 
                    className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden -mx-4 sm:-mx-6 px-4 sm:px-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--muted)) transparent' }}
                >
                    {plans.length === 0 ? (
                        <div className="flex items-center justify-center py-12 text-center">
                            <p className="text-sm text-muted-foreground">No plans available</p>
                        </div>
                    ) : (
                        <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
                            <div className="space-y-2.5 sm:space-y-3 pb-2 pr-0.5">
                                {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    layout: { duration: 0.3, ease: easing },
                                    opacity: { delay: index * 0.05, duration: 0.3, ease: easing },
                                    y: { delay: index * 0.05, duration: 0.3, ease: easing }
                                }}
                                    onClick={() => handlePlanChange(plan.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handlePlanChange(plan.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={selectedPlan === plan.id}
                                    className={cn(
                                        "relative rounded-lg sm:rounded-xl border cursor-pointer overflow-hidden transition-all duration-200",
                                        "touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                        selectedPlan === plan.id
                                            ? "border-primary bg-gradient-to-br from-muted/60 to-muted/30 shadow-sm"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <motion.div 
                                        layout="position"
                                        className="p-3 sm:p-4"
                                    >
                                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                                            <div className="flex gap-2 sm:gap-3 min-w-0 flex-1">
                                                <RadioGroupItem
                                                    value={plan.id}
                                                    id={plan.id}
                                                    className="flex-shrink-0 pointer-events-none mt-0.5 sm:mt-1"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                                        <Label
                                                            htmlFor={plan.id}
                                                            className="font-semibold sm:font-medium text-sm sm:text-base cursor-pointer leading-tight"
                                                        >
                                                            {plan.title}
                                                        </Label>
                                                        {plan.badge && (
                                                            <Badge variant="secondary" className="flex-shrink-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5 h-5 sm:h-auto">
                                                                {plan.badge}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">
                                                        {plan.description}
                                                    </p>
                                                    {plan.features.length > 0 && (
                                                        <div className="pt-2 sm:pt-3">
                                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                                {plan.features.map((feature, featureIndex) => (
                                                                    <div
                                                                        key={featureIndex}
                                                                        className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-md sm:rounded-lg bg-muted/20 border border-border/30 flex-shrink-0"
                                                                    >
                                                                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                                        <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap leading-none">
                                                                            {feature.name}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 min-w-[60px] sm:min-w-[80px]">
                                                <div className="text-base sm:text-xl font-bold sm:font-semibold leading-tight">
                                                    {
                                                        parseFloat(getCurrentPrice(plan)) >= 0 ?
                                                            `${plan.currency}${getCurrentPrice(plan)}` :
                                                            getCurrentPrice(plan)
                                                    }
                                                </div>
                                                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                                                    /{isYearly ? "year" : "month"}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <AnimatePresence initial={false}>
                                        {selectedPlan === plan.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ 
                                                    height: "auto",
                                                    opacity: 1,
                                                    transition: {
                                                        height: { duration: 0.3, ease: easing },
                                                        opacity: { duration: 0.25, delay: 0.05, ease: easing }
                                                    }
                                                }}
                                                exit={{ 
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: { duration: 0.25, ease: easing },
                                                        opacity: { duration: 0.15, ease: easing }
                                                    }
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <motion.div
                                                    initial={{ y: -8 }}
                                                    animate={{ 
                                                        y: 0,
                                                        transition: { duration: 0.25, delay: 0.05, ease: easing }
                                                    }}
                                                    exit={{ y: -8 }}
                                                    className="px-3 sm:px-4 pb-3 sm:pb-4"
                                                >
                                                    <Button 
                                                        className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium touch-manipulation"
                                                        disabled={selectedPlan === currentPlan.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPlanChange(plan.id);
                                                            handleOpenChange(false);
                                                        }}
                                                    >
                                                        {selectedPlan === currentPlan.id ? "Current Plan" : "Upgrade"}
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                ))}
                            </div>
                        </RadioGroup>
                    )}
                </div>
            </DialogContent>
        </Dialog>

    )
}
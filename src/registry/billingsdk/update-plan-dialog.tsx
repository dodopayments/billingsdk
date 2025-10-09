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
import { useState } from "react"
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

export function UpdatePlanDialog({ currentPlan, plans, onPlanChange, className, title, triggerText }: UpdatePlanDialogProps) {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const { currentTheme, previewDarkMode } = useTheme();
    const themeStyles = getThemeStyles(currentTheme, previewDarkMode);

    const getCurrentPrice = (plan: Plan) =>
        isYearly ? `${plan.yearlyPrice}` : `${plan.monthlyPrice}`

    const handlePlanChange = (planId: string) => {
        setSelectedPlan((prev) => (prev === planId ? undefined : planId));
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText || "Update Plan"}</Button>
            </DialogTrigger>
            <DialogContent className={cn("space-y-3 max-h-[90vh] flex flex-col text-foreground max-sm:overflow-scroll", className)} style={themeStyles}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                    <DialogHeader className="flex flex-row items-center justify-between py-2">
                        <DialogTitle className="text-base font-semibold">
                            {title || "Upgrade Plan"}
                        </DialogTitle>
                        <div className="flex items-center gap-2 text-sm">
                            <Toggle
                                size="sm"
                                pressed={!isYearly}
                                onPressedChange={(pressed) => setIsYearly(!pressed)}
                                className="px-3 transition-all duration-200"
                            >
                                Monthly
                            </Toggle>
                            <Toggle
                                pressed={isYearly}
                                onPressedChange={(pressed) => setIsYearly(pressed)}
                                className="px-3 transition-all duration-200"
                            >
                                Yearly
                            </Toggle>
                        </div>
                    </DialogHeader>
                </motion.div>
                <div className="flex-1 min-h-0 space-y-3">
                    <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                layout
                                onClick={() => handlePlanChange(plan.id)}
                                className={`p-4 rounded-lg border shadow-sm cursor-pointer ${selectedPlan === plan.id
                                    ? "border-primary bg-gradient-to-br from-muted/60 to-muted/30 shadow-md"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ 
                                    layout: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                                    default: { duration: 0.2 }
                                }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 min-w-0 flex-1">
                                        <RadioGroupItem
                                            value={plan.id}
                                            id={plan.id}
                                            className="flex-shrink-0 pointer-events-none"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Label
                                                    htmlFor={plan.id}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {plan.title}
                                                </Label>
                                                {plan.badge && (
                                                    <Badge variant="secondary" className="flex-shrink-0">{plan.badge}</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {plan.description}
                                            </p>
                                            {plan.features.length > 0 && (
                                                <div className="pt-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {plan.features.map((feature, featureIndex) => (
                                                            <div
                                                                key={featureIndex}
                                                                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/20 border border-border/30 flex-shrink-0"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                    {feature.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <motion.div 
                                            key={`${plan.id}-${isYearly}`}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="text-xl font-semibold"
                                        >
                                            {
                                                parseFloat(getCurrentPrice(plan)) >= 0 ?
                                                    `${plan.currency}${getCurrentPrice(plan)}` :
                                                    getCurrentPrice(plan)
                                            }
                                        </motion.div>
                                        <motion.div 
                                            key={`period-${isYearly}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="text-xs text-muted-foreground"
                                        >
                                            /{isYearly ? "year" : "month"}
                                        </motion.div>
                                    </div>
                                </div>
                                <AnimatePresence initial={false} mode="wait">
                                    {selectedPlan === plan.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ 
                                                opacity: 1, 
                                                height: "auto",
                                                transition: {
                                                    height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                                                    opacity: { duration: 0.2, delay: 0.1 }
                                                }
                                            }}
                                            exit={{ 
                                                opacity: 0,
                                                height: 0,
                                                transition: {
                                                    height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                                                    opacity: { duration: 0.15 }
                                                }
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4">
                                                <Button className="w-full"
                                                    disabled={selectedPlan === currentPlan.id}
                                                    onClick={() => {
                                                        onPlanChange(plan.id)
                                                        setIsOpen(false)
                                                    }}
                                                >{selectedPlan === currentPlan.id ? "Current Plan" : "Upgrade"}</Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </RadioGroup>
                </div>
            </DialogContent>
        </Dialog>
    )
}
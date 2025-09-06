"use client"

import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useState } from "react"

export interface HistoricalUsage {
    date: string
    usage: number
    cost?: number
    isProjected?: boolean
}

export interface UsageMetric {
    name: string
    currentUsage: number
    limit: number
    unitCost: number
    currency?: string
    historicalData: HistoricalUsage[]
    unitName?: string
}

export interface ForecastAlert {
    type: "warning" | "critical" | "info"
    message: string
    suggestedAction?: string
    costImpact?: number
}

export interface UsageForecastProps {
    metrics?: UsageMetric[]
    forecastDays?: number
    className?: string
    size?: "sm" | "md" | "lg"
    title?: string
    description?: string
    showCostProjection?: boolean
    showChart?: boolean
    alertThresholds?: number[]
}

interface ForecastData {
    projected: number
    trend: "up" | "down" | "stable"
    confidence: number
    projectedCost: number
    daysToLimit?: number
    alerts: ForecastAlert[]
}

export function UsageForecast({
    metrics = [],
    forecastDays = 30,
    className,
    size = "md",
    title,
    description,
    showCostProjection = true,
    showChart = true,
    alertThresholds = [75, 90, 100],
}: UsageForecastProps) {
    const [selectedMetric, setSelectedMetric] = useState<number>(0)
    
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">No metrics data available</p>
                </CardContent>
            </Card>
        )
    }

    const calculateTrend = (data: HistoricalUsage[]): number => {
        if (data.length < 2) return 0
        
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const recent = sortedData.slice(-7)
        const older = sortedData.slice(-14, -7)
        
        if (recent.length === 0 || older.length === 0) return 0
        
        const recentAvg = recent.reduce((sum, d) => sum + d.usage, 0) / recent.length
        const olderAvg = older.reduce((sum, d) => sum + d.usage, 0) / older.length
        
        if (olderAvg === 0 || !isFinite(olderAvg)) return 0
        
        const trendValue = ((recentAvg - olderAvg) / olderAvg) * 100
        return isFinite(trendValue) ? trendValue : 0
    }

    const forecastMetric = (metric: UsageMetric): ForecastData => {
        const trend = calculateTrend(metric.historicalData)
        const dailyGrowth = isFinite(trend) ? trend / 100 / 7 : 0
        const projected = Math.max(0, metric.currentUsage * (1 + dailyGrowth * forecastDays))
        const projectedCost = projected * metric.unitCost
        
        const alerts: ForecastAlert[] = []
        const projectedPercentage = metric.limit > 0 ? (projected / metric.limit) * 100 : 0

        const applicableThresholds = alertThresholds.filter(threshold => projectedPercentage >= threshold)
        const highestThreshold = Math.max(...applicableThresholds)
        
        if (applicableThresholds.length > 0 && metric.limit > 0) {
            const type = highestThreshold >= 100 ? "critical" : highestThreshold >= 90 ? "warning" : "info"
            const overage = Math.max(0, projected - metric.limit)
            const overageCost = overage * metric.unitCost
            
            alerts.push({
                type,
                message: highestThreshold >= 100 
                    ? `Projected to exceed limit by ${Math.round(overage).toLocaleString()} ${metric.unitName || 'units'}`
                    : `Projected to reach ${Math.round(projectedPercentage)}% of limit`,
                costImpact: highestThreshold >= 100 ? overageCost : 0,
                suggestedAction: highestThreshold >= 100 
                    ? "Consider upgrading plan or optimizing usage"
                    : "Monitor usage closely"
            })
        }

        const daysToLimit = (dailyGrowth > 0 && metric.currentUsage > 0 && metric.limit > metric.currentUsage) 
            ? Math.ceil((metric.limit - metric.currentUsage) / (metric.currentUsage * dailyGrowth))
            : undefined

        return {
            projected,
            trend: Math.abs(trend) < 2 ? "stable" : trend > 0 ? "up" : "down",
            confidence: Math.min(100, Math.max(20, 100 - Math.abs(trend) * 2)),
            projectedCost,
            daysToLimit: daysToLimit && daysToLimit > 0 && daysToLimit < forecastDays * 2 ? daysToLimit : undefined,
            alerts
        }
    }

    const sizeConfig = {
        sm: { text: "text-xs", title: "text-sm", spacing: "p-3", gap: "gap-2" },
        md: { text: "text-sm", title: "text-base", spacing: "p-4", gap: "gap-3" },
        lg: { text: "text-base", title: "text-lg", spacing: "p-6", gap: "gap-4" },
    }

    const config = sizeConfig[size]

    const getTrendIcon = (trend: "up" | "down" | "stable") => {
        const baseClasses = "inline-flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full border transition-colors duration-200"
        switch (trend) {
            case "up": 
                return (
                    <div className={cn(baseClasses, "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50")}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2L14 8H10V14H6V8H2L8 2Z" />
                        </svg>
                    </div>
                )
            case "down": 
                return (
                    <div className={cn(baseClasses, "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/50")}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 14L2 8H6V2H10V8H14L8 14Z" />
                        </svg>
                    </div>
                )
            default: 
                return (
                    <div className={cn(baseClasses, "bg-muted text-muted-foreground border-border")}>
                        <svg className="w-2.5 h-2.5" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="2" y="7" width="12" height="2" />
                        </svg>
                    </div>
                )
        }
    }

    const generateChartData = (metric: UsageMetric, forecast: ForecastData) => {
        const sortedData = [...metric.historicalData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const lastDate = new Date(sortedData[sortedData.length - 1]?.date || '2024-01-01')
        
        const chartData = [...sortedData.map(d => ({ ...d, isProjected: false }))]
        
        for (let i = 1; i <= forecastDays; i++) {
            const futureDate = new Date(lastDate)
            futureDate.setDate(lastDate.getDate() + i)
            
            const projectedUsage = metric.currentUsage + (forecast.projected - metric.currentUsage) * (i / forecastDays)
            
            chartData.push({
                date: futureDate.toISOString().split('T')[0],
                usage: projectedUsage,
                cost: projectedUsage * metric.unitCost,
                isProjected: true
            })
        }
        
        return chartData
    }

    const SimplifiedChart = ({ data, metric }: { data: Array<{ usage: number; isProjected?: boolean }>, metric: UsageMetric }) => {
        if (data.length < 2) {
            return (
                <div className="flex items-center justify-center h-16 px-3 py-2 bg-muted/30 dark:bg-muted/20 border border-border rounded-md">
                    <span className="text-xs text-muted-foreground">Insufficient data</span>
                </div>
            )
        }
        
        const usageValues = data.map(d => d.usage).filter(usage => typeof usage === 'number' && isFinite(usage))
        const maxUsage = usageValues.length > 0 ? Math.max(...usageValues, metric.limit, 0) : Math.max(metric.limit, 1)
        const chartHeight = 48
        const chartWidth = 240
        
        const bars = data.map((d, i) => {
            const safeDataLength = Math.max(data.length, 1)
            const x = safeDataLength > 1 ? (i / (safeDataLength - 1)) * chartWidth : chartWidth / 2
            const barWidth = Math.max(2, Math.max(chartWidth / safeDataLength - 1, 1))
            const safeUsage = typeof d.usage === 'number' && isFinite(d.usage) ? d.usage : 0
            const height = Math.min(chartHeight - 4, Math.max(2, (safeUsage / maxUsage) * chartHeight))
            const y = chartHeight - height
            
            return {
                x: x - barWidth / 2,
                y,
                width: barWidth,
                height,
                isProjected: d.isProjected || false
            }
        })
        
        return (
            <div className="relative w-full">
                <div className="flex items-end justify-between h-16 px-3 py-2 bg-muted/30 dark:bg-muted/20 border border-border rounded-md overflow-hidden">
                    {bars.slice(0, 20).map((bar, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "rounded-t-sm transition-colors duration-200",
                                bar.isProjected 
                                    ? "bg-muted-foreground/30 dark:bg-muted-foreground/40" 
                                    : "bg-primary/80 dark:bg-primary/90"
                            )}
                            style={{
                                width: Math.max(3, bar.width),
                                height: Math.max(2, bar.height)
                            }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: Math.max(2, bar.height), opacity: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.02 }}
                        />
                    ))}
                </div>
                
                <div className="flex justify-between items-center mt-4 px-3">
                    <span className="text-xs text-muted-foreground font-medium">Historical</span>
                    <div className="flex-1 border-t border-dashed border-muted-foreground/30 mx-4 mt-0.5" />
                    <span className="text-xs text-muted-foreground font-medium">Projected</span>
                </div>
            </div>
        )
    }

    return (
        <Card className={cn("w-full", className)}>
            {(title || description) && (
                <CardHeader className="space-y-1">
                    {title && (
                        <CardTitle className={cn("font-medium leading-tight truncate", config.title)}>
                            {title}
                        </CardTitle>
                    )}
                    {description && (
                        <CardDescription className={cn("text-muted-foreground", config.text)}>
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
            )}
            
            <CardContent className={cn("grid grid-cols-1 gap-6", config.spacing)}>
                {metrics.map((metric, i) => {
                    const forecast = forecastMetric(metric)
                    const projectedPercentage = metric.limit > 0 ? (forecast.projected / metric.limit) * 100 : 0
                    const chartData = generateChartData(metric, forecast)

                    const isSelected = selectedMetric === i

                    return (
                        <motion.div 
                            key={metric.name || i} 
                            className={cn(
                                "space-y-4 bg-muted/20 rounded-xl border transition-all duration-300", 
                                config.spacing,
                                isSelected && "border-primary bg-muted/30"
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={cn("font-medium truncate", config.title)}>{metric.name}</span>
                                    {getTrendIcon(forecast.trend)}
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    {showChart && (
                                        <Button
                                            variant={isSelected ? "default" : "outline"}
                                            size="sm"
                                            className={cn(
                                                "h-7 px-3 text-xs font-medium transition-all duration-200",
                                                isSelected && "bg-primary text-primary-foreground shadow-sm"
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedMetric(isSelected ? -1 : i)
                                            }}
                                        >
                                            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                            {isSelected ? "Hide" : "Chart"}
                                        </Button>
                                    )}
                                    <span className={cn("text-muted-foreground font-mono text-xs", config.text)}>
                                        {Math.round(forecast.confidence)}% confidence
                                    </span>
                                </div>
                            </div>

                            <div className={cn("space-y-3", config.gap)}>
                                <div className="flex justify-between items-center">
                                    <span className={cn("text-muted-foreground", config.text)}>Current</span>
                                    <span className={cn("font-mono text-right", config.text)}>
                                        {metric.currentUsage.toLocaleString()} / {metric.limit.toLocaleString()}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className={cn("text-muted-foreground", config.text)}>Projected ({forecastDays}d)</span>
                                    <span className={cn("font-mono text-right", config.text)}>
                                        {Math.round(projectedPercentage)}% of limit
                                    </span>
                                </div>

                                {showCostProjection && (
                                    <div className="flex justify-between items-center">
                                        <span className={cn("text-muted-foreground", config.text)}>Est. Cost</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium">$</span>
                                            <span className={cn("font-mono text-right", config.text)}>
                                                {forecast.projectedCost.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {forecast.daysToLimit && (
                                    <div className="flex justify-between items-center">
                                        <span className={cn("text-muted-foreground", config.text)}>Days to limit</span>
                                        <span className={cn("font-mono text-destructive dark:text-destructive text-right", config.text)}>
                                            ~{forecast.daysToLimit}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {showChart && isSelected && (
                                <motion.div
                                    className="bg-muted/30 dark:bg-muted/20 border border-border rounded-lg p-4 mt-4 shadow-sm"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <div className="flex items-center justify-center mb-4">
                                        <span className={cn("font-medium text-foreground", config.text)}>Usage Trend</span>
                                    </div>
                                    <div className="flex justify-center p-2">
                                        <SimplifiedChart data={chartData} metric={metric} />
                                    </div>
                                    <div className="flex justify-center mt-3 pt-3 border-t border-border">
                                        <span className={cn("text-muted-foreground text-xs text-center", config.text)}>Last 30 days → Next {forecastDays} days</span>
                                    </div>
                                </motion.div>
                            )}

                            {forecast.alerts.length > 0 && (
                                <div className={cn("space-y-3 mt-4", config.gap)}>
                                    {forecast.alerts.slice(0, 2).map((alert, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                                            <svg className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                            </svg>
                                            <div className="flex-1">
                                                <p className={cn("text-muted-foreground leading-relaxed", config.text)}>{alert.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
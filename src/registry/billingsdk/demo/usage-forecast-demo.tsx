"use client"

import { UsageForecast } from "@/components/billingsdk/usage-forecast"
import type { UsageMetric } from "@/components/billingsdk/usage-forecast"

const generateHistoricalData = (baseUsage: number, days: number = 30, trendType: 'up' | 'down' | 'stable' = 'up') => {
    const data = []
    const baseDate = new Date(Date.UTC(2024, 0, 1)) // January 1, 2024 UTC
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(baseDate.getTime())
        date.setUTCDate(baseDate.getUTCDate() - i)
        
        const seedValue = (i * 37) % 100 / 100
        let trendFactor = 0
        let randomVariation = 0
        
        if (trendType === 'up') {
            trendFactor = (days - i) / days * 0.4
            randomVariation = (seedValue - 0.5) * 0.2
        } else if (trendType === 'down') {
            trendFactor = -((days - i) / days * 0.3)
            randomVariation = (seedValue - 0.5) * 0.2
        } else {
            trendFactor = 0
            randomVariation = (seedValue - 0.5) * 0.05
        }
        
        const usage = Math.max(0, baseUsage * (1 + trendFactor + randomVariation))
        
        data.push({
            date: date.toISOString().split('T')[0],
            usage: Math.round(usage),
            cost: usage * 0.01
        })
    }
    return data
}

const mockMetrics: UsageMetric[] = [
    {
        name: "API Calls",
        currentUsage: 45000,
        limit: 50000,
        unitCost: 0.001,
        currency: "$",
        unitName: "calls",
        historicalData: generateHistoricalData(35000, 30, 'up')
    },
    {
        name: "Storage",
        currentUsage: 750,
        limit: 1000,
        unitCost: 0.1,
        currency: "$",
        unitName: "GB",
        historicalData: generateHistoricalData(900, 30, 'down')
    },
    {
        name: "Bandwidth",
        currentUsage: 2400,
        limit: 5000,
        unitCost: 0.05,
        currency: "$",
        unitName: "GB",
        historicalData: generateHistoricalData(2400, 30, 'stable')
    }
]

export default function UsageForecastDemo() {
    return (
        <div className="space-y-6">
            <UsageForecast
                metrics={mockMetrics}
                title="Usage Forecast"
                description="Intelligent predictions based on your usage patterns"
                showCostProjection={true}
                showChart={true}
                forecastDays={30}
            />
        </div>
    )
}
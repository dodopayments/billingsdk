"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface UsageItem {
    model: string
    inputWithCache: number
    inputWithoutCache: number
    cacheRead: number
    output: number
    totalTokens: number
    apiCost?: number
    costToYou?: number
}

interface UsageTableProps {
    className?: string
    title?: string
    description?: string
    usageHistory: UsageItem[]
    showTotal?: boolean
}

export function UsageTable({
    className,
    title,
    description,
    usageHistory,
    showTotal = true, // Default to true
}: UsageTableProps) {

    // Calculate total row if showTotal is true
    const totalRow = showTotal ? usageHistory.reduce((acc, item) => ({
        inputWithCache: acc.inputWithCache + item.inputWithCache,
        inputWithoutCache: acc.inputWithoutCache + item.inputWithoutCache,
        cacheRead: acc.cacheRead + item.cacheRead,
        output: acc.output + item.output,
        totalTokens: acc.totalTokens + item.totalTokens,
        apiCost: acc.apiCost + (item.apiCost || 0),
        costToYou: acc.costToYou + (item.costToYou || 0),
    }), {
        inputWithCache: 0,
        inputWithoutCache: 0,
        cacheRead: 0,
        output: 0,
        totalTokens: 0,
        apiCost: 0,
        costToYou: 0,
    }) : null

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num)
    }

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`
    }
    const hasApiCost = usageHistory.some(item => item.apiCost)
    const hasCostToYou = usageHistory.some(item => item.costToYou)

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableCaption className="sr-only">Model usage summary with token counts and costs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[140px]">Model</TableHead>
                                <TableHead className="text-right">
                                    <span className="hidden sm:inline">Input (w/ Cache)</span>
                                    <span className="sm:hidden">w/ Cache</span>
                                </TableHead>
                                <TableHead className="text-right">
                                    <span className="hidden sm:inline">Input (w/o Cache)</span>
                                    <span className="sm:hidden">w/o Cache</span>
                                </TableHead>
                                <TableHead className="text-right">
                                    <span className="hidden sm:inline">Cache Read</span>
                                    <span className="sm:hidden">Cache</span>
                                </TableHead>
                                <TableHead className="text-right">Output</TableHead>
                                <TableHead className="text-right">
                                    <span className="hidden sm:inline">Total Tokens</span>
                                    <span className="sm:hidden">Total</span>
                                </TableHead>
                                {hasApiCost && (
                                    <TableHead className="text-right">
                                        <span className="hidden sm:inline">API Cost</span>
                                        <span className="sm:hidden">API</span>
                                    </TableHead>
                                )}
                                {hasCostToYou && (
                                    <TableHead className="text-right">
                                        <span className="hidden sm:inline">Cost to You</span>
                                        <span className="sm:hidden">Cost</span>
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usageHistory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No usage data available
                                    </TableCell>
                                </TableRow>
                            )}
                            {usageHistory.map((item, index) => (
                                <TableRow key={item.model || index}>
                                    <TableCell className="font-medium">{item.model}</TableCell>
                                    <TableCell className="text-right">{formatNumber(item.inputWithCache)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(item.inputWithoutCache)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(item.cacheRead)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(item.output)}</TableCell>
                                    <TableCell className="text-right">{formatNumber(item.totalTokens)}</TableCell>
                                    {hasApiCost && (
                                        <TableCell className="text-right">{formatCurrency(item.apiCost || 0)}</TableCell>
                                    )}
                                    {hasCostToYou && (
                                        <TableCell className="text-right">{formatCurrency(item.costToYou || 0)}</TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {showTotal && totalRow && (
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableCell className="font-semibold">Total</TableCell>
                                    <TableCell className="text-right font-semibold">{formatNumber(totalRow.inputWithCache)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatNumber(totalRow.inputWithoutCache)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatNumber(totalRow.cacheRead)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatNumber(totalRow.output)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatNumber(totalRow.totalTokens)}</TableCell>
                                    {hasApiCost && (
                                        <TableCell className="text-right font-semibold">{formatCurrency(totalRow.apiCost || 0)}</TableCell>
                                    )}
                                    {hasCostToYou && (
                                        <TableCell className="text-right font-semibold">{formatCurrency(totalRow.costToYou || 0)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
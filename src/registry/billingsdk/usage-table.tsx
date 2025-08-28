"use client"

import { cn } from "@/lib/utils"
import {  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle} from "@/components/ui/card"
import {  Table,  TableBody,  TableCell,  TableCaption,  TableHead,  TableHeader,  TableRow} from "@/components/ui/table"

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
        <Card className={cn("w-full gap-1 py-3 md:py-6", className)}>
            <CardHeader className="space-y-2 pb-2 md:pb-4 px-3 md:px-6">
                {title && (
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                        {title}
                    </CardTitle>
                </div>
                )}
                {description && (
                    <CardDescription className="text-sm font-light text-muted-foreground leading-relaxed">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="px-3 md:px-6">
                <div className="overflow-x-auto border rounded-lg">
                    <Table>
                        <TableCaption className="sr-only">Model usage summary with token counts and costs</TableCaption>
                        <TableHeader>
                            <TableRow className="border-muted-foreground/30 bg-muted/50 hover:bg-muted/50">
                                <TableHead className="text-muted-foreground text-xs font-semibold text-left whitespace-pre-wrap">MODEL</TableHead>
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    INPUT (W/ CACHE WRITE)
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    INPUT (W/O CACHE WRITE)
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    CACHE READ
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    OUTPUT
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    TOTAL TOKENS
                                </TableHead>
                                {hasApiCost && (
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    API COST
                                </TableHead>
                                )}
                                {hasCostToYou && (
                                <TableHead className="text-muted-foreground text-xs font-semibold text-right whitespace-pre-wrap">
                                    COST TO YOU
                                </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-auto">
                            {usageHistory.length === 0 && (
                                <TableRow className="border-muted-foreground/10">
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground pl-6 pr-6">
                                        No usage data available
                                    </TableCell>
                                </TableRow>
                            )}
                            {usageHistory.map((item, index) => (
                                <TableRow key={item.model || index} className="">
                                    <TableCell className="font-mono text-foreground">
                                        {item.model}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatNumber(item.inputWithCache)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatNumber(item.inputWithoutCache)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatNumber(item.cacheRead)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatNumber(item.output)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatNumber(item.totalTokens)}
                                    </TableCell>
                                    {hasApiCost && (
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatCurrency(item.apiCost || 0)}
                                    </TableCell>
                                    )}
                                    {hasCostToYou && (
                                    <TableCell className="text-right text-foreground font-mono">
                                        {formatCurrency(item.costToYou || 0)}
                                    </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {showTotal && totalRow && (
                                <TableRow className="font-medium bg-muted/50 hover:bg-muted/50">
                                    <TableCell className="font-mono  font-semibold">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatNumber(totalRow.inputWithCache)}
                                    </TableCell>
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatNumber(totalRow.inputWithoutCache)}
                                    </TableCell>
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatNumber(totalRow.cacheRead)}
                                    </TableCell>
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatNumber(totalRow.output)}
                                    </TableCell>
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatNumber(totalRow.totalTokens)}
                                    </TableCell>
                                    {hasApiCost && (
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatCurrency(totalRow.apiCost || 0)}
                                    </TableCell>
                                    )}
                                    {hasCostToYou && (
                                    <TableCell className="text-right  font-mono font-semibold">
                                        {formatCurrency(totalRow.costToYou || 0)}
                                    </TableCell>
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
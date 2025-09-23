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
            <CardContent className="px-2 sm:px-3 md:px-6">
                <div className="overflow-x-auto border rounded-lg">
                    <Table>
                        <TableCaption className="sr-only">Model usage summary with token counts and costs</TableCaption>
                        <TableHeader>
                            <TableRow className="border-muted-foreground/30 bg-muted/50 hover:bg-muted/50">
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-left min-w-[80px] sm:min-w-[100px]">MODEL</TableHead>
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[70px] sm:min-w-[90px]">
                                    <span className="block sm:hidden">INPUT (W/ CACHE)</span>
                                    <span className="hidden sm:block">INPUT (W/ CACHE WRITE)</span>
                                </TableHead>
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[70px] sm:min-w-[90px]">
                                    <span className="block sm:hidden">INPUT (W/O CACHE)</span>
                                    <span className="hidden sm:block">INPUT (W/O CACHE WRITE)</span>
                                </TableHead>
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[60px] sm:min-w-[80px]">
                                    <span className="block sm:hidden">CACHE</span>
                                    <span className="hidden sm:block">CACHE READ</span>
                                </TableHead>
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[60px] sm:min-w-[80px]">
                                    OUTPUT
                                </TableHead>
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[70px] sm:min-w-[90px]">
                                    <span className="block sm:hidden">TOTAL</span>
                                    <span className="hidden sm:block">TOTAL TOKENS</span>
                                </TableHead>
                                {hasApiCost && (
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[60px] sm:min-w-[80px]">
                                    <span className="block sm:hidden">API</span>
                                    <span className="hidden sm:block">API COST</span>
                                </TableHead>
                                )}
                                {hasCostToYou && (
                                <TableHead className="text-muted-foreground text-[12px] sm:text-xs font-semibold text-right min-w-[60px] sm:min-w-[80px]">
                                    <span className="block sm:hidden">COST</span>
                                    <span className="hidden sm:block">COST TO YOU</span>
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
                                    <TableCell className="text-foreground">
                                        {item.model}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                        {formatNumber(item.inputWithCache)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                        {formatNumber(item.inputWithoutCache)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                        {formatNumber(item.cacheRead)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                        {formatNumber(item.output)}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                        {formatNumber(item.totalTokens)}
                                    </TableCell>
                                    {hasApiCost && (
                                    <TableCell className="text-right text-foreground">
                                        {formatCurrency(item.apiCost || 0)}
                                    </TableCell>
                                    )}
                                    {hasCostToYou && (
                                    <TableCell className="text-right text-foreground">
                                        {formatCurrency(item.costToYou || 0)}
                                    </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {showTotal && totalRow && (
                                <TableRow className="font-medium bg-muted/50 hover:bg-muted/50">
                                    <TableCell className="font-semibold">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(totalRow.inputWithCache)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(totalRow.inputWithoutCache)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(totalRow.cacheRead)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(totalRow.output)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatNumber(totalRow.totalTokens)}
                                    </TableCell>
                                    {hasApiCost && (
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(totalRow.apiCost || 0)}
                                    </TableCell>
                                    )}
                                    {hasCostToYou && (
                                    <TableCell className="text-right font-semibold">
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
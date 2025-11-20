"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export interface UsageItem {
  model: string;
  inputWithCache: number;
  inputWithoutCache: number;
  cacheRead: number;
  output: number;
  totalTokens: number;
  apiCost?: number;
  costToYou?: number;
}

interface UsageTableProps {
  className?: string;
  title?: string;
  description?: string;
  usageHistory: UsageItem[];
  showTotal?: boolean;
}

export function UsageTable({
  className,
  title,
  description,
  usageHistory,
  showTotal = true, // Default to true
}: UsageTableProps) {
  const totalRow = showTotal
    ? usageHistory.reduce(
        (acc, item) => ({
          inputWithCache: acc.inputWithCache + item.inputWithCache,
          inputWithoutCache: acc.inputWithoutCache + item.inputWithoutCache,
          cacheRead: acc.cacheRead + item.cacheRead,
          output: acc.output + item.output,
          totalTokens: acc.totalTokens + item.totalTokens,
          apiCost: acc.apiCost + (item.apiCost || 0),
          costToYou: acc.costToYou + (item.costToYou || 0),
        }),
        {
          inputWithCache: 0,
          inputWithoutCache: 0,
          cacheRead: 0,
          output: 0,
          totalTokens: 0,
          apiCost: 0,
          costToYou: 0,
        },
      )
    : null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  const hasApiCost = usageHistory.some(
    (item) => item.apiCost !== undefined && item.apiCost !== null,
  );
  const hasCostToYou = usageHistory.some(
    (item) => item.costToYou !== undefined && item.costToYou !== null,
  );

  const exportColumns = [
    { key: "model", label: "Model" },
    { key: "inputWithCache", label: "Input (w/ Cache)" },
    { key: "inputWithoutCache", label: "Input (w/o Cache)" },
    { key: "cacheRead", label: "Cache Read" },
    { key: "output", label: "Output" },
    { key: "totalTokens", label: "Total Tokens" },
    { key: "apiCost", label: "API Cost" },
    { key: "costToYou", label: "Cost to You" },
  ] as const;
  // --- CSV EXPORT LOGIC ---
  const exportToCsv = useCallback(() => {
    if (!usageHistory || usageHistory.length === 0) {
      console.warn("No data to export.");
      return;
    }
    // 1. Filter columns to match what is displayed
    const columnsToExport = exportColumns.filter((col) => {
      if (col.key === "apiCost") return hasApiCost;
      if (col.key === "costToYou") return hasCostToYou;
      return true;
    });

    // 2. Generate Header Row using display labels
    const headerRow = columnsToExport.map((col) => `"${col.label}"`).join(",");

    // 3. Helper to format a single data item into a CSV row
    const getCsvRow = (item: UsageItem & { model: string }): string => {
      return columnsToExport
        .map((col) => {
          const key = col.key as keyof UsageItem;
          const value = item[key];

          let formattedValue: string;

          if (key === "model") {
            formattedValue = item.model;
          } else if (key === "apiCost" || key === "costToYou") {
            // Apply currency formatting
            formattedValue = formatCurrency(Number(value ?? 0));
          } else {
            formattedValue = formatNumber(Number(value ?? 0)); // Apply number formatting for tokens
          }

          // Escape double quotes and wrap in quotes for robust CSV
          const escapedValue = String(formattedValue).replace(/"/g, '""');
          return `"${escapedValue}"`;
        })
        .join(",");
    };

    // 4. Map usage history rows
    let allRows = usageHistory.map((item) => getCsvRow(item));

    // 5. Conditionally add the total row
    if (showTotal && totalRow) {
      const totalItem = {
        ...totalRow,
        // Override 'model' key for the Total row label
        model: "Total",
      } as UsageItem;

      allRows.push(getCsvRow(totalItem));
    }
    // 6. Combine all content and trigger download (BOM + CRLF for Excel)
    const csvContent = [headerRow, ...allRows].join("\r\n");
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "usage_summary.csv");

    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      document.body.removeChild(link);
      // Slight delay ensures some browsers finish navigation before revoking
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }, [
    usageHistory,
    totalRow,
    showTotal,
    hasApiCost,
    hasCostToYou,
    formatNumber,
    formatCurrency,
  ]);
  // --- END CSV EXPORT LOGIC ---
  // Calculate total row if showTotal is true
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {/* Export Button on the top right */}
        {usageHistory.length > 0 && (
          <Button
            onClick={exportToCsv}
            variant="outline"
            size="sm"
            className="ml-4 h-8"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableCaption className="sr-only">
              Model usage summary with token counts and costs
            </TableCaption>
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
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No usage data available
                  </TableCell>
                </TableRow>
              )}
              {usageHistory.map((item, index) => (
                <TableRow key={item.model || index}>
                  <TableCell className="font-medium">{item.model}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.inputWithCache)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.inputWithoutCache)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.cacheRead)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.output)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.totalTokens)}
                  </TableCell>
                  {hasApiCost && (
                    <TableCell className="text-right">
                      {formatCurrency(item.apiCost || 0)}
                    </TableCell>
                  )}
                  {hasCostToYou && (
                    <TableCell className="text-right">
                      {formatCurrency(item.costToYou || 0)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {showTotal && totalRow && (
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell className="font-semibold">Total</TableCell>
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
  );
}

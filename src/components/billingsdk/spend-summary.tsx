"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "./revenue-chart";
import { cn } from "@/lib/utils";

interface SpendSummaryProps {
  data: { label: string; value: number }[];
  totalSpend: number;
  className?: string;
}

export function SpendSummary({
  data,
  totalSpend,
  className,
}: SpendSummaryProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-baseline justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Spending Summary
        </CardTitle>
        <span className="text-2xl font-bold">
          ${totalSpend.toLocaleString()}
        </span>
      </CardHeader>
      <CardContent>
        <div className="mt-4 h-[200px] w-full">
          <RevenueChart
            data={data}
            theme="minimal"
            title=""
            className="border-none bg-transparent p-0 shadow-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

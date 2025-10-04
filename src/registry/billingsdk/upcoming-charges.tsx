"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"

export interface ChargeItem {
  id: string
  description: string
  amount: string
  date: string
  type: "prorated" | "recurring" | "one-time"
}

export interface UpcomingChargesProps {
  className?: string
  title?: string
  description?: string
  nextBillingDate: string
  totalAmount: string
  charges: ChargeItem[]
}

export function UpcomingCharges({
  className,
  title = "Upcoming Charges",
  description,
  nextBillingDate,
  totalAmount,
  charges,
}: UpcomingChargesProps) {
  const getChargeTypeBadge = (type: ChargeItem["type"]) => {
    switch (type) {
      case "prorated":
        return <Badge variant="secondary">Prorated</Badge>
      case "recurring":
        return <Badge variant="default">Recurring</Badge>
      case "one-time":
        return <Badge variant="outline">One-time</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-semibold">{nextBillingDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold tabular-nums">{totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Breakdown</h3>
          <div className="space-y-2">
            {charges.map((charge) => (
              <div
                key={charge.id}
                className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium">{charge.description}</span>
                    {getChargeTypeBadge(charge.type)}
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">{charge.amount}</span>
                </div>
                <p className="text-sm text-muted-foreground">{charge.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

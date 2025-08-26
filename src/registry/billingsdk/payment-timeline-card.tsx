"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Download,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
  Zap,
} from "lucide-react"

export interface PaymentTimelineItem {
  id: string
  date: string
  amount: string
  description: string
  status: "completed" | "failed" | "pending" | "refunded" | "cancelled"
  paymentMethod?: string
  transactionId?: string
  receiptUrl?: string
  type?: "payment" | "refund" | "chargeback" | "adjustment"
}

interface PaymentTimelineCardProps {
  className?: string
  title?: string
  description?: string
  payments: PaymentTimelineItem[]
  onDownloadReceipt?: (paymentId: string) => void
  onViewDetails?: (paymentId: string) => void
  showPaymentMethod?: boolean
  showTransactionId?: boolean
  maxItems?: number
}

export function PaymentTimelineCard({
  className,
  title = "Payment Timeline",
  description = "Track your payment history and transaction details.",
  payments,
  onDownloadReceipt,
  onViewDetails,
  showPaymentMethod = true,
  showTransactionId = false,
  maxItems,
}: PaymentTimelineCardProps) {
  if (!payments) return null

  const displayedPayments = maxItems ? payments.slice(0, maxItems) : payments

  const getStatusIcon = (status: PaymentTimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-400" />
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-blue-400" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: PaymentTimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
            <Zap className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25">
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/25 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25">
            Refunded
          </Badge>
        )
      case "cancelled":
        return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: PaymentTimelineItem["type"]) => {
    switch (type) {
      case "refund":
        return <AlertCircle className="h-4 w-4 text-blue-400" />
      case "chargeback":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "adjustment":
        return <Calendar className="h-4 w-4 text-purple-400" />
      default:
        return <TrendingUp className="h-4 w-4 text-emerald-400" />
    }
  }

  const getStatusGlow = (status: PaymentTimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "shadow-emerald-500/20"
      case "failed":
        return "shadow-red-500/20"
      case "pending":
        return "shadow-amber-500/20"
      case "refunded":
        return "shadow-blue-500/20"
      default:
        return "shadow-gray-500/10"
    }
  }

  return (
    <Card
      className={cn(
        "w-full bg-gradient-to-br from-background via-background to-muted/30 border-0 shadow-2xl shadow-black/5",
        className,
      )}
    >
      {(title || description) && (
        <CardHeader className="space-y-3 pb-6">
          {title && (
            <CardTitle className="font-bold leading-tight flex items-center gap-3 text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-muted-foreground/80 text-base">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="space-y-0 px-6 pb-6">
        {displayedPayments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-muted/50 inline-block mb-4">
              <CreditCard className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">No payments yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedPayments.map((payment) => (
              <div
                key={payment.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-card via-card to-card/50 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-primary/20",
                  getStatusGlow(payment.status),
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300",
                    payment.status === "completed" && "bg-gradient-to-b from-emerald-400 to-emerald-600",
                    payment.status === "failed" && "bg-gradient-to-b from-red-400 to-red-600",
                    payment.status === "pending" && "bg-gradient-to-b from-amber-400 to-orange-500",
                    payment.status === "refunded" && "bg-gradient-to-b from-blue-400 to-blue-600",
                    payment.status === "cancelled" && "bg-gradient-to-b from-gray-400 to-gray-600",
                  )}
                />

                <div className="relative flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Status icon  */}
                    <div
                      className={cn(
                        "flex-shrink-0 p-3 rounded-xl border transition-all duration-300 group-hover:scale-110",
                        payment.status === "completed" &&
                          "bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/20",
                        payment.status === "failed" && "bg-red-500/10 border-red-500/20 shadow-lg shadow-red-500/20",
                        payment.status === "pending" &&
                          "bg-amber-500/10 border-amber-500/20 shadow-lg shadow-amber-500/20",
                        payment.status === "refunded" &&
                          "bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/20",
                        payment.status === "cancelled" && "bg-gray-500/10 border-gray-500/20",
                      )}
                    >
                      {getStatusIcon(payment.status)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(payment.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-lg leading-tight mb-2">
                            {payment.description}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 font-medium">
                              <Calendar className="h-4 w-4" />
                              {payment.date}
                            </span>
                            {showTransactionId && payment.transactionId && (
                              <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded-md">
                                {payment.transactionId}
                              </span>
                            )}
                          </div>
                          {showPaymentMethod && payment.paymentMethod && (
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                                via {payment.paymentMethod}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        {payment.receiptUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                            onClick={() =>
                              payment.receiptUrl
                                ? window.open(payment.receiptUrl, "_blank", "noopener,noreferrer")
                                : onDownloadReceipt?.(payment.id)
                            }
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        )}
                        {onViewDetails && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                            onClick={() => onViewDetails(payment.id)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Details
                            <ArrowUpRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground mb-1">{payment.amount}</div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {maxItems && payments.length > maxItems && (
          <div className="pt-6 mt-6 border-t border-border/50">
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/20 border border-muted/30">
              <p className="text-sm font-medium text-muted-foreground">
                Showing {maxItems} of {payments.length} payments
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">View all transactions in your dashboard</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

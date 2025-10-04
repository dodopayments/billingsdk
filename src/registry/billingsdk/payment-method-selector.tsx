"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, CreditCard, QrCode, Wallet, Landmark, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type PaymentMethod = "cards" | "digital-wallets" | "upi" | "bnpl-services"

interface PaymentOption {
  id: PaymentMethod
  name: string
  description: string
  icon: React.ReactNode
  examples: string[]
  details: string
  features: string[]
}

interface FormData {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  email?: string
  phone?: string
  upiId?: string
  income?: string
}

const paymentOptions: PaymentOption[] = [
  {
    id: "cards",
    name: "Cards",
    description: "Visa, Mastercard, etc.",
    icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
    examples: ["Visa", "Mastercard", "American Express", "Discover"],
    details: "Secure card payments with fraud protection",
    features: ["Instant processing", "Worldwide acceptance", "Cashback rewards", "Purchase protection"],
  },
  {
    id: "digital-wallets",
    name: "Digital Wallets",
    description: "Apple Pay, Google Pay, etc.",
    icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />,
    examples: ["Apple Pay", "Google Pay", "Cash App", "Venmo"],
    details: "Quick and secure mobile payments",
    features: ["Touch/Face ID security", "No card details shared", "Fast checkout", "Loyalty integration"],
  },
  {
    id: "upi",
    name: "UPI",
    description: "Unified Payments Interface",
    icon: <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />,
    examples: ["PhonePe", "Google Pay", "Paytm", "BHIM"],
    details: "Real-time bank-to-bank transfers",
    features: ["24/7 availability", "No transaction fees", "QR code payments", "Bank account linking"],
  },
  {
    id: "bnpl-services",
    name: "Buy Now, Pay Later",
    description: "Klarna, Affirm, Afterpay",
    icon: <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />,
    examples: ["Klarna", "Affirm", "Afterpay", "Sezzle"],
    details: "Buy now, pay later in installments",
    features: ["Split payments", "No interest options", "Flexible terms", "Credit building"],
  },
]

export interface PaymentMethodSelectorProps {
  className?: string
  onProceed?: (method: PaymentMethod, data: FormData) => void
}

export function PaymentMethodSelector({ onProceed }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState<FormData>({})

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(selectedMethod === method ? null : method)
    setFormData({})
  }

  const handleClose = () => {
    setSelectedMethod(null)
    setFormData({})
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderForm = (method: PaymentMethod) => {
    switch (method) {
      case "cards":
        return (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2">
                <Label htmlFor="cardNumber" className="text-xs sm:text-sm font-medium text-foreground">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cardNumber", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-xs sm:text-sm font-medium text-foreground">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("expiryDate", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-xs sm:text-sm font-medium text-foreground">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={formData.cvv || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cvv", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardholderName" className="text-xs sm:text-sm font-medium text-foreground">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.cardholderName || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cardholderName", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )

      case "digital-wallets":
        return (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs sm:text-sm font-medium text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You'll be redirected to your selected wallet app to complete the payment securely.
              </p>
            </div>
          </motion.div>
        )

      case "upi":
        return (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <Label htmlFor="upiId" className="text-xs sm:text-sm font-medium text-foreground">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@paytm"
                value={formData.upiId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("upiId", e.target.value)}
                className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Enter your UPI ID to receive a payment request. Complete the payment in your UPI app.
              </p>
            </div>
          </motion.div>
        )

      case "bnpl-services":
        return (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="bnplEmail" className="text-xs sm:text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="bnplEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="bnplPhone" className="text-xs sm:text-sm font-medium text-foreground">Phone Number</Label>
                <Input
                  id="bnplPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="income" className="text-xs sm:text-sm font-medium text-foreground">
                  Annual Income 
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Optional</Badge>
                </Label>
                <Input
                  id="income"
                  type="text"
                  placeholder="$50,000"
                  value={formData.income || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("income", e.target.value)}
                  className="mt-1.5 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                You'll be redirected to complete a quick eligibility check and set up your payment plan.
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="max-w-lg mx-auto text-left overflow-hidden shadow-lg w-full">
      <CardHeader className="px-4 sm:px-6 pb-2">
        <CardTitle className="text-base font-semibold">
          Payment Methods
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred payment method to continue
        </p>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 space-y-3">
        <AnimatePresence mode="wait">
          {paymentOptions.map((option) => {
            const isSelected = selectedMethod === option.id

            return (
              <motion.div
                key={option.id}
                onClick={() => handleMethodSelect(option.id)}
                className={`p-4 rounded-lg border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer ${
                  isSelected
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClose()
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 z-20"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </motion.button>
                )}

                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 sm:p-3 rounded-lg border shadow-sm transition-all duration-300 ${
                    isSelected 
                      ? "bg-background border-primary/30" 
                      : "bg-background border-border/50 hover:border-primary/30 hover:shadow-md"
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-medium transition-colors ${
                      isSelected ? "text-primary" : "text-foreground hover:text-primary"
                    }`}>
                      {option.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4">
                        {renderForm(option.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <AnimatePresence>
          {!selectedMethod && (
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Button disabled className="w-full mt-4">
                <span>Select Payment Method</span>
                <span>→</span>
              </Button>
            </motion.div>
          )}
          {selectedMethod && (
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Button
                className="w-full mt-4"
                onClick={() => {
                  if (onProceed) onProceed(selectedMethod, formData)
                }}
              >
                <span>Proceed with Payment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}



"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, CreditCard, QrCode, Wallet, Landmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "@/components/ui/label"

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
    icon: <CreditCard className="w-5 h-5" />,
    examples: ["Visa", "Mastercard", "American Express", "Discover"],
    details: "Secure card payments with fraud protection",
    features: ["Instant processing", "Worldwide acceptance", "Cashback rewards", "Purchase protection"],
  },
  {
    id: "digital-wallets",
    name: "Digital Wallets",
    description: "Apple Pay, Cash App, etc.",
    icon: <Wallet className="w-5 h-5" />,
    examples: ["Apple Pay", "Google Pay", "Cash App", "Venmo"],
    details: "Quick and secure mobile payments",
    features: ["Touch/Face ID security", "No card details shared", "Fast checkout", "Loyalty integration"],
  },
  {
    id: "upi",
    name: "UPI",
    description: "Unified Payments Interface (India)",
    icon: <QrCode className="w-5 h-5" />,
    examples: ["PhonePe", "Google Pay", "Paytm", "BHIM"],
    details: "Real-time bank-to-bank transfers",
    features: ["24/7 availability", "No transaction fees", "QR code payments", "Bank account linking"],
  },
  {
    id: "bnpl-services",
    name: "BNPL Services",
    description: "Klarna, Affirm, and similar options",
    icon: <Landmark className="w-5 h-5" />,
    examples: ["Klarna", "Affirm", "Afterpay", "Sezzle"],
    details: "Buy now, pay later in installments",
    features: ["Split payments", "No interest options", "Flexible terms", "Credit building"],
  },
]

export interface PaymentMethodSelectorProps {
  className?: string
  onProceed?: (method: PaymentMethod, data: FormData) => void
}

export default function PaymentMethodSelector({ className, onProceed }: PaymentMethodSelectorProps) {
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
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="cardNumber" className="text-xs font-medium">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cardNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-xs font-medium">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("expiryDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-xs font-medium">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={formData.cvv || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cvv", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardholderName" className="text-xs font-medium">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.cardholderName || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cardholderName", e.target.value)}
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
            <div>
              <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground">
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
              <Label htmlFor="upiId" className="text-xs font-medium">UPI ID</Label>
              <Input
                id="upiId"
                type="text"
                placeholder="yourname@paytm"
                value={formData.upiId || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("upiId", e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID to receive a payment request. You can complete the payment in your UPI app.
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
            <div>
              <Label htmlFor="bnplEmail" className="text-xs font-medium">Email Address</Label>
              <Input
                id="bnplEmail"
                type="email"
                placeholder="john@example.com"
                value={formData.email || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bnplPhone" className="text-xs font-medium">Phone Number</Label>
              <Input
                id="bnplPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="income" className="text-xs font-medium">Annual Income (Optional)</Label>
              <Input
                id="income"
                type="text"
                placeholder="$50,000"
                value={formData.income || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("income", e.target.value)}
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground">
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
    <motion.div
      className={"w-full max-w-md mx-auto ".concat(className || "")}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="backdrop-blur-sm shadow-2xl overflow-hidden">
        <CardHeader>
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <CardTitle className="text-center text-xl">Payment Methods</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent>

        <div className="space-y-2 relative">
          <AnimatePresence>
            {paymentOptions.map((option, index) => {
              const isSelected = selectedMethod === option.id
              const selectedIndex = paymentOptions.findIndex((p) => p.id === selectedMethod)
              const isAboveSelected = selectedMethod && index < selectedIndex
              const isBelowSelected = selectedMethod && index > selectedIndex

              const shouldShow = !selectedMethod || isSelected

              return (
                <motion.div
                  key={option.id}
                  initial={{ x: -15, opacity: 0, scale: 0.97 }}
                  animate={
                    shouldShow
                      ? { x: 0, opacity: 1, scale: 1, y: 0 }
                      : {
                          x: 0,
                          opacity: 0,
                          scale: 0.97,
                          y: isAboveSelected ? -40 : isBelowSelected ? 40 : 0,
                        }
                  }
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                    y: isAboveSelected ? -40 : isBelowSelected ? 40 : 0,
                    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                  }}
                  transition={{
                    delay: shouldShow ? index * 0.06 : 0,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative"
                  style={{
                    position: shouldShow ? "relative" : "absolute",
                    width: shouldShow ? "auto" : "100%",
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  <motion.div
                    whileHover={
                      !isSelected
                        ? {
                            scale: 1.005,
                            y: -0.5,
                            transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                          }
                        : {}
                    }
                    whileTap={{ scale: 0.995, transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] } }}
                  >
                    <motion.div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleMethodSelect(option.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleMethodSelect(option.id)
                        }
                      }}
                      className={`w-full p-4 rounded-lg transition-all duration-300 group cursor-pointer hover:bg-muted/30 ${
                        isSelected
                          ? "bg-muted/10 shadow-lg shadow-black/5"
                          : "hover:shadow-md"
                      }`}
                    >
                        <div className="relative">
                          {isSelected && (
                            <motion.div
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClose()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleClose()
                                }
                              }}
                              className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.15, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                          )}

                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="p-3 rounded-lg bg-background border shadow-sm group-hover:shadow-md transition-all duration-300"
                              whileHover={!isSelected ? { rotate: [0, -1, 1, 0], scale: 1.02 } : {}}
                              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              {option.icon}
                            </motion.div>
                            <div className="flex-1 text-left">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {option.name}
                              </h3>
                              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, y: -10 }}
                              animate={{ height: "auto", opacity: 1, y: 0 }}
                              exit={{ height: 0, opacity: 0, y: -10 }}
                              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-hidden"
                            >
                              <motion.div
                                initial={{ y: -8 }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="pt-4 mt-4"
                              >
                                <div className="space-y-4 text-left">{renderForm(option.id)}</div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!selectedMethod && (
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <Button
                className="w-full mt-6"
              >
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
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <Button
                className="w-full mt-6"
                onClick={() => {
                  if (onProceed) onProceed(selectedMethod, formData)
                }}
              >
                <span>Proceed with Payment</span>
                <span>→</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}



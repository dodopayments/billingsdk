"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export interface finalTextProps {
  text: string
}

export interface PaymentCardProps {
  title: string
  description: string
  price: string
  feature?: string
  featuredescription?: string
  feature2?: string
  feature2description?: string
  finalText?: finalTextProps[]
  onPay?: (data: { cardNumber: string; expiry: string; cvc: string }) => Promise<void> | void
  className?: string
}

export function PaymentCard({ title, description, price, feature, featuredescription, feature2, feature2description, finalText = [], onPay, className }: PaymentCardProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [index, setIndex] = useState(0)
  const [errors, setErrors] = useState<{ card?: string; expiry?: string; cvc?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    
    // Card number validation
    if (!/^[0-9 ]{16,19}$/.test(cardNumber)) {
      newErrors.card = "Card number must be 16 digits and only numbers."
    }

    // Expiry validation 
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Enter a valid expiry date (MM/YY)."
    } else {
      const [month, year] = expiry.split("/").map(Number)
      const now = new Date()
      const expDate = new Date(2000 + year, month - 1)
      if (expDate < now) {
        newErrors.expiry = "Expiry date cannot be in the past."
      }
    }

    // CVC validation
    if (!/^[0-9]{3,4}$/.test(cvc)) {
      newErrors.cvc = "CVC must be 3 or 4 digits."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePay = () => {
    if (validate()) {
      if (onPay) {
        onPay({ cardNumber, expiry, cvc })
        console.log("Payment processed!")
      } else {
        console.log("error")
      }
    }
  }

  // Final text animation
  useEffect(() => {
    if (!finalText || finalText.length === 0) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % finalText.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [finalText])

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="order-2 md:order-1">
          <div className="md:sticky md:top-6 space-y-4">
            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">${price || "320"}.00</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-semibold tabular-nums">${price || "320"}.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{feature || "Payment & Invoice"}</p>
                      <p className="text-sm text-muted-foreground">
                        {featuredescription || "Automated billing and detailed transaction records"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{feature2 || "Priority Support"}</p>
                      <p className="text-sm text-muted-foreground">
                        {feature2description || "Faster response times and technical support"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Form */}
        <Card className="order-1 md:order-2">
          <CardHeader>
            <CardTitle>{title || "Complete your payment"}</CardTitle>
            <CardDescription>
              {description || "Enter your card details to finalize your subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card number</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-6 flex items-center justify-center overflow-hidden z-10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={index}
                      src={[
                        "https://img.icons8.com/color/48/visa.png",
                        "https://img.icons8.com/color/48/mastercard-logo.png",
                        "https://img.icons8.com/color/48/amex.png",
                        "https://img.icons8.com/color/48/rupay.png",
                      ][index % 4]}
                      alt="card"
                      className="w-6 h-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                </div>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="pl-14 font-mono tracking-wider"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              {errors.card && <p className="text-sm text-destructive">{errors.card}</p>}
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry date</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="font-mono"
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiry && <p className="text-sm text-destructive">{errors.expiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="font-mono"
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvc && <p className="text-sm text-destructive">{errors.cvc}</p>}
              </div>
            </div>

            {/* Discount Code */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount code (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="discount"
                  placeholder="Enter code"
                  maxLength={12}
                  className="flex-1"
                />
                <Button variant="secondary" type="button">
                  Apply
                </Button>
              </div>
            </div>

            {/* Pay Button */}
            <Button className="w-full mt-2" onClick={handlePay}>
              Pay ${price || "320"}.00
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

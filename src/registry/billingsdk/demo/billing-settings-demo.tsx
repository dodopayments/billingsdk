"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { BillingSettings } from "@/components/billingsdk/billing-settings"
import { CreditCard } from "lucide-react"

type InvoiceFormat = "PDF" | "HTML"

interface Card {
  id: string
  last4: string
  brand: "Visa" | "MasterCard" | "Amex" | "Other"
  expiry: string
  primary: boolean
}

interface NewCardForm {
  number: string
  expiry: string
  cvc: string
}

export default function BillingSettingsDemo() {
  const [activeTab, setActiveTab] = useState<"general" | "payment" | "invoices" | "limits">("general")
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true)
  const [usageAlerts, setUsageAlerts] = useState<boolean>(true)
  const [invoiceReminders, setInvoiceReminders] = useState<boolean>(false)
  const [cards, setCards] = useState<Card[]>([
    { id: "1", last4: "4242", brand: "Visa", expiry: "12/25", primary: true },
  ])
  const [invoiceFormat, setInvoiceFormat] = useState<InvoiceFormat>("PDF")
  const [overageProtection, setOverageProtection] = useState<boolean>(true)
  const [usageLimitAlerts, setUsageLimitAlerts] = useState<boolean>(true)
  const [newCard, setNewCard] = useState<NewCardForm>({
    number: "",
    expiry: "",
    cvc: "",
  })
  const [open, setOpen] = useState<boolean>(false)


  const handleToggleEmailNotifications = (checked: boolean) => {
    console.log(`Email notifications toggled to: ${checked}`)
    setEmailNotifications(checked)
  }

  const handleToggleUsageAlerts = (checked: boolean) => {
    console.log(`Usage alerts toggled to: ${checked}`)
    setUsageAlerts(checked)
  }

  const handleToggleInvoiceReminders = (checked: boolean) => {
    console.log(`Invoice reminders toggled to: ${checked}`)
    setInvoiceReminders(checked)
  }

  const handleChangeInvoiceFormat = (format: InvoiceFormat) => {
    console.log(`Invoice format changed to: ${format}`)
    setInvoiceFormat(format)
  }

  const handleEditBillingAddress = () => {
    console.log("Edit billing address button clicked")
    toast.info("Edit billing address clicked!")
  }

  const handleToggleOverageProtection = (checked: boolean) => {
    console.log(`Overage protection toggled to: ${checked}`)
    setOverageProtection(checked)
  }

  const handleToggleUsageLimitAlerts = (checked: boolean) => {
    console.log(`Usage limit alerts toggled to: ${checked}`)
    setUsageLimitAlerts(checked)
  }

  const isValidCardNumber = (number: string): boolean => {
    const normalized = number.replace(/\s/g, "")
    return normalized.length >= 13 && normalized.length <= 19 && /^\d+$/.test(normalized)
  }

  const isValidExpiry = (expiry: string): boolean => {
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      return false
    }
    const [month, year] = expiry.split('/').map(Number)
    const currentYear = Number(String(new Date().getFullYear()).slice(-2))
    const currentMonth = new Date().getMonth() + 1
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false
    }
    return true
  }

  const isValidCvc = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc)
  }
 
  const detectCardBrand = (number: string): Card["brand"] => {
    if (number.startsWith("4")) return "Visa"
    if (/^5[1-5]/.test(number)) return "MasterCard"
    if (/^3[47]/.test(number)) return "Amex"
    return "Other"
  }

  const handleAddCard = (): void => {
    if (!isValidCardNumber(newCard.number)) {
      toast.error("Please enter a valid card number.")
      return
    }
    if (!isValidExpiry(newCard.expiry)) {
      toast.error("Please enter a valid expiry date (MM/YY) that's not in the past.")
      return
    }
    if (!isValidCvc(newCard.cvc)) {
      toast.error("Please enter a valid CVC.")
      return
    }
    const last4 = newCard.number.slice(-4)
    const brand = detectCardBrand(newCard.number)
    const newCardData: Card = {
      id: String(cards.length + 1),
      last4,
      brand,
      expiry: newCard.expiry,
      primary: cards.length === 0,
    }
    setCards([...cards, newCardData])
    setNewCard({ number: "", expiry: "", cvc: "" })
    setOpen(false)
    toast.success("Card added successfully!")
  }

  const formatCardNumber = (value: string): string => {
    const rawValue = value.replace(/\D/g, '');
    const formattedValue = rawValue.match(/.{1,4}/g)?.join(' ') || '';
    return formattedValue;
  };

  return (
    <div className="p-6">
      <BillingSettings
        activeTab={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab as "general" | "payment" | "invoices" | "limits")}
        emailNotifications={emailNotifications}
        onEmailNotificationsChange={handleToggleEmailNotifications}
        usageAlerts={usageAlerts}
        onUsageAlertsChange={handleToggleUsageAlerts}
        invoiceReminders={invoiceReminders}
        onInvoiceRemindersChange={handleToggleInvoiceReminders}
        cards={cards}
        onAddCard={() => setOpen(true)}
        invoiceFormat={invoiceFormat}
        onInvoiceFormatChange={handleChangeInvoiceFormat}
        onEditBillingAddress={handleEditBillingAddress}
        overageProtection={overageProtection}
        onOverageProtectionChange={handleToggleOverageProtection}
        usageLimitAlerts={usageLimitAlerts}
        onUsageLimitAlertsChange={handleToggleUsageLimitAlerts}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Card</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="number">Card Number</Label>
              <div className="relative">
                <Input
                  id="number"
                  value={formatCardNumber(newCard.number)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\s/g, '');
                    if (rawValue.length <= 19) {
                      setNewCard({ ...newCard, number: rawValue });
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="pr-10"
                  maxLength={19}
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={newCard.expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    if (value.length <= 5) {
                      setNewCard({ ...newCard, expiry: value });
                    }
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="password"
                  value={newCard.cvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setNewCard({ ...newCard, cvc: value });
                    }
                  }}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
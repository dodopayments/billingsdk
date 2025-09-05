"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, CreditCard, Plus } from "lucide-react"

const tabs = [
  { id: "general", label: "General" },
  { id: "payment", label: "Payment" },
  { id: "invoices", label: "Invoices" },
  { id: "limits", label: "Limits" },
]

interface CardInfo {
  id: string
  last4: string
  brand: string
  expiry: string
  primary?: boolean
}

interface BillingSettingsProps {
  
  activeTab: string
  onTabChange: (tab: string) => void

  
  emailNotifications: boolean
  onEmailNotificationsChange: (value: boolean) => void

  usageAlerts: boolean
  onUsageAlertsChange: (value: boolean) => void

  invoiceReminders: boolean
  onInvoiceRemindersChange: (value: boolean) => void

  
  cards: CardInfo[]
  onAddCard: () => void

  
  invoiceFormat: "PDF" | "HTML"
  onInvoiceFormatChange: (format: "PDF" | "HTML") => void
  onEditBillingAddress: () => void

  
  overageProtection: boolean
  onOverageProtectionChange: (value: boolean) => void

  usageLimitAlerts: boolean
  onUsageLimitAlertsChange: (value: boolean) => void
}

interface SettingItemProps {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function SettingItem({ title, description, checked, onCheckedChange }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex space-x-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            console.log("[v0] Tab button clicked:", tab.id)
            onTabChange(tab.id)
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function BillingSettings({
  activeTab,
  onTabChange,
  emailNotifications,
  onEmailNotificationsChange,
  usageAlerts,
  onUsageAlertsChange,
  invoiceReminders,
  onInvoiceRemindersChange,
  cards,
  onAddCard,
  invoiceFormat,
  onInvoiceFormatChange,
  onEditBillingAddress,
  overageProtection,
  onOverageProtectionChange,
  usageLimitAlerts,
  onUsageLimitAlertsChange,
}: BillingSettingsProps) {
  const renderGeneralContent = () => (
    <div className="space-y-0 divide-y">
      <SettingItem
        title="Email notifications"
        description="Receive billing updates via email"
        checked={emailNotifications}
        onCheckedChange={onEmailNotificationsChange}
      />
      <SettingItem
        title="Usage alerts"
        description="Get notified when approaching limits"
        checked={usageAlerts}
        onCheckedChange={onUsageAlertsChange}
      />
      <SettingItem
        title="Invoice reminders"
        description="Remind me before auto-renewal"
        checked={invoiceReminders}
        onCheckedChange={onInvoiceRemindersChange}
      />
    </div>
  )

  const renderPaymentContent = () => (
    <div className="space-y-4">
      {cards.map((card) => (
        <div key={card.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">•••• •••• •••• {card.last4}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {card.brand} • Expires {card.expiry}
              </p>
            </div>
          </div>
          {card.primary && <Badge variant="secondary">Primary</Badge>}
        </div>
      ))}
      <Button variant="outline" className="w-full bg-transparent" onClick={onAddCard}>
        <Plus className="mr-2 h-4 w-4" />
        Add new card
      </Button>
    </div>
  )

  const renderInvoicesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">Invoice format</h3>
          <p className="text-sm text-muted-foreground">Choose PDF or HTML format</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-20 bg-transparent">
              {invoiceFormat}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onInvoiceFormatChange("PDF")}>PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInvoiceFormatChange("HTML")}>HTML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">Billing address</h3>
          <p className="text-sm text-muted-foreground">Update your billing address</p>
        </div>
        <Button variant="outline" onClick={onEditBillingAddress}>
          Edit
        </Button>
      </div>
    </div>
  )

  const renderLimitsContent = () => (
    <div className="space-y-0 divide-y">
      <SettingItem
        title="Overage protection"
        description="Prevent accidental overages"
        checked={overageProtection}
        onCheckedChange={onOverageProtectionChange}
      />
      <SettingItem
        title="Usage limit alerts"
        description="Alert at 80% and 95% usage"
        checked={usageLimitAlerts}
        onCheckedChange={onUsageLimitAlertsChange}
      />
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralContent()
      case "payment":
        return renderPaymentContent()
      case "invoices":
        return renderInvoicesContent()
      case "limits":
        return renderLimitsContent()
      default:
        return renderGeneralContent()
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Billing settings</CardTitle>
        <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      </CardHeader>
      <CardContent>{renderTabContent()}</CardContent>
    </Card>
  )
}
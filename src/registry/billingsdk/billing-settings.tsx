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
  className?: string
}

interface SettingItemProps {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function SettingItem({ title, description, checked, onCheckedChange }: SettingItemProps) {
  const switchId = `switch-${title.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="space-y-0.5 flex-1 min-w-0">
        <label htmlFor={switchId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {title}
        </label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch 
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  )
}

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
            activeTab === tab.id
              ? "bg-background text-foreground shadow"
              : "hover:bg-background/50 hover:text-foreground"
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
  className,
}: BillingSettingsProps) {
  const renderGeneralContent = () => (
    <div className="space-y-0 divide-y divide-border">
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
        <div key={card.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 sm:p-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm">•••• {card.last4}</span>
                {card.primary && <Badge variant="secondary">Primary</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {card.brand} • Expires {card.expiry}
              </p>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full" onClick={onAddCard}>
        <Plus className="mr-2 h-4 w-4" />
        Add new card
      </Button>
    </div>
  )

  const renderInvoicesContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 flex-1">
          <h3 className="text-sm font-medium">Invoice format</h3>
          <p className="text-sm text-muted-foreground">Choose PDF or HTML format</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 flex-1">
          <h3 className="text-sm font-medium">Billing address</h3>
          <p className="text-sm text-muted-foreground">Update your billing address</p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onEditBillingAddress}>
          Edit
        </Button>
      </div>
    </div>
  )

  const renderLimitsContent = () => (
    <div className="space-y-0 divide-y divide-border">
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
    <div className={`w-full px-4 sm:px-0 ${className || ''}`}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Billing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
          {renderTabContent()}
        </CardContent>
      </Card>
    </div>
  )
}

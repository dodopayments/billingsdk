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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-start py-4 gap-3 sm:gap-4 w-full">
      <div className="space-y-1 min-w-0">
        <h3 className="font-medium text-foreground break-words hyphens-auto">{title}</h3>
        <p className="text-sm text-muted-foreground break-words hyphens-auto">{description}</p>
      </div>
      <div className="sm:justify-self-end">
        <Switch checked={checked} onCheckedChange={onCheckedChange} className="flex-shrink-0" />
      </div>
    </div>
  )
}

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            console.log("[v0] Tab button clicked:", tab.id)
            onTabChange(tab.id)
          }}
          className={`w-full sm:flex-1 rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <span className="truncate">{tab.label}</span>
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
        <div key={card.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 sm:p-4 gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs sm:text-sm truncate">•••• •••• •••• {card.last4}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {card.brand} • Expires {card.expiry}
              </p>
            </div>
          </div>
          {card.primary && <Badge variant="secondary" className="flex-shrink-0 text-xs self-start sm:self-auto">Primary</Badge>}
        </div>
      ))}
      <Button variant="outline" className="w-full bg-transparent" onClick={onAddCard}>
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Add new card</span>
        <span className="sm:hidden">Add card</span>
      </Button>
    </div>
  )

  const renderInvoicesContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-medium text-foreground">Invoice format</h3>
          <p className="text-sm text-muted-foreground">Choose PDF or HTML format</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-20 bg-transparent">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-medium text-foreground">Billing address</h3>
          <p className="text-sm text-muted-foreground">Update your billing address</p>
        </div>
        <Button variant="outline" onClick={onEditBillingAddress} className="w-full sm:w-auto">
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
    <Card className={`mx-auto md:min-w-xl max-w-2xl overflow-hidden ${className || ''}`}>
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg sm:text-xl">Billing settings</CardTitle>
        <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      </CardHeader>
      <CardContent className="px-3 sm:px-6 overflow-hidden">
        <div className="w-full">
          {renderTabContent()}
        </div>
      </CardContent>
    </Card>
  )
}
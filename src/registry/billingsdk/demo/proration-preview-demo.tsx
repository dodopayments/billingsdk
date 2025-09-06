"use client";

import { ProrationPreview } from "@/components/billingsdk/proration-preview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const currentPlan = {
  plan: {
    id: "pro",
    title: "Pro",
    description: "Best for small teams",
    monthlyPrice: "29.99",
    yearlyPrice: "299.99",
    currency: "$",
    buttonText: "Current Plan",
    features: [
      { name: "Advanced features", icon: "check" },
      { name: "Priority support", icon: "check" },
    ],
  },
  type: "monthly" as const,
  price: "29.99",
  nextBillingDate: "2024-01-15",
  paymentMethod: "•••• 4242",
  status: "active" as const,
};

const yearlyCurrentPlan = {
  plan: {
    id: "pro-yearly",
    title: "Pro", 
    description: "Best for small teams",
    monthlyPrice: "29.99",
    yearlyPrice: "299.99",
    currency: "$",
    buttonText: "Current Plan",
    features: [
      { name: "Advanced features", icon: "check" },
      { name: "Priority support", icon: "check" },
    ],
  },
  type: "yearly" as const,
  price: "299.99",
  nextBillingDate: "2024-12-15",
  paymentMethod: "•••• 4242",
  status: "active" as const,
};

const basicPlan = {
  id: "basic",
  title: "Basic",
  description: "Perfect for getting started",
  monthlyPrice: "9.99",
  yearlyPrice: "99.99", 
  currency: "$",
  buttonText: "Downgrade",
  features: [
    { name: "Basic features", icon: "check" },
    { name: "Email support", icon: "check" },
  ],
};

const enterprisePlan = {
  id: "enterprise",
  title: "Enterprise",
  description: "For large organizations",
  monthlyPrice: "99.99",
  yearlyPrice: "999.99",
  currency: "$",
  buttonText: "Upgrade",
  features: [
    { name: "All features", icon: "check" },
    { name: "Priority support", icon: "check" },
    { name: "Custom integrations", icon: "check" },
  ],
};

const customPlan = {
  id: "custom",
  title: "Custom",
  description: "Tailored for your needs",
  monthlyPrice: "Custom",
  yearlyPrice: "Custom",
  currency: "$",
  buttonText: "Contact Sales",
  features: [
    { name: "Custom features", icon: "check" },
    { name: "Dedicated support", icon: "check" },
  ],
};

export function ProrationPreviewDemo() {
  return (
    <div className="space-y-8">

      <Tabs defaultValue="upgrade" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="downgrade">Downgrade</TabsTrigger>
          <TabsTrigger value="cycle-change">Cycle Change</TabsTrigger>
          <TabsTrigger value="next-cycle">Next Cycle</TabsTrigger>
        </TabsList>

        <TabsContent value="upgrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly to Enterprise Upgrade</CardTitle>
              <CardDescription>
                Upgrading from Pro monthly to Enterprise monthly with 15 days remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={currentPlan}
                newPlan={enterprisePlan}
                billingCycle="monthly"
                daysRemaining={15}
                effectiveDate="immediately"
                theme="minimal"
                onConfirm={() => console.log("Upgrade confirmed")}
                onCancel={() => console.log("Upgrade cancelled")}
              />
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="downgrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise to Basic Downgrade</CardTitle>
              <CardDescription>
                Downgrading from Enterprise to Basic with account credit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={{
                  plan: enterprisePlan,
                  type: "monthly",
                  price: "99.99",
                  nextBillingDate: "2024-01-15",
                  paymentMethod: "•••• 4242",
                  status: "active",
                }}
                newPlan={basicPlan}
                billingCycle="monthly"
                daysRemaining={20}
                effectiveDate="immediately"
                theme="minimal"
                onConfirm={() => console.log("Downgrade confirmed")}
                onCancel={() => console.log("Downgrade cancelled")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycle-change" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly to Yearly Switch</CardTitle>
              <CardDescription>
                Switching from monthly to yearly billing for the same plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={currentPlan}
                newPlan={currentPlan.plan}
                billingCycle="yearly"
                daysRemaining={10}
                effectiveDate="immediately"
                theme="minimal"
                onConfirm={() => console.log("Cycle change confirmed")}
                onCancel={() => console.log("Cycle change cancelled")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yearly to Monthly Switch</CardTitle>
              <CardDescription>
                Switching from yearly to monthly billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={yearlyCurrentPlan}
                newPlan={yearlyCurrentPlan.plan}
                billingCycle="monthly"
                daysRemaining={120}
                effectiveDate="immediately"
                theme="classic"
                onConfirm={() => console.log("Cycle change confirmed")}
                onCancel={() => console.log("Cycle change cancelled")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next-cycle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Cycle Change</CardTitle>
              <CardDescription>
                Plan change effective at the next billing cycle with no immediate charge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={currentPlan}
                newPlan={enterprisePlan}
                billingCycle="monthly"
                daysRemaining={25}
                effectiveDate="next billing cycle"
                theme="minimal"
                onConfirm={() => console.log("Next cycle change confirmed")}
                onCancel={() => console.log("Next cycle change cancelled")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Pricing Scenario</CardTitle>
              <CardDescription>
                Handling custom/enterprise pricing that doesn't follow standard rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProrationPreview
                currentPlan={currentPlan}
                newPlan={customPlan}
                billingCycle="monthly"
                daysRemaining={12}
                effectiveDate="next billing cycle"
                theme="classic"
                onConfirm={() => console.log("Custom plan confirmed")}
                onCancel={() => console.log("Custom plan cancelled")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
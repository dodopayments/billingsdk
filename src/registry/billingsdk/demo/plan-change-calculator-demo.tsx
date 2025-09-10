"use client";

import { PlanChangeCalculator } from "@/registry/billingsdk/plan-change-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlanChangeCalculatorDemo() {
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
              <PlanChangeCalculator
                currentPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Advanced features", "Priority support"]
                }}
                newPlan={{
                  id: "enterprise",
                  name: "Enterprise", 
                  price: 99.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["All features", "Priority support", "Custom integrations"]
                }}
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
              <PlanChangeCalculator
                currentPlan={{
                  id: "enterprise",
                  name: "Enterprise",
                  price: 99.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["All features", "Priority support", "Custom integrations"]
                }}
                newPlan={{
                  id: "basic",
                  name: "Basic",
                  price: 9.99,
                  currency: "USD", 
                  interval: "month",
                  intervalCount: 1,
                  features: ["Basic features", "Email support"]
                }}
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
              <PlanChangeCalculator
                currentPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Advanced features", "Priority support"]
                }}
                newPlan={{
                  id: "pro-yearly",
                  name: "Pro",
                  price: 299.99,
                  currency: "USD",
                  interval: "year",
                  intervalCount: 1,
                  features: ["Advanced features", "Priority support"]
                }}
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
              <PlanChangeCalculator
                currentPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Advanced features", "Priority support"]
                }}
                newPlan={{
                  id: "enterprise",
                  name: "Enterprise",
                  price: 99.99,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["All features", "Priority support", "Custom integrations"]
                }}
                onConfirm={() => console.log("Next cycle change confirmed")}
                onCancel={() => console.log("Next cycle change cancelled")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

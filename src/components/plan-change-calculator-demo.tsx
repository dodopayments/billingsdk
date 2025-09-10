"use client";

import { PlanChangeCalculator } from "@/registry/billingsdk/plan-change-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlanChangeCalculatorDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Change Calculator</CardTitle>
          <CardDescription>
            Interactive component that calculates billing adjustments when users change subscription plans, 
            featuring cost breakdowns, credits, prorated charges, and date picker for change timing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upgrade" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
              <TabsTrigger value="downgrade">Downgrade</TabsTrigger>
              <TabsTrigger value="cycle-change">Cycle Change</TabsTrigger>
              <TabsTrigger value="next-cycle">Next Cycle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upgrade" className="space-y-4">
              <PlanChangeCalculator
                currentPlan={{
                  id: "starter",
                  name: "Starter",
                  price: 9,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["100 requests", "Basic support", "1 project"]
                }}
                newPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Unlimited requests", "Priority support", "10 projects"]
                }}
                onConfirm={(quote) => console.log("Upgrade confirmed:", quote)}
                onCancel={() => console.log("Upgrade cancelled")}
              />
            </TabsContent>
            
            <TabsContent value="downgrade" className="space-y-4">
              <PlanChangeCalculator
                currentPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Unlimited requests", "Priority support", "10 projects"]
                }}
                newPlan={{
                  id: "starter",
                  name: "Starter",
                  price: 9,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["100 requests", "Basic support", "1 project"]
                }}
                onConfirm={(quote) => console.log("Downgrade confirmed:", quote)}
                onCancel={() => console.log("Downgrade cancelled")}
              />
            </TabsContent>
            
            <TabsContent value="cycle-change" className="space-y-4">
              <PlanChangeCalculator
                currentPlan={{
                  id: "pro-monthly",
                  name: "Pro Monthly",
                  price: 29,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Unlimited requests", "Priority support", "10 projects"]
                }}
                newPlan={{
                  id: "pro-yearly",
                  name: "Pro Yearly",
                  price: 290,
                  currency: "USD",
                  interval: "year",
                  intervalCount: 1,
                  features: ["Unlimited requests", "Priority support", "10 projects", "2 months free"]
                }}
                onConfirm={(quote) => console.log("Cycle change confirmed:", quote)}
                onCancel={() => console.log("Cycle change cancelled")}
              />
            </TabsContent>
            
            <TabsContent value="next-cycle" className="space-y-4">
              <PlanChangeCalculator
                currentPlan={{
                  id: "starter",
                  name: "Starter",
                  price: 9,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["100 requests", "Basic support", "1 project"]
                }}
                newPlan={{
                  id: "pro",
                  name: "Pro",
                  price: 29,
                  currency: "USD",
                  interval: "month",
                  intervalCount: 1,
                  features: ["Unlimited requests", "Priority support", "10 projects"]
                }}
                changeDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
                onConfirm={(quote) => console.log("Next cycle change confirmed:", quote)}
                onCancel={() => console.log("Next cycle change cancelled")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

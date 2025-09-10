"use client";

import React, { useState, useMemo } from "react";
import { PlanChangeCalculator } from "@/registry/billingsdk/plan-change-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlanConfirmationModal } from "@/components/ui/plan-confirmation-modal";
import { SavingsCalculator } from "@/components/ui/savings-calculator";
import { PlanComparison } from "@/components/ui/plan-comparison";
import { mockPlans, mockCoupons, mockTaxRates, MockBillingProvider } from "@/lib/providers/mock-adapter";
import { ProrationQuote } from "@/lib/billing-core/types";
import { RecommendationEngine, usagePatterns } from "@/lib/billing-core/usage-patterns";
import { ProrationEngine } from "@/lib/billing-core/proration-engine";

export function PlanChangeCalculatorDemo() {
  const [selectedScenario, setSelectedScenario] = useState("upgrade-mid-cycle");
  const [selectedCoupon, setSelectedCoupon] = useState<string | undefined>(undefined);
  const [selectedTax, setSelectedTax] = useState<string | undefined>(undefined);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedQuote, setConfirmedQuote] = useState<ProrationQuote | null>(null);
  const [showEnhancedFeatures, setShowEnhancedFeatures] = useState(true);
  const [selectedPlanForComparison, _setSelectedPlanForComparison] = useState<string | null>(null);

  const scenarios = MockBillingProvider.getScenarios();
  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  // Enhanced features data
  const currentUsage = usagePatterns[0]; // Use first usage pattern as example
  const recommendations = useMemo(() => 
    RecommendationEngine.recommendPlans(currentUsage, currentScenario.fromPlan.id),
    [currentUsage, currentScenario.fromPlan.id]
  );
  
  const yearlyPlan = mockPlans.find(p => 
    p.name === currentScenario.fromPlan.name && p.interval === 'year'
  );

  const handleConfirm = (quote: ProrationQuote) => {
    setConfirmedQuote(quote);
    setShowConfirmModal(true);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanForComparison(planId);
    // Find the scenario that matches this plan change
    const matchingScenario = scenarios.find(s => s.toPlan.id === planId);
    if (matchingScenario) {
      setSelectedScenario(matchingScenario.id);
    } else {
      // If no exact scenario match, create a dynamic scenario by finding the closest one
      // and updating the target plan
      const currentPlan = currentScenario.fromPlan;
      const targetPlan = mockPlans.find(p => p.id === planId);
      if (targetPlan) {
        // Find a scenario with the same source plan or use the first one
        const baseScenario = scenarios.find(s => s.fromPlan.id === currentPlan.id) || scenarios[0];
        setSelectedScenario(baseScenario.id);
      }
    }
  };

  const handleSelectYearly = () => {
    if (yearlyPlan) {
      handleSelectPlan(yearlyPlan.id);
    }
  };

  const handleCancel = () => {
    // Plan change cancelled - could add analytics here
  };

  const appliedCoupon = selectedCoupon ? mockCoupons.find(c => c.id === selectedCoupon) : undefined;
  const appliedTax = selectedTax ? mockTaxRates.find(t => t.country === selectedTax) : undefined;

  // Generate proration quotes for comparison
  const comparisonQuotes = useMemo(() => {
    const quotes: Record<string, ProrationQuote> = {};
    mockPlans.forEach(plan => {
      if (plan.id !== currentScenario.fromPlan.id) {
        try {
          quotes[plan.id] = ProrationEngine.computeProrationQuote(
            currentScenario.subscription,
            currentScenario.fromPlan,
            plan,
            currentScenario.changeDate,
            appliedCoupon,
            appliedTax
          );
        } catch (error) {
          // Skip plans that can't be calculated
          console.warn(`Failed to calculate proration for plan ${plan.id}:`, error);
        }
      }
    });
    return quotes;
  }, [currentScenario, appliedCoupon, appliedTax]);

  const handleModalClose = () => {
    setShowConfirmModal(false);
    setConfirmedQuote(null);
  };

  const handleModalConfirm = () => {
    // Final confirmation - could trigger actual API call here
  };


  return (
    <div className="space-y-8">
      {/* Interactive Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Proration Preview</CardTitle>
          <CardDescription>
            Try different scenarios, coupons, and tax rates to see how proration works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon (Optional)</Label>
              <Select value={selectedCoupon || "none"} onValueChange={(value) => setSelectedCoupon(value === "none" ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="No coupon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No coupon</SelectItem>
                  {mockCoupons.map((coupon) => (
                    <SelectItem key={coupon.id} value={coupon.id}>
                      {coupon.name} ({coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`} off)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax">Tax Rate (Optional)</Label>
              <Select value={selectedTax || "none"} onValueChange={(value) => setSelectedTax(value === "none" ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="No tax" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No tax</SelectItem>
                  {mockTaxRates.map((tax) => (
                    <SelectItem key={tax.country} value={tax.country}>
                      {tax.region} - {tax.name} ({(tax.rate * 100).toFixed(1)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{currentScenario.description}</Badge>
            {appliedCoupon && (
              <Badge variant="secondary">
                Coupon: {appliedCoupon.name}
              </Badge>
            )}
            {appliedTax && (
              <Badge variant="secondary">
                Tax: {appliedTax.region} ({(appliedTax.rate * 100).toFixed(1)}%)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Enhanced Proration Preview</h2>
          <p className="text-sm text-muted-foreground">Plan comparison and savings calculator</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowEnhancedFeatures(!showEnhancedFeatures)}
        >
          {showEnhancedFeatures ? 'Hide' : 'Show'} Enhanced Features
        </Button>
      </div>

      {/* Enhanced Features */}
      {showEnhancedFeatures && (
        <div className="grid grid-cols-1 gap-6">
          {/* Savings Calculator */}
          {yearlyPlan && currentScenario.fromPlan.interval === 'month' && (
            <SavingsCalculator
              monthlyPlan={currentScenario.fromPlan}
              yearlyPlan={yearlyPlan}
              onSelectYearly={handleSelectYearly}
            />
          )}
        </div>
      )}

      {/* Plan Comparison */}
      {showEnhancedFeatures && (
        <PlanComparison
          currentPlan={currentScenario.fromPlan}
          plans={mockPlans}
          prorationQuotes={comparisonQuotes}
          onSelectPlan={handleSelectPlan}
          recommendedPlanId={recommendations[0]?.planId}
        />
      )}

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{currentScenario.name}</CardTitle>
          <CardDescription>{currentScenario.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanChangeCalculator
            subscription={currentScenario.subscription}
            currentPlan={currentScenario.fromPlan}
            newPlan={currentScenario.toPlan}
            changeDate={currentScenario.changeDate}
            coupon={appliedCoupon}
            tax={appliedTax}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {/* Preset Scenarios */}
      <Tabs defaultValue="upgrade" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          <TabsTrigger value="downgrade">Downgrade</TabsTrigger>
          <TabsTrigger value="annual">Annual Switch</TabsTrigger>
          <TabsTrigger value="complex">Complex</TabsTrigger>
        </TabsList>

        <TabsContent value="upgrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mid-Cycle Upgrade</CardTitle>
              <CardDescription>
                Upgrading from Starter to Pro with 20 days remaining in the billing cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanChangeCalculator
                currentPlan={mockPlans[0]} // Starter
                newPlan={mockPlans[1]} // Pro
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downgrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pro to Starter Downgrade</CardTitle>
              <CardDescription>
                Downgrading with account credit for unused time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanChangeCalculator
                subscription={MockBillingProvider.createMockSubscription('pro', 5)}
                currentPlan={mockPlans[1]} // Pro
                newPlan={mockPlans[0]} // Starter
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Switch to Annual Billing</CardTitle>
              <CardDescription>
                Switching from monthly Pro to yearly Pro for savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanChangeCalculator
                subscription={MockBillingProvider.createMockSubscription('pro', 15)}
                currentPlan={mockPlans[1]} // Pro monthly
                newPlan={mockPlans[3]} // Pro yearly
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade with Coupon and Tax</CardTitle>
              <CardDescription>
                Enterprise upgrade with 20% off coupon and Netherlands VAT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanChangeCalculator
                subscription={MockBillingProvider.createMockSubscription('pro', 12)}
                currentPlan={mockPlans[1]} // Pro
                newPlan={mockPlans[2]} // Enterprise
                coupon={mockCoupons[0]} // SAVE20
                tax={mockTaxRates[0]} // Netherlands VAT
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fixed Discount Coupon</CardTitle>
              <CardDescription>
                Upgrade with $10 off fixed discount coupon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanChangeCalculator
                currentPlan={mockPlans[0]} // Starter
                newPlan={mockPlans[1]} // Pro
                coupon={mockCoupons[1]} // WELCOME10
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Confirmation Modal */}
      {confirmedQuote && (
        <PlanConfirmationModal
          open={showConfirmModal}
          onClose={handleModalClose}
          quote={confirmedQuote}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}
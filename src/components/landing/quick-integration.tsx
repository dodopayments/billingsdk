"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { CustomCodeBlock } from "@/components/code";

const steps = [
  {
    step: "1",
    title: "Install Component",
    description: "Add any component to your project with a single command",
    code: `# Using shadcn registry
npx shadcn@latest add https://billingsdk.com/r/pricing-table-one.json

# Or using BillingSDK CLI
npx @billingsdk/cli add pricing-table-one`,
    language: "shell",
  },
  {
    step: "2", 
    title: "Configure",
    description: "Set up your billing plans and configuration",
    code: `// lib/billingsdk-config.ts
export const plans = [
  {
    id: 'starter',
    title: 'Starter',
    description: 'Perfect for getting started',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    buttonText: 'Get Started',
    features: [
      { name: 'Basic features', icon: 'check' }
    ]
  },
  {
    id: 'pro',
    title: 'Pro', 
    description: 'For growing businesses',
    monthlyPrice: '$29',
    yearlyPrice: '$290',
    buttonText: 'Upgrade to Pro',
    features: [
      { name: 'Advanced features', icon: 'check' },
      { name: 'Priority support', icon: 'check' }
    ]
  }
]`,
    language: "typescript",
  },
  {
    step: "3",
    title: "Use Component", 
    description: "Import and customize the component to fit your needs",
    code: `import { UpdatePlanCard } from "@/components/billingsdk/update-plan-card"
import { plans } from "@/lib/billingsdk-config"

export default function App() {
  return (
    <UpdatePlanCard
      currentPlan={plans[0]}
      plans={plans}
      onPlanChange={(planId) => console.log('Upgraded to:', planId)}
    />
  )
}`,
    language: "tsx",
  },
];

export function QuickIntegration() {
  const [copiedSteps, setCopiedSteps] = useState<Set<string>>(new Set());

  const handleCopy = async (code: string, step: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSteps(prev => new Set(prev).add(step));
      setTimeout(() => {
        setCopiedSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(step);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex flex-col my-24 items-center justify-center max-w-8xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Quick Integration
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Get started in minutes with our simple 3-step process
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 w-full">
        {steps.map((stepData, index) => (
          <div key={stepData.step} className="relative group">
            <div className="bg-background border border-border rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                  {stepData.step}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xl text-foreground mb-2">{stepData.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stepData.description}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className=" rounded-lg p-6 overflow-hidden border border-slate-800 min-h-[320px]">
                  <CustomCodeBlock 
                    code={stepData.code} 
                    language={stepData.language}
                    maxHeight="400px"
                    className="text-sm leading-relaxed"
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 gap-2 h-8 px-3 text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-600 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                  onClick={() => handleCopy(stepData.code, stepData.step)}
                >
                  {copiedSteps.has(stepData.step) ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Connection arrow for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden xl:flex absolute top-16 -right-6 w-12 items-center justify-center z-10">
                <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-primary/50"></div>
                <div className="w-0 h-0 border-l-4 border-l-primary border-t-2 border-b-2 border-t-transparent border-b-transparent -ml-1"></div>
              </div>
            )}
            
            {/* Connection line for mobile/tablet */}
            {index < steps.length - 1 && (
              <div className="xl:hidden flex justify-center py-6">
                <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-primary/50"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

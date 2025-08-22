import React from "react";
import { Button } from "@/components/ui/button";
import { CustomCodeBlock } from "@/components/code";

const Page = () => {
  const feature = {
    title: "Plan Upgrades in Seconds",
    description: "Beautiful plan upgrade interface - copy, paste, done!",
    code: `
  import { UpdatePlanCard } from "@/components/billingsdk/update-plan-card"
  import { plans } from "@/lib/billing-sdk-const"
  
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
  };

  return (
    <main className="w-full min-h-screen relative overflow-hidden p-4">
      {/* Gradient Background */}
      <div className=" bg-[radial-gradient(131.66%_109.77%_at_50%_97.75%,transparent_37.41%,rgba(74,0,224,0.44)_69.27%,rgba(0,234,255,0.5)_100%)] dark:bg-[radial-gradient(131.66%_109.77%_at_50%_97.75%,transparent_37.41%,#4a00e070_69.27%,#ff_100%)] rounded-lg">
        {/* Content */}
        <div className="relative z-10 pt-[calc(70vh/3)] px-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Hero Section */}
            <div className="text-center mb-16 relative">
              <h1 className="text-5xl md:text-6xl font-medium font-display text-white mb-3 leading-tight">
                Ship Billing UIs <span className="text-orange-500">10x</span>{" "}
                Faster
              </h1>
              <p className="text-neutral-300/80 text-lg max-w-2xl mx-auto">
                Stop reinventing the wheel. Use production-ready, accessible
                billing components — from pricing cards to subscription
                dashboards — built for React and ShadCN.
              </p>
              {/* Email Signup */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-4 max-w-md mx-auto">
                <Button>Get Started</Button>
                <Button variant="secondary">Browse Components</Button>
              </div>
              <div className="absolute top-22 right-44">
                <div className="relative">
                  <div className="handwritten text-orange-400 text-lg transform rotate-12 whitespace-nowrap">
                    Fully Open Source
                  </div>
                  <svg 
                    className="absolute -top-8 right-1/2 transform translate-x-1/2 -rotate-12 text-orange-400" 
                    width="40" 
                    height="30" 
                    viewBox="0 0 40 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M38 28C32 22 28 18 22 15C16 12 12 10 5 5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="none"
                    />
                    <path 
                      d="M8 10L5 5L10 6" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

            </div>

            {/* Demo Section */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 relative">
              {/* Handwritten annotations */}
              <div className="absolute -top-12 left-56">
                <div className="relative">
                  <div className="handwritten text-blue-400 text-lg transform -rotate-12 whitespace-nowrap">
                    Easy to Use Components
                  </div>
                  <svg
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 rotate-12 text-blue-400" 
                    width="40" 
                    height="30" 
                    viewBox="0 0 40 30" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2 2C8 8 12 12 18 15C24 18 28 20 35 25" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="none"
                    />
                    <path 
                      d="M32 20L35 25L30 24" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              
              {/* Search Card */}
              <div className="shadow-lg border-x border-t border-border mx-8 mt-4 h-72 overflow-hidden">
                {/* Window chrome */}
                <div className="py-2 px-4 border-b border-border bg-transparent border-l-foreground">
                  <div className="flex items-center gap-1">
                    <div className="size-2 outline rounded-full outline-border"></div>
                    <div className="size-2 outline rounded-full outline-accent"></div>
                  </div>
                </div>

                {/* Code block */}
                <CustomCodeBlock
                  code={feature.code}
                  language={feature.language}
                  maxHeight="400px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;

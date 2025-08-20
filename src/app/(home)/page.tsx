"use client";

import Hero from "@/components/landing/Hero";
import { cn } from "@/lib/utils";
import { HTMLProps, useState } from "react";
import { UpdatePlanCardDemo } from "@/components/update-plan-card-demo";
import { SubscriptionManagementDemo } from "@/components/subscription-management-demo";
import { plans } from "@/lib/billing-sdk-const";
import { Banner } from "@/components/billingsdk/banner";
import { UsageMeter } from "@/components/billingsdk/usage-meter";
import { CancelSubscriptionCard } from "@/registry/billingsdk/cancel-subscription-card";
import Features from "@/components/landing/Features";

export default function HomePage() {
  return (
    <main className="flex flex-1 min-h-screen flex-col  text-center w-full">
      <Hero />
      <Features />
      <Components />
    </main>
  );
}
function ComponentPanel(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "duration-700 animate-in fade-in text-sm prose max-w-none",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function Components() {
  return (
    <div className="relative overflow-hidden border-x border-t p-2">
      <ComponentsShowcase />
    </div>
  );
}

function ComponentsShowcase() {
  const [active, setActive] = useState("Subscription Management");
  const components = [
    "Subscription Management",
    "Banner Notifications",
    "Usage Meters",
    "Plan Updates",
    "Cancellation Flow",
  ];

  return (
    <div
      id="components-showcase"
      className="flex flex-col-reverse gap-3 md:flex-row md:min-h-[500px]"
    >
      <div className="flex flex-col">
        {components.map((item, i) => (
          <button
            key={item}
            type="button"
            className={cn(
              "transition-colors text-nowrap border border-transparent rounded-lg px-3 py-2.5 text-start text-sm text-fd-muted-foreground font-medium",
              item === active
                ? "text-fd-primary bg-fd-primary/10 border-fd-primary/10"
                : "hover:text-fd-accent-foreground/80"
            )}
            onClick={() => {
              setActive(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 border border-fd-primary/10 bg-fd-card/40 rounded-lg shadow-lg">
        {/* {active === 0 ? (
          <ComponentPanel>
            <PricingTableOne
              plans={plans}
              title="Pricing"
              description="Choose the plan that's right for you"
              onPlanSelect={(planId) => console.log("Selected plan:", planId)}
              size="small" // small, medium, large
              theme="classic" // minimal or classic
            />
          </ComponentPanel>
        ) : null} */}

        {active === "Banner Notifications" ? (
          <ComponentPanel>
            <Banner
              title="🎉 Start your free trial today!"
              description="Get 30 days free access to all premium features"
              buttonText="Start Free Trial"
              buttonLink="https://example.com/signup"
              variant="default" // default, minimal, popup
            />
          </ComponentPanel>
        ) : null}

        {active === "Usage Meters" ? (
          <ComponentPanel>
            <UsageMeter
              usage={[
                {
                  name: "Claude Sonnet 4",
                  usage: 75,
                  limit: 100,
                },
                {
                  name: "ChatGPT 5",
                  usage: 12,
                  limit: 100,
                },
              ]}
              title="LLM Usage"
              description="Your usage of the LLM models"
              variant="linear"
              size="md"
              className="mx-auto"
            />
          </ComponentPanel>
        ) : null}

        {active === "Subscription Management" ? (
          <ComponentPanel>
            <div className="mt-4">
              <SubscriptionManagementDemo />
            </div>
          </ComponentPanel>
        ) : null}

        {active === "Plan Updates" ? (
          <ComponentPanel>
            <div className="mt-4">
              <UpdatePlanCardDemo />
            </div>
          </ComponentPanel>
        ) : null}

        {active === "Cancellation Flow" ? (
          <ComponentPanel>
            <div className="mx-auto flex items-center justify-center w-full">
              <CancelSubscriptionCard
                title="We're sorry to see you go..."
                description={`Before you cancel, we hope you'll consider upgrading to a ${plans[1].title} plan again.`}
                plan={plans[1]}
                leftPanelImageUrl="https://framerusercontent.com/images/GWE8vop9hubsuh3uWWn0vyuxEg.webp"
                warningTitle="You will lose access to your account"
                warningText="If you cancel your subscription, you will lose access to your account and all your data will be deleted."
                keepButtonText={`Keep My ${plans[1].title} Plan`}
                continueButtonText="Continue with Cancellation"
                finalTitle="Final Step - Confirm Cancellation"
                finalSubtitle="This action will immediately cancel your subscription"
                finalWarningText="You'll lose access to all Pro features and your data will be permanently deleted after 30 days."
                goBackButtonText="Wait, Go Back"
                confirmButtonText="Yes, Cancel My Subscription"
                onCancel={async (planId) => {
                  console.log("Cancelling subscription for plan:", planId);
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      resolve(void 0);
                    }, 1000);
                  });
                }}
                onKeepSubscription={async (planId) => {
                  console.log("Keeping subscription for plan:", planId);
                }}
                className="max-w-4xl"
              />
            </div>
          </ComponentPanel>
        ) : null}
      </div>
    </div>
  );
}

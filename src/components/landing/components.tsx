"use client"
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PreviewComponents } from "@/components/preview/preview-components";
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billing-sdk-const";
import { Banner } from "@/components/billingsdk/banner";
import { UsageMeter } from "@/components/billingsdk/usage-meter";
import { SubscriptionManagementDemo } from "@/components/subscription-management-demo";
import { UpdatePlanCardDemo } from "@/components/update-plan-card-demo";
import { CancelSubscriptionCard } from "@/registry/billingsdk/cancel-subscription-card";

export function ComponentsSection() {
    return (
        <div className="md:px-8 py-12 relative overflow-hidden w-full">
            <div className="text-center">
                <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary">
                    Try our components
                </h2>
                <p className="text-sm mt-4 text-muted-foreground max-w-2xl mx-auto tracking-tight">
                    Try our components in action and see how they work.
                </p>
            </div>
            <ComponentsShowcase />

        </div>
    );
}

function ComponentsShowcase() {
    const [active, setActive] = useState("Pricing");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const components = [
        "Pricing",
        "Subscription Management",
        "Banner Notifications",
        "Usage Meters",
        "Plan Updates",
        "Cancellation Flow",
    ];

    // Auto-rotation logic
    useEffect(() => {
        if (!isAutoRotating || isHovered) return;

        const interval = setInterval(() => {
            handleTransition();
        }, 5000); // Rotate every 6 seconds

        return () => clearInterval(interval);
    }, [active, isAutoRotating, isHovered, components]);

    // Handle smooth transitions
    const handleTransition = (targetComponent?: string) => {
        setIsTransitioning(true);

        // Allow time for fade out animation
        setTimeout(() => {
            const currentIndex = components.indexOf(active);
            let nextComponent;

            if (targetComponent) {
                nextComponent = targetComponent;
            } else {
                const nextIndex = (currentIndex + 1) % components.length;
                nextComponent = components[nextIndex];
            }

            setActive(nextComponent);

            // Allow time for fade in animation
            setTimeout(() => {
                setIsTransitioning(false);
            }, 150);
        }, 150);
    };

    // Handle manual component selection
    const handleComponentClick = (component: string) => {
        if (component === active || isTransitioning) return;

        handleTransition(component);
        setIsAutoRotating(false); // Pause auto-rotation when user manually selects

        // Resume auto-rotation after 15 seconds of inactivity
        setTimeout(() => {
            setIsAutoRotating(true);
        }, 15000);
    };

    return (
        <div id="components-showcase"
            className="flex flex-col gap-3 my-auto w-full mt-5">
            <div className="flex flex-row w-full justify-center">
                {components.map((item, i) => (
                    <button
                        key={item}
                        type="button"
                        className={cn(
                            "transition-colors text-nowrap px-2 py-1 text-start text-xs font-medium underline-offset-2",
                            isTransitioning
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer",
                            item === active
                                ? "underline decoration-1 underline-offset-2 decoration-fd-primary"
                                : "hover:text-fd-accent-foreground/60 text-muted-foreground/60"
                        )}
                        onClick={() => {
                            handleComponentClick(item);
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div
                className="flex flex-col border border-fd-primary/10 bg-background rounded-lg shadow-lg w-full items-center justify-center mt-5"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={cn(
                    "w-full h-full transition-all duration-300 ease-in-out",
                    isTransitioning ? "opacity-0 transform scale-98" : "opacity-100 transform scale-100"
                )}>
                    {active === "Pricing" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in max-w-none w-full h-full border-none  bg-background md:min-h-[900px] px-0">
                            <PricingTableOne
                                className="w-full"
                                plans={plans}
                                title="Pricing"
                                description="Choose the plan that's right for you"
                                onPlanSelect={(planId) => console.log("Selected plan:", planId)}
                                size="small" // small, medium, large
                                theme="classic" // minimal or classic
                            />
                        </PreviewComponents>
                    ) : null}

                    {active === "Banner Notifications" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background md:min-h-[900px] px-0">
                            <Banner
                                title="🎉 Start your free trial today!"
                                description="Get 30 days free access to all premium features"
                                buttonText="Start Free Trial"
                                buttonLink="https://example.com/signup"
                                gradientColors={[
                                    "rgba(0,149,255,0.56)",
                                    "rgba(231,77,255,0.77)",
                                    "rgba(255,0,0,0.73)",
                                    "rgba(131,255,166,0.66)",
                                ]}
                                variant="default" // default, minimal, popup
                            />
                        </PreviewComponents>
                    ) : null}

                    {active === "Usage Meters" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background md:min-h-[900px] px-0">
                            <UsageMeter
                                usage={[{
                                        name: "Claude Sonnet 4",
                                        usage: 75,
                                        limit: 100,
                                    },{
                                        name: "ChatGPT 5",
                                        usage: 12,
                                        limit: 100,
                                    },{
                                        name: "Grok 3",
                                        usage: 95,
                                        limit: 100,
                                    }
                                ]}
                                title="LLM Usage"
                                description="Your usage of the LLM models"
                                variant="linear"
                                size="md"
                                className="mx-auto"
                            />
                        </PreviewComponents>
                    ) : null}

                    {active === "Subscription Management" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background md:min-h-[900px] px-0">
                            <div className="mt-4">
                                <SubscriptionManagementDemo />
                            </div>
                        </PreviewComponents>
                    ) : null}

                    {active === "Plan Updates" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background md:min-h-[900px] px-0">
                            <div className="mt-4 w-full">
                                <UpdatePlanCardDemo />
                            </div>
                        </PreviewComponents>
                    ) : null}

                    {active === "Cancellation Flow" ? (
                        <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background md:min-h-[900px] px-0">
                            <div className=" flex items-center justify-center w-full">
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
                        </PreviewComponents>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
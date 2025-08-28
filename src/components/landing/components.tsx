"use client"
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PreviewComponents } from "@/components/preview/preview-components";
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";
import { Banner } from "@/components/billingsdk/banner";
import { UsageMeter } from "@/components/billingsdk/usage-meter";
import { SubscriptionManagementDemo } from "@/components/subscription-management-demo";
import { UpdatePlanCardDemo } from "@/components/update-plan-card-demo";
import { CancelSubscriptionCard } from "@/registry/billingsdk/cancel-subscription-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AiOutlineDollar } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import { BiBarChartAlt2, BiArrowToTop } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { motion } from "motion/react";

export function ComponentsSection() {
    return (
        <div className="md:px-8 py-12 relative overflow-hidden w-full max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary">
                    Explore Interactive Billing Components
                </h2>
                <p className="text-sm mt-4 text-muted-foreground max-w-2xl mx-auto tracking-tight">
                    Interact with real-time UI elements designed to streamline your billing workflows.
                </p>
            </div>
            <ComponentsShowcase />
        </div>
    );
}

function ComponentsShowcase() {
    const [active, setActive] = useState("pricing");
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [borderPosition, setBorderPosition] = useState({ left: 0, top: 0, width: 0, height: 2 });
    const tabsListRef = useRef<HTMLDivElement>(null);

    const components = [
        { id: "pricing", label: "Pricing", icon: AiOutlineDollar },
        { id: "subscription", label: "Subscription Management", icon: FiSettings },
        { id: "banner", label: "Banner Notifications", icon: BsBell },
        { id: "usage", label: "Usage Meters", icon: BiBarChartAlt2 },
        { id: "updates", label: "Plan Updates", icon: BiArrowToTop },
        { id: "cancellation", label: "Cancellation Flow", icon: MdClose },
    ];

    useEffect(() => {
        if (!tabsListRef.current) return;

        const tabsList = tabsListRef.current;
        const activeTab = tabsList.querySelector(`[data-state="active"]`) as HTMLElement;
        const isMobile = window.innerWidth < 640;

        if (activeTab) {
            const tabsListRect = tabsList.getBoundingClientRect();
            const activeTabRect = activeTab.getBoundingClientRect();

            if (isMobile) {
                // Vertical layout - left border
                setBorderPosition({
                    left: 0,
                    top: activeTabRect.top - tabsListRect.top,
                    width: 2,
                    height: activeTabRect.height
                });
            } else {
                // Horizontal layout - bottom border
                setBorderPosition({
                    left: activeTabRect.left - tabsListRect.left,
                    top: tabsListRect.height - 2, // Position at bottom of container
                    width: activeTabRect.width,
                    height: 2
                });
            }
        }
    }, [active]);

    useEffect(() => {
        if (!isAutoRotating || isHovered) return;

        const interval = setInterval(() => {
            handleTransition();
        }, 6000);

        return () => clearInterval(interval);
    }, [active, isAutoRotating, isHovered]);

    const handleTransition = (targetComponent?: string) => {
        const currentIndex = components.findIndex(comp => comp.id === active);
        let nextComponent;

        if (targetComponent) {
            nextComponent = targetComponent;
        } else {
            const nextIndex = (currentIndex + 1) % components.length;
            nextComponent = components[nextIndex].id;
        }

        setActive(nextComponent);
    };

    const handleComponentClick = (componentId: string) => {
        if (componentId === active) return;

        handleTransition(componentId);
        setIsAutoRotating(false);

        setTimeout(() => {
            setIsAutoRotating(true);
        }, 15000);
    };

    return (
        <div id="components-showcase"
            className="flex flex-col gap-3 my-auto w-full mt-5">
            <div className="relative flex flex-col sm:flex-row w-full overflow-x-auto scrollbar-hide justify-start sm:justify-center">
                <Tabs value={active} onValueChange={handleComponentClick} className="w-full">
                    <div className="flex flex-col sm:flex-row gap-2 md:mx-auto my-auto relative">
                        <TabsList ref={tabsListRef} className="flex flex-col sm:flex-row gap-2 h-auto bg-background rounded-sm border relative p-0 w-full md:w-auto">
                            {components.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <TabsTrigger
                                        key={item.id}
                                        value={item.id}
                                        className={cn(
                                            "flex flex-row gap-1 h-auto transition-all duration-200 p-2 w-full",
                                            "text-xs font-medium whitespace-nowrap border-0 rounded-none",
                                            "hover:bg-muted/50 w-full sm:w-auto justify-start sm:justify-center"
                                        )}
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        <span className="hidden sm:inline text-[10px] leading-tight">
                                            {item.label.split(' ')[0]}
                                        </span>
                                        <span className="sm:hidden text-[10px] leading-tight">
                                            {item.label}
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                        <motion.div
                            className="absolute bg-white rounded-full"
                            animate={{
                                left: borderPosition.left,
                                top: borderPosition.top,
                                width: borderPosition.width,
                                height: borderPosition.height
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            style={{
                                position: 'absolute'
                            }}
                        />
                    </div>

                    <div
                        className="flex flex-col border border-fd-primary/10 bg-background rounded-lg shadow-lg w-full items-center justify-center mt-5"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="w-full h-full transition-all duration-300 ease-in-out">
                            <TabsContent value="pricing" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in max-w-none w-full h-full border-none  bg-background min-h-[500px] md:min-h-[900px] px-0">
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
                            </TabsContent>

                            <TabsContent value="banner" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0">
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
                            </TabsContent>

                            <TabsContent value="usage" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0">
                                    <UsageMeter
                                        usage={[{
                                            name: "Claude Sonnet 4",
                                            usage: 75,
                                            limit: 100,
                                        }, {
                                            name: "ChatGPT 5",
                                            usage: 12,
                                            limit: 100,
                                        }, {
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
                            </TabsContent>

                            <TabsContent value="subscription" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0">
                                    <div className="mt-4">
                                        <SubscriptionManagementDemo />
                                    </div>
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="updates" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0">
                                    <div className="mt-4 w-full">
                                        <UpdatePlanCardDemo />
                                    </div>
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="cancellation" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0">
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
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
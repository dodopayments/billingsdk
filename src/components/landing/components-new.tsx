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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AiOutlineDollar } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import { BiBarChartAlt2, BiArrowToTop } from "react-icons/bi";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ComponentsSection() {
    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <motion.h2 
                    className="text-3xl md:text-4xl font-display font-medium text-foreground mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    See components in action
                </motion.h2>
                <motion.p 
                    className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    Interactive previews of our most popular billing components. Click to explore each one.
                </motion.p>
            </div>
            <ComponentsShowcase />
        </section>
    );
}

function ComponentsShowcase() {
    const [active, setActive] = useState("pricing");
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [borderPosition, setBorderPosition] = useState({ left: 0, top: 0, width: 0, height: 2 });
    const tabsListRef = useRef<HTMLDivElement>(null);

    // Featured components (marquee selection)
    const components = [
        { 
            id: "pricing", 
            label: "Pricing Tables", 
            icon: AiOutlineDollar,
            href: "/docs/components/pricing-table",
            description: "Beautiful, responsive pricing tables with multiple variants"
        },
        { 
            id: "subscription", 
            label: "Subscription Management", 
            icon: FiSettings,
            href: "/docs/components/manage-subscription",
            description: "Complete subscription management dashboard"
        },
        { 
            id: "banner", 
            label: "Banner Notifications", 
            icon: BsBell,
            href: "/docs/components/banner",
            description: "Eye-catching promotional and notification banners"
        },
        { 
            id: "usage", 
            label: "Usage Meters", 
            icon: BiBarChartAlt2,
            href: "/docs/components/usage-meter",
            description: "Track and display usage metrics with progress indicators"
        },
        { 
            id: "updates", 
            label: "Plan Updates", 
            icon: BiArrowToTop,
            href: "/docs/components/update-plan",
            description: "Smooth plan upgrade and downgrade interfaces"
        },
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
                setBorderPosition({
                    left: 0,
                    top: activeTabRect.top - tabsListRect.top,
                    width: 2,
                    height: activeTabRect.height
                });
            } else {
                setBorderPosition({
                    left: activeTabRect.left - tabsListRect.left,
                    top: tabsListRect.height - 2,
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

    const activeComponent = components.find(comp => comp.id === active);

    return (
        <div className="flex flex-col gap-6 w-full">
            <Tabs value={active} onValueChange={handleComponentClick} className="w-full">
                <div className="flex flex-col gap-6">
                    {/* Component Tabs */}
                    <TabsList ref={tabsListRef} className="flex flex-col sm:flex-row gap-2 h-auto bg-background rounded-lg border relative p-1 w-full md:w-auto mx-auto">
                        {components.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <TabsTrigger
                                    key={item.id}
                                    value={item.id}
                                    className={cn(
                                        "flex flex-row gap-2 h-auto transition-all duration-200 p-3 w-full",
                                        "text-sm font-medium whitespace-nowrap border-0 rounded-md",
                                        "hover:bg-muted/50 w-full sm:w-auto justify-start sm:justify-center"
                                    )}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    <span className="text-sm">
                                        {item.label}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                        <motion.div
                            className="absolute bg-primary/10 rounded-md"
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
                    </TabsList>

                    {/* Component Preview */}
                    <div
                        className="border border-border bg-background rounded-lg shadow-sm w-full"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Preview Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div>
                                <h3 className="font-semibold text-foreground">{activeComponent?.label}</h3>
                                <p className="text-sm text-muted-foreground">{activeComponent?.description}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={activeComponent?.href || "#"} className="flex items-center gap-2">
                                    View component
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>

                        {/* Preview Content */}
                        <div className="w-full transition-all duration-300 ease-in-out">
                            <TabsContent value="pricing" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in max-w-none w-full h-full border-none bg-background min-h-[400px] md:min-h-[600px] px-0">
                                    <PricingTableOne
                                        className="w-full"
                                        plans={plans}
                                        title="Pricing"
                                        description="Choose the plan that's right for you"
                                        onPlanSelect={(planId) => console.log("Selected plan:", planId)}
                                        size="small"
                                        theme="classic"
                                    />
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="banner" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none bg-background min-h-[400px] md:min-h-[600px] px-0">
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
                                        variant="default"
                                    />
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="usage" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none bg-background min-h-[400px] md:min-h-[600px] px-0">
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
                                        }]}
                                        title="LLM Usage"
                                        description="Your usage of the LLM models"
                                        variant="linear"
                                        size="md"
                                        className="mx-auto"
                                    />
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="subscription" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none bg-background min-h-[400px] md:min-h-[600px] px-0">
                                    <div className="mt-4">
                                        <SubscriptionManagementDemo />
                                    </div>
                                </PreviewComponents>
                            </TabsContent>

                            <TabsContent value="updates" className="mt-0">
                                <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none bg-background min-h-[400px] md:min-h-[600px] px-0">
                                    <div className="mt-4 w-full">
                                        <UpdatePlanCardDemo />
                                    </div>
                                </PreviewComponents>
                            </TabsContent>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}

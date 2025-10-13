"use client";
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
import { ShineButton } from "./shine-button";
import { ArrowLeft, ArrowRight, Blocks } from "lucide-react";
import { Button } from "../ui/button";

export function ComponentsSection() {
  const [active, setActive] = useState("pricing");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [borderPosition, setBorderPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 2,
  });
  const tabsListRef = useRef<HTMLDivElement>(null);

  const components = [
    {
      id: "pricing",
      label: "Pricing",
      icon: AiOutlineDollar,
      href: "/docs/components/pricing-table/pricing-table-one",
    },
    {
      id: "subscription",
      label: "Subscription Management",
      icon: FiSettings,
      href: "/docs/components/banner#gradient-banner",
    },
    {
      id: "banner",
      label: "Banner Notifications",
      icon: BsBell,
      href: "/components/banner",
    },
    {
      id: "usage",
      label: "Usage Meters",
      icon: BiBarChartAlt2,
      href: "/docs/components/usage-meter/usage-meter-linear",
    },
    {
      id: "updates",
      label: "Plan Updates",
      icon: BiArrowToTop,
      href: "/docs/components/update-plan/update-plan-card",
    },
    {
      id: "cancellation",
      label: "Cancellation Flow",
      icon: MdClose,
      href: "/docs/components/cancel-subscription/cancel-subscription-card",
    },
  ];

  useEffect(() => {
    if (!tabsListRef.current) return;

    const tabsList = tabsListRef.current;
    const activeTab = tabsList.querySelector(
      `[data-state="active"]`
    ) as HTMLElement;

    if (activeTab) {
      const tabsListRect = tabsList.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();

      setBorderPosition({
        left: 0,
        top: activeTabRect.top - tabsListRect.top,
        width: 3,
        height: activeTabRect.height,
      });
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
    const currentIndex = components.findIndex((comp) => comp.id === active);
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

  const handlePrevious = () => {
    const currentIndex = components.findIndex((comp) => comp.id === active);
    const prevIndex =
      currentIndex === 0 ? components.length - 1 : currentIndex - 1;
    const prevComponent = components[prevIndex].id;
    handleComponentClick(prevComponent);
  };

  const handleNext = () => {
    const currentIndex = components.findIndex((comp) => comp.id === active);
    const nextIndex = (currentIndex + 1) % components.length;
    const nextComponent = components[nextIndex].id;
    handleComponentClick(nextComponent);
  };

  const getCurrentComponent = () => {
    return components.find((comp) => comp.id === active);
  };

  const handleViewComponent = () => {
    const currentComponent = getCurrentComponent();
    if (currentComponent?.href) {
      window.open(currentComponent.href, "_blank");
    }
  };

  return (
    <div className=" relative overflow-hidden w-full mx-auto">
      <Tabs
        value={active}
        onValueChange={handleComponentClick}
        className="w-full"
      >
        <div className="flex gap-8 xl:flex-row flex-col w-full items-start">
          {/* Left Side - Title, Description & Tab List */}
          <div className="flex flex-col w-full xl:w-80 items-start flex-shrink-0">
            <ShineButton
              Icon={Blocks}
              className="shadow-xl w-fit shadow-white/5"
              label="Components"
            />
            <div className="text-left">
              <h2 className="text-3xl mt-4 sm:text-3xl font-display md:text-4xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Explore Interactive Billing Components
              </h2>
              <p className="text-sm md:text-base text-balance mt-4 text-muted-foreground mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Interact with real-time UI elements designed to streamline your
                billing workflows.
              </p>
            </div>

            {/* Tab List */}
            <div className="w-full">
              <TabsList
                ref={tabsListRef}
                className="flex flex-col gap-2 h-auto bg-background rounded-lg  relative p-2 w-full"
              >
                {components.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex flex-row gap-3 h-auto transition-all duration-200 p-3 w-full",
                        "text-sm font-medium border-0 rounded-md",
                        "hover:bg-muted/50 justify-start cursor-pointer",
                        "data-[state=active]:bg-muted data-[state=active]:text-foreground"
                      )}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm leading-tight text-left">
                        {item.label}
                      </span>
                    </TabsTrigger>
                  );
                })}

                {/* Animated border indicator */}
                <motion.div
                  className="absolute bg-primary rounded-sm"
                  animate={{
                    left: borderPosition.left,
                    top: borderPosition.top,
                    width: borderPosition.width,
                    height: borderPosition.height,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    position: "absolute",
                  }}
                />
              </TabsList>

              <div className="grid md:grid-cols-3 xl:grid-cols-4 mt-4 w-full gap-2">
                <Button
                  variant={"default"}
                  className="w-full col-span-1 xl:col-span-4 text-sm py-2"
                  onClick={handleViewComponent}
                >
                  View Component
                </Button>
                <Button
                  variant={"secondary"}
                  className="w-full col-span-1 xl:col-span-2 flex items-center justify-center py-2"
                  onClick={handlePrevious}
                  title="Previous Component"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  variant={"secondary"}
                  className="w-full col-span-1 xl:col-span-2 flex items-center justify-center py-2"
                  onClick={handleNext}
                  title="Next Component"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Tab Content */}
          <div className="flex-1 w-full xl:w-auto">
            <ComponentsShowcase
              setIsHovered={setIsHovered}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function ComponentsShowcase({ setIsHovered }: any) {
  return (
    <div id="components-showcase" className="w-full">
      <div
        className="flex flex-col border border-fd-primary/10 bg-background rounded-lg shadow-lg w-full items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-full transition-all duration-300 ease-in-out">
          <TabsContent value="pricing" className="mt-0">
            <PreviewComponents className="duration-300 animate-in fade-in max-w-none w-full h-full border-none bg-background min-h-[500px] md:min-h-[700px] py-4 px-0">
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
            <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[700px] px-0">
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
            <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[700px] px-0">
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
                  {
                    name: "Grok 3",
                    usage: 95,
                    limit: 100,
                  },
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
            <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[700px] px-0">
              <div className="mt-4">
                <SubscriptionManagementDemo />
              </div>
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="updates" className="mt-0">
            <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[700px] px-0">
              <div className="mt-4 w-full">
                <UpdatePlanCardDemo />
              </div>
            </PreviewComponents>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-0">
            <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none border rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[700px] px-0">
              <div className="flex items-center justify-center w-full">
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
    </div>
  );
}

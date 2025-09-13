"use client"
import { useState, useEffect, useRef } from "react";
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
import Image from "next/image";
import { HiOutlineMenu } from "react-icons/hi";

interface ComponentsProps {
  id: string;
  label: string;
  icon?: any;
  component?: React.ReactNode;
}

export function HeroComponentsShowcase() {
  const [selectedTab, setSelectedTab] = useState("pricing");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const components: ComponentsProps[] = [
    {
      id: "pricing", label: "Pricing", icon: AiOutlineDollar, component: <PricingTableOne className="w-full" plans={plans} title="Pricing" description="Choose the plan that's right for you" onPlanSelect={(planId) => console.log("Selected plan:", planId)} size="small" theme="classic" />
    },
    { id: "subscription", label: "Subscription", icon: FiSettings, component: <SubscriptionManagementDemo /> },
    {
      id: "banner", label: "Banner", icon: BsBell, component: <Banner
        title=" Start your free trial today!"
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
    },
    {
      id: "usage", label: "Usage", icon: BiBarChartAlt2, component: <UsageMeter
        usage={[
          { name: "Claude Sonnet 4", usage: 75, limit: 100 },
          { name: "ChatGPT 5", usage: 12, limit: 100 },
          { name: "Grok 3", usage: 95, limit: 100 },
        ]}
        title="LLM Usage"
        description="Your usage of the LLM models"
        variant="linear"
        size="md"
        className="mx-auto w-full"
      />
    },
    { id: "updates", label: "Plans", icon: BiArrowToTop, component: <UpdatePlanCardDemo /> },
    {
      id: "cancellation", label: "Cancellation", icon: MdClose, component: <CancelSubscriptionCard
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
        className="flex flex-row items-stretch max-w-6xl mx-auto"
      />
    },
  ];

  return (
    <>
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 relative mb-4"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      >
        {/* Card */}
        <motion.div
          className="shadow-lg border-x border-y rounded-lg border-border mx-4 sm:mx-6 md:mx-8 mt-4 w-full  lg:max-w-6xl relative"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        >
          {isMobile ? (
            <>
              {/* Mobile Hamburger */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <Image src="/logo/logo-dodo.svg" alt="Billing SDK" width={28} height={28} />
                  <span className="text-3xl font-display">/</span>
                  <Image src="/logo/Logo.svg" alt="Billing SDK" width={120} height={120} />
                </div>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <HiOutlineMenu size={28} />
                </button>
              </div>
              {showMobileMenu && (
                <div className="flex flex-col bg-background border-b">
                  {components.map((component) => (
                    <button
                      key={component.id}
                      className={`flex items-center gap-2 p-3 text-left w-full ${selectedTab === component.id ? "bg-fd-primary/10" : ""}`}
                      onClick={() => { setSelectedTab(component.id); setShowMobileMenu(false); }}
                    >
                      <component.icon />
                      {component.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="p-4">
                {components.find((c) => c.id === selectedTab)?.component}
              </div>
            </>
          ) : (
            <Tabs defaultValue="pricing" className="gap-0 ">
              <TabsList className="border-b h-12 bg-transparent py-4 rounded-none w-full flex items-center  justify-between px-2">
                <div className="flex flex-1 items-center justify-start gap-2">
                  <Image src="/logo/logo-dodo.svg" alt="Billing SDK" width={28} height={28} />
                  <span className="text-3xl font-display">/</span>
                  <Image src="/logo/Logo.svg" alt="Billing SDK" width={120} height={120} />
                </div>
                <div className="flex flex-2 items-center justify-center gap-3 relative">
                  {components.map((component) => (
                    <TabsTrigger
                      key={component.id}
                      value={component.id.toLowerCase()}
                      className="relative px-3 py-2 flex items-center gap-1 border-none"
                      onClick={() => setSelectedTab(component.id)}
                    >
                      <component.icon className="size-4 mr-1" />
                      {component.label}
                      {selectedTab === component.id && (
                        <motion.div
                          className="absolute inset-0 rounded-md border shadow-[inset_0_-2px_4px_rgba(250,204,21,0.4)]"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          exit={{ width: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
              {components.map((component) => (
                <TabsContent key={component.id ?? "pricing"} value={component.id ?? "pricing"} className=" w-full">
                  <PreviewComponents className="duration-300 animate-in fade-in text-sm max-w-none w-full border-none rounded-lg border-fd-primary/10 bg-background min-h-[500px] md:min-h-[900px] px-0 shadow-2xl">
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeIn" }}
                      className="w-full"
                    >
                      {component.component}
                    </motion.div>
                  </PreviewComponents>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

"use client";

import {
  Globe2Icon,
  CreditCardIcon,
  PlugZap2Icon,
  TrendingUpIcon,
  BellIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

const features = [
  {
    id: 1,
    label: "Customizable",
    title: "<strong>Customizable</strong>",
    description:
      "Easily modify components with props and Tailwind classes to match your brand. Full control over styling, colors, and layout without compromising functionality or accessibility.",
    icon: PlugZap2Icon,
  },
  {
    id: 2,
    label: "Fast Development",
    title: "<strong>Fast Development</strong>",
    description:
      "Skip weeks of development time with pre-built billing components. Focus on your core business logic while we handle the complex UI patterns and user flows.",
    icon: TrendingUpIcon,
  },
  {
    id: 3,
    label: "Copy & Paste",
    title: "<strong>Copy & Paste</strong>",
    description:
      "No package dependencies or complex installations. Simply copy the component code directly into your project and start using it immediately with full source code access.",
    icon: CreditCardIcon,
  },
  {
    id: 4,
    label: "Open Source",
    title: "<strong>Open Source</strong>",
    description:
      "Completely free to use and modify for personal and commercial projects. Access the full source code, contribute improvements, and customize to your heart's content.",
    icon: Globe2Icon,
  },
 
  {
    id: 6,
    label: "Accessible",
    title: "<strong>Accessible</strong>",
    description:
      "Built with accessibility in mind, ensuring your billing interfaces work for all users. WCAG compliant components with proper ARIA labels and keyboard navigation support.",
    icon: BellIcon,
  },
];

export default function Features() {
  return (
    <div className="flex flex-col my-24 mt-32 items-center justify-center max-w-7xl mx-auto">
      <div className="text-center">

        <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Why choose BillingSDK?
      </h2>
      <p className="text-sm mt-4 text-muted-foreground mb-12 max-w-xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        Beautiful, customizable billing components that save you development time and effort.
      </p>
      </div>
      

      <div className="relative rounded-none px-2 ">
        <div className="w-full md:mx-0  ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2  ">
            {features.slice(0,2).map((feature, index) => (
            <div
            key={feature.id}
            className={cn(
              "bg-black backdrop-blur-sm  border-x border-[#f9f9f9] rounded-md  transition-all duration-300 md:min-h-[190px] transform-gpu flex flex-col p-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ",
             
            )}
            style={{
              animationDelay: `${500 + index * 150}ms`,
            } as CSSProperties}
          >
            <div className="flex flex-col h-full w-full">
              <div className="mb-5">
                <feature.icon className="w-12 h-12 hover:scale-110 transition-all duration-100" />
              </div>
              <div className="flex-grow">
                <p
                  className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl "
                  dangerouslySetInnerHTML={{
                    __html: feature.title,
                  }}
                />
                <p className="mt-2 text-sm text-left text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
            ))}
          </div>
        </div>
          {/* Second row*/}
        <div className="mt-2.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {features.slice(2,6).map((feature, index) => (
              <div
                key={feature.id}
                className={cn(
                  "bg-black backdrop-blur-sm border-x border-[#f9f9f9] text-white  rounded-md  transition-all duration-300 md:min-h-[190px] transform-gpu flex flex-col p-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ",
                 
                )}
                style={{
                  animationDelay: `${500 + index * 150}ms`,
                } as CSSProperties}
              >
                <div className="flex flex-col h-full w-full">
                  <div className="mb-5 ">
                    <feature.icon className="w-12 h-12 hover:scale-110 transition-all duration-100" />
                  </div>
                  <div className="flex-grow ">
                    <p
                      className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl"
                      dangerouslySetInnerHTML={{
                        __html: feature.title,
                      }}
                    />
                    <p className="mt-2 text-sm text-left text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
       
      </div>
    </div>
  );
}

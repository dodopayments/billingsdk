"use client";

import {
  Globe2Icon,
  CreditCardIcon,
  PlugZap2Icon,
  Plus,
  TrendingUpIcon,
  ShieldCheckIcon,
  BarChart3Icon,
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
    label: "Ready to Use",
    title: "<strong>Ready to Use</strong>",
    description:
      "Production-ready components that have been tested across different browsers and devices. No additional setup or configuration required - just import and use.",
    icon: ShieldCheckIcon,
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
    id: 5,
    label: "Fast Development",
    title: "<strong>Fast Development</strong>",
    description:
      "Skip weeks of development time with pre-built billing components. Focus on your core business logic while we handle the complex UI patterns and user flows.",
    icon: TrendingUpIcon,
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
    <div className="flex flex-col my-24 mt-32 items-center justify-center">
      <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Why choose BillingSDK?
      </h2>
      <p className="text-sm mt-4 text-muted-foreground mb-12 max-w-2xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        Beautiful, customizable billing components that save you development time and effort.
      </p>

      <div className="relative rounded-none -pr-2  ">
        <div className="w-full md:mx-0">
          <div className="grid grid-cols-1 relative md:grid-rows-2 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={cn(
                  "justify-center md:min-h-[240px] transform-gpu flex flex-col p-10 2xl:p-12 animate-in fade-in slide-in-from-bottom-6 duration-1000",
                  // Add right border for all except last column
                  (index + 1) % 3 !== 0 && "md:border-r-[1.2px]",
                  // Add bottom border for first row
                  index < 3 && "md:border-b-[1.2px]",
                  // Add top border for mobile
                  index > 0 && "border-t-[1.2px] md:border-t-0"
                )}
                style={{
                  animationDelay: `${500 + index * 150}ms`,
                } as CSSProperties}
              >
                <div className="mt-2">
                  <div className="max-w-full">
                    <div className="flex gap-3 ">
                      <p
                        className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl"
                        dangerouslySetInnerHTML={{
                          __html: feature.title,
                        }}
                      />
                    </div>
                  </div>
                                     <p className="mt-2 text-sm text-left text-muted-foreground">
                     {feature.description}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

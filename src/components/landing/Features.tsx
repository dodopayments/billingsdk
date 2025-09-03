"use client";

import {
  CreditCardIcon,
  PlugZap2Icon,
  TrendingUpIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

const features = [
  {
    id: 1,
    label: "Ship pricing pages fast",
    title: "<strong>Ship pricing pages fast</strong>",
    description:
      "Production-ready pricing tables, plan upgrade flows, and subscription management components. No weeks of development—just copy, paste, and customize.",
    icon: TrendingUpIcon,
  },
  {
    id: 2,
    label: "Drop-in subscription UI",
    title: "<strong>Drop-in subscription UI</strong>",
    description:
      "Complete billing interfaces from cancellation flows to usage meters. Built with React, TypeScript, and Tailwind CSS for seamless integration.",
    icon: PlugZap2Icon,
  },
  {
    id: 3,
    label: "Copy-paste, then customize",
    title: "<strong>Copy-paste, then customize</strong>",
    description:
      "No package dependencies or complex setup. View source code, copy components directly into your project, and customize with Tailwind classes.",
    icon: CreditCardIcon,
  },
  {
    id: 4,
    label: "Accessible by default",
    title: "<strong>Accessible by default</strong>",
    description:
      "WCAG compliant components with proper ARIA labels, keyboard navigation, and screen reader support. Build inclusive billing experiences for all users.",
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <div className="flex flex-col my-24 mt-32 items-center justify-center max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Why choose BillingSDK?
      </h2>
      <p className="text-sm mt-4 text-muted-foreground mb-12 max-w-xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        Beautiful, customizable billing components that save you development time and effort.
      </p>

      <div className="relative rounded-none -pr-2  ">
        <div className="w-full md:mx-0">
          <div className="grid grid-cols-1 relative md:grid-rows-2 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={cn(
                  "justify-center md:min-h-[240px] transform-gpu flex flex-col p-10 2xl:p-12 animate-in fade-in slide-in-from-bottom-6 duration-1000",
                  // Add right border for all except last column
                  (index + 1) % 2 !== 0 && "md:border-r-[1.2px]",
                  // Add bottom border for first row
                  index < 2 && "md:border-b-[1.2px]",
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

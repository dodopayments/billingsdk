"use client";

import {
  Globe2Icon,
  CreditCardIcon,
  PlugZap2Icon,
  TrendingUpIcon,
  ShieldCheckIcon,
  BellIcon,
  Crown,
} from "lucide-react";
import React from "react";
import { ShineButton } from "./shine-button";
import { FeatureCard } from "./feature-card";

export const features = [
  {
    id: 1,
    label: "customizable",
    title: "Customizable",
    description:
      "Easily adjust components with props and Tailwind classes for full control over styling, colors, and layout.",
    icon: PlugZap2Icon,
  },
  {
    id: 2,
    label: "copy-paste",
    title: "Copy & Paste",
    description:
      "No dependencies or installs required. Copy the code into your project and start using it instantly.",
    icon: CreditCardIcon,
  },
  {
    id: 3,
    label: "ready-to-use",
    title: "Ready to Use",
    description:
      "Production-ready components tested across browsers and devices—just import and use, no setup needed.",
    icon: ShieldCheckIcon,
  },
  {
    id: 4,
    label: "open-source",
    title: "Open Source",
    description:
      "Free to use and modify for any project with full source code access and community contributions.",
    icon: Globe2Icon,
  },
  {
    id: 5,
    label: "fast-dev",
    title: "Fast Development",
    description:
      "Save weeks of work with pre-built billing components and focus on core business logic instead.",
    icon: TrendingUpIcon,
  },
  {
    id: 6,
    label: "accessible",
    title: "Accessible",
    description:
      "WCAG-compliant components with ARIA labels and keyboard support to ensure usability for all.",
    icon: BellIcon,
  },
];

export default function Features() {
  return (
    <div className="flex relative flex-col my-24 mt-32 items-center justify-center max-w-7xl mx-auto">
      <ShineButton
        Icon={Crown}
        className="shadow-xl shadow-white/5"
        label="Features"
      />
      <h2 className="text-3xl mt-4 sm:text-3xl font-display md:text-5xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Why choose BillingSDK?
      </h2>
      <p className="text-sm md:text-base text-balance mt-4 text-muted-foreground mb-12 max-w-3xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-center">
        Beautiful, customizable billing components that save you development
        time and effort.
      </p>

      <div className="relative w-full rounded-none -pr-2  ">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-4 w-full relative sm:grid-cols-2 lg:grid-cols-10">
            {features.map((item, index) => {
              return <FeatureCard key={item.title} item={item} index={index} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

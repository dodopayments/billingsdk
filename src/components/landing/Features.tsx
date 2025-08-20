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
    label: "Framework Agnostic",
    title: "Support for popular <strong>frameworks</strong>.",
    description:
      "Works seamlessly with React, Vue, Svelte, Next.js, Nuxt, and more. Drop billing components into any modern web framework.",
    icon: PlugZap2Icon,
  },
  {
    id: 2,
    label: "Pricing Tables",
    title: "Beautiful <strong>pricing tables</strong>.",
    description:
      "Pre-built pricing components with multiple layouts, subscription tiers, and customizable styling to match your brand.",
    icon: CreditCardIcon,
  },
  {
    id: 3,
    label: "Usage Tracking",
    title: "Real-time <strong>usage meters</strong>.",
    description:
      "Track and display customer usage with circular and linear progress meters. Perfect for metered billing and quota management.",
    icon: BarChart3Icon,
  },
  {
    id: 4,
    label: "Subscription Management",
    title: "Complete <strong>subscription flows</strong>.",
    description:
      "Handle plan upgrades, downgrades, and cancellations with pre-built components that guide users through each step.",
    icon: ShieldCheckIcon,
  },
  {
    id: 5,
    label: "Cancellation Flow",
    title: "Smart <strong>retention</strong> strategies.",
    description:
      "Reduce churn with intelligent cancellation flows that offer alternatives and capture feedback before customers leave.",

    icon: TrendingUpIcon,
  },

  {
    id: 6,
    label: "Notification Banners",
    title: "Billing <strong>notifications</strong>.",
    description:
      "Keep customers informed with customizable banners for trial expirations, payment failures, and billing updates.",
    icon: BellIcon,
  },
];

export default function Features() {
  return (
    <div className="relative rounded-none -pr-2  ">
      <div className="w-full md:mx-0">
        <div className="grid grid-cols-1 relative md:grid-rows-2 md:grid-cols-3 border-b-[1.2px]">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "justify-center border-l-[1.2px] md:min-h-[240px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-10 2xl:p-12",
                index >= 3 && "md:border-t-[1.2px]"
              )}
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
                  <a className="ml-2 underline" href="/docs" target="_blank">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative col-span-3 border-t-[1.2px] border-l-[1.2px] md:border-b-[1.2px] dark:border-b-0  h-full py-20">
          <div className="w-full h-full p-16 pt-10 md:px-10 2xl:px-16">
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
              <div className="flex items-center gap-2">
                <Globe2Icon className="w-4 h-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Billing Made Simple
                </p>
              </div>
              <p className="max-w-md mx-auto mt-4 text-4xl font-normal tracking-tighter text-center md:text-4xl">
                <strong>Build beautiful billing UIs in minutes!</strong>
              </p>
              <div className="flex mt-[10px] z-20 justify-center items-start">
                <TechStackDisplay
                  skills={[
                    "nextJs",
                    "react",
                    "nuxt",
                    "svelteKit",
                    "astro",
                    "solidStart",
                    "tanstack",
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                {/* <GithubStat stars={stars} /> */}
              </div>
              <Ripple />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RippleProps {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}
const Ripple = React.memo(function Ripple({
  mainCircleSize = 180,
  mainCircleOpacity = 0.2,
  numCircles = 10,
}: RippleProps) {
  return (
    <div className="absolute opacity-65 w-full inset-0 flex items-center justify-center bg-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border [--i:${i}]`}
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

import { Icons } from "./Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
type TechStackIconType = {
  [key: string]: {
    name: string;
    icon: any;
  };
};
export const techStackIcons: TechStackIconType = {
  nextJs: {
    name: "Next.js",
    icon: <Icons.nextJS className="w-10 h-10" />,
  },
  nuxt: {
    name: "Nuxt",
    icon: <Icons.nuxt className="w-10 h-10" />,
  },
  svelteKit: {
    name: "SvelteKit",
    icon: <Icons.svelteKit className="w-10 h-10" />,
  },
  solidStart: {
    name: "SolidStart",
    icon: <Icons.solidStart className="w-10 h-10" />,
  },
  react: {
    name: "React",
    icon: <Icons.react className="w-10 h-10" />,
  },
  hono: {
    name: "Hono",
    icon: <Icons.hono className="w-10 h-10" />,
  },
  astro: {
    name: "Astro",
    icon: <Icons.astro className="w-10 h-10" />,
  },
  tanstack: {
    name: "TanStack Start",
    icon: <Icons.tanstack className="w-10 h-10" />,
  },
  expo: {
    name: "Expo",
    icon: <Icons.expo className="w-10 h-10" />,
  },
  nitro: {
    name: "Nitro",
    icon: <Icons.nitro className="w-10 h-10" />,
  },
};
const TechStackDisplay = ({
  skills,
  className,
}: {
  skills: string[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex gap-7 flex-wrap mt-3 justify-center items-center max-w-4xl",
        className
      )}
    >
      {skills.map((icon) => {
        return (
          <TooltipProvider delayDuration={50} key={icon}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="transform duration-300 hover:rotate-12 transition-transform">
                  {techStackIcons[icon].icon}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-white/80 bg-gradient-to-tr from-stone-950/90 via-stone-900 to-stone-950/90">
                {techStackIcons[icon].name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

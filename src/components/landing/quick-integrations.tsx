"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, Zap } from "lucide-react";
import { ShineButton } from "./shine-button";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import {
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
} from "fumadocs-ui/components/codeblock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface QuickIntegrationDataItem {
  heading: string;
  href: string;
  label: string;
  description: string;
  subPoints: string[];
  codeExample: {
    title: string;
    code?: string;
    language: string;
    commands?: {
      npm: string;
      pnpm: string;
      bun: string;
    };
  };
}

export const billingQuickIntegrationData: QuickIntegrationDataItem[] = [
  {
    heading: "Installation",
    href: "/docs/quick-start",
    label: "Follow Installation",
    description:
      "Get started with Billing SDK in seconds. Choose between our CLI tool for complete project setup or add individual components using shadcn. Both methods provide TypeScript-first components with full theme integration.",
    subPoints: [
      "One-command project initialization",
      "Individual component installation",
      "Automatic dependency management",
    ],
    codeExample: {
      title: "Install any component instantly",
      language: "shell",
      commands: {
        npm: "npx shadcn@latest add @billingsdk/pricing-table-one",
        pnpm: "pnpm dlx shadcn@latest add @billingsdk/pricing-table-one",
        bun: "bunx shadcn@latest add @billingsdk/pricing-table-one",
      },
    },
  },
  {
    heading: "Configure Theming",
    href: "/docs/theming",
    label: "Play with Themes",
    description:
      "Customize your billing components with our comprehensive theming system. Choose from pre-built themes like Cyberpunk, Elegant, or Minimal, or create your own using CSS variables for perfect brand integration.",
    subPoints: [
      "10+ pre-built theme variants",
      "CSS variable-based customization",
      "Dark/light mode support",
    ],
    codeExample: {
      title: "Apply custom theme colors",
      code: `:root {
  --primary: oklch(0.6 0.25 253);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0.01 253);
  --radius: 0.625rem;
}`,
      language: "css",
    },
  },
  {
    heading: "Usage",
    href: "/docs/quick-start#use-in-your-app",
    label: "Implement Usage",
    description:
      "Start building with production-ready components immediately. Import your chosen component, pass your pricing data, and handle user interactions with simple callback functions. Full TypeScript support included.",
    subPoints: [
      "Import and use instantly",
      "TypeScript interfaces included",
      "Callback-based event handling",
    ],
    codeExample: {
      title: "Use components with full TypeScript support",
      code: `import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";
import { plans } from "@/lib/billingsdk-config";

<PricingTableOne
  plans={plans}
  onPlanSelect={(planId) => console.log('Selected:', planId)}
  theme="classic"
  size="medium"
/>`,
      language: "tsx",
    },
  },
];

const CodeExample = ({
  example,
}: {
  example: QuickIntegrationDataItem["codeExample"];
}) => {
  if (example.commands) {
    return (
      <div className="">
        <Badge
          variant={"secondary"}
          className="text-muted-foreground text-sm font-normal"
        >
          {example.title}
        </Badge>
        <CodeBlockTabs
          defaultValue="npm"
          className="w-full bg-black/20 p-2 backdrop-blur-lg"
        >
          <CodeBlockTabsList className="w-full">
            <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
            <CodeBlockTabsTrigger value="pnpm">pnpm</CodeBlockTabsTrigger>
            <CodeBlockTabsTrigger value="bun">bun</CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="npm" className="w-full p-2">
            <CodeBlock
              className="max-w-full bg-black/20 backdrop-blur-lg md:max-w-md"
              code={example.commands.npm}
              language={example.language}
            ></CodeBlock>
          </CodeBlockTab>

          <CodeBlockTab value="pnpm" className="w-full p-2">
            <CodeBlock
              className="max-w-full bg-black/20 backdrop-blur-lg md:max-w-md"
              code={example.commands.pnpm}
              language={example.language}
            ></CodeBlock>
          </CodeBlockTab>

          <CodeBlockTab value="bun" className="w-full p-2">
            <CodeBlock
              className="max-w-full bg-black/20 backdrop-blur-lg md:max-w-md"
              code={example.commands.bun}
              language={example.language}
            ></CodeBlock>
          </CodeBlockTab>
        </CodeBlockTabs>
      </div>
    );
  }

  return (
    <div className="">
      <Badge
        variant={"secondary"}
        className="text-muted-foreground mb-3 text-sm font-normal"
      >
        {example.title}
      </Badge>
      <CodeBlock
        className="max-w-full bg-black/50 backdrop-blur-lg md:max-w-md"
        showLineNumbers
        code={example.code!}
        language={example.language}
      >
        <CodeBlockCopyButton />
      </CodeBlock>
    </div>
  );
};

export function QuickIntegration() {
  return (
    <div className="my-20 flex max-h-fit min-h-[30rem] flex-col items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <ShineButton Icon={Zap} label="Quick Integration" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="font-display text-primary animate-in fade-in slide-in-from-bottom-4 mt-4 max-w-2xl text-center text-3xl font-medium text-balance duration-1000 sm:text-3xl md:text-5xl"
      >
        Get your billing system running in minutes
      </motion.h2>

      <div className="mt-14 flex w-full max-w-7xl flex-col gap-8">
        {billingQuickIntegrationData.map((item, index) => (
          <motion.div
            key={item.heading}
            initial={{
              opacity: 0,
              y: 20,
              filter: "blur(10px)",
            }}
            viewport={{
              once: true,
            }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              delay: 0.3 + index * 0.2,
              ease: "easeInOut",
            }}
            className={`border-muted bg-muted/20 flex w-full flex-col items-start gap-8 rounded-3xl p-6 xl:flex-row`}
          >
            <div className="h-fit w-full rounded-md p-4 xl:aspect-[3/2] xl:h-full xl:w-1/2">
              <div className="flex flex-col gap-4 xl:h-[calc(100%-25px)]">
                <Image
                  src="/landing/gradient2.png"
                  alt="Moon background"
                  fill
                  className="absolute top-0 left-0 h-full w-full object-cover opacity-20 blur"
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-lg md:text-xl">
                      {index + 1}. {item.heading}
                    </div>
                  </div>
                  <div className="text-muted-foreground/80 text-sm leading-relaxed lg:text-base">
                    {item.description}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {item.subPoints.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        className="text-muted-foreground flex items-center gap-3 text-base"
                      >
                        <div
                          className={cn(
                            "rounded-full p-0.5 transition-colors duration-200",
                          )}
                        >
                          <CheckIcon className="fill-primary text-primary-foreground size-5" />
                        </div>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button asChild variant={"secondary"} className="mt-4 xl:mt-0">
                <Link href={item.href} className="flex items-center gap-2">
                  <span>{item.label}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-muted/20 border-muted/80 relative hidden w-full overflow-x-scroll rounded-xl border px-6 py-10 transition-all duration-500 md:block md:overflow-auto xl:aspect-[3/2] xl:w-1/2 xl:py-0">
              <div className="mx-auto flex h-full max-w-full items-center md:max-w-1/2 md:justify-center">
                <CodeExample example={item.codeExample} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

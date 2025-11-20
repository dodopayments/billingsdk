"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { CornerDownLeft } from "lucide-react";
import { CodeBlock, CodeBlockCopyButton } from "./code-block";
import { useRouter } from "next/navigation";

const Hero = () => {
  const feature = {
    title: "Plan Upgrades in Seconds",
    description: "Beautiful plan upgrade interface - copy, paste, done!",
    code: `
  import { UpdatePlanCard } from "@/components/billingsdk/update-plan-card"
  import { plans } from "@/lib/billingsdk-config"

  export default function App() {
    return (
      <UpdatePlanCard
        currentPlan={plans[0]}
        plans={plans}
        onPlanChange={(planId) => console.log('Upgraded to:', planId)}
      />
    ) 
  }`,
    language: "tsx",
  };
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "enter") {
        router.push("/docs"); // Redirect to Get Started
      }
      if (e.key.toLowerCase() === "b") {
        router.push("/docs/components"); // Redirect to Browse Components
      }
      if (e.key.toLowerCase() === "g") {
        router.push("https://github.com/dodopayments/billingsdk");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className="border-muted relative max-h-fit min-h-[45rem] overflow-hidden rounded-4xl border pt-30">
      {/* Background Image */}
      <Image
        src="/landing/FractalMaze.jpg"
        alt="Moon background"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[1px] md:blur-[2px]"
      />
      {/* Content */}
      <motion.div
        className="relative z-10 px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto w-full max-w-7xl">
          {/* Main Hero Section */}
          <div className="relative mb-8 space-y-4 text-center sm:mb-12 md:mb-16">
            <motion.h1
              className="font-display relative mx-auto mb-3 max-w-xl text-5xl leading-10 font-semibold text-balance text-white md:text-6xl lg:text-7xl xl:leading-16"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Launch Billing UIs at <span>warp speed</span>
              <motion.div
                className="group absolute top-[100px] -right-[145px] hidden h-12 rotate-12 rounded-full p-px text-xs leading-6 font-semibold text-white lg:flex"
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              >
                <span className="via-primary/40 absolute -top-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>

                {/* Inner container like button */}
                <div className="relative z-10 hidden items-center gap-2 rounded-full px-4 py-0.5 ring-1 ring-white/10">
                  <div className="text-lg whitespace-nowrap text-white">
                    Fully Open Source
                  </div>
                  <svg
                    className="absolute -top-12 right-1/2 translate-x-1/2 -rotate-12 transform text-white"
                    width="80"
                    height="40"
                    viewBox="0 0 40 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M38 28C32 22 28 18 22 15C16 12 12 10 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M8 10L5 5L10 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Underline effect like Tailwind Connect */}
                <span className="via-primary/90 absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="mx-auto mt-8 w-full text-base tracking-tight text-neutral-100/80 sm:text-lg md:max-w-2xl md:text-balance"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              Stop reinventing the wheel , Ship production ready accessible
              billing components with 10x more faster speed, built for React and
              Shadcn.
            </motion.p>

            {/* Email Signup */}
            <motion.div
              className="mx-auto my-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:max-w-md"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <Button
                className="focus-visible:ring-ring gap-2 whitespace-nowrap transition-all duration-300 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                asChild
              >
                <Link className="group flex items-center gap-2" href="/docs">
                  <span>Get Started</span>
                  <Badge className="bg-accent text-foreground shadow-background/70 p-1 transition-all duration-200 ease-in-out group-hover:shadow-xl">
                    <CornerDownLeft className="size-4" />
                  </Badge>
                </Link>
              </Button>
              <Button
                variant="secondary"
                className="focus-visible:ring-ring gap-2 whitespace-nowrap transition-all duration-300 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <Link
                  className="group flex items-center gap-2"
                  href="/docs/components"
                >
                  <span>Browse Components</span>
                  <Badge className="bg-accent text-foreground shadow-white/70 transition-all duration-200 group-hover:shadow-xl">
                    B
                  </Badge>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Demo Section */}
          <motion.div
            className="relative flex flex-col items-center justify-center gap-6 sm:gap-8 lg:flex-row lg:gap-12"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="relative mx-4 mt-4 h-64 w-full max-w-2xl rounded-t-xl bg-gradient-to-r from-white/5 to-white/10 px-2 pt-2 shadow-lg backdrop-blur-md sm:mx-6 sm:h-72 md:mx-8 lg:h-80"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            >
              <div className="border-l-foreground relative bg-transparent">
                <motion.div
                  className="absolute -top-[60px] -left-[180px] hidden lg:block"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="group hidden h-12 -rotate-12 rounded-full p-px text-xs leading-6 font-semibold text-white lg:flex"
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                  >
                    {/* Top gradient line like Fully Open Source */}
                    <span className="via-primary/40 absolute -top-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>

                    {/* Inner container */}
                    <div className="relative z-10 hidden items-center gap-2 rounded-full px-4 py-0.5 ring-1 ring-white/10">
                      <div className="text-sm whitespace-nowrap text-white">
                        Easy to Use Components
                      </div>

                      {/* Original Easy to Use SVG (persisted as-is) */}
                      <svg
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 rotate-12 transform text-white"
                        width="40"
                        height="30"
                        viewBox="0 0 40 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2C8 8 12 12 18 15C24 18 28 20 35 25"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M32 20L35 25L30 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    {/* Bottom underline like Fully Open Source */}
                    <span className="via-primary/90 absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                  </motion.div>
                </motion.div>
              </div>

              <CodeBlock
                className="h-full rounded-b-none border-none bg-black/70 backdrop-blur-lg"
                code={feature.code}
                language="jsx"
              >
                <CodeBlockCopyButton
                  onCopy={() => console.log("Copied code to clipboard")}
                  onError={() =>
                    console.error("Failed to copy code to clipboard")
                  }
                />
              </CodeBlock>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;

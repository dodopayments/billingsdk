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
    <div className="rounded-4xl border border-muted min-h-[45rem] pt-30 max-h-fit overflow-hidden relative">
      {/* Background Image */}
      <Image
        src="/landing/FractalMaze.jpg"
        alt="Moon background"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full opacity-40 blur-[1px] md:blur-[2px] object-cover"
      />
      {/* Content */}
      <motion.div
        className="relative z-10 px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Hero Section */}
          <div className="text-center mb-8 space-y-4 sm:mb-12 md:mb-16 relative">
            <motion.h1
              className="text-5xl text-balance max-w-xl mx-auto md:text-6xl lg:text-7xl font-semibold font-display text-white mb-3 leading-10 xl:leading-16 relative"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Launch Billing UIs at <span>warp speed</span>
              <motion.div
                className="hidden lg:flex absolute rotate-12 top-[100px] -right-[145px] rounded-full p-px 
             text-xs font-semibold leading-6 h-12 text-white group"
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              >
                <span
                  className="absolute -top-0 left-[1.125rem] h-px 
                   w-[calc(100%-2.25rem)] 
                   bg-gradient-to-r from-emerald-400/0 via-primary/40 
                   transition-opacity duration-500 group-hover:opacity-40"
                ></span>

                {/* Inner container like button */}
               <div className="relative flex items-center gap-2 z-10 rounded-full py-0.5 px-4 ring-1 ring-white/10 hidden">
                  <div className="text-white text-lg whitespace-nowrap">
                    Fully Open Source
                  </div>
                  <svg
                    className="absolute -top-12 right-1/2 transform translate-x-1/2 -rotate-12 text-white"
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
                <span
                  className="absolute -bottom-0 left-[1.125rem] h-px 
                   w-[calc(100%-2.25rem)] 
                   bg-gradient-to-r from-emerald-400/0 via-primary/90  
                   transition-opacity duration-500 group-hover:opacity-40"
                ></span>
              </motion.div>
            </motion.h1>

            <motion.p
              className="text-neutral-100/80 md:text-balance text-base sm:text-lg w-full md:max-w-2xl mx-auto mt-8 tracking-tight"
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
              className="flex flex-col sm:flex-row gap-4 justify-center items-center my-8 md:max-w-md mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <Button
                className="gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300"
                asChild
              >
                <Link className="flex group items-center gap-2" href="/docs">
                  <span>Get Started</span>
                  <Badge className="bg-accent p-1 text-foreground transition-all duration-200 ease-in-out group-hover:shadow-xl shadow-background/70">
                    <CornerDownLeft className="size-4" />
                  </Badge>
                </Link>
              </Button>
              <Button
                variant="secondary"
                className="gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300"
              >
                <Link
                  className="flex group items-center gap-2"
                  href="/docs/components"
                >
                  <span>Browse Components</span>
                  <Badge className="bg-accent text-foreground transition-all duration-200 group-hover:shadow-xl shadow-white/70">
                    B
                  </Badge>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Demo Section */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="shadow-lg mx-4 bg-gradient-to-r from-white/5 to-white/10 px-2 rounded-t-xl backdrop-blur-md pt-2 sm:mx-6 md:mx-8 mt-4 h-64 sm:h-72 lg:h-80  w-full max-w-2xl relative"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            >
              <div className="bg-transparent border-l-foreground relative">
                <motion.div
                  className="hidden lg:block absolute -top-[60px] -left-[180px]"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="hidden lg:flex -rotate-12 rounded-full p-px 
             text-xs font-semibold leading-6 h-12 text-white group"
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                  >
                    {/* Top gradient line like Fully Open Source */}
                    <span
                      className="absolute -top-0 left-[1.125rem] h-px 
       w-[calc(100%-2.25rem)] 
       bg-gradient-to-r from-emerald-400/0 via-primary/40 
       transition-opacity duration-500 group-hover:opacity-40"
                    ></span>

                    {/* Inner container */}
                    <div className="relative flex items-center gap-2 z-10 rounded-full py-0.5 px-4 ring-1 ring-white/10 hidden">
                      <div className=" text-white text-sm whitespace-nowrap">
                        Easy to Use Components
                      </div>

                      {/* Original Easy to Use SVG (persisted as-is) */}
                      <svg
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 rotate-12 text-white"
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
                    <span
                      className="absolute -bottom-0 left-[1.125rem] h-px 
       w-[calc(100%-2.25rem)] 
       bg-gradient-to-r from-emerald-400/0 via-primary/90  
       transition-opacity duration-500 group-hover:opacity-40"
                    ></span>
                  </motion.div>
                </motion.div>
              </div>

              <CodeBlock
                className="border-none h-full rounded-b-none bg-black/70 backdrop-blur-lg"
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

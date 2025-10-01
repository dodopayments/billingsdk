"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CustomCodeBlock } from "@/components/code";
import { motion } from "motion/react";
import Link from "next/link";
import { Cover } from "../ui/cover";
import { GrainGradient } from "@paper-design/shaders-react";
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

  return (
    <div className="rounded-lg overflow-hidden relative">
      <GrainGradient
        style={{ height: "125%", width: "125%", position: "absolute" }}
        colorBack="hsl(0, 0%, 5%)"
        softness={0.5}
        className="opacity-90"
        intensity={0.27}
        noise={0.3}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={[
          "hsl(218, 100%, 50%)",
          "hsl(212, 100%, 83%)",
          "hsl(195, 100%, 50%)",
          "hsl(250, 100%, 50%)",
        ]}
      />
      {/* Content */}
      <motion.div
        className="relative z-10 pt-[calc(70vh/4)] px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Hero Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
            <motion.h1
              className="text-3xl sm:text-4xl w-fit mx-auto md:text-5xl lg:text-7xl font-medium font-display text-white mb-3 leading-tight relative"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Ship Billing UIs <Cover className="text-primary">10x</Cover>{" "}
              Faster
              {/* Fully Open Source annotation inside h1 */}
              <motion.div
                className="hidden lg:block absolute top-[100px] -right-[145px]"
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              >
                <div className="relative">
                  <div className="handwritten text-white text-lg transform rotate-12 whitespace-nowrap">
                    Fully Open Source
                  </div>
                  <svg
                    className="absolute -top-8 right-1/2 transform translate-x-1/2 -rotate-12 text-white"
                    width="40"
                    height="30"
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
              </motion.div>
            </motion.h1>

            <motion.p
              className="text-neutral-100/80 text-sm sm:text-lg max-w-2xl mx-auto tracking-tighter"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              Stop reinventing the wheel. Use production-ready, accessible
              billing components, from pricing cards to subscription dashboards,
              built for React and ShadCN.
            </motion.p>

            {/* Email Signup */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center my-8 max-w-md mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <Button
                className="bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
                asChild
              >
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button
                variant="secondary"
                className="bg-secondary text-secondary-foreground ring-secondary before:from-secondary-foreground/20 after:from-secondary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
              >
                <Link href="/docs/components">Browse Components</Link>
              </Button>
            </motion.div>
            <div className="flex justify-center items-center w-full">
              <a
                className="w-fit"
                href="https://www.producthunt.com/products/dodo-payments?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_source=badge-billing&#0045;sdk&#0045;2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1011707&theme=light&period=daily&t=1757072846066"
                  alt="Billing&#0032;SDK - Open&#0032;source&#0032;billing&#0032;UI&#0032;components | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
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
            {/* Search Card */}
            <motion.div
              className="shadow-lg border-x border-t border-border mx-4 sm:mx-6 md:mx-8 mt-4 h-64 sm:h-72 lg:h-80  w-full max-w-2xl relative"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            >
              {/* Window chrome */}
              <div className="py-2 px-4 border-b border-border bg-transparent border-l-foreground relative">
                <div className="flex items-center gap-1">
                  <div className="size-2 outline rounded-full outline-border"></div>
                  <div className="size-2 outline rounded-full outline-accent"></div>
                </div>

                {/* Easy to Use Components annotation inside window chrome */}
                <motion.div
                  className="hidden lg:block absolute -top-[30px] -left-[150px]"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                >
                  <div className="relative">
                    <div className="handwritten text-white text-lg transform -rotate-12 whitespace-nowrap">
                      Easy to Use Components
                    </div>
                    <svg
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 rotate-12 text-white"
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
                </motion.div>
              </div>

              {/* Code block */}
              <CustomCodeBlock
                code={feature.code}
                language={feature.language}
                maxHeight="400px"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;

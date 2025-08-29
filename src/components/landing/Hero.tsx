"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CustomCodeBlock } from "@/components/code";
import { motion } from "motion/react";
import Link from "next/link";
import { Cover } from "../ui/cover";
import { analytics } from "@/lib/analytics";
import { Sparkles, ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const codeSnippet = `npm install @billingsdk/components

import { PricingTable } from "@billingsdk/components"

export default function App() {
  return (
    <PricingTable
      plans={plans}
      onPlanSelect={(planId) => console.log(planId)}
    />
  )
}`;

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/5 to-accent/10"></div>
      <div className="bg-[url('/landing/hero-bg.webp')] rounded-xl bg-cover bg-center relative">
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80 rounded-xl"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-muted/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        {/* Content */}
        <motion.div
          className="relative z-10 py-24 md:py-32 px-6 md:px-8"
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto w-full">
            {/* Badge */}
            <motion.div
              className="flex justify-center mb-8"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Open Source • MIT Licensed
              </div>
            </motion.div>

            {/* Main Hero Section */}
            <div className="text-center mb-12 relative">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                Ship Billing UIs{" "}
                <Cover className="text-primary bg-gradient-to-r from-primary to-blue-400">
                  10x
                </Cover>{" "}
                Faster
                
                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 text-yellow-400"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </motion.h1>

              <motion.p
                className="text-neutral-200 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto tracking-tight mb-10 leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                Copy-paste production-ready billing components. Stop building subscription UIs from scratch—ship faster with{" "}
                <span className="text-primary font-semibold">accessible</span>,{" "}
                <span className="text-blue-400 font-semibold">customizable</span> React components.
              </motion.p>

              {/* Enhanced CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                  asChild
                >
                  <Link href="https://billingsdk.com/docs" target="_blank" rel="noopener noreferrer" onClick={analytics.trackGetStartedClick} className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border bg-card/50 backdrop-blur-sm text-foreground hover:bg-card/80 hover:border-primary/50 font-semibold px-8 py-3 text-lg transition-all duration-300 w-full sm:w-auto group"
                  asChild
                >
                  <Link href="https://billingsdk.com/docs/components" target="_blank" rel="noopener noreferrer" onClick={analytics.trackBrowseComponentsClick} className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Live Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm mb-12"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>MIT Licensed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>TypeScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>shadcn/ui Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>500+ Developers</span>
                </div>
              </motion.div>
            </div>

          {/* Code Preview */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="shadow-lg border-x border-t border-border mx-4 sm:mx-6 md:mx-8 mt-4 h-64 sm:h-72 lg:h-80 w-full max-w-2xl relative"
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            >
              {/* Window chrome */}
              <div className="py-2 px-4 border-b border-border bg-background/5 backdrop-blur relative">
                <div className="flex items-center gap-1">
                  <div className="size-2 outline rounded-full outline-border bg-red-500/60"></div>
                  <div className="size-2 outline rounded-full outline-border bg-yellow-500/60"></div>
                  <div className="size-2 outline rounded-full outline-border bg-green-500/60"></div>
                </div>
              </div>

              {/* Code block */}
              <CustomCodeBlock
                code={codeSnippet}
                language="tsx"
                maxHeight="400px"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Hero;

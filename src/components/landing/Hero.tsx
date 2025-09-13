"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { GrainGradient } from "@paper-design/shaders-react";

import { HeroComponentsShowcase } from "./hero-components";
const Hero = () => {


  return (
    <div className="rounded-lg overflow-hidden relative">

      <DiagonalLightBeams />
      <motion.div
        className="relative z-10 pt-[calc(70vh/4)] px-6"
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto w-full">

          {/* Main Hero Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
            <ProductHuntBadge />
            <Header />
            <SubHeader />
            <CTA />
          </div>

          <div className="relative ">
            <EasyToUseAnnotation />
            <HeroComponentsShowcase />
          </div>

        </div>
      </motion.div>
    </div>
  );
};


function Header() {
  return (
    <>
      <motion.h1
        className="text-3xl sm:text-4xl w-fit mx-auto md:text-5xl lg:text-7xl lg:max-w-4xl font-medium font-display text-white mb-4 leading-tighter relative"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        Billing components for building payment infrastructure
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
    </>
  )
}

function SubHeader() {
  return (
    <>
      <motion.p
        className="text-neutral-100/80 text-sm sm:text-lg max-w-2xl mx-auto tracking-tighter"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        Use production-ready, accessible
        billing components, from pricing cards to subscription dashboards,
        built for React and ShadCN.
      </motion.p>
    </>)
}


function CTA() {

  return (
    <>
      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center items-center my-8 max-w-md mx-auto"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <Button
          className="relative isolate inline-flex items-center justify-center 
             overflow-hidden rounded-md px-6 py-3 text-sm font-semibold 
             bg-gray-100 text-gray-800
             shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]
             ring-1 ring-gray-200
             transition-all duration-300 hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(255,255,255,0.8)]"
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
    </>
  )
}


function ProductHuntBadge() {
  return (
    <>

      <div className="flex justify-center items-center w-full">
        <a
          className="w-fit"
          href="https://www.producthunt.com/products/dodo-payments?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_source=badge-billing&#0045;sdk&#0045;2"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1011707&theme=light&period=daily&t=1757072846066"
            alt="Billing&#0032;SDK - Open&#0032;source&#0032;billing&#0032;UI&#0032;components | Product Hunt"
            style={{ width: "230px", height: "46px" }}
            width="250"
            height="50"
          />
        </a>
      </div>
    </>
  )
}


function EasyToUseAnnotation() {
  return (
    <>

      {/* Easy to Use Components annotation inside window chrome */}
      <motion.div
        className="hidden lg:block absolute -top-[30px] -left-[100px]"
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

    </>
  )
}



import { useMotionValue, useTransform } from "framer-motion";

export function DiagonalLightBeams() {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // Animate offsets in a loop
  useTransform(offsetX, [0, 1], [-0.5, 0.5]);
  useTransform(offsetY, [0, 1], [-0.5, 0.5]);

  return (
    <motion.div
      //@ts-ignore
      style={{ offsetX, offsetY }}
      //@ts-ignore
      animate={{ offsetX: [0, 1], offsetY: [0, 1] }}
      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      className="absolute inset-0"
    >
      <GrainGradient
        style={{ height: "150%", width: "200%", position: "absolute" }}
        colorBack="hsl(0,0%,5%)"
        softness={0.8}
        intensity={0.25}
        noise={0.05}
        shape="wave"
        rotation={45}
        scale={3}
        colors={["rgba(255,255,0,0.2)", "rgba(128,0,128,0.15)"]}
      />
    </motion.div>
  );
}




export default Hero;

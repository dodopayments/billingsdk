"use client";

import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";
import { SiNextdotjs } from "react-icons/si";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
import { AiOutlineDollar } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { BsBell } from "react-icons/bs";
import { BiBarChartAlt2 } from "react-icons/bi";
import { motion } from 'motion/react'
import { Cover } from "../ui/cover";


export default function Features() {
  return (
    <div className="flex flex-col my-32 mt-32 items-center justify-center max-w-7xl mx-auto">
      <h2 className="text-3xl  font-display md:text-5xl font-medium text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Why choose BillingSDK?
      </h2>
      <p className=" mt-4 text-muted-foreground mb-12 max-w-xl mx-auto tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-center">
        Beautiful, customizable billing components that save you development
        time and effort.
      </p>

      <div className="relative rounded-none   ">
        <div className="w-full md:mx-0">
          <FeatureBento />
        </div>
      </div>
    </div>
  );
}


function FeatureBento() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3  w-full gap-5  lg:max-w-5xl">

        <div className="col-span-1 lg:col-span-2 border rounded overflow-hidden">
          <EasyCodeIntegration />
        </div>
        <div className="col-span-1 border rounded overflow-hidden ">
          <OpenSourceGithub />
        </div>

        <div className="col-span-1 border rounded ">
          <FastDevelopment />

        </div>
        <div className="col-span-1 lg:col-span-2 border rounded ">
          <SleekComponents />
        </div>

      </div>
    </>
  )
}

function EasyCodeIntegration() {
  return (
    <div className="relative h-full w-full overflow-hidden pt-4 px-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="md:text-[17px]">Easily Integrates with your system</h2>
        <h2 className="md:text-[16px] text-muted-foreground mt-1">
         It’s built on the shadcn ecosystem—code at your doorstep with just one command
        </h2>
      </motion.div>

      {/* Card */}
      <motion.div
        className="relative h-full mt-4 lg:mt-0 lg:translate-y-10 border rounded-lg shadow-lg overflow-hidden bg-muted-foreground/5"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Top Bar */}
        <div className="border-b w-full flex items-center justify-between px-2 gap-2 h-8 bg-muted">
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <Input
            readOnly
            value="https://billingsdk.com"
            className="text-sm text-center text-muted-foreground max-w-xs h-6"
          />

          <FiSearch className="size-5 text-muted-foreground" />
        </div>

        {/* Command Line */}
        <motion.div
          className="flex items-baseline p-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="60"
            height="60"
            className="text-foreground"
            fill="none"
          >
            <path
              d="M20 80
              C10 50, 40 40, 50 55
              C55 65, 35 70, 35 55
              C35 35, 70 35, 80 55"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M75 50 L85 55 L75 60"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(45 78 60)"
              fill="none"
            />
          </svg>

          <div className="md:text-[17px] ml-2">
            npx shadcn@latest add @billingsdk/pricing-table-one
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function OpenSourceGithub() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Logo Grid */}
      <motion.div
        className="flex flex-wrap gap-4 pt-4 pb-4 justify-center -mx-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }} // 👈 animate only first time in view
        variants={{
          hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: 0.6,
              staggerChildren: 0.1,
              ease: "easeOut",
            },
          },
        }}
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.div
            key={index}
            className="h-12 w-12 border rounded flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.4 },
              },
            }}
          >
            {index === 4 && (
              <SiNextdotjs className="text-white text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            )}

            {index === 8 && (
              <FaGithub className="text-yellow-400 text-3xl drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]" />
            )}

            {index === 12 && (
              <div className="relative flex items-end justify-center w-7 h-7 bg-white rounded shadow">
                {/* Left diagonal */}
                <div className="absolute bottom-2 right-2 w-0.5 h-6 bg-black rotate-[60deg]" />
                {/* Right diagonal */}
                <div className="absolute bottom-0 right-2 w-0.5 h-6 bg-black rotate-[60deg]" />
              </div>
            )}

            {index === 17 && (
              <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]">
                <FaReact />
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        className="border-t py-3 px-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>Open Source</h2>
        <h3 className="text-muted-foreground">
          Access the full source code, contribute and customize to your needs.
        </h3>
      </motion.div>
    </div>
  );
}




function FastDevelopment() {
  return (
    <div className="relative h-full w-full overflow-hidden pt-4 px-4">
      {/* Heading */}


      {/* Visual Card */}

      <div className="h-36 mb-10">

        <Cover className="w-full h-full">

          <motion.div
            className="relative  h-36 mt-4 rounded-lg shadow-lg overflow-hidden flex w-full text-lg px-12 items-center justify-center"

          >
            Faster Developement
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >

            </motion.div>

          </motion.div>
        </Cover>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        <h2 className="md:text-[16px] text-muted-foreground mt-4">
          Ship features faster with prebuilt components and a streamlined workflow.
        </h2>
      </motion.div>
    </div>
  );
}






function SleekComponents() {
  const components = [
    { id: "pricing", label: "Pricing", icon: AiOutlineDollar },
    { id: "subscription", label: "Subscription Management", icon: FiSettings },
    { id: "banner", label: "Banner Notifications", icon: BsBell },
    { id: "usage", label: "Usage Meters", icon: BiBarChartAlt2 },

  ];

  return (
    <>
      <h2 className="md:text-[17px] text-foreground mt-1 px-4 py-4">
        Beautiful, production-ready components - copy, paste, done!
      </h2>
      <div className="px-4 flex flex-col gap-4 py-4">
        {components.map((component, index) => (
          <motion.div
            key={component.id}
            className="p-2 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex items-center gap-3 backdrop-blur-sm"
            initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
          >
            <div className="w-5 h-5 border rounded-full bg-muted flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-br from-white to-yellow-500"></div>
            </div>
            <h2 className="md:text-[17px] flex items-center gap-2 text-muted-foreground">
              <component.icon className="size-5" /> {component.label}
            </h2>
          </motion.div>
        ))}
      </div>
    </>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { CornerDownLeft } from "lucide-react";
import { LogoMark } from "./svgs/logo-mark";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full h-[20rem] border rounded-2xl overflow-hidden relative">
      <Image
        src="/landing/FractalMaze.jpg"
        alt="Moon background"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full opacity-40 blur-[1px] md:blur-[2px] object-cover rotate-180"
      />

      <div className="absolute right-40 xl:flex hidden top-30 items-center justify-center size-32 border-2 border-white/30 p-4 rounded-4xl bg-accent/10 backdrop-blur-xs">
        <LogoMark className="size-32" />
      </div>

      <div className="relative z-10 flex flex-col items-start px-4 md:px-8 pt-2 pb-4 justify-between sm:justify-center h-full">
        <div className="relative flex flex-col items-start justify-start">
          <p className="text-white max-w-lg mt-3 tracking-tight font-semibold text-xl md:text-3xl text-left">
            Ready to use billing components and blocks for your next project?
          </p>
          <p className="text-sm pt-3 text-neutral-200 max-w-xl text-left">
            Free Billing components and blocks built with React, Typescript,
            Tailwind CSS, and Motion. Perfect companion for shadcn/ui.
          </p>
        </div>
        <motion.div
          className="w-full flex flex-row md:gap-4 gap-2 flex-wrap md:justify-start justify-center items-stretch md:items-start mt-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <Button
            className="w-full md:w-52 h-12 text-primary-foreground before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium  before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
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
            className="bg-secondary w-full md:w-52 h-12 text-secondary-foreground ring-accent hover:ring-2  relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
          >
            <Link
              className="flex group items-center gap-2"
              href="/docs/components"
            >
              <span>Github</span>
              <Badge className="bg-accent text-foreground transition-all duration-200 group-hover:shadow-xl shadow-white/70">
                <FaGithub />
              </Badge>
            </Link>
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}

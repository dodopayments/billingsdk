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
        <footer className="relative min-h-[18rem] w-full overflow-hidden rounded-2xl border sm:h-[20rem]">
      <Image
        src="/landing/FractalMaze.jpg"
        alt="Moon background"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full rotate-180 object-cover opacity-40 blur-[1px] md:blur-[2px]"
      />

      <div className="bg-accent/10 absolute top-30 right-40 hidden size-32 items-center justify-center rounded-4xl border-2 border-white/30 p-4 backdrop-blur-xs xl:flex">
        <LogoMark className="size-32" />
      </div>

            <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pt-2 pb-2 sm:justify-center sm:pb-4 md:px-8">
        <div className="relative flex flex-col items-start justify-start">
          <p className="mt-2 max-w-lg text-left text-lg font-semibold tracking-tight text-white sm:mt-3 sm:text-xl md:text-3xl">
            Ready to use billing components and blocks for your next project?
          </p>
                    <p className="max-w-xl pt-2 text-left text-xs text-neutral-200 sm:pt-3 sm:text-sm">
            Free Billing components and blocks built with React, Typescript,
            Tailwind CSS, and Motion. Perfect companion for shadcn/ui.
          </p>
        </div>
        <motion.div
          className="mt-4 flex w-full flex-row flex-wrap items-stretch justify-center gap-2 sm:mt-6 md:items-start md:justify-start md:gap-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <Button
            className="text-primary-foreground before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer sm:h-12 md:w-52"
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
            className="bg-secondary text-secondary-foreground ring-accent relative isolate inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer hover:ring-2 sm:h-12 md:w-52"
          >
            <Link
              className="group flex items-center gap-2"
              href="/docs/components"
            >
              <span>Github</span>
              <Badge className="bg-accent text-foreground shadow-white/70 transition-all duration-200 group-hover:shadow-xl">
                <FaGithub />
              </Badge>
            </Link>
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}

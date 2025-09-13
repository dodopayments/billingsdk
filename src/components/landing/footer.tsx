"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GrainGradient } from "@paper-design/shaders-react";
import { DiagonalLightBeams } from "./Hero";

export function Footer() {
  return (
    <footer className="w-full my-5 py-20 rounded-b-xl overflow-hidden relative">
      {/* <GrainGradient
        style={{ height: "150%", width: "100%", position: "absolute" }}
        colorBack="hsl(0, 0%, 5%)"
        softness={0.5}
        className="opacity-90"
        intensity={0.27}
        noise={0.30}
        shape="wave"
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
      /> */}
      <DiagonalLightBeams/>
      <div className="relative z-10 flex flex-col items-center justify-center h-full my-12 space-y-10 px-6">
        <div className="relative flex flex-col items-center justify-center">
          <p className="text-white mt-3 tracking-tight text-xl md:text-3xl text-center">
            Ready to use billing components and blocks for your next project?
          </p>
          <p className="text-sm pt-2 text-neutral-300 text-center max-w-xl mx-auto">
            Free Billing components and blocks built with React, Typescript,
            Tailwind CSS, and Motion. Perfect companion for shadcn/ui.
          </p>
          <div className="flex py-4 gap-2 mt-4">
            <Button
              asChild
              className="bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
            >
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button
              variant="secondary"
              asChild
              className="bg-secondary text-secondary-foreground ring-secondary before:from-secondary-foreground/20 after:from-secondary-foreground/10 relative isolate inline-flex items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer"
            >
              <Link href="/docs/components">Browse Components</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

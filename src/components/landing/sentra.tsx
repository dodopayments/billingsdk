"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CornerDownLeft } from "lucide-react";
import Image from "next/image";
import { ShineButton } from "./shine-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sentra() {
  return (
    <div className="relative h-[30rem] w-full overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-black/20 before:via-transparent before:to-black/20 after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-t after:from-black/10 after:via-transparent after:to-black/10">
      <Image
        src="/landing/sentrabg.png"
        alt="Moon background"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[1px] md:blur-[2px]"
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-8 md:flex-row md:px-8">
        {/* Left Content */}
        <div className="flex flex-col items-start justify-center md:w-1/2 md:pr-8">
          <ShineButton
            containerClassName="rounded-none"
            className="mb-2 rounded-sm shadow-md shadow-white/5"
            label="Sentra"
          />
          <p className="font-display mb-4 text-left text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Don't code,
            <br />
            just prompt & integrate.
          </p>
          <p className="mb-8 max-w-xl text-left text-sm text-neutral-200">
            Sentra is the new agentic stack from Dodo Payments, an IDE-first
            assistant that integrates billing and payments, gives insights, and
            executes actions inside VS Code, Cursor or Windsurf.
          </p>
          <motion.div
            className="flex"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-primary-foreground before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex h-12 w-44 items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer md:w-52">
                  <span className="group flex items-center gap-2">
                    <span>Get Alpha Access</span>
                    <CornerDownLeft className="size-4 transition-all duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  className="cursor-pointer px-3 py-2"
                  onClick={() =>
                    window.open(
                      "vscode:extension/dodopayments.sentra-code",
                      "_blank",
                    )
                  }
                >
                  VS Code
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer px-3 py-2"
                  onClick={() =>
                    window.open(
                      "windsurf:extension/dodopayments.sentra-code",
                      "_blank",
                    )
                  }
                >
                  Windsurf
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer px-3 py-2"
                  onClick={() =>
                    window.open(
                      "cursor:extension/dodopayments.sentra-code",
                      "_blank",
                    )
                  }
                >
                  Cursor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        {/* Right Sentra Image */}
        <div className="mt-8 flex items-center justify-center md:mt-0 md:w-1/2">
          <div className="bg-muted/20 border-muted/80 relative overflow-x-scroll rounded-xl border p-4 md:overflow-auto">
            <Image
              src="/landing/SENTRA.png"
              alt="Sentra"
              width={500}
              height={500}
              className="opacity-80 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

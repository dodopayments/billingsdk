"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import GitHubStarBadge from "./GitHubStarBadge";
import { Badge } from "../ui/badge";
import { CornerDownLeft } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/logo/logo-dodo.svg"
        alt="Billing SDK"
        width={28}
        height={28}
      />
      <span className="font-display text-3xl">/</span>
      <Image src="/logo/Logo.svg" alt="Billing SDK" width={120} height={120} />
    </div>
  );
};

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (current) =>
    setIsScrolled(current >= 10),
  );

  console.log(isScrolled);
  return (
    <nav
      className={cn(
        `fixed right-0 left-0 z-55 mx-auto flex max-w-7xl justify-center ${
          isScrolled ? "top-4 px-2 md:px-20" : "top-2 px-6 py-4"
        } transition-all duration-300`,
      )}
    >
      <div className="w-full">
        <div
          className={cn(
            `flex w-full items-center justify-between px-2 py-3 transition-all duration-300 md:px-4 ${
              isScrolled &&
              "bg-accent/30 rounded-2xl px-4 inset-shadow-sm inset-shadow-white/20 backdrop-blur-lg"
            }`,
          )}
        >
          <Link href="/" className="cursor-pointer">
            <Logo />
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Show full star badge on sm+ screens */}
            <div className="hidden sm:block">
              <GitHubStarBadge />
            </div>
            {/* Keep compact icon on very small screens */}
            <div className="sm:hidden">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/dodopayments/billingsdk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex h-7 items-center justify-center overflow-hidden rounded-md px-2 text-left text-xs font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer sm:h-8 sm:px-3 sm:text-sm"
              asChild
            >
              <Link className="group flex items-center gap-2" href="/docs">
                <span>Get Started</span>
                <Badge className="bg-accent text-foreground shadow-background/70 p-1 transition-all duration-200 ease-in-out group-hover:shadow-xl">
                  <CornerDownLeft className="size-4" />
                </Badge>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

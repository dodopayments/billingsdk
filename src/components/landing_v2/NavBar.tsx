"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0  max-w-[1920px] w-full left-0 right-0 z-50 p-4 flex justify-center",
        isScrolled ? "py-0" : ""
      )}
    >
      <div
        className={cn(
          `flex items-center w-full justify-between px-6 py-3  transition-all duration-300 ${
            isScrolled
              ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-b-lg"
              : ""
          }`
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mr-8">
          <Image
            src="/logo/logo-dodo.svg"
            alt="Billing SDK"
            width={24}
            height={24}
          />
          <span className="text-lg font-display">/</span>
          <span className="text-lg font-heading font-semibold">
            Billing SDK
          </span>
        </div>

        {/* Join Beta Button */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/dodopayments/billingsdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

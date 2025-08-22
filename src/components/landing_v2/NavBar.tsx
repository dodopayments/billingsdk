import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="fixed max-w-[1920px] mx-auto top-0 left-0 right-0 z-50 p-8">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo/logo-dodo.svg"
            alt="Billing SDK"
            width={26}
            height={26}
          />
          <span className="text-xl font-display">/</span>
          <span className="text-2xl pb-1 font-heading font-semibold">
            Billing SDK
          </span>
        </div>

        {/* Join Beta Button */}
        <Button
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
          asChild
        >
          <Link href="/docs">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;

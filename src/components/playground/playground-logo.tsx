"use client";

import Image from "next/image";

export function PlaygroundLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/logo/logo-dodo.svg"
        alt="Billing SDK"
        width={20}
        height={20}
      />
      <span className="text-lg font-display text-foreground">/</span>
      <Image 
        src="/logo/Logo.svg" 
        alt="Billing SDK" 
        width={80} 
        height={80} 
      />
    </div>
  );
}

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/landing_v2/NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1920px] mx-auto min-h-screen bg-background">
      <NavBar />
      {/* Main Content */}
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import NavBar from "@/components/landing/NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1920px] mx-auto min-h-screen bg-background">
      <NavBar />
      {children}
    </div>
  );
}

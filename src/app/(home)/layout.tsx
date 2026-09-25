import type { ReactNode } from "react";
import NavBar from "@/components/landing/NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1920px] bg-background">
      <NavBar />
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions}>
      <div
        className="max-w-7xl mx-auto border-x border-y border-base-900 px-2 md:px-0 w-full lg:overflow-hidden"
        style={{
          background:
            "repeating-linear-gradient(125deg, transparent, transparent 6px, #e8e8e820 6px, #e8e8e820 7px)",
        }}
      >
        {children}
      </div>
    </HomeLayout>
  );
}

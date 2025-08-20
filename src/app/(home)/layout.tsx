import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions}>
      <div className="w-full max-w-[1400px] border-x border-dashed mx-auto">
        {children}
      </div>
    </HomeLayout>
  );
}



import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const geistSans = Geist({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

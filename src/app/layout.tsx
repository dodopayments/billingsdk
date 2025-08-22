import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { Darker_Grotesque, Instrument_Sans, Inter, Kalam } from "next/font/google";
import type { ReactNode } from "react";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const DarkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  variable: "--font-darker-grotesque",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${DarkerGrotesque.variable} ${inter.variable} ${kalam.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-body">
        <ThemeProvider>
          <RootProvider>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { Darker_Grotesque, Inter, Kalam } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: {
    default: "BillingSDK - Production-Ready Billing Components for React",
    template: "%s | BillingSDK"
  },
  description: "Copy-paste billing components for React. Ship pricing tables, subscription management, and usage meters 10x faster. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: [
    "billing components",
    "subscription management",
    "pricing tables",
    "usage meters",
    "React components",
    "nextjs components", 
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "billing UI",
    "subscription UI",
    "pricing UI",
    "billing SDK",
    "payment components",
    "copy paste components",
    "open source",
    "production ready"
  ],
  metadataBase: new URL("https://billingsdk.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("https://billingsdk.com"),
    title: "BillingSDK - Production-Ready Billing Components for React",
    description: "Copy-paste billing components for React. Ship pricing tables, subscription management, and usage meters 10x faster. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
    siteName: "BillingSDK",
    images: [
      {
        url: "/landing/og-image.png",
        width: 1200,
        height: 630,
        alt: "BillingSDK - Production-Ready Billing Components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillingSDK - Production-Ready Billing Components",
    description: "Copy-paste billing components for React. Ship pricing tables, subscription management, and usage meters 10x faster.",
    images: ["/landing/og-image.png"],
    creator: "@dodopayments",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${DarkerGrotesque.variable} ${inter.variable} ${kalam.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/logo/logo-dodo.svg" />
        <link rel="apple-touch-icon" href="/logo/logo-dodo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="flex flex-col min-h-screen font-body">
        <ThemeProvider>
          <RootProvider
          theme={{
            enabled: false, // Disable theme switching
            defaultTheme: 'dark',
            storageKey: 'fumadocs-theme',
          }}
        >{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

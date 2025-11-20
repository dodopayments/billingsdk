import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { ThemeProvider } from "@/contexts/theme-context";
import { Darker_Grotesque, Inter, Kalam } from "next/font/google";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    default: "Billing SDK - Modern Billing & Monetization Components",
    template: "%s | Billing SDK",
  },
  description:
    "A comprehensive collection of modern billing and subscription management components built with React, TypeScript, and Tailwind CSS. Perfect companion for shadcn/ui.",
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
  ],
  metadataBase: new URL("https://billingsdk.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("https://billingsdk.com"),
    title: "Billing SDK - Modern Billing & Monetization Components",
    description:
      "A comprehensive collection of modern billing and subscription management components built with React, TypeScript, and Tailwind CSS. Perfect companion for shadcn/ui.",
    siteName: "Billing SDK",
    images: [
      {
        url: "/landing/og-image.png",
        width: 1200,
        height: 630,
        alt: "Billing SDK - Modern Billing & Monetization Components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Billing SDK - Modern Billing & Subscription Components",
    description:
      "A comprehensive collection of modern billing and subscription management components built with React, TypeScript, and Tailwind CSS.",
    images: ["/logo/logo-dodo.svg"],
    creator: "@billingsdk",
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
      </head>
      <body className="font-body flex min-h-screen flex-col">
        <ThemeProvider>
          <RootProvider
            theme={{
              enabled: false, // Disable theme switching
              defaultTheme: "dark",
              storageKey: "fumadocs-theme",
            }}
          >
            {children}
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

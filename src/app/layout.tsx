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
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BillingSDK - Copy-paste billing components for React",
    template: "%s | BillingSDK",
  },
  description:
    "Copy-paste production-ready billing components for React. From pricing tables to subscription management—accessible, customizable, and open source.",
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
    "open source billing",
  ],
  metadataBase: new URL("https://billingsdk.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("https://billingsdk.com"),
    title: "BillingSDK - Copy-paste billing components for React",
    description:
      "Copy-paste production-ready billing components for React. From pricing tables to subscription management—accessible, customizable, and open source.",
    siteName: "BillingSDK",
    images: [
      {
        url: "/landing/og-image.png",
        width: 1200,
        height: 630,
        alt: "BillingSDK - Copy-paste billing components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillingSDK - Copy-paste billing components for React",
    description:
      "Copy-paste production-ready billing components for React. From pricing tables to subscription management—accessible, customizable, and open source.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
      <body className="flex flex-col min-h-screen font-body" suppressHydrationWarning={true}>
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
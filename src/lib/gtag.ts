export interface GTagConfig {
  measurementId: string;
}

export const GA_MEASUREMENT_ID: string | undefined = process.env.NEXT_PUBLIC_GA_ID;

export function isGAEnabled(): boolean {
  return typeof window !== "undefined" && typeof GA_MEASUREMENT_ID === "string" && GA_MEASUREMENT_ID.length > 0;
}

export function pageview(url: string): void {
  if (!isGAEnabled()) return;
  window.gtag?.("config", GA_MEASUREMENT_ID as string, {
    page_path: url,
  });
}

export function event(action: string, params: Record<string, unknown> = {}): void {
  if (!isGAEnabled()) return;
  window.gtag?.("event", action, params);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}



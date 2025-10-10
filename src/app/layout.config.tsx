import { LogoContent } from "@/components/landing/NavBar";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    transparentMode: "top",
    title: <LogoContent />,
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};

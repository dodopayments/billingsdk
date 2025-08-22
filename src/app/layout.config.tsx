import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

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
    title: (
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/logo/logo-dodo.svg"
          alt="Billing SDK"
          width={26}
          height={26}
        />
        <span className="text-xl font-display">/</span>
        <span className="text-2xl pb-1 font-heading">Billing SDK</span>
      </div>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};

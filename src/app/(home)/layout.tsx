// import type { ReactNode } from "react";
// import { HomeLayout } from "fumadocs-ui/layouts/home";
// import { baseOptions } from "@/app/layout.config";

// export default function Layout({ children }: { children: ReactNode }) {
//   return (
//     <HomeLayout {...baseOptions}>
//       <div
//         className="max-w-7xl mx-auto border-x border-y border-base-900 px-2 md:px-0 w-full lg:overflow-hidden"
//         style={{
//           background:
//             "repeating-linear-gradient(125deg, transparent, transparent 6px, #e8e8e820 6px, #e8e8e820 7px)",
//         }}
//       >
//         {children}
//       </div>
//     </HomeLayout>
//   );
// }

import type { ReactNode } from "react";
import NavBar from "@/components/landing/NavBar";
import { gradientColors } from "@/components/banner-gradient-demo";
import { Banner } from "@/registry/billingsdk/banner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1920px] mx-auto min-h-screen bg-background">
      <NavBar />
      {/* Main Content */}
      <Banner
        title="Billing SDK is live on Product Hunt!"
        description="Go upvote and support us!"
        dismissable={false}
        buttonText="Upvote"
        buttonLink="https://www.producthunt.com/products/dodo-payments/launches/billing-sdk-2"
        className="border-none p-0 flex justify-center"
        variant="default"
        gradientColors={gradientColors}
      />
      {children}
    </div>
  );
}

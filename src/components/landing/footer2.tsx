import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { Footer } from "./footer";

export function Footer2() {
  return (
    <footer className="w-full rounded-3xl border border-input bg-muted/10 p-2">
      <Footer />
      <div className="px-4 pt-12 pb-2 md:pb-12">
        <div className="mx-auto max-w-6xl">
          {/* Top Section */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center">
                <div className="flex items-center justify-center">
                  <Image
                    src="/logo/Logo.svg"
                    alt="BillingSDK Logo"
                    width={160}
                    height={32}
                    className="h-8 w-40"
                  />
                </div>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Open-source React components for modern billing and subscription
                management.
              </p>
              <div className="flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://github.com/dodopayments/billingsdk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://dodopayments.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/logo/logo-dodo.svg"
                      alt="Dodo Payments"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="https://x.com/dodopayments"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsTwitterX className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Components</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs/components/pricing-table/pricing-table-one"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Pricing Tables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/usage-meter/usage-meter-linear"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Usage Meters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/manage-subscription"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Subscription Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/banner"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Banners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/quick-start"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/theming"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Theming Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/interfaces"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Interfaces
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Community</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="https://github.com/dodopayments/billingsdk/issues"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub Issues
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.com/invite/bYqAp4ayYh"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Discord Server
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/contribution-open-source"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contributing
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/dodopayments"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Dodo Payments Github
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-4 flex flex-col items-center gap-4 md:mb-0 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} BillingSDK. Made with{" "}
                  <FaHeart className="inline h-3 w-3 fill-current text-red-500" />{" "}
                  by developers at Dodo Payments, for developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

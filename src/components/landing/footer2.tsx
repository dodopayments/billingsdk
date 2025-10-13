import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { Footer } from "./footer";

export function Footer2() {
  return (
    <footer className="bg-muted/10 rounded-3xl border border-input p-2 w-full">
      <Footer />
      <div className="pt-12 pb-2 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
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
              <p className="text-sm text-muted-foreground mb-4">
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
              <h4 className="font-semibold text-foreground mb-4">Components</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs/components/pricing-table/pricing-table-one"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing Tables
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/usage-meter/usage-meter-linear"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Usage Meters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/manage-subscription"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Subscription Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components/banner"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Banners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/quick-start"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/theming"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Theming Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/interfaces"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Interfaces
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="https://github.com/dodopayments/billingsdk/issues"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub Issues
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.com/invite/bYqAp4ayYh"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Discord Server
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/contribution-open-source"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contributing
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/dodopayments"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dodo Payments Github
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} BillingSDK. Made with{" "}
                  <FaHeart className="inline h-3 w-3 text-red-500 fill-current" />{" "}
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

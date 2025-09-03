"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <div className="flex flex-col my-24 items-center justify-center max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary mb-4">
        Ready to build better billing UIs?
      </h2>
      <p className="text-sm mt-2 text-muted-foreground max-w-2xl mx-auto tracking-tight mb-8">
        Start using production-ready components in your next project. No setup required—just copy, paste, and customize.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          asChild
        >
          <Link href="/docs/quick-start">
            Start with Quick Start
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button 
          size="lg"
          variant="outline"
          className="gap-2"
          asChild
        >
          <Link href="https://github.com/dodopayments/billingsdk" target="_blank">
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-6">
        Join 1,000+ developers building with BillingSDK
      </p>
    </div>
  );
}

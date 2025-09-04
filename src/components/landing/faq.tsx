"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    question: "Is BillingSDK completely free?",
    answer: "Yes! BillingSDK is 100% open source and free to use for both personal and commercial projects. There are no hidden fees, subscriptions, or licensing costs. You get full access to all components and their source code."
  },
  {
    id: 2,
    question: "How do I customize the components to match my brand?",
    answer: "All components are built with Tailwind CSS and accept custom className props. You can override any styling by passing Tailwind classes or by modifying the CSS variables in your global stylesheet. Each component is also highly configurable through props."
  },
  {
    id: 3,
    question: "Are the components accessible?",
    answer: "Absolutely! All components are built following WCAG guidelines with proper ARIA labels, keyboard navigation support, and screen reader compatibility. We use Radix UI primitives as the foundation to ensure robust accessibility."
  },
  {
    id: 4,
    question: "What frameworks are supported?",
    answer: "Currently, BillingSDK supports React with TypeScript. Components are built using modern React patterns and are compatible with Next.js, Vite, Create React App, and other React-based frameworks."
  },
  {
    id: 5,
    question: "Do I need to install any packages?",
    answer: "Most components require some common dependencies like Radix UI, Tailwind CSS, and Lucide React icons. Each component page lists its specific dependencies, but you can also copy the code and install only what you need."
  },
  {
    id: 6,
    question: "How do I get support or report issues?",
    answer: "Join our Discord community for help and discussions. For bugs or feature requests, open an issue on our GitHub repository. We also have comprehensive documentation and examples for each component."
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col my-24 items-center justify-center max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-3xl font-display md:text-4xl font-medium text-primary text-center mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-sm mt-2 text-muted-foreground max-w-2xl mx-auto tracking-tight text-center mb-12">
        Everything you need to know about using BillingSDK
      </p>
      
      <div className="w-full space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border rounded-lg bg-card">
            <button
              className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              onClick={() => toggleItem(faq.id)}
            >
              <h3 className="font-medium text-foreground pr-4">{faq.question}</h3>
              {openItems.has(faq.id) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                openItems.has(faq.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-6 pb-6">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

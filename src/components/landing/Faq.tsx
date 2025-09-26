"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  return (
    <section className="max-w-4xl mx-auto my-20 px-4">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 lg:lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Answers to the most common questions about BillingSDK and how to use our components.
        </p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="item-1" className="border-b border-border">
          <AccordionTrigger className="text-left text-[15px] lg:text-lg font-medium hover:no-underline">
            What is BillingSDK?
          </AccordionTrigger>
          <AccordionContent className="text-[15px] lg:text-lg text-muted-foreground">
            BillingSDK is a component library built on top of Shadcn UI that provides ready-to-use
            billing components like pricing tables, checkout forms, and subscription flows.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b border-border">
          <AccordionTrigger className="text-left text-[15px] lg:text-lg font-medium hover:no-underline">
            Do I need Shadcn installed to use BillingSDK?
          </AccordionTrigger>
          <AccordionContent className="text-[15px] lg:text-lg text-muted-foreground">
            Yes. BillingSDK components are designed to work seamlessly with Shadcn UI. You can install
            them via the CLI and start using immediately in your project.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-b border-border">
          <AccordionTrigger className="text-left text-[15px] lg:text-lg font-medium hover:no-underline">
            Can I customize the billing components?
          </AccordionTrigger>
          <AccordionContent className="text-[15px] lg:text-lg text-muted-foreground">
            Absolutely. Every component is built with Tailwind and Shadcn primitives, so you can fully
            customize styling, props, and behavior to match your project needs.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b border-border">
          <AccordionTrigger className="text-left text-[15px] lg:text-lg font-medium hover:no-underline">
            Does BillingSDK support multiple themes?
          </AccordionTrigger>
          <AccordionContent className="text-[15px] lg:text-lg text-muted-foreground">
            Yes. You can switch between <code>minimal</code> and <code>classic</code> themes, and
            further extend styles using Tailwind classes.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-b border-border">
          <AccordionTrigger className="text-left text-[15px] lg:text-lg font-medium hover:no-underline">
            How do I get started with BillingSDK?
          </AccordionTrigger>
          <AccordionContent className="text-[15px] lg:text-lg text-muted-foreground">
            Install a component using the CLI command and drop it into your project. Then configure
            props like <code>plans</code>, <code>theme</code>, and <code>onPlanSelect</code> to get
            started quickly.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

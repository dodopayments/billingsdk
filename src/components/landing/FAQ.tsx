"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "pricing",
    question: "What's the pricing model for BillingSDK?",
    answer: "BillingSDK is completely free and open-source under the MIT license. You can use it in personal and commercial projects without any cost. We believe in making billing UI components accessible to everyone."
  },
  {
    id: "theming",
    question: "Can I customize the theme and styling?",
    answer: "Absolutely! All components are built with Tailwind CSS and support full customization. You can easily modify colors, spacing, fonts, and layouts to match your brand. We also provide built-in theme variants and CSS custom properties for easy theming."
  },
  {
    id: "accessibility",
    question: "Are the components accessible (a11y compliant)?",
    answer: "Yes, all components are built with accessibility in mind. They include proper ARIA labels, keyboard navigation support, screen reader compatibility, and follow WCAG 2.1 guidelines. We test with various assistive technologies to ensure inclusive experiences."
  },
  {
    id: "license",
    question: "What license do you use?",
    answer: "BillingSDK is released under the MIT License, which means you can freely use, modify, and distribute the code in both personal and commercial projects. No attribution required, though it's always appreciated!"
  },
  {
    id: "framework-support",
    question: "Which frameworks and libraries are supported?",
    answer: "Currently, we support React with TypeScript. The components are built with modern React patterns (hooks, context) and work with Next.js, Vite, Create React App, and other React-based frameworks. We're considering Vue and Svelte support in the future."
  },
  {
    id: "support",
    question: "How can I get help and support?",
    answer: "We offer several support channels: GitHub Issues for bug reports and feature requests, comprehensive documentation with examples, and an active community. For urgent issues, you can also reach out through our GitHub discussions."
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto relative px-6 md:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/5 to-accent/5 rounded-3xl"></div>
      
      <div className="relative">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Got{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              questions?
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Find answers to common questions about BillingSDK, from pricing and licensing to customization and support.
          </motion.p>
        </div>

        <motion.div 
          className="max-w-4xl mx-auto space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              className="border border-border/50 rounded-xl bg-background/50 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-6 text-left hover:bg-muted/30 transition-colors duration-200 flex items-center justify-between group"
                aria-expanded={openItems.includes(item.id)}
              >
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: openItems.includes(item.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  {openItems.includes(item.id) ? (
                    <Minus className="h-5 w-5 text-primary" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openItems.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional help section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a 
            href="https://github.com/dodopayments/billingsdk/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-primary font-medium transition-all duration-200 hover:scale-105"
          >
            <HelpCircle className="w-4 h-4" />
            Ask in GitHub Discussions
          </a>
        </motion.div>
      </div>
    </section>
  );
}
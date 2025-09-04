"use client";

import { motion } from "motion/react";
import { 
  Copy, 
  Zap, 
  Palette, 
  Shield,
  CheckCircle2
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Ship pricing pages fast",
    description: "Pre-built components eliminate weeks of development time. Focus on your core product while we handle the UI complexity.",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-black to-gray-800",
    iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    icon: Copy,
    title: "Copy-paste, then customize",
    description: "No dependencies or installations. Copy the code directly into your project and modify it to match your brand perfectly.",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-gradient-to-br from-black to-gray-800",
    iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Drop-in subscription UI",
    description: "Complete billing flows from pricing tables to cancellation pages. Everything you need for subscription management.",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-black to-gray-800",
    iconBg: "bg-gradient-to-br from-purple-400 to-pink-500"
  },
  {
    icon: Shield,
    title: "Accessible by default",
    description: "WCAG compliant components with proper ARIA labels, keyboard navigation, and screen reader support built-in.",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-gradient-to-br from-black to-gray-800",
    iconBg: "bg-gradient-to-br from-green-400 to-emerald-500"
  }
];

export default function Benefits() {
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
            <CheckCircle2 className="w-4 h-4" />
             Benefits
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Why developers{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              love
            </span>{" "}
            BillingSDK
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Build beautiful billing interfaces with components designed for performance, 
            accessibility, and developer experience.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className={`group relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${benefit.bgColor}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${benefit.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {benefit.description}
                </p>

                {/* Decorative gradient overlay */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, ArrowRight, Rocket, Zap, ExternalLink } from "lucide-react";
import { analytics } from "@/lib/analytics";

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto relative px-6 md:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/5 to-accent/5 rounded-3xl"></div>
      
      <motion.div 
        className="relative bg-card/50 border border-border/50 rounded-3xl p-12 md:p-16 text-center space-y-8 overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Floating elements */}
        <div className="absolute top-8 left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative space-y-6">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-4 h-4" />
            Ready to ship faster?
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground">
            Start building{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              today
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop building billing UIs from scratch. Get started with production-ready components and ship your next feature in minutes, not weeks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group" 
            asChild
          >
            <Link href="https://billingsdk.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3" onClick={analytics.trackFinalGetStartedClick}>
              <Zap className="w-5 h-5" />
              Quick Start
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/50 font-semibold px-8 py-4 text-lg transition-all duration-300 w-full sm:w-auto group" 
            asChild
          >
            <Link 
              href="https://github.com/dodopayments/billingsdk" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
              onClick={analytics.trackGithubClick}
            >
              <Github className="h-5 w-5" />
              View on GitHub
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Join <span className="text-foreground font-bold">500+</span> developers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">MIT licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-medium">Production ready</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

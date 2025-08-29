"use client"

import React from "react";
import Hero from "@/components/landing/Hero";
import Benefits from "@/components/landing/Benefits";
import { ComponentsSection } from "@/components/landing/components";
import { FAQ } from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/footer";
import { Footer2 } from "@/components/landing/footer2";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const Page = () => {
  return (
    <main className="w-full relative overflow-hidden bg-background">
      <Hero />
      <Benefits />
      <ComponentsSection />
      <FAQ />
      <FinalCTA />
      <Footer />
      <Footer2 />
      <ScrollToTop />
    </main>
  );
};

export default Page;

"use client";

import React from "react";
import { Footer2 } from "@/components/landing/footer2";
import Hero from "@/components/landing/Hero";
import { ComponentsSection } from "@/components/landing/components";
import Features from "@/components/landing/Features";
import { OpenSource } from "@/components/landing/opensource";
import { Faq } from "@/components/landing/faq";
import { QuickSteps } from "@/components/landing/quick-steps";

const Page = () => {
  return (
    <main className="w-full max-w-7xl mx-auto relative overflow-hidden p-4">
      <Hero />
      <Features />
      <ComponentsSection />
      <QuickSteps />
      <Faq />
      <OpenSource />
      <Footer2 />
    </main>
  );
};

export default Page;

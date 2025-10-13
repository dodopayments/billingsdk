"use client";

import React from "react";
import Hero from "@/components/landing/Hero";
import { ComponentsSection } from "@/components/landing/components";
import Features from "@/components/landing/Features";
import { OpenSource } from "@/components/landing/opensource";
import { Faq } from "@/components/landing/faq";
import { QuickIntegration } from "@/components/landing/quick-integrations";
import { Footer2 } from "@/components/landing/footer2";
import { Sentra } from "@/components/landing/sentra";

const Page = () => {
  return (
    <main className="w-full container mx-auto relative overflow-hidden p-4">
      <Hero />
      <Features />
      <ComponentsSection />
      <QuickIntegration />
      <Sentra />
      <Faq />
      <OpenSource />
      <Footer2 />
    </main>
  );
};

export default Page;

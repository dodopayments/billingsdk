"use client";

import React from "react";
import { Footer2 } from "@/components/landing/footer2";
import Hero from "@/components/landing/Hero";
import { ComponentsSection } from "@/components/landing/components";
import Features from "@/components/landing/Features";
import { Footer } from "@/components/landing/footer";
import { OpenSource } from "@/components/landing/opensource";

const Page = () => {
  return (
    <main className="w-full relative overflow-hidden p-4">
      <Hero />
      <Features />
      <ComponentsSection />
      <OpenSource />
      <Footer />
      <Footer2 />
    </main>
  );
};

export default Page;

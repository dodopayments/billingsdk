"use client";

import React from "react";
import { Footer2 } from "@/components/landing/footer2";
import Hero from "@/components/landing/Hero";
import { ComponentsSection } from "@/components/landing/components";
import Features from "@/components/landing/Features";
import { Footer } from "@/components/landing/footer";
import { OpenSource } from "@/components/landing/opensource";
import { Banner } from "@/registry/billingsdk/banner";
import { gradientColors } from "@/components/banner-gradient-demo";

const Page = () => {
  return (
    <main className="w-full relative overflow-hidden p-4">
      <Banner
        title="Billing SDK is live on Product Hunt!"
        description="Go upvote and support us!"
        dismissable={false}
        buttonText="Upvote"
        buttonLink="https://www.producthunt.com/products/dodo-payments/launches/billing-sdk-2"
        // className="bg-orange-500"
        variant="default"
        gradientColors={gradientColors}
      />
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

"use client";

import React, { useEffect, useState } from "react";
import { Footer2 } from "@/components/landing/footer2";
import Hero from "@/components/landing/Hero";
import { ComponentsSection } from "@/components/landing/components";
import Features from "@/components/landing/Features";
import { Footer } from "@/components/landing/footer";
import { OpenSource } from "@/components/landing/opensource";
import { LoadingScreen } from "@/components/landing/loading-screen";
import NavBar from "@/components/landing/NavBar";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds - as per i calculated

    return () => clearTimeout(timer);
  }, []);

  
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="w-full relative overflow-hidden p-4">
      <NavBar />
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

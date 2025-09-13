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
    const seen = sessionStorage.getItem("homeLoadedOnce") === "1";
    if (seen) {
      setIsLoading(false);
      return;
    }
    // Show loading screen only once per session, respecting user preferences for reduced motion and data saving.
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const saveData = (navigator as any)?.connection?.saveData;
    const delay = prefersReducedMotion || saveData ? 300 : 1200;
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("homeLoadedOnce", "1");
    }, delay);
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

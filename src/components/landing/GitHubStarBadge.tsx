"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { GoRepoForked } from "react-icons/go";
import { motion, AnimatePresence } from "motion/react";

type StarResponse = {
  stars: number | null;
  pretty: string | null;
  forks: number | null;
  forksPretty: string | null;
};

export default function GitHubStarBadge() {
  const [display, setDisplay] = useState<{
    kind: "stars" | "forks";
    text: string;
  } | null>(null);
  const [metrics, setMetrics] = useState<StarResponse | null>(null);

  function toFixedTrim(value: number, digits: number) {
    const s = value.toFixed(digits);
    return s.replace(/\.0+$/, "");
  }

  function formatApprox(value: number | null | undefined): string {
    const n = Number(value ?? 0);
    if (n < 100) {
      // For numbers less than 100, round down to nearest 10
      const approx = Math.floor(n / 10) * 10;
      // If the result is 0, show 10+ for values between 1-9
      return `${approx === 0 ? (n > 0 ? "10" : "0") : approx}+`;
    }
    if (n < 1000) {
      // For numbers between 100-999, round down to nearest 25
      const approx = Math.floor(n / 25) * 25;
      return `${approx}+`;
    }
    if (n < 1_000_000) {
      const k = Math.floor(n / 100) / 10; // floor to 0.1k
      return `${toFixedTrim(k, 1)}k+`;
    }
    const m = Math.floor(n / 100_000) / 10; // floor to 0.1M
    return `${toFixedTrim(m, 1)}M+`;
  }

  useEffect(() => {
    let cancelled = false;
    // Create AbortController for fetch requests
    let controller: AbortController | null = null;

    async function load() {
      // Create new controller for each request
      controller = new AbortController();

      try {
        const res = await fetch("/api/github-stars", {
          cache: "no-store",
        });

        // Check if response is ok before parsing JSON
        if (!res.ok) {
          // Don't clobber existing display on error
          return;
        }

        const data: StarResponse = await res.json();
        // Only update state if component is still mounted and request wasn't aborted
        if (!cancelled && controller && !controller.signal.aborted) {
          setMetrics(data);
          const initial = formatApprox(data.stars);
          setDisplay({ kind: "stars", text: initial });
        }
      } catch {
        // Only clear display if component is still mounted and request wasn't aborted
        // Don't clobber existing display on error
        if (!cancelled && controller && !controller.signal.aborted) {
          // Keep existing display/metrics instead of setting to null
        }
      }
    }

    load();
    // Schedule refresh every 5 minutes (instead of 30 minutes)
    const id = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(id);
      // Abort any ongoing fetch requests
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  // Cycle between stars and forks every 4s
  useEffect(() => {
    if (!metrics) return;
    const cycle = setInterval(() => {
      setDisplay((prev) => {
        if (!prev) return prev;
        if (prev.kind === "stars") {
          const text = formatApprox(metrics.forks);
          return { kind: "forks", text };
        } else {
          const text = formatApprox(metrics.stars);
          return { kind: "stars", text };
        }
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, [metrics]);

  return (
    <Link
      href="https://github.com/dodopayments/billingsdk"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center h-9 rounded-md border border-white/20 bg-black/60 text-white text-xs font-normal shadow-sm backdrop-blur-md hover:bg-black/70 transition-colors leading-none"
      aria-label="View GitHub repository and star"
    >
      {/* Left: GitHub icon */}
      <span className="flex items-center h-full px-1.5">
        <FaGithub className="h-5 w-5" />
      </span>
      {/* Middle: number */}
      <span className="flex items-center h-full px-1 w-10 justify-center border-l border-white/20 pl-2 text-sm font-normal">
        <AnimatePresence mode="popLayout" initial={false}>
          {display && (
            <motion.span
              key={`${display.kind}-${display.text}`}
              initial={{ y: 4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -4, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 20,
                mass: 0.7,
              }}
            >
              {display.text}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {/* Right: cycling icon with left border */}
      <span className="flex items-center h-full pl-1 pr-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {display && (
            <motion.span
              key={display.kind}
              initial={{ rotate: -12, scale: 0.95, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 12, scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
                mass: 0.8,
              }}
              className="inline-flex"
            >
              {display.kind === "stars" ? (
                <FiStar className="h-3.5 w-3.5" />
              ) : (
                <GoRepoForked className="h-3.5 w-3.5" />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
}

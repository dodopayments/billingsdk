"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { GoRepoForked } from "react-icons/go";
import { FaCodePullRequest } from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";

type StarResponse = {
  stars: number | null;
  pretty: string | null;
  forks: number | null;
  forksPretty: string | null;
  prs: number | null;
  prsPretty: string | null;
};

export default function GitHubStarBadge() {
  const [display, setDisplay] = useState<{
    kind: "stars" | "forks" | "prs";
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
      const approx = Math.floor(n / 10) * 10;
      return `${approx === 0 ? (n > 0 ? "10" : "0") : approx}+`;
    }
    if (n < 1000) {
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
    let controller: AbortController | null = null;

    async function load() {
      controller = new AbortController();

      try {
        const res = await fetch("/api/github-stars", {
          cache: "no-store",
        });
        if (!res.ok) {
          return;
        }

        const data: StarResponse = await res.json();
        if (!cancelled && controller && !controller.signal.aborted) {
          setMetrics(data);
          const initial = formatApprox(data.stars);
          setDisplay({ kind: "stars", text: initial });
        }
      } catch {
        if (!cancelled && controller && !controller.signal.aborted) {
        }
      }
    }

    load();
    // Schedule refresh every 5 minutes (instead of 30 minutes)
    const id = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(id);
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!metrics) return;
    const cycle = setInterval(() => {
      setDisplay((prev) => {
        if (!prev) return prev;
        if (prev.kind === "stars") {
          const text = formatApprox(metrics.forks);
          return { kind: "forks", text };
        } else if (prev.kind === "forks") {
          const text = formatApprox(metrics.prs);
          return { kind: "prs", text };
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
      className="inline-flex items-center h-9 bg-background rounded-md border text-white text-xs font-normal shadow-sm backdrop-blur-md  transition-colors leading-none"
      aria-label="View GitHub repository and star"
    >
      {/* Left: GitHub icon */}
      <span className="flex rounded-l-md items-center h-full px-1.5">
        <FaGithub className="h-5 w-5" />
      </span>
      {/* Middle: number */}
      <span className="flex items-center h-full px-1 w-10 justify-center border-l  pl-2 text-sm font-normal">
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
              ) : display.kind === "forks" ? (
                <GoRepoForked className="h-3.5 w-3.5" />
              ) : (
                <FaCodePullRequest className="h-3.5 w-3.5" />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
}
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { findUpSync } from "find-up"; // find a file path by walking up parent directories

export const detectFramework = ():
  | "nextjs"
  | "express"
  | "react"
  | "hono"
  | "fastify"
  | "nestjs"
  | null => {
  try {
    const pkgPath = findUpSync("package.json");
    if (!pkgPath) return null;
    const rootDir = path.dirname(pkgPath);
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

    function hasFile(file: string) {
      return existsSync(path.join(rootDir, file));
    }
    const {
      dependencies = {},
      devDependencies = {},
      peerDependencies = {},
    } = pkg ?? {};
    const deps = { ...dependencies, ...devDependencies, ...peerDependencies };

    //  nextjs detection
    if (
      deps.next ||
      hasFile("next.config.js") ||
      hasFile("next.config.mjs") ||
      hasFile("next.config.cjs") ||
      hasFile("next.config.ts") ||
      existsSync(path.join(rootDir, ".next"))
    ) {
      return "nextjs";
    }

    //  express detection
    if (deps.express) {
      return "express";
    }
    //  nestjs detection
    if (
      deps["@nestjs/core"] ||
      deps["@nestjs/common"] ||
      deps["@nestjs/platform-express"] ||
      hasFile("nest-cli.json") ||
      (hasFile("tsconfig.json") &&
        pkg.scripts &&
        (pkg.scripts.start?.includes("nest") ||
          pkg.scripts.build?.includes("nest") ||
          pkg.scripts.dev?.includes("nest")))
    ) {
      return "nestjs";
    }
    //  reactjs detection
    if (deps.react) {
      return "react";
    }
    //  hono detection
    if (deps.hono) {
      return "hono";
    }
    //  fastify detection
    if (deps.fastify) {
      return "fastify";
    }
    return null;
  } catch {
    return null;
  }
};

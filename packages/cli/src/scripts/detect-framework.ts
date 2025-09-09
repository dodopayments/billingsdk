import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import findUp from "find-up";

export const detectFramework = (): "nextjs" | "express" | "react" | null => {
    try {
        const pkgPath = findUp.sync("package.json");
        if (!pkgPath) return null;

        const rootDir = path.dirname(pkgPath);
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

        function hasFile(file: string) {
            return existsSync(path.join(rootDir, file));
        }

        const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = pkg ?? {};
        const deps = { ...dependencies, ...devDependencies, ...peerDependencies };

        // nextjs detection
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

        // express detection
        if (deps.express) return "express";

        // react detection
        if (deps.react) return "react";

        return null;
    } catch {
        return null;
    }
};

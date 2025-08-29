import fs from "fs";
import path from "path";
import { Registry, Result } from "../types/registry.js";

export const buildRegistry = async () => {
  try {
    const registryPath = path.join(process.cwd(), "/packages/templates/registry.json");
    if (!fs.existsSync(registryPath)) {
      console.error("registry.json not found in root directory");
      process.exit(1);
    }

    const registry: Registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

    const outputDir = path.join(process.cwd(), "public/tr");
    fs.mkdirSync(outputDir, { recursive: true });

    const componentsToProcess = registry.components;

    for (const component of componentsToProcess) {
      console.log(`Building ${component.name}...`);

      const processedComponent: Result = {
        ...component,
        files: []
      };

      for (const file of component.files) {
        const filePathPattern = typeof (file as any).path === "string" ? (file as any).path : "";
        const hasWildcard = filePathPattern.includes("*");
        const sourceBase = hasWildcard
          ? path.join(process.cwd(), filePathPattern.split("*")[0])
          : path.join(process.cwd(), filePathPattern);

        const fileTarget = typeof (file as any).target === "string" ? (file as any).target : "";
        const targetHasWildcard = fileTarget.includes("*");
        const targetBaseRaw = targetHasWildcard ? fileTarget.split("*")[0] : fileTarget;

        const pushFile = (absSourcePath: string, relativeFromBase?: string) => {
          const content = fs.readFileSync(absSourcePath, "utf-8");
          const targetPath = hasWildcard && targetHasWildcard && relativeFromBase
            ? path.join(targetBaseRaw, relativeFromBase)
            : targetBaseRaw;
          processedComponent.files.push({
            target: targetPath,
            type: file.type ?? "template",
            content: content,
          });
        };

        if (hasWildcard) {
          if (!fs.existsSync(sourceBase)) {
            console.warn(`Skipping missing directory: ${sourceBase}`);
            continue;
          }

          const walk = (dir: string, base: string) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const abs = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                walk(abs, base);
              } else if (entry.isFile()) {
                const rel = path.relative(base, abs);
                pushFile(abs, rel);
              }
            }
          };

          walk(sourceBase, sourceBase);
        } else {
          if (!fs.existsSync(sourceBase)) {
            console.warn(`Skipping missing file: ${sourceBase}`);
            continue;
          }
          pushFile(sourceBase);
        }
      }

      const outputPath = path.join(outputDir, `${component.name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(processedComponent, null, 2), "utf-8");

      console.log(`Built ${component.name} -> public/tr/${component.name}.json`);
    }
    console.log(`Successfully built ${componentsToProcess.length} component(s)`);

  } catch (error) {
    console.error(`Build failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
};
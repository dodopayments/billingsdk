import path from "path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { Result } from "../types/registry.js";
import { confirm, spinner } from "@clack/prompts";
import { execSync } from "child_process";

    // __dirname is not available in ESM; derive it from import.meta.url
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    // Resolve registry source (local only)
    const filename = `${framework}-${provider}.json`;
    const explicitLocal = process.env.BILLINGSDK_REGISTRY_LOCAL_PATH;
    const candidates = [
        explicitLocal,
        path.join(process.cwd(), "public", "tr"),
        path.join(process.cwd(), "..", "..", "public", "tr"),
        path.join(__dirname, "..", "..", "..", "public", "tr"),
        path.join(__dirname, "..", "..", "public", "tr"),
    ].filter(Boolean) as string[];

export async function addFiles(
  framework: "nextjs" | "express" | "react" | "fastify" | "hono",
  provider: "dodopayments" | "stripe" | "paypal"
): Promise<void> {
  // Resolve registry source (local only)
  const filename = `${framework}-${provider}.json`;
  const explicitLocal = process.env.BILLINGSDK_REGISTRY_LOCAL_PATH;
  const candidates = [
    explicitLocal,
    path.join(process.cwd(), "public", "tr"),
    path.join(process.cwd(), "..", "..", "public", "tr"),
    path.join(__dirname, "..", "..", "..", "public", "tr"),
    path.join(__dirname, "..", "..", "public", "tr"),
  ].filter(Boolean) as string[];

  let result: Result | null = null;
  for (const base of candidates) {
    const localPath = path.join(base, filename);
    try {
      if (fs.existsSync(localPath)) {
        const raw = fs.readFileSync(localPath, "utf8");
        result = JSON.parse(raw) as Result;
        break;
      }
    } catch {
      // try next candidate silently
    }
  }

  if (!result) {
    throw new Error(
      `Unable to load local registry file "${filename}".\n` +
        `Set BILLINGSDK_REGISTRY_LOCAL_PATH to your registry directory or ensure public/tr exists near your CWD.`
    );
  }

  let srcExists = fs.existsSync(path.join(process.cwd(), "src"));
  const addToPath = srcExists ? "src" : "";

  for (const file of result.files) {
    const filePath = path.join(process.cwd(), addToPath, file.target);
    const dirPath = path.dirname(filePath);
    const relativePath = addToPath ? path.join(addToPath, file.target) : file.target;

    try {
      fs.mkdirSync(dirPath, { recursive: true });
      const fileName = path.basename(file.target);

      if (fs.existsSync(filePath)) {
        if (fileName === ".env.example") {
          const existingContent = fs.readFileSync(filePath, "utf8");
          const newContent = existingContent + "\n" + file.content + "\n";
          fs.writeFileSync(filePath, newContent);
        } else {
          const overwrite = await confirm({
            message: `File ${relativePath} already exists. Do you want to overwrite it?`,
          });
          if (overwrite) {
            fs.writeFileSync(filePath, file.content);
          }
        }
      } else {
        fs.writeFileSync(filePath, file.content);
      }
    } catch (error) {
      console.error(`Failed to add file ${relativePath}:`, error);
    }
  }

  if (result.dependencies && result.dependencies.length > 0) {
    const s = spinner();
    s.start("Installing dependencies...");
    try {
      // execSync is synchronous; no await
      execSync(`npm install ${result.dependencies.join(" ")}`, { stdio: "inherit" });
      s.stop("Dependencies installed successfully!");
    } catch (error) {
      s.stop("Failed to install dependencies");
      console.error("Failed to install dependencies:", error);
    }
  }
}

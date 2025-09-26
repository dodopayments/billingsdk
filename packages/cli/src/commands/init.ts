import { Command } from "commander";
import { cancel, intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { addFiles } from "../scripts/add-files.js";
import { detectFramework } from "../scripts/detect-framework.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize a new billing project")
  .summary("Set up billing components and framework integration")
  .action(async () => {
    try {
      intro("Welcome to Billing SDK Setup!");

      const detectedFramework = detectFramework();
      const framework = await select({
        message: "Which framework you are using? (Adding more frameworks soon)",
        options: [
          { value: "nextjs", label: detectedFramework === "nextjs" ? "Next.js (detected)" : "Next.js", hint: "React framework with App Router" },
          { value: "express", label: detectedFramework === "express" ? "Express.js (detected)" : "Express.js", hint: "Node.js web framework" },
          { value: "react", label: detectedFramework === "react" ? "React.js (detected)" : "React.js", hint: "Client-side React app template" },
          { value: "hono", label: detectedFramework === "hono" ? "Hono.js (detected)" : "Hono.js", hint: "Lightweight web framework for edge runtimes" },
          { value: "fastify", label: detectedFramework === "fastify" ? "Fastify.js (detected)" : "Fastify.js", hint: "Fast and low overhead web framework" }
        ],
        initialValue: detectedFramework ?? undefined  // cursor will already be on detected framework
      });

      if (isCancel(framework)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      const frameworkValue = framework as "nextjs" | "express" | "react" | "fastify" | "hono";

      const providerOptions =
        frameworkValue === "express" || frameworkValue === "hono"
          ? [
              { value: "dodopayments", label: "Dodo Payments" },
              { value: "stripe", label: "Stripe payments" },
            ]
          : [
              { value: "dodopayments", label: "Dodo Payments" },
            ];

      const providerChoice = await select({
        message: "Which payment provider would you like to use? (Adding more providers soon)",
        options: providerOptions,
      });

      if (isCancel(providerChoice)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }
      const provider = providerChoice as "dodopayments" | "stripe";

      const s = spinner();
      s.start("Setting up your billing project...");
      try {
        await addFiles(frameworkValue, provider);
        s.stop("Setup completed successfully!");
      } catch (error) {
        s.stop("Setup failed!");
        process.exit(1);
      }

      outro("Your billing project is ready! Happy coding! 🎉");

    } catch (error) {
      process.exit(1);
    }
  });
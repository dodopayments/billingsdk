import { Command } from "commander";
import { cancel, intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { addFiles } from "../scripts/add-files.js";
import { detectFramework } from "../scripts/detect-framework.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize a new billing project")
  .summary("Set up billing components and framework integration")
  .option("--framework <framework>", "Framework to use (nextjs|express|react|hono|fastify)")
  .option("--provider <provider>", "Payment provider (dodopayments|stripe|paypal)")
  .action(async (_opts, cmd: Command) => {
    try {
      intro("Welcome to Billing SDK Setup!");

      const options = cmd.opts<{ framework?: string; provider?: string }>();
      let frameworkValue: "nextjs" | "express" | "react" | "fastify" | "hono";
      let provider: "dodopayments" | "stripe" | "paypal";

      // If flags provided, validate and use them
      const isValidFramework = (v?: string): v is typeof frameworkValue =>
        v === "nextjs" || v === "express" || v === "react" || v === "fastify" || v === "hono";
      const isValidProvider = (v?: string): v is typeof provider =>
        v === "dodopayments" || v === "stripe" || v === "paypal";

      if (options.framework && options.provider) {
        if (!isValidFramework(options.framework)) {
          throw new Error(`Invalid framework: ${options.framework}`);
        }
        if (!isValidProvider(options.provider)) {
          throw new Error(`Invalid provider: ${options.provider}`);
        }
        frameworkValue = options.framework;
        provider = options.provider;
      } else {
        // Interactive prompts
        const detectedFramework = detectFramework();
        let framework: unknown;
        try {
          framework = await select({
            message: "Which framework you are using? (Adding more frameworks soon)",
            options: [
              { value: "nextjs", label: detectedFramework === "nextjs" ? "Next.js (detected)" : "Next.js", hint: "React framework with App Router" },
              { value: "express", label: detectedFramework === "express" ? "Express.js (detected)" : "Express.js", hint: "Node.js web framework" },
              { value: "react", label: detectedFramework === "react" ? "React.js (detected)" : "React.js", hint: "Client-side React app template" },
              { value: "hono", label: detectedFramework === "hono" ? "Hono.js (detected)" : "Hono.js", hint: "Lightweight web framework for edge runtimes" },
              { value: "fastify", label: detectedFramework === "fastify" ? "Fastify.js (detected)" : "Fastify.js", hint: "Fast and low overhead web framework" }
            ],
            initialValue: detectedFramework ?? undefined
          });
        } catch (e) {
          console.error("Interactive prompts failed. Try providing flags, e.g.:\n  billingsdk init --framework nextjs --provider paypal");
          throw e;
        }

        if (isCancel(framework)) {
          cancel("Setup cancelled.");
          process.exit(0);
        }
        frameworkValue = framework as typeof frameworkValue;

        const providerOptions: { value: "dodopayments" | "stripe" | "paypal"; label: string }[] = [
          { value: "dodopayments", label: "Dodo Payments" }
        ];
        if (frameworkValue === "express" || frameworkValue === "hono") {
          providerOptions.push({ value: "stripe", label: "Stripe payments" });
        }
        if (frameworkValue === "nextjs") {
          providerOptions.push({ value: "paypal", label: "PayPal" });
        }

        let providerChoice: unknown;
        try {
          providerChoice = await select({
            message: "Which payment provider would you like to use? (Adding more providers soon)",
            options: providerOptions,
          });
        } catch (e) {
          console.error("Interactive prompts failed. Try providing flags, e.g.:\n  billingsdk init --framework nextjs --provider paypal");
          throw e;
        }
        if (isCancel(providerChoice)) {
          cancel("Setup cancelled.");
          process.exit(0);
        }
        provider = providerChoice as typeof provider;
      }

      const s = spinner();
      s.start("Setting up your billing project...");
      try {
        await addFiles(frameworkValue, provider);
        s.stop("Setup completed successfully!");
      } catch (error) {
        s.stop("Setup failed!");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }

      outro("Your billing project is ready! Happy coding! 🎉");

    } catch (error) {
      process.exit(1);
    }
  });

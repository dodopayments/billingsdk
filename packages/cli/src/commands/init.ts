import { Command } from "commander";
import { cancel, intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { addFiles } from "../scripts/add-files.js";
import { detectFramework } from "../scripts/detect-framework.js";
import { SupportedFramework, SupportedProvider, getAllowedProvidersForFramework, isValidCombination, supportedFrameworks } from "../config/matrix.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize a new billing project")
  .summary("Set up billing components and framework integration")
  .option("--framework <framework>")
  .option("--provider <provider>")
  .option("--yes")
  .option("--no-install")
  .option("--registry-base <url>")
  .option("--cwd <path>")
  .option("--force")
  .option("--dry-run")
  .option("--verbose")
  .option("--package-manager <pm>")
  .action(async (opts: any) => {
    try {
      intro("Welcome to Billing SDK Setup!");

      const detectedFramework = detectFramework();

      let frameworkValue: SupportedFramework | null = null;
      let providerValue: SupportedProvider | null = null;

      const flagFramework = opts?.framework as SupportedFramework | undefined;
      const flagProvider = opts?.provider as SupportedProvider | undefined;
      const nonInteractive = Boolean(opts?.yes);

      if (flagFramework && supportedFrameworks.includes(flagFramework)) {
        frameworkValue = flagFramework;
      }

      if (flagProvider === "dodopayments" || flagProvider === "stripe") {
        providerValue = flagProvider;
      }

      if (nonInteractive) {
        // fail fast: require both flags and valid combo
        if (!frameworkValue || !providerValue) {
          cancel("Missing required flags in non-interactive mode: --framework and --provider");
          process.exit(1);
        }
        if (!isValidCombination(frameworkValue, providerValue)) {
          cancel("Invalid framework/provider combination.");
          process.exit(1);
        }
      } else {
        if (!frameworkValue) {
          const framework = await select({
            message: "Which framework you are using? (Adding more frameworks soon)",
            options: supportedFrameworks.map((fw) => ({
              value: fw,
              label:
                detectedFramework === fw
                  ? (fw === "nextjs" ? "Next.js (detected)" : fw === "express" ? "Express.js (detected)" : fw === "react" ? "React.js (detected)" : fw === "hono" ? "Hono.js (detected)" : "Fastify.js (detected)")
                  : (fw === "nextjs" ? "Next.js" : fw === "express" ? "Express.js" : fw === "react" ? "React.js" : fw === "hono" ? "Hono.js" : "Fastify.js"),
            })),
            initialValue: frameworkValue ?? detectedFramework ?? undefined
          });
          if (isCancel(framework)) {
            cancel("Setup cancelled.");
            process.exit(0);
          }
          frameworkValue = framework as SupportedFramework;
        }

        const allowedProviders = getAllowedProvidersForFramework(frameworkValue);
        if (!providerValue) {
          const providerChoice = await select({
            message: "Which payment provider would you like to use? (Adding more providers soon)",
            options: allowedProviders.map((p) => ({ value: p, label: p === "dodopayments" ? "Dodo Payments" : "Stripe payments" })),
            initialValue: providerValue ?? undefined
          });
          if (isCancel(providerChoice)) {
            cancel("Setup cancelled.");
            process.exit(0);
          }
          providerValue = providerChoice as SupportedProvider;
        }
      }

      if (!frameworkValue || !providerValue) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      const s = spinner();
      s.start("Setting up your billing project...");
      try {
        const pmRaw = typeof opts?.packageManager === "string" ? (" " + opts.packageManager).trim().split(" ")[0] : undefined;
        const normalizedPackageManager = (pmRaw === "npm" || pmRaw === "pnpm" || pmRaw === "yarn" || pmRaw === "bun") ? pmRaw : undefined;
        await addFiles(frameworkValue, providerValue, {
          registryBase: opts?.registryBase,
          cwd: opts?.cwd,
          installDeps: opts?.noInstall ? false : true,
          nonInteractive: Boolean(opts?.nonInteractive),
          forceOverwrite: Boolean(opts?.force),
          dryRun: Boolean(opts?.dryRun),
          verbose: Boolean(opts?.verbose),
          packageManager: normalizedPackageManager
        });
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

import { Command } from "commander";
import { cancel, intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { addFiles } from "../scripts/add-files.js";
import { detectFramework } from "../scripts/detect-framework.js";
import { SupportedFramework, SupportedProvider, getAllowedProvidersForFramework, isValidCombination, supportedFrameworks, supportedProviders } from "../config/matrix.js";

// Helper function to get framework display name
const getFrameworkLabel = (fw: SupportedFramework, isDetected: boolean = false) => {
  const frameworkNames: Record<SupportedFramework, string> = {
    nextjs: "Next.js",
    express: "Express.js", 
    react: "React.js",
    hono: "Hono.js",
    fastify: "Fastify.js"
  };
  const suffix = isDetected ? " (detected)" : "";
  return frameworkNames[fw] + suffix;
};

// Helper function to get provider display name
const getProviderLabel = (provider: SupportedProvider) => {
  const providerNames: Record<SupportedProvider, string> = {
    dodopayments: "Dodo Payments",
    stripe: "Stripe"
  };
  return providerNames[provider];
};

// Helper function to normalize package manager
const normalizePackageManager = (pm: string | undefined): "npm" | "pnpm" | "yarn" | "bun" | undefined => {
  if (!pm) return undefined;
  const validManagers = ["npm", "pnpm", "yarn", "bun"] as const;
  const normalized = pm.trim().toLowerCase();
  return validManagers.includes(normalized as any) ? (normalized as "npm" | "pnpm" | "yarn" | "bun") : undefined;
};

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

      // Normalize flag values to lowercase and trim whitespace for case-insensitive comparison
      const flagFrameworkRaw = opts?.framework as string | undefined;
      const flagProviderRaw = opts?.provider as string | undefined;
      
      const flagFramework = flagFrameworkRaw ? flagFrameworkRaw.trim().toLowerCase() : undefined;
      const flagProvider = flagProviderRaw ? flagProviderRaw.trim().toLowerCase() : undefined;
      
      const nonInteractive = Boolean(opts?.yes);

      // Case-insensitive framework validation
      if (flagFramework) {
        const matchedFramework = supportedFrameworks.find((fw: SupportedFramework) => fw.toLowerCase() === flagFramework);
        if (matchedFramework) {
          frameworkValue = matchedFramework;
        }
      }

      // Case-insensitive provider validation
      if (flagProvider) {
        const matchedProvider = supportedProviders.find((p: SupportedProvider) => p.toLowerCase() === flagProvider);
        if (matchedProvider) {
          providerValue = matchedProvider;
        }
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
              label: getFrameworkLabel(fw, detectedFramework === fw)
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
        const providerIsAllowed = providerValue ? allowedProviders.includes(providerValue) : false;

        if (!providerValue || !providerIsAllowed) {
          const providerChoice = await select({
            message: "Which payment provider would you like to use? (Adding more providers soon)",
            options: allowedProviders.map((p) => ({ 
              value: p, 
              label: getProviderLabel(p)
            })),
            initialValue: providerIsAllowed ? (providerValue as SupportedProvider) : undefined
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
        const normalizedPackageManager = normalizePackageManager(opts?.packageManager);
        await addFiles(frameworkValue, providerValue, {
          registryBase: opts?.registryBase,
          cwd: opts?.cwd,
          // Respect Commander negated boolean and our alias, prefer opts.install when present
          installDeps: (typeof opts?.install === "boolean") ? opts.install !== false : (opts?.noInstall ? false : true),
          nonInteractive,
          forceOverwrite: Boolean(opts?.force),
          dryRun: Boolean(opts?.dryRun),
          verbose: Boolean(opts?.verbose),
          packageManager: normalizedPackageManager,
          onConflict: nonInteractive ? (opts?.force ? "overwrite" : "error") : "prompt"
        });
        s.stop("Setup completed successfully!");
      } catch {
        s.stop("Setup failed!");
        process.exit(1);
      }

      outro("Your billing project is ready! Happy coding! 🎉");

    } catch {
      process.exit(1);
    }
  });

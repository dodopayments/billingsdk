import { Command } from "commander";
import { intro, outro, select, spinner } from "@clack/prompts";
import { addFiles } from "../scripts/add-files.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize a new billing project")
  .summary("Set up billing components and framework integration")
  .action(async () => {
    try {
      intro("Welcome to Billing SDK Setup!");

      const framework = await select({
        message: "Which framework would you like to use?",
        options: [
          { value: "nextjs", label: "Next.js", hint: "React framework with App Router" },
          { value: "express", label: "Express.js", hint: "Node.js web framework" },
          { value: "react", label: "React.js", hint: "Client-side React app template"}
        ],
      });

      const provider = await select({
        message: "Which payment provider would you like to use? (Adding more providers soon)",
        options: [
          { value: "dodopayments", label: "Dodo Payments" },
        ],
      });

      const s = spinner();
      s.start("Setting up your billing project...");
      try {
        await addFiles(framework as "nextjs" | "express", provider as "dodopayments");
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

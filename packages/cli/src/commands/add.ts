import { Command } from "commander";
import { execSync } from "child_process";

export const addCommand = new Command()
  .name("add")
  .description("Add a billing component to your project")
  .summary("Install and configure billing components")
  .argument("<component>", "Name of the component to add")
  .action(async (component) => {
    try {
      if (!component) {
        console.error("Component name is required");
        console.error("Usage: billingsdk add <component>");
        process.exit(1);
      }

      const templateUrl = `https://billingsdk.com/r/${component}.json`;
      execSync(`npx shadcn@latest add ${templateUrl}`, { stdio: "inherit" });
    } catch (error) {
      // console.error(`Failed to add component "${component}"`,);
      process.exit(1);
    }
  });

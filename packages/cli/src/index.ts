#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { buildCommand } from "./commands/build.js";
import { render } from "ink";
import React from "react";
import { BigTextBanner } from "./components/BigTextBanner.js";

const program = new Command();

program
  .name("billingsdk")
  .description("Billing SDK CLI for managing billing components")
  .version("1.0.0");

  render(
    React.createElement(BigTextBanner, {
      text: "Billing\nSDK",
      font: "block",
      colors: ["white"],
      align: "left",
      showSubtitle: false
    })
  );

// Register commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(buildCommand);

// Parse arguments
program.parse();

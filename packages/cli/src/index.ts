#!/usr/bin/env node

import { Command } from 'commander';
import { render } from 'ink';
import React from 'react';
import { addCommand } from './commands/add.js';
import { buildCommand } from './commands/build.js';
import { initCommand } from './commands/init.js';
import { BigTextBanner } from './components/BigTextBanner.js';

/**
 * The main CLI program instance.
 */
const program = new Command();

program
	.name('billingsdk')
	.description('Billing SDK CLI for managing billing components')
	.version('1.0.0');

render(
	React.createElement(BigTextBanner, {
		text: 'Billing\nSDK',
		font: 'block',
		colors: ['white'],
		align: 'left',
		showSubtitle: false,
	})
);

// Register commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(buildCommand);

// Parse arguments
program.parse();

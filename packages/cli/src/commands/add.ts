import { execFileSync } from 'child_process';
import { Command } from 'commander';

/**
 * Determines the appropriate package manager runner.
 *
 * @returns An array with the command and its arguments
 */
function getPackageManagerRunner(): [string, ...string[]] {
	const userAgent = process.env.npm_config_user_agent || '';

	if (userAgent.startsWith('bun')) {
		return ['bunx'];
	} else if (userAgent.startsWith('pnpm')) {
		return ['pnpm', 'dlx'];
	} else if (userAgent.startsWith('yarn')) {
		// Check if it's Yarn 1 (yarn/1.x.x)
		if (/^yarn\/1\./.test(userAgent)) {
			return ['npx']; // or ['yarn'] if preferred
		} else {
			// Yarn >= 2
			return ['yarn', 'dlx'];
		}
	} else {
		return ['npx'];
	}
}

/**
 * Command to add a billing component to the project.
 */
export const addCommand = new Command()
	.name('add')
	.description('Add a billing component to your project')
	.summary('Install and configure billing components')
	.argument('<component>', 'Name of the component to add')
	.action(async (component) => {
		try {
			if (!component) {
				console.error('Component name is required.\nUsage: billingsdk add <component>');
				process.exit(1);
			}
			const valid = /^[a-z0-9][a-z0-9-]*$/i.test(component);
			if (!valid) {
				console.error(`Invalid component "${component}". Use letters, numbers, and dashes only.`);
				process.exit(1);
			}

			// Validate component name to prevent path traversal or special characters
			if (
				typeof component !== 'string' ||
				component.includes('/') ||
				component.includes('\\') ||
				component.includes('..')
			) {
				console.error('Invalid component name');
				process.exit(1);
			}

			const templateRegistry = `@billingsdk/${component}.json`;
			const [command, ...args] = getPackageManagerRunner();

			// Execute the command with discrete arguments to prevent shell injection
			execFileSync(
				command,
				[...args, 'shadcn@latest', 'add', templateRegistry],
				{
					stdio: 'inherit',
				}
			);
		} catch (error) {
			process.exit(1);
		}
	});
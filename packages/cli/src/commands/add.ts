import { execSync } from 'child_process';
import { Command } from 'commander';

/**
 * Determines the appropriate package manager runner.
 *
 * @returns The package manager runner command
 */
function getPackageManagerRunner(): string {
	const userAgent = process.env.npm_config_user_agent || '';

	if (userAgent.startsWith('bun')) {
		return 'bunx';
	} else if (userAgent.startsWith('pnpm')) {
		return 'pnpm dlx';
	} else if (userAgent.startsWith('yarn')) {
		return 'yarn dlx';
	} else {
		return 'npx';
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
				console.error('Component name is required');
				console.error('Usage: billingsdk add <component>');
				process.exit(1);
			}

			const templateRegistry = `@billingsdk/${component}.json`;
			const runner = getPackageManagerRunner();
			execSync(`${runner} shadcn@latest add ${templateRegistry}`, {
				stdio: 'inherit',
			});
		} catch (error) {
			process.exit(1);
		}
	});

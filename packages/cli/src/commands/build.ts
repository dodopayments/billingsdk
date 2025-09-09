import { Command } from 'commander';
import { buildRegistry } from '../scripts/build-registry.js';

/**
 * Command to build the component registry.
 */
export const buildCommand = new Command()
	.name('build')
	.description('Build the component registry')
	.summary('Generate component registry for distribution')
	.action(async () => {
		try {
			console.log('Building component registry...');
			await buildRegistry();
			console.log('Registry built successfully!');
		} catch (error) {
			process.exit(1);
		}
	});

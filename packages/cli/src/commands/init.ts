import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
} from '@clack/prompts';
import { Command } from 'commander';
import { detectFramework } from '../scripts/detect-framework.js';

/**
 * Type representing the supported frameworks.
 */
type Framework = 'nextjs' | 'express' | 'react';

/**
 * Type representing the supported payment providers.
 */
type Provider = 'dodopayments' | 'paypal';

/**
 * Adds files for the specified framework and provider.
 */
const addFiles = async (framework: Framework, provider: Provider) => {
	const mod = (await import(
		'../scripts/add-files.js'
	)) as typeof import('../scripts/add-files.js');
	return mod.addFiles(framework, provider);
};

/**
 * Command to initialize a new billing project.
 */
export const initCommand = new Command()
	.name('init')
	.description('Initialize a new billing project')
	.summary('Set up billing components and framework integration')
	.option('--skip-deps', 'Skip dependency installation', false)
	.action(async (options) => {
		try {
			intro('Welcome to Billing SDK Setup!');
			const major = Number.parseInt(process.versions.node.split('.')[0] || '0', 10);
			if (!Number.isFinite(major) || major < 18) {
				cancel('Node.js >= 18 is required. Please upgrade to run this command.');
				process.exitCode = 1;
				return;
			}

			const detectedFramework = detectFramework();
			const framework = await select({
				message:
					'Which framework you are using? (Adding more frameworks soon)',
				options: [
					{
						value: 'nextjs',
						label:
							detectedFramework === 'nextjs'
								? 'Next.js (detected)'
								: 'Next.js',
						hint: 'React framework with App Router',
					},
					{
						value: 'express',
						label:
							detectedFramework === 'express'
								? 'Express.js (detected)'
								: 'Express.js',
						hint: 'Node.js web framework',
					},
					{
						value: 'react',
						label:
							detectedFramework === 'react'
								? 'React.js (detected)'
								: 'React.js',
						hint: 'Client-side React app template',
					},
				],
				initialValue: detectedFramework ?? undefined,
			});

			if (isCancel(framework)) {
				cancel('Setup cancelled.');
				process.exit(0);
			}

			const providerChoice = await select({
				message:
					'Which payment provider would you like to use? (Adding more providers soon)',
				options: [
					{ value: 'dodopayments', label: 'Dodo Payments' },
					{ value: 'paypal', label: 'PayPal' },
				],
			});

			if (isCancel(providerChoice)) {
				cancel('Setup cancelled.');
				process.exit(0);
			}
			const provider = providerChoice as Provider;

			// Set environment variable to skip dependency installation if requested
			if (options.skipDeps) {
				process.env.BILLINGSDK_SKIP_INSTALL = '1';
			}

			const s = spinner();
			s.start('Setting up your billing project...');
			try {
				await addFiles(framework as Framework, provider);
				s.stop('Setup completed successfully!');
			} catch (error) {
				s.stop('Setup failed!');
				console.error(
					`Error: ${(error as Error).message || 'Unknown error occurred'}`
				);
				process.exit(1);
			} finally {
				outro('Thanks for using Billing SDK CLI!');
			}
		} catch (error) {
			console.error(
				`Error: ${(error as Error).message || 'Unknown error occurred'}`
			);
			process.exit(1);
		}
	});
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

type Framework = 'nextjs' | 'express' | 'react';
type Provider = 'dodopayments' | 'paypal';

const addFiles = async (framework: Framework, provider: Provider) => {
	const mod = await import('../scripts/add-files.js');
	return mod.addFiles(framework, provider as any);
};

export const initCommand = new Command()
	.name('init')
	.description('Initialize a new billing project')
	.summary('Set up billing components and framework integration')
	.action(async () => {
		try {
			intro('Welcome to Billing SDK Setup!');

			const detectedFramework = detectFramework();
			const framework = await select({
				message: 'Which framework you are using? (Adding more frameworks soon)',
				options: [
					{
						value: 'nextjs',
						label:
							detectedFramework === 'nextjs' ? 'Next.js (detected)' : 'Next.js',
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

			const s = spinner();
			s.start('Setting up your billing project...');
			try {
				await addFiles(framework as Framework, provider);
				s.stop('Setup completed successfully!');
			} finally {
				outro('Thanks for using Billing SDK CLI!');
			}
		} catch {
			process.exit(1);
		}
	});

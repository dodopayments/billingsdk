/**
 * Adds files from a template to the current project based on the specified framework and provider.
 *
 * @param framework - The framework to use for the template ('nextjs', 'express', or 'react')
 * @param provider - The payment provider to use for the template ('dodopayments' or 'paypal')
 * @returns A promise that resolves when all files have been added
 */
export declare const addFiles: (
	framework: 'nextjs' | 'express' | 'react',
	provider: 'dodopayments' | 'paypal'
) => Promise<void>;

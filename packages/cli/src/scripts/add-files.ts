import { confirm, spinner } from '@clack/prompts';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Result } from '../types/registry.js';

/**
 * Adds files from a template to the current project based on the specified framework and provider.
 * This function fetches template files either from a remote registry or a local fallback,
 * then writes them to the appropriate locations in the project directory.
 *
 * @param framework - The framework to use for the template ('nextjs', 'express', or 'react')
 * @param provider - The payment provider to use for the template ('dodopayments' or 'paypal')
 * @returns A promise that resolves when all files have been added
 * @throws {Error} If neither remote nor local templates are available
 */
export const addFiles = async (
	framework: 'nextjs' | 'express' | 'react',
	provider: 'dodopayments' | 'paypal'
) => {
	/**
	 * Fetches a template from the remote registry or falls back to a local template.
	 *
	 * @returns A promise that resolves to the template result
	 * @throws {Error} If neither remote nor local templates are available or parseable
	 */
	async function fetchTemplate(): Promise<Result> {
		const url = `https://billingsdk.com/r/${framework}-${provider}.json`;
		try {
			// Set a timeout for the fetch request (8 seconds)
			const controller = new AbortController();
			const t = setTimeout(() => controller.abort(), 8000);
			const res = await fetch(url, { signal: controller.signal });
			clearTimeout(t);
			if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
			return (await res.json()) as Result;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.warn(
				`Remote template not available (${errorMessage}), using local template instead`
			);
			// Local fallback to repo templates when remote registry is unavailable
			const currentDir = path.dirname(fileURLToPath(import.meta.url));
			const localPath = path.resolve(
				currentDir,
				'../../../public/r',
				`${framework}-${provider}.json`
			);

			// Check if local template file exists and can be read
			if (!fs.existsSync(localPath)) {
				throw new Error(
					`Local template file not found at ${localPath}. Remote template failed with: ${errorMessage}`
				);
			}

			try {
				const raw = fs.readFileSync(localPath, 'utf8');
				return JSON.parse(raw) as Result;
			} catch (readError) {
				const readErrorMessage =
					readError instanceof Error ? readError.message : String(readError);
				throw new Error(
					`Failed to read or parse local template at ${localPath}. Error: ${readErrorMessage}. Remote template failed with: ${errorMessage}`
				);
			}
		}
	}

	const result = await fetchTemplate();
	let srcExists = fs.existsSync(path.join(process.cwd(), 'src'));
	const addToPath = srcExists ? 'src' : '';

	for (const file of result.files) {
		// Validate and sanitize file.target to prevent path traversal
		const baseDir = path.resolve(process.cwd(), addToPath ?? '.');
		const dest = path.resolve(process.cwd(), addToPath ?? '.', file.target);
		const relativePath = path.relative(baseDir, dest);

		// Check if the resolved path is outside the intended base directory
		if (relativePath.startsWith('..') || relativePath === '..') {
			console.error(`Skipping file ${file.target}: Path traversal detected`);
			continue;
		}

		const filePath = dest;
		const dirPath = path.dirname(filePath);
		const displayPath = addToPath
			? path.join(addToPath, file.target)
			: file.target;

		try {
			fs.mkdirSync(dirPath, { recursive: true });
			const fileName = path.basename(file.target);

			if (fs.existsSync(filePath)) {
				if (fileName === '.env.example') {
					const existingContent = fs.readFileSync(filePath, 'utf8');

					// Parse existing content into a set of keys (ignore blank lines and comments)
					const existingLines = existingContent.split('\n');
					const existingKeys = new Set<string>();
					for (const line of existingLines) {
						const trimmedLine = line.trim();
						if (trimmedLine && !trimmedLine.startsWith('#')) {
							const [key] = trimmedLine.split('=', 2);
							if (key) {
								existingKeys.add(key.trim());
							}
						}
					}

					// Parse new content and filter out duplicate keys
					const newLines = file.content.split('\n');
					const filteredNewLines: string[] = [];
					for (const line of newLines) {
						const trimmedLine = line.trim();
						if (trimmedLine && !trimmedLine.startsWith('#')) {
							const [key] = trimmedLine.split('=', 2);
							if (key && !existingKeys.has(key.trim())) {
								filteredNewLines.push(line);
							}
						} else {
							// Keep comments and blank lines
							filteredNewLines.push(line);
						}
					}

					// Only append non-duplicate lines
					let newContent = existingContent;
					if (filteredNewLines.length > 0) {
						// Ensure there's a newline at the end of existing content before appending
						if (!newContent.endsWith('\n')) {
							newContent += '\n';
						}
						// Append filtered lines
						newContent += filteredNewLines.join('\n');
						// Ensure file ends with a newline
						if (!newContent.endsWith('\n')) {
							newContent += '\n';
						}
					}

					fs.writeFileSync(filePath, newContent);
				} else {
					const overwrite = await confirm({
						message: `File ${displayPath} already exists. Do you want to overwrite it?`,
					});
					if (overwrite) {
						fs.writeFileSync(filePath, file.content);
					}
				}
			} else {
				fs.writeFileSync(filePath, file.content);
			}
		} catch (error) {
			console.error(`Failed to add file ${displayPath}:`, error);
		}
	}

	/**
	 * Determines the package manager being used based on the npm_config_user_agent environment variable.
	 *
	 * @returns The name of the package manager ('bun', 'pnpm', 'yarn', or 'npm')
	 */
	function getPackageManager(): string {
		const userAgent = process.env.npm_config_user_agent || '';

		if (userAgent.startsWith('bun')) {
			return 'bun';
		} else if (userAgent.startsWith('pnpm')) {
			return 'pnpm';
		} else if (userAgent.startsWith('yarn')) {
			return 'yarn';
		} else {
			return 'npm';
		}
	}

	if (result.dependencies && process.env.BILLINGSDK_SKIP_INSTALL !== '1') {
		const s = spinner();
		s.start('Installing dependencies...');
		try {
			// Use execFileSync instead of execSync to prevent shell injection
			const packageManager = getPackageManager();
			const args = ['install', ...result.dependencies];
			execFileSync(packageManager, args, {
				stdio: 'inherit',
			});
			s.stop('Dependencies installed successfully!');
		} catch (error) {
			s.stop('Dependency installation failed.');
			console.error('Failed to install dependencies:', error);
		}
	}
};
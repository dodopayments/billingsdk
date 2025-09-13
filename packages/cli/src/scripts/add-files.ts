import { confirm, spinner } from '@clack/prompts';
import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Result } from '../types/registry.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
	const fetchTemplate = async (): Promise<Result> => {
		const remoteUrl = `https://billingsdk.com/tr/${framework}-${provider}.json`;
		
		// Multiple candidate paths to handle different execution contexts
		const candidatePaths = [
			// Standard path when CLI is run from project root (packages/cli)
			path.join(__dirname, '..', '..', '..', 'public', 'tr', `${framework}-${provider}.json`),
			// Path when CLI is run from packages/cli directory (alternative)
			path.join(process.cwd(), '..', '..', 'public', 'tr', `${framework}-${provider}.json`),
			// Path when CLI is run from one directory up
			path.join(__dirname, '..', '..', '..', '..', 'billingsdk', 'public', 'tr', `${framework}-${provider}.json`),
			// Additional fallback paths based on current working directory
			path.join(process.cwd(), 'public', 'tr', `${framework}-${provider}.json`),
			path.join(process.cwd(), 'packages', 'cli', 'public', 'tr', `${framework}-${provider}.json`),
		];

		const localPath = candidatePaths.find(p => fs.existsSync(p));

		try {
			const response = await fetch(remoteUrl);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return (await response.json()) as Result;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			try {
				if (localPath && fs.existsSync(localPath)) {
					const localContent = fs.readFileSync(localPath, 'utf8');
					return JSON.parse(localContent) as Result;
				} else {
					const allPaths = candidatePaths.map(p => `\n  - ${p}`).join('');
					throw new Error(
						`Local template not found at any of the expected paths:${allPaths}\n\nRemote template failed with: ${errorMessage}`
					);
				}
			} catch (readError) {
				const readErrorMessage =
					readError instanceof Error ? readError.message : String(readError);
				throw new Error(
					`Failed to read or parse local template at ${localPath || 'unknown path'}. Error: ${readErrorMessage}. Remote template failed with: ${errorMessage}`
				);
			}
		}
	};

	const result = await fetchTemplate();
	let addToPath = '';
	if (framework === 'nextjs') {
	  // Prefer placing under src when src/app or src exists; never prefix with 'app'
	  if (fs.existsSync(path.join(process.cwd(), 'src', 'app'))) addToPath = 'src';
	  else if (fs.existsSync(path.join(process.cwd(), 'src'))) addToPath = 'src';
	  else addToPath = '';
	} else {
	  addToPath = fs.existsSync(path.join(process.cwd(), 'src')) ? 'src' : '';
	}
	for (const file of result.files) {
		// Validate and sanitize file.target to prevent path traversal
		const baseDir = path.resolve(process.cwd());
		const normalizedTarget = file.target.replace(/^[./]+/, '');
		// If addToPath === 'src', prefix unless target already starts with 'src/'
		let targetRel = normalizedTarget;
		if (addToPath === 'src' && !normalizedTarget.startsWith('src/')) {
		  targetRel = path.join('src', normalizedTarget);
		}
		const dest = path.resolve(process.cwd(), targetRel);
		const relativePath = path.relative(baseDir, dest);
		const insideBase =
			!path.isAbsolute(file.target) &&
			!relativePath.startsWith('..') &&
			!path.isAbsolute(relativePath) &&
			dest.startsWith(baseDir + path.sep);
		if (!insideBase) {
			console.error(`Skipping file ${file.target}: Path traversal detected`);
			continue;
		}

		const filePath = dest;
		const dirPath = path.dirname(filePath);
		const displayPath = targetRel;

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

	if (result.dependencies && process.env.BILLINGSDK_SKIP_INSTALL !== '1') {
		const s = spinner();
		s.start('Installing dependencies...');
		try {
			// Use execFileSync instead of execSync to prevent shell injection
			const packageManager = getPackageManager();
			const mkArgs = (pm: string, deps: string[]) => {
				switch (pm) {
					case 'pnpm':
						return ['add', ...deps];
					case 'yarn':
						return ['add', ...deps];
					case 'bun':
						return ['add', ...deps];
					default: // npm
						return ['install', ...deps];
				}
			};
			const args = mkArgs(packageManager, result.dependencies);
			
			// Run from the user's project root
			const projectRoot = process.cwd();
			
			// Check if the package manager exists before trying to run it
			try {
				execSync(`${packageManager} --version`, { stdio: 'ignore' });
			} catch (versionError) {
				throw new Error(`Package manager '${packageManager}' not found in PATH. Please ensure it is installed and available in your system PATH.`);
			}
			
			// Try to execute the command, with fallback for Windows
			try {
				execFileSync(packageManager, args, {
					stdio: 'inherit',
					cwd: projectRoot, // Run from project root
				});
				s.stop('Dependencies installed successfully!');
			} catch (execError) {
				// On Windows, try with shell option as fallback
				if (process.platform === 'win32') {
					try {
						execFileSync(packageManager, args, {
							stdio: 'inherit',
							cwd: projectRoot,
							shell: true, // Use shell on Windows
						});
						s.stop('Dependencies installed successfully!');
					} catch (shellError) {
						throw new Error(`Failed to execute command with shell fallback: ${shellError instanceof Error ? shellError.message : String(shellError)}`);
					}
				} else {
					throw execError;
				}
			}
		} catch (error) {
			s.stop('Dependency installation failed.');
			console.error('Failed to install dependencies:', error instanceof Error ? error.message : String(error));
			
			// Provide more helpful error message
			const packageManager = getPackageManager();
			const args = ['install', ...result.dependencies];
			console.log('\nNote: You may need to manually install the required dependencies:');
			console.log(`\n${packageManager} ${args.join(' ')}`);
			console.log(`\nRun this command from the project root: ${path.join(__dirname, '..', '..', '..')}`);
			console.log('\nIf you continue to have issues, please ensure that:');
			console.log('1. The package manager is installed and in your system PATH');
			console.log('2. You have the necessary permissions to install packages');
			console.log('3. Your internet connection is working properly');
			console.log('\nAlternatively, you can skip dependency installation by setting the environment variable:');
			console.log('BILLINGSDK_SKIP_INSTALL=1');
		}
	}
};

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
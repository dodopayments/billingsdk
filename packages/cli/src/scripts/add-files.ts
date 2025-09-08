import { confirm, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Result } from '../types/registry.js';

export const addFiles = async (
	framework: 'nextjs' | 'express' | 'react',
	provider: 'dodopayments' | 'paypal'
) => {
	async function fetchTemplate(): Promise<Result> {
		const url = `https://billingsdk.com/tr/${framework}-${provider}.json`;
		try {
			// Set a timeout for the fetch request (8 seconds)
			const controller = new AbortController();
			const t = setTimeout(() => controller.abort(), 8000);
			const res = await fetch(url, { signal: controller.signal });
			clearTimeout(t);
			if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
			return (await res.json()) as Result;
		} catch (err) {
			console.warn(
				`Remote template not available (${err.message}), using local template instead`
			);
			// Local fallback to repo templates when remote registry is unavailable
			const currentDir = path.dirname(fileURLToPath(import.meta.url));
			const localPath = path.resolve(
				currentDir,
				'../../../public/tr',
				`${framework}-${provider}.json`
			);
			const raw = fs.readFileSync(localPath, 'utf8');
			return JSON.parse(raw) as Result;
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
	if (result.dependencies && process.env.BILLINGSDK_SKIP_INSTALL !== '1') {
		const s = spinner();
		s.start('Installing dependencies...');
		try {
			execSync(`npm install ${result.dependencies.join(' ')}`, {
				stdio: 'inherit',
			});
			s.stop('Dependencies installed successfully!');
		} catch (error) {
			s.stop('Dependency installation failed.');
			console.error('Failed to install dependencies:', error);
		}
	}
};

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
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Failed ${res.status} ${res.statusText}`);
			return (await res.json()) as Result;
		} catch {
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
		const filePath = path.join(process.cwd(), addToPath, file.target);
		const dirPath = path.dirname(filePath);
		const relativePath = addToPath
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
						message: `File ${relativePath} already exists. Do you want to overwrite it?`,
					});
					if (overwrite) {
						fs.writeFileSync(filePath, file.content);
					}
				}
			} else {
				fs.writeFileSync(filePath, file.content);
			}
		} catch (error) {
			console.error(`Failed to add file ${relativePath}:`, error);
		}
	}
	if (result.dependencies && process.env.BILLINGSDK_SKIP_INSTALL !== '1') {
		const s = spinner();
		s.start('Installing dependencies...');
		try {
			await execSync(`npm install ${result.dependencies.join(' ')}`, {
				stdio: 'inherit',
			});
			s.stop('Dependencies installed successfully!');
		} catch (error) {
			console.error('Failed to install dependencies:', error);
		}
	}
};

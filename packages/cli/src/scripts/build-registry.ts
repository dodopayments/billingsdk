import fs from 'fs';
import path from 'path';
import { Registry, Result } from '../types/registry.js';

/**
 * Builds the registry by processing component templates and generating JSON files.
 * This function reads the registry.json file, processes each component's files,
 * and generates individual JSON files for each component in the public/tr directory.
 *
 * @returns A promise that resolves when the registry build is complete
 * @throws {Error} If the registry.json file is not found or if there are file system errors
 */
export const buildRegistry = async () => {
	try {
		const registryPath = path.join(
			process.cwd(),
			'packages',
			'templates',
			'registry.json'
		);
		if (!fs.existsSync(registryPath)) {
			console.error('registry.json not found in root directory');
			process.exit(1);
		}

		const registry: Registry = JSON.parse(
			fs.readFileSync(registryPath, 'utf-8')
		);

		const outputDir = path.join(process.cwd(), 'public/r');
		fs.mkdirSync(outputDir, { recursive: true });

		const componentsToProcess = registry.components;

		for (const component of componentsToProcess) {
			console.log(`Building ${component.name}...`);

			const processedComponent: Result = {
				...component,
				files: [],
			};

			/**
			 * Processes a file and adds it to the processed component.
			 *
			 * @param absSourcePath - The absolute path to the source file
			 * @param relativeFromBase - The relative path from the base directory (for wildcard processing)
			 */
			const pushFile = (absSourcePath: string, relativeFromBase?: string) => {
				const content = fs.readFileSync(absSourcePath, 'utf-8');

				// Compute target path with proper POSIX normalization
				let targetPath: string;
				if (hasWildcard && targetHasWildcard && relativeFromBase) {
					// When both source and target have wildcards and we have a relative path
					targetPath = path.posix.join(targetBaseRaw, relativeFromBase);
				} else if (!hasWildcard && targetHasWildcard) {
					// When source is a single file but target has a wildcard
					// Substitute the '*' with the source filename
					const fileName = path.basename(absSourcePath);
					targetPath = targetBaseRaw.replace(/\*$/, fileName);
				} else {
					// Simple case - no wildcards or only source has wildcard
					targetPath = targetBaseRaw;
				}

				// Ensure the resulting target string is normalized to POSIX separators
				targetPath = targetPath.replace(/\\/g, '/');

				processedComponent.files.push({
					target: targetPath,
					type: file.type ?? 'template',
					content: content,
				});
			};

			for (const file of component.files) {
				// Validate that file.path is a non-empty string before using it
				if (
					typeof (file as any).path !== 'string' ||
					(file as any).path.trim() === ''
				) {
					console.warn(
						`Skipping file with invalid path in component ${component.name}:`,
						file
					);
					continue;
				}

				const filePathPattern = (file as any).path;
				const hasWildcard = filePathPattern.includes('*');
				const sourceBase = hasWildcard
					? path.join(process.cwd(), filePathPattern.split('*')[0])
					: path.join(process.cwd(), filePathPattern);

				const fileTarget =
					typeof (file as any).target === 'string' ? (file as any).target : '';
				const targetHasWildcard = fileTarget.includes('*');
				const targetBaseRaw = targetHasWildcard
					? fileTarget.split('*')[0]
					: fileTarget;

				if (hasWildcard) {
					if (!fs.existsSync(sourceBase)) {
						console.warn(`Skipping missing directory: ${sourceBase}`);
						continue;
					}

					/**
					 * Recursively walks through a directory and processes all files.
					 *
					 * @param dir - The directory to walk through
					 * @param base - The base directory for calculating relative paths
					 */
					const walk = (dir: string, base: string) => {
						const entries = fs.readdirSync(dir, { withFileTypes: true });
						for (const entry of entries) {
							const abs = path.join(dir, entry.name);
							if (entry.isDirectory()) {
								walk(abs, base);
							} else if (entry.isFile()) {
								const rel = path.relative(base, abs);
								pushFile(abs, rel);
							}
						}
					};

					walk(sourceBase, sourceBase);
				} else {
					if (!fs.existsSync(sourceBase)) {
						console.warn(`Skipping missing file: ${sourceBase}`);
						continue;
					}
					pushFile(sourceBase);
				}
			}

			const outputPath = path.join(outputDir, `${component.name}.json`);
			fs.writeFileSync(
				outputPath,
				JSON.stringify(processedComponent, null, 2),
				'utf-8'
			);

			console.log(`Built ${component.name} -> public/r/${component.name}.json`);
		}
		console.log(
			`Successfully built ${componentsToProcess.length} component(s) to public/r`
		);
	} catch (error) {
		console.error(
			`Build failed: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
		process.exit(1);
	}
};

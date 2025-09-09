import { findUpSync } from 'find-up'; // find a file path by walking up parent directories
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Detects the framework used in the current project by examining package.json dependencies
 * and project structure.
 *
 * This function attempts to identify if the project is using Next.js, Express, or React
 * by checking for specific dependencies and configuration files.
 *
 * @returns The detected framework ('nextjs', 'express', 'react') or null if no framework is detected
 * @throws Will return null if any error occurs during detection
 */
export const detectFramework = (): 'nextjs' | 'express' | 'react' | null => {
	try {
		const pkgPath = findUpSync('package.json');
		if (!pkgPath) return null;
		const rootDir = path.dirname(pkgPath);
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

		/**
		 * Checks if a file exists in the project root directory.
		 *
		 * @param file - The file path to check
		 * @returns True if the file exists, false otherwise
		 */
		function hasFile(file: string) {
			return existsSync(path.join(rootDir, file));
		}
		const {
			dependencies = {},
			devDependencies = {},
			peerDependencies = {},
		} = pkg ?? {};
		const deps = { ...dependencies, ...devDependencies, ...peerDependencies };

		// Next.js detection
		if (
			deps.next ||
			hasFile('next.config.js') ||
			hasFile('next.config.mjs') ||
			hasFile('next.config.cjs') ||
			hasFile('next.config.ts') ||
			existsSync(path.join(rootDir, '.next'))
		) {
			return 'nextjs';
		}

		// Express detection
		if (deps.express) {
			return 'express';
		}

		// React detection
		if (deps.react) {
			return 'react';
		}
		return null;
	} catch {
		return null;
	}
};

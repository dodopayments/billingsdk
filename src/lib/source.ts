import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import type { LucideIcon } from 'lucide-react';
import * as icons from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: '/docs',
	source: docs.toFumadocsSource(),
	icon(icon) {
		if (!icon) {
			return;
		}
		if (icon in icons) {
			const Icon = (icons as unknown as Record<string, LucideIcon>)[icon];
			if (Icon) {
				return createElement(Icon);
			}
		}
		console.warn(`Icon "${icon}" not found in lucide-react`);
	},
});

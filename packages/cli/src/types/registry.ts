/**
 * Represents a backend component with its associated files and dependencies.
 */
export interface BackendComponent {
	/** The name of the component */
	name: string;

	/** A description of the component */
	description: string;

	/** The framework this component is designed for */
	framework: 'nextjs' | 'express' | 'react' | 'fastify';

	/** The files associated with this component */
	files: Array<{
		/** The source path of the file */
		path: string;

		/** The content of the file */
		content: string;

		/** The target path where the file should be placed */
		target: string;

		/** The type of the file */
		type: 'template' | 'config' | 'types';
	}>;

	/** Optional dependencies required by this component */
	dependencies?: string[];
}

/**
 * Represents the registry structure containing all available components.
 */
export interface Registry {
	/** The schema URL for validation */
	$schema: string;

	/** The list of available components */
	components: BackendComponent[];
}

/**
 * Represents the result of processing a component template.
 */
export interface Result {
	/** The name of the component */
	name: string;

	/** A description of the component */
	description: string;

	/** The framework this component is designed for */
	framework: 'nextjs' | 'express' | 'react' | 'fastify';

	/** The processed files for this component */
	files: Array<{
		/** The content of the file */
		content: string;

		/** The target path where the file should be placed */
		target: string;

		/** The type of the file */
		type: 'template' | 'config' | 'types';
	}>;

	/** Optional dependencies required by this component */
	dependencies?: string[];
}
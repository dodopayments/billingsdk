/**
 * Auto-discovery utility for playground components
 * Automatically discovers and loads components from the public registry
 */

import type { ComponentConfig } from "./types";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: Array<{
    path: string;
    type: string;
    target: string;
  }>;
}

interface RegistryManifest {
  items: RegistryItem[];
}

/**
 * Fetches the registry manifest from the public directory
 */
async function fetchRegistryManifest(): Promise<RegistryManifest | null> {
  try {
    const response = await fetch('/r/registry.json');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch registry manifest:', error);
    return null;
  }
}

/**
 * Fetches individual component metadata from the registry
 */
async function fetchComponentMetadata(componentName: string): Promise<any> {
  try {
    const response = await fetch(`/r/${componentName}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch metadata for ${componentName}:`, error);
    return null;
  }
}

/**
 * Converts a kebab-case component name to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Categorizes components based on their name
 */
function categorizeComponent(name: string): string {
  if (name.includes('pricing-table')) return 'pricing';
  if (name.includes('subscription') || name.includes('plan') || name.includes('cancel') || name.includes('update')) return 'subscription';
  if (name.includes('payment') || name.includes('invoice') || name.includes('billing')) return 'payment';
  if (name.includes('usage') || name.includes('meter') || name.includes('proration') || name.includes('upcoming-charges') || name.includes('detailed-usage')) return 'usage';
  return 'ui';
}

/**
 * Escapes special regex characters to prevent injection
 */
function regexEscape(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts usage code snippet from component metadata
 * Limits input size and uses safe regex patterns to prevent ReDoS
 */
function extractUsageSnippet(metadata: any, componentName: string): string {
  const pascalName = toPascalCase(componentName);
  
  // Try to find demo file content
  const demoFile = metadata?.files?.find((f: any) => 
    f.path?.includes('demo') && f.content
  );
  
  if (demoFile?.content) {
    try {
      // Limit input size to prevent ReDoS attacks (50KB max)
      const MAX_CONTENT_SIZE = 50 * 1024; // 50KB
      const safeContent = demoFile.content.slice(0, MAX_CONTENT_SIZE);
      
      // Escape pascalName to prevent regex injection
      const escapedName = regexEscape(pascalName);
      
      // Extract the JSX from the demo component - use bounded quantifiers
      // Match opening tag, attributes (max 500 chars), and closing tag (max 2000 chars content)
      const componentPattern = new RegExp(
        `<${escapedName}[^>]{0,500}(?:>|\\/>)(?:[^<]{0,2000}|(?:<(?!\\/${escapedName}>)[^>]{0,100}>){0,50})*?(?:<\\/${escapedName}>|(?=\\n\\s*\\)))`,
        'i'
      );
      const match = safeContent.match(componentPattern);
      if (match) {
        return match[0].trim();
      }
      
      // Fallback: try to find any component tag with bounded quantifiers
      // Match any PascalCase component with limited nesting
      const anyComponentPattern = new RegExp(
        '<[A-Z][a-zA-Z]{0,50}[^>]{0,500}(?:>|\\/>)(?:[^<]{0,2000}|(?:<(?!\\/[A-Z])[^>]{0,100}>){0,50})*?(?:<\\/[A-Z][a-zA-Z]{0,50}>|(?=\\n\\s*\\)))',
        'i'
      );
      const anyComponentMatch = safeContent.match(anyComponentPattern);
      if (anyComponentMatch) {
        return anyComponentMatch[0].trim();
      }
    } catch (error) {
      console.warn(`Failed to extract snippet for ${componentName}:`, error);
    }
  }
  
  // Fallback to basic usage
  return `<${pascalName} />`;
}

/**
 * Dynamically imports a component from the billingsdk directory
 */
async function importComponent(componentName: string): Promise<any> {
  try {
    const module = await import(`@/components/billingsdk/${componentName}`);
    const pascalName = toPascalCase(componentName);
    
    // Try multiple export patterns
    const component = module[pascalName] || module.default || module[componentName];
    
    if (!component) {
      console.warn(`Component ${componentName} (${pascalName}) not found in module exports:`, Object.keys(module));
    }
    
    return component;
  } catch (error) {
    console.error(`Failed to import component ${componentName}:`, error);
    return null;
  }
}

/**
 * Discovers all available components from the registry
 */
export async function discoverComponents(): Promise<ComponentConfig[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) {
    console.warn('Failed to fetch registry manifest');
    return [];
  }

  const components: ComponentConfig[] = [];
  
  // Filter out non-component items (like 'index', 'all', 'hello-world')
  const componentItems = manifest.items.filter(item => 
    item.type === 'registry:block' && 
    item.name !== 'index' && 
    item.name !== 'all' &&
    item.name !== 'hello-world'
  );

  console.log(`Discovering ${componentItems.length} components...`);

  // Process each component in parallel for better performance
  const results = await Promise.allSettled(
    componentItems.map(async (item) => {
      try {
        // Fetch detailed metadata
        const metadata = await fetchComponentMetadata(item.name);
        
        // Dynamically import the component
        const Component = await importComponent(item.name);
        
        if (!Component) {
          console.warn(`Skipping ${item.name}: Component not found`);
          return null;
        }

        const config: ComponentConfig = {
          id: item.name,
          name: item.title,
          description: item.description,
          category: categorizeComponent(item.name),
          component: Component,
          imports: [`@/components/billingsdk/${item.name}`],
          defaultCode: extractUsageSnippet(metadata, item.name),
          defaultProps: {},
        };

        return config;
      } catch (error) {
        console.error(`Failed to process component ${item.name}:`, error);
        return null;
      }
    })
  );

  // Filter out failed imports and null results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      components.push(result.value);
    } else if (result.status === 'rejected') {
      console.error(`Component ${componentItems[index].name} failed:`, result.reason);
    }
  });

  console.log(`Successfully discovered ${components.length} components`);
  return components;
}

/**
 * Normalizes component names to kebab-case
 * Handles PascalCase, camelCase, spaces, and special characters
 */
function normalizeComponentName(name: string): string {
  return name
    // Insert hyphens between lower→upper transitions (decamelize)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Insert hyphens between letter→number transitions
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    // Lowercase everything
    .toLowerCase()
    // Replace whitespace with hyphens
    .replace(/\s+/g, '-')
    // Remove non a-z0-9- characters
    .replace(/[^a-z0-9-]/g, '')
    // Collapse multiple hyphens
    .replace(/-+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Discovers a single component by name
 * Handles various component name formats (kebab-case, PascalCase, etc.)
 */
export async function discoverComponent(componentName: string): Promise<ComponentConfig | null> {
  try {
    // Normalize component name to kebab-case
    const normalizedName = normalizeComponentName(componentName);
    
    console.log(`Discovering component: ${componentName} → ${normalizedName}`);
    
    const metadata = await fetchComponentMetadata(normalizedName);
    if (!metadata) {
      console.warn(`No metadata found for ${normalizedName} — proceeding with defaults`);
    }
    const Component = await importComponent(normalizedName);
    if (!Component) {
      console.warn(`Component ${normalizedName} could not be imported`);
      return null;
    }

    const config: ComponentConfig = {
      id: normalizedName,
      name: metadata?.title || toPascalCase(normalizedName),
      description: metadata?.description || `${toPascalCase(normalizedName)} component`,
      category: categorizeComponent(normalizedName),
      component: Component,
      imports: [`@/components/billingsdk/${normalizedName}`],
      defaultCode: extractUsageSnippet(metadata ?? {}, normalizedName),
      defaultProps: {},
    };

    console.log(`Successfully discovered component: ${normalizedName}`);
    return config;
  } catch (error) {
    console.error(`Failed to discover component ${componentName}:`, error);
    return null;
  }
}

/**
 * Lightweight component list entry (no actual component imported)
 */
export interface ComponentListItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

/**
 * Gets a lightweight list of all components (no imports)
 * Use this for initial loading to avoid bloating the bundle
 */
export async function getComponentList(): Promise<ComponentListItem[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) {
    console.warn('Failed to fetch registry manifest');
    return [];
  }

  const componentItems = manifest.items.filter(item => 
    item.type === 'registry:block' && 
    item.name !== 'index' && 
    item.name !== 'all' &&
    item.name !== 'hello-world'
  );

  return componentItems.map(item => ({
    id: item.name,
    name: item.title,
    description: item.description,
    category: categorizeComponent(item.name),
  }));
}

/**
 * Gets all component names from the registry
 */
export async function getComponentNames(): Promise<string[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) return [];

  return manifest.items
    .filter(item => 
      item.type === 'registry:block' && 
      item.name !== 'index' && 
      item.name !== 'all' &&
      item.name !== 'hello-world'
    )
    .map(item => item.name);
}

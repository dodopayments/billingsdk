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

function isValidRegistryBlock(item: RegistryItem): boolean {
  return (
    item.type === "registry:block" &&
    item.name !== "index" &&
    item.name !== "all" &&
    item.name !== "hello-world"
  );
}

async function fetchRegistryManifest(): Promise<RegistryManifest | null> {
  try {
    const response = await fetch("/r/registry.json");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch registry manifest:", error);
    return null;
  }
}

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

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function categorizeComponent(name: string): string {
  if (name.includes("pricing-table")) return "pricing";
  if (
    name.includes("subscription") ||
    name.includes("plan") ||
    name.includes("cancel") ||
    name.includes("update")
  )
    return "subscription";
  if (
    name.includes("payment") ||
    name.includes("invoice") ||
    name.includes("billing")
  )
    return "payment";
  if (
    name.includes("usage") ||
    name.includes("meter") ||
    name.includes("proration") ||
    name.includes("upcoming-charges") ||
    name.includes("detailed-usage")
  )
    return "usage";
  return "ui";
}

function regexEscape(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractUsageSnippet(metadata: any, componentName: string): string {
  const pascalName = toPascalCase(componentName);
  const demoFile = metadata?.files?.find(
    (f: any) => f.path?.includes("demo") && f.content,
  );

  if (demoFile?.content) {
    try {
      const MAX_CONTENT_SIZE = 50 * 1024;
      const safeContent = demoFile.content.slice(0, MAX_CONTENT_SIZE);
      const escapedName = regexEscape(pascalName);
      const componentPattern = new RegExp(
        `<${escapedName}[^>]{0,500}(?:>|\\/>)(?:[^<]{0,2000}|(?:<(?!\\/${escapedName}>)[^>]{0,100}>){0,50})*?(?:<\\/${escapedName}>|(?=\\n\\s*\\)))`,
        "i",
      );
      const match = safeContent.match(componentPattern);
      if (match) {
        return match[0].trim();
      }
      const anyComponentPattern = new RegExp(
        "<[A-Z][a-zA-Z]{0,50}[^>]{0,500}(?:>|\\/>)(?:[^<]{0,2000}|(?:<(?!\\/[A-Z])[^>]{0,100}>){0,50})*?(?:<\\/[A-Z][a-zA-Z]{0,50}>|(?=\\n\\s*\\)))",
        "i",
      );
      const anyComponentMatch = safeContent.match(anyComponentPattern);
      if (anyComponentMatch) {
        return anyComponentMatch[0].trim();
      }
    } catch (error) {
      console.warn(`Failed to extract snippet for ${componentName}:`, error);
    }
  }
  return `<${pascalName} />`;
}

async function importComponent(componentName: string): Promise<any> {
  const pascalName = toPascalCase(componentName);
  try {
    console.log(
      `[Import] Attempting: @/components/billingsdk/${componentName}`,
    );
    const module = await import(`@/components/billingsdk/${componentName}`);
    const component =
      module[pascalName] || module.default || module[componentName];

    if (component) {
      console.log(
        `[Import] ✓ Success from /components/billingsdk/${componentName}`,
      );
      return component;
    }

    console.warn(
      `[Import] Module loaded but component not found. Exports:`,
      Object.keys(module),
    );
  } catch (error) {
    console.warn(`[Import] Failed from /components/billingsdk:`, error);
  }
  try {
    console.log(`[Import] Attempting: @/registry/billingsdk/${componentName}`);
    const module = await import(`@/registry/billingsdk/${componentName}`);
    const component =
      module[pascalName] || module.default || module[componentName];

    if (component) {
      console.log(
        `[Import] ✓ Success from /registry/billingsdk/${componentName}`,
      );
      return component;
    }

    console.warn(
      `[Import] Module loaded but component not found. Exports:`,
      Object.keys(module),
    );
  } catch (error) {
    console.warn(`[Import] Failed from /registry/billingsdk:`, error);
  }
  console.error(
    `[Import] ✗ All import strategies failed for ${componentName} (${pascalName})`,
  );
  return null;
}

export async function discoverComponents(): Promise<ComponentConfig[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) {
    console.warn("Failed to fetch registry manifest");
    return [];
  }

  const components: ComponentConfig[] = [];
  const componentItems = manifest.items.filter(isValidRegistryBlock);

  console.log(`Discovering ${componentItems.length} components...`);
  const results = await Promise.allSettled(
    componentItems.map(async (item) => {
      try {
        const metadata = await fetchComponentMetadata(item.name);
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
    }),
  );
  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      components.push(result.value);
    } else if (result.status === "rejected") {
      console.error(
        `Component ${componentItems[index].name} failed:`,
        result.reason,
      );
    }
  });
  console.log(`Successfully discovered ${components.length} components`);
  return components;
}

function normalizeComponentName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function discoverComponent(
  componentName: string,
): Promise<ComponentConfig | null> {
  try {
    const normalizedName = normalizeComponentName(componentName);
    console.log(`Discovering component: ${componentName} → ${normalizedName}`);
    const metadata = await fetchComponentMetadata(normalizedName);
    if (!metadata) {
      console.warn(
        `No metadata found for ${normalizedName} — proceeding with defaults`,
      );
    }
    const Component = await importComponent(normalizedName);
    if (!Component) {
      console.warn(`Component ${normalizedName} could not be imported`);
      return null;
    }
    const config: ComponentConfig = {
      id: normalizedName,
      name: metadata?.title || toPascalCase(normalizedName),
      description:
        metadata?.description || `${toPascalCase(normalizedName)} component`,
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

export interface ComponentListItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

export async function getComponentList(): Promise<ComponentListItem[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) {
    console.warn("Failed to fetch registry manifest");
    return [];
  }

  const componentItems = manifest.items.filter(isValidRegistryBlock);

  return componentItems.map((item) => ({
    id: item.name,
    name: item.title,
    description: item.description,
    category: categorizeComponent(item.name),
  }));
}

export async function getComponentNames(): Promise<string[]> {
  const manifest = await fetchRegistryManifest();
  if (!manifest) return [];

  return manifest.items.filter(isValidRegistryBlock).map((item) => item.name);
}

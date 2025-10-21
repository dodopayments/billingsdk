export type SupportedFramework = "nextjs" | "express" | "react" | "fastify" | "hono" | "nestjs";
export type SupportedProvider = "dodopayments" | "stripe";

export const supportedFrameworks: SupportedFramework[] = [
  "nextjs",
  "express",
  "react",
  "fastify",
  "hono",
  "nestjs"
];

export const supportedProviders: SupportedProvider[] = [
  "dodopayments",
  "stripe"
];

// Matrix of valid framework/provider combinations
const VALID_COMBINATIONS: Record<SupportedProvider, SupportedFramework[]> = {
  dodopayments: ["nextjs", "express", "react", "fastify", "hono", "nestjs"],
  stripe: ["nextjs", "express", "react", "hono", "nestjs"]
};

export const isValidCombination = (framework: SupportedFramework, provider: SupportedProvider): boolean => {
  return VALID_COMBINATIONS[provider]?.includes(framework) ?? false;
};

export const getAllowedProvidersForFramework = (framework: SupportedFramework): SupportedProvider[] => {
  return supportedProviders.filter((provider) => 
    VALID_COMBINATIONS[provider]?.includes(framework) ?? false
  );
};

export const transportNameFor = (framework: SupportedFramework, provider: SupportedProvider): string => {
  return `${framework}-${provider}`;
};



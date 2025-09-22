export type SupportedFramework = "nextjs" | "express" | "react" | "fastify" | "hono";
export type SupportedProvider = "dodopayments" | "stripe";

export const supportedFrameworks: SupportedFramework[] = [
  "nextjs",
  "express",
  "react",
  "fastify",
  "hono"
];

export const supportedProviders: SupportedProvider[] = [
  "dodopayments",
  "stripe"
];

// Matrix of valid framework/provider combinations
export const isValidCombination = (framework: SupportedFramework, provider: SupportedProvider): boolean => {
  if (provider === "dodopayments") return true;
  if (provider === "stripe") {
    return framework === "express" || framework === "hono";
  }
  return false;
};

export const getAllowedProvidersForFramework = (framework: SupportedFramework): SupportedProvider[] => {
  return supportedProviders.filter((p) => isValidCombination(framework, p));
};

export const transportNameFor = (framework: SupportedFramework, provider: SupportedProvider): string => {
  return `${framework}-${provider}`;
};



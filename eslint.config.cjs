const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const unusedImports = require("eslint-plugin-unused-imports");
const nextPlugin = require("@next/eslint-plugin-next");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "out/**",
      "coverage/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "unused-imports": unusedImports,
      "@next/next": nextPlugin,
    },
    rules: {
      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
      "@next/next/no-unwanted-polyfillio": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-head-import-in-document": "error",

      // Console rules - allow warn and error
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],

      // Turn off base no-unused-vars in favor of TypeScript and unused-imports rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Unused imports handling
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

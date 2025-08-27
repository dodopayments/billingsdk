# Contributing to BillingSDK

Thank you for your interest in contributing. This document explains how to set up the project, the development workflow, and expectations for pull requests.

## Prerequisites

- Node.js 18.18+ (Next.js 15 requires Node 18 or newer)
- A package manager: npm, pnpm, or yarn

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies:
   - **npm**: `npm ci` (or `npm install`)
   - **pnpm**: `pnpm install`
   - **yarn**: `yarn`
3. Copy .env.example to .env and fill the values `cp .env.example .env`

4. Start the dev server:
   - **npm**: `npm run dev`
   - **pnpm**: `pnpm dev`
   - **yarn**: `yarn dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure (High Level)

- `src/app/(home)`: Landing and marketing pages
- `src/app/docs`: Documentation layout and routing
- `content/docs`: MDX content for documentation
- `src/app/api/search/route.ts`: Search API powered by Fumadocs source
- `src/app/api/chat/route.ts`: Chat API using Inkeep
- `src/components/ui`: Reusable UI primitives (shadcn-style components)

## Local Development Workflow (Shadcn Registry)

1. Create component source:
   - Component: `src/registry/billingsdk/<component>.tsx`
   - Demo: `src/registry/billingsdk/demo/<component>-demo.tsx`
2. Update `registry.json` following the [shadcn registry docs](https://ui.shadcn.com/docs/registry).
3. Build registry JSON:
   - Run: `npx shadcn@latest build`
   - Output: generated files appear under `public/r/*.json`
4. Consume in another project:
   - `npx shadcn@latest add http://localhost:3000/r/<component>.json`

## Development Guidelines

- Use Tailwind utilities and existing theme tokens; avoid hard-coded color values.
- Keep functions small and focused; use meaningful names.
- Match existing code style and formatting. If unsure, align to nearby code.
- Avoid introducing unused dependencies.

## Scripts

- `dev`: start Next.js dev server
- `build`: production build
- `start`: run production server

## Docs and Content Contributions

- Add or edit MDX docs under `content/docs`.
- Ensure frontmatter and structure follow existing examples.
- For new components or demos, keep examples minimal and focused.

## Submitting Changes

1. Create a feature branch from `main`.
2. Make your changes with small, focused commits.
3. Verify locally:
   - `npm run build` completes successfully
   - `npm run dev` starts without runtime or TypeScript errors
   - Relevant routes (home, docs, affected pages) render as expected
4. Open a pull request:
   - Provide a clear title and description of the change and motivation
   - Include screenshots for UI changes when applicable
   - Note any migrations or breaking changes

## Code Reviews

- Keep PRs small and self-contained when possible.
- Address review feedback with follow-up commits (avoid force-pushing unless necessary).
- If a discussion stalls, summarize options and propose a decision to move forward.

## Reporting Issues

When filing an issue, include:

- What you expected to happen vs. what happened
- Steps to reproduce
- Environment details (OS, Node version, browser)
- Logs or stack traces if available

## License

Unless otherwise stated, contributions to this repository are made under the same license as the repository.

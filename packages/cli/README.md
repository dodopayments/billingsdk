# Billing SDK CLI

A command-line tool for managing billing components and framework integration. Built with TypeScript and designed to work seamlessly with React, Next.js, Express.js, and Hono.

## Installation

The CLI can be used directly with `npx` without installation:

```bash
npx @billingsdk/cli --help
```

This command provides two setup options:
- **UI Components**: Sets up shadcn/ui components
- **Framework Setup**: Configures your framework (Next.js, Express.js, React, or Hono) with Dodo Payments (and Stripe for Express/Hono)

## Quick Start

### Initialize a New Project

```bash
npx @billingsdk/cli init
```

This interactive command will:
- Automatically detect your framework (Next.js, Express.js, React, or Hono) from your project dependencies
- Guide you through framework selection if auto-detection fails or you prefer manual selection
- Help you choose a payment provider: Dodo Payments (all frameworks) or Stripe (Express/Hono only)
- Set up complete project structure with API routes (for full-stack frameworks) or hooks/utilities (for React)
- Install all necessary dependencies
- Generate configuration files and boilerplate code

### Non-interactive flags

```bash
# fully non-interactive
npx @billingsdk/cli init --framework nextjs --provider dodopayments --yes

# point to local built templates
BILLINGSDK_REGISTRY_BASE=file://$PWD/public/tr \
  npx @billingsdk/cli init --framework express --provider dodopayments --yes --cwd /tmp/my-app

# skip dependency installation
npx @billingsdk/cli init --framework hono --provider stripe --yes --no-install

# dry-run with verbose output and custom package manager
npx @billingsdk/cli init --framework nextjs --provider dodopayments --yes --dry-run --verbose --package-manager pnpm
```

Flags:
- `--framework <nextjs|express|react|fastify|hono>`
- `--provider <dodopayments|stripe>` (Stripe valid for Express/Hono)
- `--yes` skip prompts
- `--no-install` skip dependency installation
- `--registry-base <url>` override template base (env: `BILLINGSDK_REGISTRY_BASE`)
- `--cwd <path>` operate in a different directory
- `--force` overwrite files without prompt
- `--dry-run` print actions without writing files or installing
- `--verbose` show registry URL, placement, and actions
- `--package-manager <npm|pnpm|yarn|bun>` choose installer

### Add Components

```bash
# Add a pricing table
npx @billingsdk/cli add pricing-table-one

# Add subscription management
npx @billingsdk/cli add subscription-management

# Add usage monitoring
npx @billingsdk/cli add usage-meter-circle
```

## Commands

### `@billingsdk/cli init`

Initialize a new billing project with complete setup.

**Options:**
- Automatic framework detection (Next.js, Express.js, React, Hono) from project dependencies
- Interactive framework selection as fallback or when preferred
- Payment provider configuration (Stripe offered for Express/Hono; Dodo for all)
- Automatic dependency installation
- Template-based file generation


### `@billingsdk/cli add <component>`

Add individual billing components to your existing project.

**Examples:**
```bash
npx @billingsdk/cli add pricing-table-one
npx @billingsdk/cli add subscription-management
npx @billingsdk/cli add usage-meter-circle
```

## Supported Frameworks & Providers

### Frameworks

The CLI automatically detects your framework based on your project dependencies and configuration files:

- ✅ **Next.js** (App Router) - Fully supported
  - Detected by: `next` dependency, `next.config.*` files, or `.next` directory
- ✅ **Express.js** - Fully supported
  - Detected by: `express` dependency
- ✅ **React** - Fully supported (hooks and utilities)
  - Detected by: `react` dependency
- ✅ **Hono** - Fully supported
- ✅ **Fastify** - Partially supported

**Auto-Detection Process:**
1. Scans your `package.json` for framework-specific dependencies
2. Checks for framework configuration files in your project root
3. Presents detected framework as the default option during setup
4. Falls back to manual selection if no framework is detected

### Payment Providers
- ✅ **Dodo Payments** - Fully supported
- ✅ **Stripe** - Supported for Express.js and Hono (Next.js/React coming soon)
- 🚧 **Additional providers** - Based on community demand

## Development / Local Setup / Testing

### Build transport templates (for local testing)

```bash
cd packages/cli && npm run build
```

### Local linking workflow (optional)

```bash
# 1) Run the docs site locally (serves transports at `http://localhost:3000/tr`)

npm run dev
```

```bash
# 2) Build the CLI and link it for development

cd packages/cli && npm run build && npm link
```

```bash
# 3) In another project, run the linked CLI

BILLINGSDK_REGISTRY_BASE=http://localhost:3000/tr npx @billingsdk/cli init --framework express --provider dodopayments --yes
```
### Building the CLI

```bash
cd packages/cli
npm run build
```

### Development Mode

```bash
cd packages/cli
npm run dev
```

## Troubleshooting

### Common Issues

**Command not found**
```bash
# Ensure you're using npx correctly
npx @billingsdk/cli --help
```

**Permission errors**
```bash
# On Unix systems
chmod +x node_modules/.bin/@billingsdk/cli
```

#### Transport not found
```bash
# Build transports locally, then point CLI at file:// registry
node packages/cli/dist/index.js build
BILLINGSDK_REGISTRY_BASE=file://$PWD/public/tr node packages/cli/dist/index.js init --framework express --provider dodopayments --yes --cwd /tmp/app
```

### Getting Help

```bash
# Show all commands
npx @billingsdk/cli --help

# Get help for specific command
npx @billingsdk/cli init --help
```

## Contributing

The CLI is part of the Billing SDK monorepo. See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for development setup and contribution guidelines.

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Export the command from `src/index.ts`
3. Update this README with documentation

### Adding New Components

1. Add component templates to `packages/templates/`
2. Update the registry configuration
3. Run `@billingsdk/cli build` from project root to generate new registry files

## License

This project is licensed under the GNU General Public License (GPL). See the main [LICENSE](../LICENSE) file for details.

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

**Generated Structures:**

*Next.js (App Router):*
```
your-project/
├── app/api/(dodopayments)/
│   ├── checkout/route.ts
│   ├── customer/route.ts
│   ├── products/route.ts
│   └── webhook/route.ts
├── hooks/
│   └── useBilling.ts
├── lib/
│   └── dodopayments.ts
└── .env.example
```

*Express.js:*
```
your-project/
├── src/
│   ├── lib/
│   │   └── dodopayments.ts
│   └── routes/
│       └── dodopayments/
│           ├── checkout.ts
│           ├── customer.ts
│           ├── payments.ts
│           ├── products.ts
│           ├── subscriptions.ts
│           └── webhook.ts
├── .env.example
└── package.json
```

*React (Client-side only):*
```
your-project/
├── hooks/
│   └── useBilling.ts
├── lib/
│   └── dodopayments.ts
└── .env.example
```

*Hono:*
```
your-project/
├── src/
│   ├── lib/
│   │   └── dodopayments.ts
│   └── routes/
│       ├── route.ts
│       └── dodopayments/
│           ├── checkout.ts
│           ├── customer.ts
│           ├── payments.ts
│           ├── products.ts
│           ├── subscriptions.ts
│           └── webhook.ts
├── .env.example
└── package.json
```

### `@billingsdk/cli add <component>`

Add individual billing components to your existing project.

**Examples:**
```bash
npx @billingsdk/cli add pricing-table-one
npx @billingsdk/cli add subscription-management
npx @billingsdk/cli add usage-meter-circle
```


## Configuration

### Environment Variables

After running `init`, configure your environment:

```bash
# Copy the generated .env.example to .env.local
cp .env.example .env.local

# Add your Dodo Payments credentials
DODO_PAYMENTS_API_KEY=your_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Dependencies Installed

The CLI installs dependencies based on your selections:
- Dodo Payments: `dodopayments`, `standardwebhooks`, `zod` (plus framework libs)
- Stripe (Express/Hono only): `stripe`, `standardwebhooks`, `zod` (plus framework libs)

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

**Auto-Detection Process:**
1. Scans your `package.json` for framework-specific dependencies
2. Checks for framework configuration files in your project root
3. Presents detected framework as the default option during setup
4. Falls back to manual selection if no framework is detected

### Payment Providers
- ✅ **Dodo Payments** - Fully supported
- ✅ **Stripe** - Supported for Express.js and Hono (Next.js/React coming soon)
- 🚧 **Additional providers** - Based on community demand

## Development

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

**Network issues**
```bash
# Check internet connection
# CLI downloads templates from @billingsdk/cli.com
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
3. Run `@billingsdk/cli build` to generate new registry files

## License

This project is licensed under the GNU General Public License (GPL). See the main [LICENSE](../LICENSE) file for details.

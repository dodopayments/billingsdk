# Billing SDK CLI

A command-line tool for managing billing components and framework integration. Built with TypeScript and designed to work seamlessly with React, Next.js, Express.js, and other popular frameworks.

## Installation

The CLI can be used directly with `npx` without installation:

```bash
npx @billingsdk/cli --help
```

This command provides two setup options:

- **UI Components**: Sets up shadcn/ui components
- **Framework Setup**: Configures your framework (Next.js, Express.js, or React) with payment provider integration

## Quick Start

### Initialize a New Project

```bash
npx @billingsdk/cli init
```

This interactive command will:

- Automatically detect your framework (Next.js, Express.js, or React) from your project dependencies
- Guide you through framework selection if auto-detection fails or you prefer manual selection
- Help you choose a payment provider (Dodo Payments or PayPal)
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

- Automatic framework detection (Next.js, Express.js, or React) from project dependencies
- Interactive framework selection as fallback or when preferred
- Payment provider configuration (Dodo Payments or PayPal)
- Automatic dependency installation
- Template-based file generation
- `--skip-deps` - Skip automatic dependency installation (useful for troubleshooting)

**Generated Structures:**

*Next.js (App Router):*

```
your-project/
├── app/api/(provider)/
│   ├── checkout/route.ts
│   ├── order/[orderId]/route.ts
│   ├── order/capture/route.ts
│   └── webhook/route.ts
├── hooks/
│   └── useBilling.ts (or usePayPal.ts)
├── lib/
│   └── provider.ts (dodopayments.ts or paypal.ts)
└── .env.example
```

*Express.js:*

```
your-project/
├── src/
│   ├── lib/
│   │   └── provider.ts (dodopayments.ts or paypal.ts)
│   └── routes/
│       └── provider/
│           ├── checkout.ts
│           ├── order.ts
│           ├── route.ts
│           └── webhook.ts
├── .env.example
└── package.json
```

*React (Client-side only):*

```
your-project/
├── hooks/
│   └── useBilling.ts (or usePayPal.ts)
├── lib/
│   └── provider.ts (dodopayments.ts or paypal.ts)
└── .env.example
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

# For Dodo Payments
DODO_PAYMENTS_API_KEY=your_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_webhook_secret_here

# For PayPal
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_WEBHOOK_ID=your_webhook_id_here
PAYPAL_ENV=sandbox # or live

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Dependencies Installed

The CLI automatically installs:

- `dodopayments` - Payment processing library (when Dodo Payments selected)
- `@paypal/paypal-server-sdk` - PayPal SDK (when PayPal selected)
- `standardwebhooks` - Webhook verification
- `zod` - TypeScript schema validation

## Supported Frameworks & Providers

### Frameworks

The CLI automatically detects your framework based on your project dependencies and configuration files:

- ✅ **Next.js** (App Router) - Fully supported
  - Detected by: `next` dependency, `next.config.*` files, or `.next` directory
- ✅ **Express.js** - Fully supported
  - Detected by: `express` dependency
- ✅ **React** - Fully supported (hooks and utilities)
  - Detected by: `react` dependency
- 🚧 **Hono** - Coming soon

**Auto-Detection Process:**

1. Scans your `package.json` for framework-specific dependencies
2. Checks for framework configuration files in your project root
3. Presents detected framework as the default option during setup
4. Falls back to manual selection if no framework is detected

### Payment Providers

- ✅ **Dodo Payments** - Fully supported
- ✅ **PayPal** - Fully supported
- 🚧 **Stripe** - Coming soon
- 🚧 **Additional providers** - Based on community demand

## Troubleshooting

### Dependency Installation Issues

If you encounter issues with automatic dependency installation (particularly on Windows), you can:

1. Skip automatic installation and install dependencies manually:

   ```bash
   npx @billingsdk/cli init --skip-deps
   # Then manually install dependencies as instructed
   ```

2. Set an environment variable to skip installation:

   ```bash
   BILLINGSDK_SKIP_INSTALL=1 npx @billingsdk/cli init
   ```

3. Ensure your package manager (npm, yarn, pnpm, bun) is properly installed and in your system PATH

### Common Issues

**Command not found**

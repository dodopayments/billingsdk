# Billing SDK CLI

A command-line tool for managing billing components and framework integration. Built with TypeScript and designed to work seamlessly with React and Next.js applications.

## Installation

The CLI can be used directly with `npx` without installation:

```bash
npx @billingsdk/cli --help
```

This command provides two setup options:
- **UI Components**: Sets up shadcn/ui components
- **Framework Setup**: Configures Next.js with Dopayments integration

## Quick Start

### Initialize a New Project

```bash
npx @billingsdk/cli init
```

This interactive command will:
- Guide you through framework selection (Next.js)
- Help you choose a payment provider (Dodo Payments)
- Set up complete project structure with API routes
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
- Interactive framework selection
- Payment provider configuration
- Automatic dependency installation
- Template-based file generation

**Generated Structure for Next.js (app router):**
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

The CLI automatically installs:
- `dodopayments` - Payment processing library
- `standardwebhooks` - Webhook verification
- `zod` - TypeScript schema validation

## Supported Frameworks & Providers

### Frameworks
- ✅ **Next.js** (App Router) - Fully supported
- 🚧 **Express.js** - Coming soon
- 🚧 **Hono** - Coming soon

### Payment Providers
- ✅ **Dodo Payments** - Fully supported
- 🚧 **Stripe** - Coming soon
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

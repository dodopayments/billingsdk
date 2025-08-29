# Billing SDK CLI

A command-line tool for managing billing components and framework integration.

## Commands

### init

Initialize a new billing project with component setup and framework integration.

```bash
npx billingsdk init
```

This command provides two setup options:
- **UI Components**: Sets up shadcn/ui components
- **Framework Setup**: Configures Next.js with Dopayments integration

### add

Add billing components to your existing project.

```bash
npx billingsdk add <component>
```

Example:
```bash
npx billingsdk add pricing-table
npx billingsdk add subscription-management
```

### build

Build the component registry for distribution.

```bash
npx billingsdk build
```

## Usage Examples

1. **Initialize a new project**:
   ```bash
   npx billingsdk init
   ```

2. **Add a pricing table component**:
   ```bash
   npx billingsdk add pricing-table
   ```

3. **Build registry for distribution**:
   ```bash
   npx billingsdk build
   ```

## Supported Frameworks

- Next.js

## Supported Providers

- Dopayments

## Development

### Building the CLI

```bash
npm run build
```

### Development mode

```bash
npm run dev
```

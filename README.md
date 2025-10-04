# Billing SDK

<p align="center">
  <img
    src="https://github.com//dodopayments/billingsdk/blob/main/.github/images/billingsdk-cover.webp?raw=true"
    alt="Billing SDK Cover"
    width="900"
    height="320"
    style="max-width: 100%; height: auto; border-radius: 0.5rem;"
    loading="lazy"
  />
</p>

<p align="center">
  <a href="https://github.com/dodopayments/billingsdk/stargazers">
    <img src="https://img.shields.io/github/stars/dodopayments/billingsdk?style=social" alt="GitHub stars" />
  </a>
  <a href="https://discord.gg/bYqAp4ayYh">
    <img src="https://img.shields.io/discord/1305511580854779984?label=Join%20Discord&logo=discord" alt="Join Discord" />
  </a>
  <a href="https://twitter.com/dodopayments">
    <img src="https://img.shields.io/twitter/follow/dodopayments?label=Follow&style=social" alt="Twitter Follow" />
  </a>
  <img src="https://img.shields.io/github/license/dodopayments/billingsdk" alt="License" />
</p>


Modern, type-safe billing and subscription management components for React, built with TypeScript and Tailwind CSS. Designed to work seamlessly alongside shadcn/ui.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Components](#components)
- [Quick Example](#quick-example)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation in Your Project](#installation-in-your-project)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Star History](#star-history)
- [License](#license)

## Overview

Billing SDK provides production-ready UI building blocks for pricing, usage, and subscription workflows. Drop them into your app, wire up your data, and ship faster with consistent UX.

## Features

- **Ready-to-use components**: End-to-end billing and subscription building blocks
- **Multiple themes**: Classic, Minimal, and custom theme tokens
- **Responsive by default**: Optimized for mobile, tablet, and desktop
- **TypeScript-first**: Strongly typed props for safe composition
- **Easy integration**: One-command install via CLI or shadcn/ui registry

## Components

- **Pricing Tables**: Multiple variants for different use cases
- **Subscription Management**: Manage plans, status, and details
- **Usage Meters**: Linear and circular quota indicators
- **Banner Notifications**: Announcements and promotional banners
- **Plan Updates**: Upgrade/downgrade flows with clear affordances
- **Cancellation Flow**: Guided cancellation with retention patterns

### Quick Example

```tsx
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";

const plans = [
  {
    id: "starter",
    title: "Starter",
    price: 9,
    period: "month",
    features: ["100 requests", "Basic support", "1 project"],
    popular: false,
  },
  {
    id: "pro",
    title: "Pro",
    price: 29,
    period: "month",
    features: ["Unlimited requests", "Priority support", "10 projects"],
    popular: true,
  },
];

export default function App() {
  return (
    <PricingTableOne
      plans={plans}
      title="Choose your plan"
      description="Select the plan that works best for you"
      onPlanSelect={(planId) => {
        console.log("Selected plan:", planId);
      }}
      theme="classic"
      size="medium"
    />
  );
}
```

## Tech Stack

- **Runtime**: React 19, Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **Animation**: Motion

## Quick Start

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open `http://localhost:3000`

### Installation in Your Project

#### Using CLI (Recommended)

For complete project setup with framework integration:

```bash
# Initialize billing to a new project
npx @billingsdk/cli init

# Add individual components
npx @billingsdk/cli add pricing-table-one
```

#### Manual Installation

Add Billing SDK components to your existing shadcn/ui project:

```bash
npx shadcn@latest add @billingsdk/[component-name]
```

## Documentation

Explore docs, guides and interactive examples:

[billingsdk.com/docs](https://billingsdk.com/docs)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, project structure, and contribution guidelines.

## Contributors

Thanks to all our amazing contributors for their support and code!

<a href="https://github.com/dodopayments/billingsdk/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=dodopayments/billingsdk" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dodopayments/billingsdk&type=Date)](https://star-history.com/#dodopayments/billingsdk&Date)

## License

This project is licensed under the GNU General Public License (GPL), which allows you to use, modify, and distribute the software freely, provided that any derivative works are also distributed under the same license.

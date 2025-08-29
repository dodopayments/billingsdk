# Billing SDK
[![GitHub stars](https://img.shields.io/github/stars/dodopayments/billingsdk?style=social)](https://github.com/dodopayments/billingsdk/stargazers)
[![Discord](https://img.shields.io/badge/chat-on%20discord-7289DA.svg)](https://discord.gg/bYqAp4ayYh)
[![Twitter Follow](https://img.shields.io/twitter/follow/dodopayments?label=Follow&style=social)](https://twitter.com/dodopayments)
![License](https://img.shields.io/github/license/dodopayments/billingsdk)


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
- [License](#license)

## Overview

Billing SDK provides production-ready UI building blocks for pricing, usage, and subscription workflows. Drop them into your app, wire up your data, and ship faster with consistent UX.

## Features

- **Ready-to-use components**: End-to-end billing and subscription building blocks
- **Multiple themes**: Classic, Minimal, and custom theme tokens
- **Responsive by default**: Optimized for mobile, tablet, and desktop
- **TypeScript-first**: Strongly typed props for safe composition
- **Easy integration**: One-command install via shadcn/ui registry

## Components

- **Payment Method Manager**: Manage credit cards and ACH accounts for billing. [Docs](https://billingsdk.com/docs/components/payment-method-manager)
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

Add Billing SDK components to your existing shadcn/ui project:

```bash
npx shadcn@latest add https://billingsdk.com/r/[component-name].json
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

## License

This project is licensed under the GNU General Public License (GPL), which allows you to use, modify, and distribute the software freely, provided that any derivative works are also distributed under the same license.

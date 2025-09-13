# Express.js PayPal Template

This template provides a complete PayPal integration for Express.js applications.

## Setup

1. Install the required dependencies:

   ```bash
   npm install
   ```

2. Copy the `.env.example` file to `.env` and configure the environment variables:

   ```bash
   cp .env.example .env
   ```

3. Configure the following environment variables in your `.env` file:
   - `PAYPAL_CLIENT_ID` - Your PayPal client ID
   - `PAYPAL_CLIENT_SECRET` - Your PayPal client secret
   - `PAYPAL_ENV` - Either 'sandbox' or 'live'
   - `PAYPAL_WEBHOOK_ID` - Your PayPal webhook ID
   - `NEXT_PUBLIC_APP_URL` - Your application's base URL

## Dependencies

This template requires the following npm packages:

- `@paypal/paypal-server-sdk` - PayPal's official Node.js SDK
- `express` - Web framework
- `standardwebhooks` - Webhook verification utilities
- `zod` - Schema validation

All dependencies are listed in the `package.json` file.

## Usage

The template includes:

- PayPal client initialization in [lib/paypal.ts](src/lib/paypal.ts)
- API routes for checkout, order capture, and order retrieval
- Webhook handling for PayPal events

To start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

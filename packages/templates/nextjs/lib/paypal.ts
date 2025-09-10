// File: packages/templates/nextjs/lib/paypal.ts

// Ensure this module is server-only in Next.js
import 'server-only';
import * as paypal from '@paypal/checkout-server-sdk';

declare global {
  // eslint-disable-next-line no-var
  var __paypalClient: paypal.core.PayPalHttpClient | undefined;
}

export function getPayPalClient(): paypal.core.PayPalHttpClient {
  if (!globalThis.__paypalClient) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error(
        'Missing PayPal credentials: set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env'
      );
    }
    const env = (process.env.PAYPAL_ENV ?? 'sandbox').toLowerCase();
    const environment =
      env === 'live'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    globalThis.__paypalClient = new paypal.core.PayPalHttpClient(environment);
  }
  return globalThis.__paypalClient;
}

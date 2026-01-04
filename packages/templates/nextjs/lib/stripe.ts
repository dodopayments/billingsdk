import Stripe from "stripe";
import { z } from 'zod';

const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required').startsWith('sk_', {
    message: 'STRIPE_SECRET_KEY must start with "sk_"'
  }),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required').startsWith('whsec_', {
    message: 'STRIPE_WEBHOOK_SECRET must start with "whsec_"'
  }),
});

// Validate environment variables at module load time (fails fast!)
function validateStripeEnv() {
  const result = stripeEnvSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n');
    throw new Error(`Stripe environment validation failed: ${errors}

Please check:
1. Your .env.local file exists in the project root
2. All required variables are set correctly
3. You've restarted your development server
4. No extra quotes or spaces in the .env.local file

Required variables:
- STRIPE_SECRET_KEY: Your Stripe secret key (starts with sk_)
- STRIPE_WEBHOOK_SECRET: Your Stripe webhook secret (starts with whsec_)
    `);
  }
  
  return result.data;
}

// Validate once at module load
const validatedEnv = validateStripeEnv();

// Export for use in webhook handlers
export { validatedEnv };

let _stripe: Stripe | null = null;
export const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(validatedEnv.STRIPE_SECRET_KEY, {});
  }
  return _stripe;
};

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;

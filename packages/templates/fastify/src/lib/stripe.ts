import Stripe from "stripe";

let _stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(`
      STRIPE_SECRET_KEY environment variable is missing.
      
      Please check:
      1. Your .env file exists in the project root
      2. The file contains: STRIPE_SECRET_KEY=<your-secret-key>
      3. You've restarted your development server
      4. No extra quotes or spaces in the .env file
    `);
  }

  if (!_stripe) {
    _stripe = new Stripe(key);
  }
  return _stripe;
};

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;

import Stripe from "stripe";

let _stripe: Stripe | null = null;
export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
  }
  return _stripe;
};
export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;

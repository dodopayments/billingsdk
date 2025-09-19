import Stripe from "stripe";

let _stripe: Stripe | null = null;
export const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) {
    _stripe = new Stripe(key, {});
  }
  return _stripe;
};

const stripe = getStripe();

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;

export async function getProducts(): Promise<Product[]> {
  const { data } = await stripe.products.list({ limit: 100 });
  return data;
}

export async function getProduct(product_id: string): Promise<Product> {
  return await stripe.products.retrieve(product_id);
}

export async function getCustomer(
  customer_id: string
): Promise<Customer | Stripe.DeletedCustomer> {
  const customer = await stripe.customers.retrieve(customer_id);
  return customer;
}

export async function createCustomer(
  params: Stripe.CustomerCreateParams
): Promise<Customer> {
  return await stripe.customers.create(params);
}

export async function updateCustomer(
  customer_id: string,
  params: Stripe.CustomerUpdateParams
): Promise<Customer> {
  return await stripe.customers.update(customer_id, params);
}

export async function getCustomerSubscriptions(
  customer_id: string
): Promise<Subscription[]> {
  const { data } = await stripe.subscriptions.list({ customer: customer_id });
  return data;
}

export async function getCustomerPayments(
  customer_id: string
): Promise<PaymentIntent[]> {
  const { data } = await stripe.paymentIntents.list({
    customer: customer_id,
    limit: 100,
  });
  return data;
}

export async function createCheckoutSession(opts: {
  price_id: string;
  customer_id?: string;
  success_url: string;
  cancel_url: string;
}): Promise<{ checkout_url: string }> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: opts.price_id, quantity: 1 }],
    customer: opts.customer_id ?? undefined,
    success_url: opts.success_url,
    cancel_url: opts.cancel_url,
  });
  return { checkout_url: session.url! };
}

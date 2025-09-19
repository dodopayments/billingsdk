import Stripe from 'stripe';

let _stripe: Stripe | null = null;
export const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      
    });
  }
  return _stripe;
};

const stripe = getStripe();

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;


export const getProducts = async (): Promise<Product[]> => {
  const { data } = await stripe.products.list({ limit: 100 });
  return data;
};

export const getProduct = async (product_id: string): Promise<Product> => {
  return await stripe.products.retrieve(product_id);
};


export const getCustomer = async (customer_id: string): Promise<Customer> => {
  const customer = await stripe.customers.retrieve(customer_id);
  if ((customer as Stripe.DeletedCustomer).deleted) {
    throw new Error(`Customer with id ${customer_id} is deleted.`);
  }
  return customer as Customer;
};

export const createCustomer = async (
  customer: Stripe.CustomerCreateParams
): Promise<Customer> => {
  return await stripe.customers.create(customer);
};

export const updateCustomer = async (
  customer_id: string,
  customer: Stripe.CustomerUpdateParams
): Promise<Customer> => {
  return await stripe.customers.update(customer_id, customer);
};


export const getCustomerSubscriptions = async (
  customer_id: string
): Promise<Subscription[]> => {
  const { data } = await stripe.subscriptions.list({
    customer: customer_id,
  });
  return data;
};


export const getCustomerPayments = async (
  customer_id: string
): Promise<PaymentIntent[]> => {
  const { data } = await stripe.paymentIntents.list({
    customer: customer_id,
    limit: 100,
  });
  return data;
};


export const checkout = async ({
  product_id,
  customer_id,
  success_url,
  cancel_url,
}: {
  product_id: string;
  customer_id?: string;
  success_url: string;
  cancel_url: string;
}): Promise<{ checkout_url: string }> => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // or "payment" for one-time
    line_items: [{ price: product_id, quantity: 1 }],
    customer: customer_id,
    success_url,
    cancel_url,
  });

  return { checkout_url: session.url! };
};
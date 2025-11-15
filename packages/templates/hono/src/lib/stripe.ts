import Stripe from 'stripe';
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
    throw new Error(` Stripe environment validation failed: ${errors}

Please check:
1. Your .env file exists in the project root
2. All required variables are set correctly
3. You've restarted your development server
4. No extra quotes or spaces in the .env file

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
    _stripe = new Stripe(validatedEnv.STRIPE_SECRET_KEY, {

    });
  }
  return _stripe;
};

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;


export async function getProducts(): Promise<Product[]> {
  try {
    const stripe = getStripe();
    const { data } = await stripe.products.list({ limit: 100 });
    return data;
  } catch (error) {
    console.error('Error fetching products', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProduct(product_id: string): Promise<Product> {
  try {
    const stripe = getStripe();
    return await stripe.products.retrieve(product_id);
  } catch (error) {
    console.error('Error fetching product', error);
    throw new Error('Failed to fetch product');
  }
}


export async function getCustomer(customer_id: string): Promise<Customer | Stripe.DeletedCustomer> {
  try {
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customer_id);

    if ((customer as Stripe.DeletedCustomer).deleted) {
      return customer as Stripe.DeletedCustomer;
    }
    return customer as Customer;
  } catch (error) {
    console.error('Error fetching customer', error);
    throw new Error('Failed to fetch customer');
  }
}

export async function createCustomer(params: Stripe.CustomerCreateParams): Promise<Customer> {
  try {
    const stripe = getStripe();
    return await stripe.customers.create(params);
  } catch (error) {
    console.error('Error creating customer', error);
    throw new Error('Failed to create customer');
  }
}

export async function updateCustomer(customer_id: string, params: Stripe.CustomerUpdateParams): Promise<Customer> {
  try {
    const stripe = getStripe();
    return await stripe.customers.update(customer_id, params);
  } catch (error) {
    console.error('Error updating customer', error);
    throw new Error('Failed to update customer');
  }
}


export async function getCustomerSubscriptions(customer_id: string): Promise<Subscription[]> {
  try {
    const stripe = getStripe();
    const { data } = await stripe.subscriptions.list({ customer: customer_id });
    return data;
  } catch (error) {
    console.error('Error fetching subscriptions', error);
    throw new Error('Failed to fetch subscriptions');
  }
}


export async function getCustomerPayments(customer_id: string): Promise<PaymentIntent[]> {
  try {
    const stripe = getStripe();
    const { data } = await stripe.paymentIntents.list({ customer: customer_id, limit: 100 });
    return data;
  } catch (error) {
    console.error('Error fetching payments', error);
    throw new Error('Failed to fetch payments');
  }
}


export async function checkout(opts: {
  price_id: string;
  customer_id?: string;
  success_url: string;
  cancel_url: string;
}): Promise<{ checkout_url: string }> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: opts.price_id, quantity: 1 }],
      customer: opts.customer_id ?? '',
      success_url: opts.success_url,
      cancel_url: opts.cancel_url,
    });
    return { checkout_url: session.url! };
  } catch (error) {
    console.error('Error creating checkout session', error);
    throw new Error('Failed to create checkout session');
  }
}


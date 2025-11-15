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
    _stripe = new Stripe(validatedEnv.STRIPE_SECRET_KEY, {
      
    });
  }
  return _stripe;
};


export const getProducts = async ({ baseUrl }: { baseUrl?: string }): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>> => {
  try {
    const response = await fetch(`${baseUrl}/api/products`)

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProduct = async ({ baseUrl, product_id }: { baseUrl?: string, product_id: string }): Promise<Stripe.Product> => {
  try {
    const response = await fetch(`${baseUrl}/api/product?product_id=${product_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const getCustomer = async ({ baseUrl, customer_id }: { baseUrl?: string, customer_id: string }): Promise<Stripe.Customer> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
}

export const getCustomerSubscriptions = async ({ baseUrl, customer_id }: { baseUrl?: string, customer_id: string }): Promise<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer/subscriptions?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer subscriptions: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error)
    throw error
  }
}

export const getCustomerPayments = async ({ baseUrl, customer_id }: { baseUrl?: string, customer_id: string }): Promise<Stripe.PaymentIntent[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer/payments?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer payments: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer payments:', error)
    throw error
  }
}

export const createCustomer = async ({ baseUrl, customer }: { baseUrl?: string, customer: { email: string; name: string; phone_number?: string | null } }): Promise<Stripe.Customer> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    })

    if (!response.ok) {
      throw new Error(`Failed to create customer: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export const updateCustomer = async ({ baseUrl, customer_id, customer }: { baseUrl?: string, customer_id: string, customer: { name?: string | null; phone_number?: string | null } }): Promise<Stripe.Customer> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer?customer_id=${customer_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    })

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export const checkout = async ({ baseUrl, productCart, customer, return_url, metadata }: { baseUrl?: string, productCart: Array<{ name: string; quantity: number; amount: number }>, customer: { email: string; name: string }, return_url: string, metadata?: Record<string, string> }): Promise<{ url: string }> => {
  try {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productCart, customer, return_url, metadata }),
    })

    if (!response.ok) {
      throw new Error(`Failed to checkout: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error checking out:', error)
    throw error
  }
}
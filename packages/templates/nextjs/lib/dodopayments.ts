import { DodoPayments } from "dodopayments";
import { z } from 'zod'

type Product = DodoPayments.Product;

const dodoPaymentsEnvSchema = z.object({
  DODO_PAYMENTS_API_KEY: z.string().min(1, 'DODO_PAYMENTS_API_KEY is required'),
  DODO_PAYMENTS_ENVIRONMENT: z.enum(['live_mode', 'test_mode'], {
    errorMap: () => ({ message: 'DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"' })
  }),
  DODO_PAYMENTS_WEBHOOK_KEY: z.string().min(1, 'DODO_PAYMENTS_WEBHOOK_KEY is required'),
})

// Validate environment variables at module load time (fails fast!)
function validateDodoPaymentsEnv() {
  const result = dodoPaymentsEnvSchema.safeParse(process.env)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n')
    throw new Error(`DodoPayments environment validation failed: ${errors}

Please check:
1. Your .env.local file exists in the project root
2. All required variables are set correctly
3. You've restarted your development server
4. No extra quotes or spaces in the .env.local file

Required variables:
- DODO_PAYMENTS_API_KEY: Your DodoPayments API key
- DODO_PAYMENTS_ENVIRONMENT: Either "live_mode" or "test_mode"
- DODO_PAYMENTS_WEBHOOK_KEY: Your DodoPayments webhook secret key
    `)
  }
  
  return result.data
}

// Validate once at module load
const validatedEnv = validateDodoPaymentsEnv()

// Export for use in webhook handlers
export { validatedEnv }

let dodopaymentsClient: DodoPayments | null = null;

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    dodopaymentsClient = new DodoPayments({
      bearerToken: validatedEnv.DODO_PAYMENTS_API_KEY,
      environment: validatedEnv.DODO_PAYMENTS_ENVIRONMENT,
    });
  }

  return dodopaymentsClient;
}

export const getProducts = async ({
  baseUrl,
}: {
  baseUrl?: string;
}): Promise<Product[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/products`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProduct = async ({
  baseUrl,
  product_id,
}: {
  baseUrl?: string;
  product_id: string;
}): Promise<Product> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/product?product_id=${product_id}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getCustomer = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl?: string;
  customer_id: string;
}): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer?customer_id=${customer_id}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

export const getCustomerSubscriptions = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl?: string;
  customer_id: string;
}): Promise<DodoPayments.Subscriptions.Subscription[]> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer/subscriptions?customer_id=${customer_id}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer subscriptions: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    throw error;
  }
};

export const getCustomerPayments = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl?: string;
  customer_id: string;
}): Promise<DodoPayments.Payments.Payment[]> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer/payments?customer_id=${customer_id}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer payments: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching customer payments:", error);
    throw error;
  }
};

export const createCustomer = async ({
  baseUrl,
  customer,
}: {
  baseUrl?: string;
  customer: DodoPayments.Customers.CustomerCreateParams;
}): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer`, {
      method: "POST",
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create customer: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async ({
  baseUrl,
  customer_id,
  customer,
}: {
  baseUrl?: string;
  customer_id: string;
  customer: DodoPayments.Customers.CustomerUpdateParams;
}): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer?customer_id=${customer_id}`,
      {
        method: "PUT",
        body: JSON.stringify(customer),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update customer: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const checkout = async ({
  baseUrl,
  productCart,
  customer,
  billing_address,
  return_url,
  customMetadata,
}: {
  baseUrl?: string;
  productCart: Array<{ product_id: string; quantity: number; amount?: number }>;
  customer: DodoPayments.Payments.CustomerRequest;
  billing_address: DodoPayments.Payments.BillingAddress;
  return_url: string;
  customMetadata?: Record<string, string>;
}) => {
  try {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: "POST",
      body: JSON.stringify({
        productCart,
        customer,
        billing_address,
        return_url,
        customMetadata,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to checkout: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking out:", error);
    throw error;
  }
};

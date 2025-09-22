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

export const getProducts = async ({
  baseUrl,
}: {
  baseUrl?: string;
}): Promise<Product[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/products`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
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
      `${baseUrl}/api/product?product_id=${product_id}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product: ${response.status} ${response.statusText}`
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
}): Promise<Customer> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer?customer_id=${customer_id}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer: ${response.status} ${response.statusText}`
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
}): Promise<Subscription[]> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer/subscriptions?customer_id=${customer_id}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer subscriptions: ${response.status} ${response.statusText}`
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
}): Promise<PaymentIntent[]> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer/payments?customer_id=${customer_id}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer payments: ${response.status} ${response.statusText}`
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
  customer: Stripe.CustomerCreateParams;
}): Promise<Customer> => {
  try {
    const response = await fetch(`${baseUrl}/api/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create customer: ${response.status} ${response.statusText}`
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
  customer: Stripe.CustomerUpdateParams;
}): Promise<Customer> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/customer?customer_id=${customer_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update customer: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const checkout = async ({
  productCart,
  success_url,
  cancel_url,
  baseUrl,
  customer,
  metadata,
}: {
  productCart: Array<{ price_id: string; quantity: number }>;
  success_url: string;
  cancel_url: string;
  baseUrl?: string;
  customer?: {
    customer_id?: string;
    email?: string;
    name?: string;
    phone_number?: string;
  };
  metadata?: Record<string, string>;
}) => {
  try {
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productCart,
        customer,
        success_url,
        cancel_url,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to checkout: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking out:", error);
    throw error;
  }
};

import Stripe from "stripe";

export type Product = Stripe.Product;
export type Customer = Stripe.Customer;
export type Subscription = Stripe.Subscription;
export type PaymentIntent = Stripe.PaymentIntent;

export const getProducts = async ({
  baseUrl,
}: {
  baseUrl: string;
}): Promise<Product[]> => {
  const response = await fetch(`${baseUrl}/products`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const getProduct = async ({
  baseUrl,
  product_id,
}: {
  baseUrl: string;
  product_id: string;
}): Promise<Product> => {
  const response = await fetch(`${baseUrl}/product?product_id=${product_id}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const getCustomer = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string;
  customer_id: string;
}): Promise<Customer> => {
  const response = await fetch(
    `${baseUrl}/customer?customer_id=${customer_id}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch customer: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const getCustomerSubscriptions = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string;
  customer_id: string;
}): Promise<Subscription[]> => {
  const response = await fetch(
    `${baseUrl}/customer/subscriptions?customer_id=${customer_id}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch subscriptions: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const getCustomerPayments = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string;
  customer_id: string;
}): Promise<PaymentIntent[]> => {
  const response = await fetch(
    `${baseUrl}/customer/payments?customer_id=${customer_id}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch payments: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const createCustomer = async ({
  baseUrl,
  customer,
}: {
  baseUrl: string;
  customer: Stripe.CustomerCreateParams;
}): Promise<Customer> => {
  const response = await fetch(`${baseUrl}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to create customer: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const updateCustomer = async ({
  baseUrl,
  customer_id,
  customer,
}: {
  baseUrl: string;
  customer_id: string;
  customer: Stripe.CustomerUpdateParams;
}): Promise<Customer> => {
  const response = await fetch(
    `${baseUrl}/customer?customer_id=${customer_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to update customer: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const checkout = async ({
  baseUrl,
  price_id,
  customer_id,
  success_url,
  cancel_url,
}: {
  baseUrl: string;
  price_id: string;
  customer_id?: string;
  success_url: string;
  cancel_url: string;
}): Promise<{ checkout_url: string }> => {
  const response = await fetch(`${baseUrl}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price_id, customer_id, success_url, cancel_url }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to checkout: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

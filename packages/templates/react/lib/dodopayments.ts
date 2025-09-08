import { DodoPayments } from "dodopayments"

export type Product = DodoPayments.Product
export type Customer = DodoPayments.Customers.Customer
export type Subscription = DodoPayments.Subscriptions.Subscription
export type Payment = DodoPayments.Payments.Payment


export const getProducts = async ({
  baseUrl,
}: {
  baseUrl: string
}): Promise<Product[]> => {
  const response = await fetch(`${baseUrl}/products`)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const getProduct = async ({
  baseUrl,
  product_id,
}: {
  baseUrl: string
  product_id: string
}): Promise<Product> => {
  const response = await fetch(`${baseUrl}/product?product_id=${product_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const getCustomer = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string
  customer_id: string
}): Promise<Customer> => {
  const response = await fetch(`${baseUrl}/customer?customer_id=${customer_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const getCustomerSubscriptions = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string
  customer_id: string
}): Promise<Subscription[]> => {
  const response = await fetch(`${baseUrl}/customer/subscriptions?customer_id=${customer_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const getCustomerPayments = async ({
  baseUrl,
  customer_id,
}: {
  baseUrl: string
  customer_id: string
}): Promise<Payment[]> => {
  const response = await fetch(`${baseUrl}/customer/payments?customer_id=${customer_id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const createCustomer = async ({
  baseUrl,
  customer,
}: {
  baseUrl: string
  customer: DodoPayments.Customers.CustomerCreateParams
}): Promise<Customer> => {
  const response = await fetch(`${baseUrl}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  })
  if (!response.ok) {
    throw new Error(`Failed to create customer: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const updateCustomer = async ({
  baseUrl,
  customer_id,
  customer,
}: {
  baseUrl: string
  customer_id: string
  customer: DodoPayments.Customers.CustomerUpdateParams
}): Promise<Customer> => {
  const response = await fetch(`${baseUrl}/customer?customer_id=${customer_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  })
  if (!response.ok) {
    throw new Error(`Failed to update customer: ${response.status} ${response.statusText}`)
  }
  return response.json()
}


export const checkout = async ({
  baseUrl,
  productCart,
  customer,
  billing_address,
  return_url,
  customMetadata,
}: {
  baseUrl: string
  productCart: Array<{ product_id: string; quantity: number; amount?: number }>
  customer: DodoPayments.Payments.CustomerRequest
  billing_address: DodoPayments.Payments.BillingAddress
  return_url: string
  customMetadata?: Record<string, string>
}): Promise<{ checkout_url: string }> => {
  const response = await fetch(`${baseUrl}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productCart, customer, billing_address, return_url, customMetadata }),
  })
  if (!response.ok) {
    throw new Error(`Failed to checkout: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

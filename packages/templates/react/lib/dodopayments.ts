import { DodoPayments } from 'dodopayments'
type Product = DodoPayments.Product

let dodopaymentsClient: DodoPayments | null = null

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    const token = process.env.DODO_PAYMENTS_API_KEY
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as 'live_mode' | 'test_mode'

    if (!token) {
      throw new Error('DODO_PAYMENTS_API_KEY environment variable is missing.')
    }

    if (!environment || (environment !== 'live_mode' && environment !== 'test_mode')) {
      throw new Error('DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"')
    }

    dodopaymentsClient = new DodoPayments({
      bearerToken: token,
      environment: environment,
    })
  }

  return dodopaymentsClient
}
// Base URL for backend. Path-preserving: keep `/api` suffix in the base.
// Examples:
// - Dev proxy or same-origin: VITE_API_BASE_URL not set → BASE_URL = '/api'
// - Cross-origin: VITE_API_BASE_URL = 'http://localhost:8000/api'
const BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL ?? '/api'

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${BASE_URL}/products`)
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const getProduct = async (product_id: string): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/product?product_id=${product_id}`)
  if (!response.ok) throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const getCustomer = async (customer_id: string): Promise<DodoPayments.Customers.Customer> => {
  const response = await fetch(`${BASE_URL}/customer?customer_id=${customer_id}`)
  if (!response.ok) throw new Error(`Failed to fetch customer: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const getCustomerSubscriptions = async (
  customer_id: string,
): Promise<DodoPayments.Subscriptions.Subscription[]> => {
  const response = await fetch(`${BASE_URL}/customer/subscriptions?customer_id=${customer_id}`)
  if (!response.ok) throw new Error(`Failed to fetch customer subscriptions: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const getCustomerPayments = async (
  customer_id: string,
): Promise<DodoPayments.Payments.Payment[]> => {
  const response = await fetch(`${BASE_URL}/customer/payments?customer_id=${customer_id}`)
  if (!response.ok) throw new Error(`Failed to fetch customer payments: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const createCustomer = async (
  customer: DodoPayments.Customers.CustomerCreateParams,
): Promise<DodoPayments.Customers.Customer> => {
  const response = await fetch(`${BASE_URL}/customer`, {
    method: 'POST',
    body: JSON.stringify(customer),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`Failed to create customer: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const updateCustomer = async (
  customer_id: string,
  customer: DodoPayments.Customers.CustomerUpdateParams,
): Promise<DodoPayments.Customers.Customer> => {
  const response = await fetch(`${BASE_URL}/customer?customer_id=${customer_id}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`Failed to update customer: ${response.status} ${response.statusText}`)
  return await response.json()
}

export const checkout = async (
  productCart: Array<{ product_id: string; quantity: number; amount?: number }>,
  customer: DodoPayments.Payments.CustomerRequest,
  billing_address: DodoPayments.Payments.BillingAddress,
  return_url: string,
  customMetadata?: Record<string, string>,
) => {
  const response = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    body: JSON.stringify({ productCart, customer, billing_address, return_url, customMetadata }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`Failed to checkout: ${response.status} ${response.statusText}`)
  return await response.json()
}



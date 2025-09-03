import { DodoPayments } from 'dodopayments'
type Product = DodoPayments.Product

let dodopaymentsClient: DodoPayments | null = null

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    const token = process.env.DODO_PAYMENTS_API_KEY
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode"

    console.log('Initializing DodoPayments client...')
    console.log('Token exists:', !!token)
    console.log('Environment:', environment)

    if (!token) {
      throw new Error(`
        DODO_PAYMENTS_API_KEY environment variable is missing.
        
        Please check:
        1. Your .env.local file exists in the project root
        2. The file contains: DODO_PAYMENTS_API_KEY=<your-api-key>
        3. You've restarted your development server
        4. No extra quotes or spaces in the .env.local file
      `)
    }

    if (!environment || (environment !== "live_mode" && environment !== "test_mode")) {
      throw new Error('DODO_PAYMENTS_ENVIRONMENT must be either "live_mode" or "test_mode"')
    }

    dodopaymentsClient = new DodoPayments({
      bearerToken: token,
      environment: environment,
    })
  }

  return dodopaymentsClient
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products')

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProduct = async (product_id: string): Promise<Product> => {
  try {
    const response = await fetch(`/api/product?product_id=${product_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const getCustomer = async (customer_id: string): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch(`/api/customer?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
}

export const getCustomerSubscriptions = async (customer_id: string): Promise<DodoPayments.Subscriptions.Subscription[]> => {
  try {
    const response = await fetch(`/api/customer/subscriptions?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer subscriptions: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error)
    throw error
  }
}

export const getCustomerPayments = async (customer_id: string): Promise<DodoPayments.Payments.Payment[]> => {
  try {
    const response = await fetch(`/api/customer/payments?customer_id=${customer_id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch customer payments: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching customer payments:', error)
    throw error
  }
}

export const createCustomer = async (customer: DodoPayments.Customers.CustomerCreateParams): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch('/api/customer', {
      method: 'POST',
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

export const updateCustomer = async (customer_id: string, customer: DodoPayments.Customers.CustomerUpdateParams): Promise<DodoPayments.Customers.Customer> => {
  try {
    const response = await fetch(`/api/customer?customer_id=${customer_id}`, {
      method: 'PUT',
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

export const checkout = async (productCart: Array<{ product_id: string; quantity: number; amount?: number }>, customer: DodoPayments.Payments.CustomerRequest, billing_address: DodoPayments.Payments.BillingAddress, return_url: string, customMetadata?: Record<string, string>) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ productCart, customer, billing_address, return_url, customMetadata }),
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
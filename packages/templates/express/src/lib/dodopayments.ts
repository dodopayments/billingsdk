import { DodoPayments } from 'dodopayments'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

type Product = DodoPayments.Product

let dodopaymentsClient: DodoPayments | null = null

export function getDodoPaymentsClient(): DodoPayments {
  if (!dodopaymentsClient) {
    // Load environment variables from .env if available
    try { require('dotenv').config(); } catch (_) {}
    const token = process.env.DODO_PAYMENTS_API_KEY
    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode"

    if (process.env.NODE_ENV !== 'production') {
      const maskedToken = token ? `${token.slice(0, 4)}...${token.slice(-4)}` : 'missing'
      console.debug('Initializing DodoPayments client...')
      console.debug('Token present:', !!token ? maskedToken : 'missing')
      console.debug('Environment:', environment)
    }

    if (!token) {
      const baseMsg = 'DODO_PAYMENTS_API_KEY is missing'
      const devTips = `\nPlease check:\n1. Your .env file exists in the project root\n2. The file contains: DODO_PAYMENTS_API_KEY=<your-api-key>\n3. You've restarted your development server\n4. No extra quotes or spaces in the .env file\n`
      throw new Error(process.env.NODE_ENV === 'production' ? baseMsg : baseMsg + devTips)
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

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      })
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        error: "Query validation failed",
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      })
    }
    req.query = result.data
    next()
  }
}

export function handleDodoPaymentsError(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('DodoPayments API Error:', error)

  if (error.status) {
    return res.status(error.status).json({
      error: error.message || 'API Error'
    })
  }

  res.status(500).json({
    error: 'Internal server error'
  })
}

export const createCheckoutSession = async (
  productCart: Array<{ product_id: string; quantity: number; amount?: number }>,
  customer: DodoPayments.Payments.CustomerRequest,
  billing_address: DodoPayments.Payments.BillingAddress,
  return_url: string,
  customMetadata?: Record<string, string>
) => {
  try {
    const session = await getDodoPaymentsClient().checkoutSessions.create({
      product_cart: productCart,
      customer: customer,
      billing_address: billing_address,
      return_url: return_url,
      metadata: customMetadata,
    })
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const retrieveCustomer = async (customer_id: string): Promise<DodoPayments.Customers.Customer> => {
  try {
    const customer = await getDodoPaymentsClient().customers.retrieve(customer_id)
    return customer
  } catch (error) {
    console.error('Error retrieving customer:', error)
    throw error
  }
}

export const createCustomer = async (customer: DodoPayments.Customers.CustomerCreateParams): Promise<DodoPayments.Customers.Customer> => {
  try {
    const newCustomer = await getDodoPaymentsClient().customers.create(customer)
    return newCustomer
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export const updateCustomer = async (
  customer_id: string,
  customer: DodoPayments.Customers.CustomerUpdateParams
): Promise<DodoPayments.Customers.Customer> => {
  try {
    const updatedCustomer = await getDodoPaymentsClient().customers.update(customer_id, customer)
    return updatedCustomer
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export const listProducts = async () => {
  try {
    const products = await getDodoPaymentsClient().products.list()
    return products.items
  } catch (error) {
    console.error('Error listing products:', error)
    throw error
  }
}

export const retrieveProduct = async (product_id: string): Promise<Product> => {
  try {
    const product = await getDodoPaymentsClient().products.retrieve(product_id)
    return product
  } catch (error) {
    console.error('Error retrieving product:', error)
    throw error
  }
}

export const listCustomerSubscriptions = async (customer_id: string): Promise<DodoPayments.Subscriptions.SubscriptionListResponse[]> => {
  try {
    const subscriptions = await getDodoPaymentsClient().subscriptions.list({
      customer_id: customer_id,
    })
    return subscriptions.items || []
  } catch (error) {
    console.error('Error listing customer subscriptions:', error)
    throw error
  }
}

export const listCustomerPayments = async (customer_id: string): Promise<DodoPayments.Payments.PaymentListResponse[]> => {
  try {
    const payments = await getDodoPaymentsClient().payments.list({
      customer_id: customer_id,
    })
    return payments.items || []
  } catch (error) {
    console.error('Error listing customer payments:', error)
    throw error
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// @ts-nocheck
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

const stripe = getStripe();

export default async function checkoutRoutes(fastify: FastifyInstance) {
  const productCartItemSchema = z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    amount: z.number().int().min(0).optional(),
  })

  const attachExistingCustomerSchema = z.object({
    customer_id: z.string().min(1, 'Customer ID is required'),
  })

  const newCustomerSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(1, 'Name is required'),
    phone_number: z.string().optional().nullable(),
    create_new_customer: z.boolean().optional(),
  })

  const customerSchema = z.union([attachExistingCustomerSchema, newCustomerSchema])

  const billingAddressSchema = z.object({
    city: z.string().min(1, 'City is required'),
    country: z.string().regex(/^[A-Z]{2}$/, 'Country must be a 2-letter uppercase ISO code'),
    state: z.string().min(1, 'State is required'),
    street: z.string().min(1, 'Street address is required'),
    zipcode: z.string().min(1, 'Zipcode is required'),
  })

  const checkoutSessionSchema = z.object({
    productCart: z.array(productCartItemSchema).min(1, 'At least one product is required'),
    customer: customerSchema,
    billing_address: billingAddressSchema,
    return_url: z.string().url('Return URL must be a valid URL'),
    customMetadata: z.record(z.string(), z.string()).optional(),
  })

  fastify.post('/', async (request, reply) => {
    try {
      const validationResult = checkoutSessionSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const { productCart, customer, success_url, cancel_url, metadata } = validationResult.data;

      let customerId: string | undefined;
      if (customer && 'email' in customer) {
        const stripeCustomer = await stripe.customers.create({
          email: customer.email ?? "",
          name: customer.name ?? "",
          phone: customer.phone_number ?? "",
        });
        customerId = stripeCustomer.id;
      } else if (customer && 'customer_id' in customer) {
        customerId = customer.customer_id;
      }


      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: productCart.map(item => ({
          price: item.price_id,
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: success_url + "?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: cancel_url,

        ...(metadata ? { metadata } : {}),
      };


      if (customerId) {
        sessionParams.customer = customerId;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return reply.send({ url: session.url })
    } catch (error) {
      console.error('Stripe checkout error:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

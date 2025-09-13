import express from 'express';
import { z } from 'zod';
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

const router = express.Router();
const stripe = getStripe();


const productCartItemSchema = z.object({
  price_id: z.string().min(1, "Price ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const attachExistingCustomerSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

const newCustomerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().optional().nullable(),
  create_new_customer: z.boolean().optional(),
});

const customerSchema = z.union([attachExistingCustomerSchema, newCustomerSchema]);

const checkoutSessionSchema = z.object({
  productCart: z.array(productCartItemSchema).min(1, "At least one product is required"),
  customer: customerSchema.optional(),
  success_url: z.string().url("Success URL must be a valid URL"),
  cancel_url: z.string().url("Cancel URL must be a valid URL"),
  metadata: z.record(z.string(), z.string()).optional(),
});


router.post('/', async (req, res) => {
  try {
    const validationResult = checkoutSessionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
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

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as checkoutRouter };

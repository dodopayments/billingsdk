import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getStripe } from '../../lib/stripe';
import type { Stripe } from 'stripe';

const stripe = getStripe()

const router = new Hono()
  .get('/:payment_id',
    zValidator('param', z.object({
      payment_id: z.string(),
    }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "payment_id parameter is required",
        }, 400)
      }
    }
    ),
    async (c) => {
      try {
        const { payment_id } = c.req.valid('param');
        const payment = await stripe.paymentIntents.retrieve(payment_id);
        return c.json(payment);
      } catch (error) {
        console.error('Error fetching payment:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })
  .get('/list',
    zValidator('query', z.object({
      customer_id: z.string().optional(),
      limit: z.coerce.number().optional(),
      starting_after: z.string().optional(),
    }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "Invalid query parameters",
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { customer_id, limit, starting_after } = c.req.valid('query');

        const params: Stripe.PaymentIntentListParams = {};

        if (customer_id) {
          params.customer = customer_id;
        }
        if (limit) {
          params.limit = limit;
        }
        if (starting_after) {
          params.starting_after = starting_after;
        }

        const payments = await stripe.paymentIntents.list(params);
        return c.json(payments);
      } catch (error) {
        console.error('Error fetching payments list:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    });

export { router as paymentsRouter };

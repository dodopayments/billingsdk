import { Hono } from 'hono';
import type Stripe from 'stripe';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getStripe } from '../../lib/stripe';

const stripe = getStripe();

const router = new Hono()
  .get('/:subscription_id',
    zValidator('param', z.object({
      subscription_id: z.string(),
    }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "subscription_id parameter is required",
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { subscription_id } = c.req.valid('param');

        const subscription = await stripe.subscriptions.retrieve(subscription_id);
        return c.json(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return c.json({ error: 'Internal server error', details: (error as Error).message }, 500);
      }
    })
  .get('/list',
    zValidator('query', z.object({
      customer_id: z.string(),
      limit: z.coerce.number().optional().default(10),
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

        const params: Stripe.SubscriptionListParams = {
          customer: customer_id,
          limit: limit,
        };

        if (starting_after) {
          params.starting_after = starting_after;
        }

        const subscriptions = await stripe.subscriptions.list(params);
        return c.json(subscriptions.data); // return only the subscriptions array
      } catch (error) {
        console.error('Error fetching subscriptions list:', error);
        return c.json({ error: 'Internal server error', details: (error as Error).message }, 500);
      }
    });

export { router as subscriptionsRouter };


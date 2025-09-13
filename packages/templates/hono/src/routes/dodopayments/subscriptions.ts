import { Hono } from "hono";
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const router = new Hono()
  .get('/:subscription_id',
    zValidator('param', z.object({ subscription_id: z.string() }), (result, c) => {
      if (!result.success) {
        return c.json({ error: 'subscription_id is required' }, 400);
      }
    }),
    async (c) => {
      try {
        const { subscription_id } = c.req.valid('param');
        const subscription = await getDodoPaymentsClient().subscriptions.retrieve(subscription_id);
        return c.json(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })
  .get('/list',
    zValidator('query', z.object({
      customer_id: z.string().optional(),
      limit: z.coerce.number().optional(),
      starting_after: z.string().optional()
    })),
    async (c) => {
      try {
        const params = c.req.valid('query');

        const subscriptions = await getDodoPaymentsClient().subscriptions.list(params);
        return c.json(subscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions list:', error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    })

export { router as subscriptionsRouter };

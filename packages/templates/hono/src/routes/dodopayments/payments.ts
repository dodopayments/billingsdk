import { Hono } from 'hono';
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const router = new Hono()
  .get('/:payment_id', zValidator('param', z.object({ payment_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'payment_id is required' }, 400);
    }
  }), async (c) => {
    try {
      const { payment_id } = c.req.valid('param');
      const payment = await getDodoPaymentsClient().payments.retrieve(payment_id);
      return c.json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .get('/list', zValidator('query', z.object({
    customer_id: z.string().optional(),
    limit: z.coerce.number().optional(),
    starting_after: z.string().optional()
  })), async (c) => {
    try {
      const params = c.req.valid('query');

      const payments = await getDodoPaymentsClient().payments.list(params);
      return c.json(payments);
    } catch (error) {
      console.error('Error fetching payments list:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })

export { router as paymentsRouter };

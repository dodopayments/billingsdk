import { Hono } from 'hono';
import { getDodoPaymentsClient } from '../../lib/dodopayments';
import { zValidator } from '@hono/zod-validator';
import z from 'zod';

const router = new Hono()
  .get('/', async (c) => {
    try {
      const products = await getDodoPaymentsClient().products.list()
      return c.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .get('product', zValidator('param', z.object({ product_id: z.string() }), (result, c) => {
    if (!result.success) {
      return c.json({ error: 'product_id is required' }, 400);
    }
  }), async (c) => {
    try {
      const { product_id } = c.req.valid('param');
      const product = await getDodoPaymentsClient().products.retrieve(product_id);
      return c.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })

export { router as productsRouter };

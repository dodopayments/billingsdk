import { Hono } from 'hono';
import { getStripe } from '../../lib/stripe';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const stripe = getStripe();

const router = new Hono()
  .get('/',
    zValidator('query', z.object({
      limit: z.coerce.number().default(10).optional(),
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
        const params = c.req.valid('query');
        const products = await stripe.products.list(params);
        return c.json(products.data); // this returns only product array
      } catch (error) {
        console.error('Error fetching products:', error);
        return c.json({ error: 'Internal server error', details: (error as Error).message }, 500);
      }
    })
  .get('/product/:product_id',
    zValidator('param', z.object({
      product_id: z.string(),
    }), (result, c) => {
      if (!result.success) {
        return c.json({
          error: "product_id parameter is required",
        }, 400)
      }
    }),
    async (c) => {
      try {
        const { product_id } = c.req.valid('param');
        const product = await stripe.products.retrieve(product_id);
        return c.json(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        return c.json({ error: 'Internal server error', details: (error as Error).message }, 500);
      }
    });

export { router as productsRouter };

import express from 'express';
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

const router = express.Router();
const stripe = getStripe();


router.get('/', async (req, res) => {
  try {
    const { limit, starting_after } = req.query;

    const params: Stripe.ProductListParams = {};
    if (limit && typeof limit === 'string') {
      const parsed = parseInt(limit, 10);
      if (!isNaN(parsed)) params.limit = parsed;
    }

    if (starting_after && typeof starting_after === 'string') {
      params.starting_after = starting_after;
    }


    const products = await stripe.products.list(params);
    res.json(products.data); // this returns only product array
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});


router.get('/product', async (req, res) => {
  try {
    const { product_id } = req.query;

    if (!product_id || typeof product_id !== 'string') {
      return res.status(400).json({ error: 'product_id is required' });
    }

    const product = await stripe.products.retrieve(product_id);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
});

export { router as productsRouter };


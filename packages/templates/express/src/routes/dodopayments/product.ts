import express from 'express';
import { z } from 'zod';
import { validateQuery, retrieveProduct } from '../../lib/dodopayments';

const router = express.Router();

const productIdSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
});

router.get('/', validateQuery(productIdSchema), async (req, res, next) => {
  try {
    const { product_id } = req.query as { product_id: string };
    const product = await retrieveProduct(product_id);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;

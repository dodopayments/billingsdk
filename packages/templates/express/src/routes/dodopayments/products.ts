import express from 'express';
import { listProducts } from '../../lib/dodopayments';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

export default router;

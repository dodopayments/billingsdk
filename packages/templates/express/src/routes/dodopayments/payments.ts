import express from 'express';
import { z } from 'zod';
import { validateQuery, listCustomerPayments } from '../../lib/dodopayments';

const router = express.Router();

const paymentQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

router.get('/', validateQuery(paymentQuerySchema), async (req, res, next) => {
  try {
    const { customer_id } = req.query as { customer_id: string };
    const payments = await listCustomerPayments(customer_id);
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

export default router;

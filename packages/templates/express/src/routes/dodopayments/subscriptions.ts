import express from 'express';
import { z } from 'zod';
import { validateQuery, listCustomerSubscriptions } from '../../lib/dodopayments';

const router = express.Router();

const subscriptionQuerySchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
});

router.get('/', validateQuery(subscriptionQuerySchema), async (req, res, next) => {
  try {
    const { customer_id } = req.query as { customer_id: string };
    const authCustomerId = (req as any).user?.id ?? (req as any).auth?.userId;
    const isAdmin = (req as any).user?.roles?.includes?.('admin');
    if (!isAdmin && authCustomerId && authCustomerId !== customer_id) {
      return res.status(403).json({ error: 'Forbidden: mismatched customer_id' });
    }
    const subscriptions = await listCustomerSubscriptions(customer_id);
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
});

export default router;

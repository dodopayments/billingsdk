import express from 'express';
import cors from 'cors';
import { handleDodoPaymentsError } from '../../lib/dodopayments';

import checkoutRouter from './checkout';
import customerRouter from './customer';
import productsRouter from './products';
import productRouter from './product';
import webhookRouter from './webhook';
import paymentsRouter from './payments';
import subscriptionsRouter from './subscriptions';

const router = express.Router();

router.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'webhook-id', 'webhook-signature', 'webhook-timestamp'],
  credentials: true
}));

router.use(express.json({
  limit: '10mb',
  verify: (req: any, res, buf) => {
    if (req.originalUrl?.includes('/webhook')) {
      (req as any).rawBody = buf;
    }
  }
}));

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'dodopayments-api',
    timestamp: new Date().toISOString()
  });
});

router.use('/checkout', checkoutRouter);
router.use('/customer', customerRouter);
router.use('/products', productsRouter);
router.use('/product', productRouter);
router.use('/payments', paymentsRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/webhook', webhookRouter);

router.use(handleDodoPaymentsError);

export default router;



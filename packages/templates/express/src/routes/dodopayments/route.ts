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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0);

router.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(new Error('Origin header required'));
    if (allowedOrigins.length === 0) return callback(new Error('CORS not configured'));
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'webhook-id', 'webhook-signature', 'webhook-timestamp'],
  credentials: true
}));

router.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(new Error('Origin header required'));
    if (allowedOrigins.length === 0) return callback(new Error('CORS not configured'));
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Important: mount webhook BEFORE json parser to keep raw body intact
router.use('/webhook', webhookRouter);

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

router.use(handleDodoPaymentsError);

export default router;



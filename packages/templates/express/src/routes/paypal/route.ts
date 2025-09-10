import express from 'express';
import { checkoutRouter } from './checkout';
import { orderRouter } from './order';
import { webhookRouter } from './webhook';

const router = express.Router();
// Mount webhook route before any express.json() middleware to preserve raw body
router.use('/webhook', webhookRouter);
router.use(express.json()); // Ensure request body is parsed for other routes
router.use('/checkout', checkoutRouter);
router.use('/order', orderRouter);
export { router as paypalRouter };

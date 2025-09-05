import express from 'express';
import { checkoutRouter } from './checkout';
import { customerRouter } from './customer';
import { paymentsRouter } from './payments';
import { productsRouter } from './products';
import { productRouter } from './product';
import { subscriptionsRouter } from './subscriptions';
import { webhookRouter } from './webhook';

const router = express.Router();

router.use('/checkout', checkoutRouter);
router.use('/customer', customerRouter);
router.use('/payments', paymentsRouter);
router.use('/products', productsRouter);
router.use('/product', productRouter);
router.use('/subscriptions', subscriptionsRouter);
router.use('/webhook', webhookRouter);

export { router as dodopaymentsRouter };

import { Hono } from 'hono';
import { checkoutRouter } from './checkout';
import { customerRouter } from './customer';
import { paymentsRouter } from './payments';
import { productsRouter } from './products';
import { subscriptionsRouter } from './subscriptions';
import { webhookRouter } from './webhook';

const router = new Hono()
  .route('/checkout', checkoutRouter)
  .route('/customer', customerRouter)
  .route('/payments', paymentsRouter)
  .route('/products', productsRouter)
  .route('/subscriptions', subscriptionsRouter)
  .route('/webhook', webhookRouter);


export { router as stripeRouter };

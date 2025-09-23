import { Hono } from 'hono';
import Stripe from 'stripe';
import { getStripe } from '../../lib/stripe';

const stripe = getStripe();

const router = new Hono()
  .post('/', async (c) => {
    const rawBody = await c.req.raw.text();
    const sig = c.req.header('stripe-signature');

    if (!sig) {
      return c.json({ error: 'Missing Stripe signature' }, 400);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return c.json({ error: 'Webhook verification failed' }, 400);
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log('Subscription event:', event.type, subscription.id);
          break;
        }
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment succeeded:', paymentIntent.id, paymentIntent.amount);
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
          break;
        }
        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          console.log('Charge refunded:', charge.id, charge.amount_refunded);
          break;
        }
        default:
          console.log('Unhandled event type:', event.type);
          break;
      }

      return c.json({ message: 'Webhook processed successfully' });
    } catch (err) {
      console.error('Error handling webhook event:', err);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

export { router as webhookRouter };

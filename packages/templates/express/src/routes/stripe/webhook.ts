import express from 'express';
import Stripe from 'stripe';
import { getStripe } from '../../lib/stripe';

const router = express.Router();
const stripe = getStripe();


router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook verification failed' });
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

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as webhookRouter };

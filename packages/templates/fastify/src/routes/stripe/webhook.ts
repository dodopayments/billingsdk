// @ts-nocheck
import { FastifyInstance } from 'fastify'
import Stripe from 'stripe';
import { getStripe } from '../../lib/stripe';

const stripe = getStripe();

export default async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    // Note: To get the raw body reliably, register `fastify-raw-body` in your Fastify app:
    // await fastify.register(import('fastify-raw-body'), { field: 'rawBody', global: false, encoding: 'utf8', runFirst: true })
    // and enable it for this route via `config: { rawBody: true }`.
    config: { rawBody: true }
  }, async (request, reply) => {
    try {
      // Prefer rawBody provided by fastify-raw-body; fallback to re-serializing parsed body
      const rawBody: any = (request as any).rawBody ?? JSON.stringify(request.body ?? {})

      const sig = request.headers['stripe-signature'] as string | undefined;
      if (!sig) {
        return reply.status(400).send({ error: 'Missing Stripe signature' });
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return reply.status(400).send({ error: 'Webhook verification failed' });
      }

      // Emit logs for reference; users can replace with their business logic
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

      return reply.status(200).send({ message: 'Webhook processed successfully' })
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return reply.status(400).send({ error: 'Webhook verification failed' })
    }
  })
}

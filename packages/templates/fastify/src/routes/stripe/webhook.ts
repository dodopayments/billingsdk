import { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { getStripe } from '../../lib/stripe'

export default async function webhookRoutes(fastify: FastifyInstance) {
  const stripe = getStripe()

  fastify.post('/', {
    // Note: To get the raw body reliably, register `fastify-raw-body` in your Fastify app:
    // await fastify.register(import('fastify-raw-body'), { field: 'rawBody', global: false, encoding: 'utf8', runFirst: true })
    // and enable it for this route via `config: { rawBody: true }`.
    config: { rawBody: true }
  }, async (request, reply) => {
    try {
      // Validate webhook secret environment variable
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
      if (!webhookSecret) {
        request.log.error('STRIPE_WEBHOOK_SECRET environment variable is missing')
        return reply.status(500).send({ error: 'Webhook secret not configured' })
      }

      // Get raw body and signature from headers
      const rawBody: any = (request as any).rawBody ?? JSON.stringify(request.body ?? {})
      const sig = request.headers['stripe-signature'] as string

      if (!sig) {
        request.log.error('Missing Stripe signature header')
        return reply.status(400).send({ error: 'Missing Stripe signature' })
      }

      let event: Stripe.Event

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
      } catch (err) {
        request.log.error({ err }, 'Webhook signature verification failed')
        return reply.status(400).send({ error: 'Webhook verification failed' })
      }

      // Handle the event
      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription
            request.log.info(
              { eventType: event.type, subscriptionId: subscription.id },
              'Subscription event received'
            )
            break
          }

          case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            request.log.info(
              { paymentIntentId: paymentIntent.id, amount: paymentIntent.amount },
              'Payment succeeded'
            )
            break
          }

          case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            request.log.error(
              { 
                paymentIntentId: paymentIntent.id, 
                error: paymentIntent.last_payment_error 
              },
              'Payment failed'
            )
            break
          }

          case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge
            request.log.info(
              { chargeId: charge.id, amountRefunded: charge.amount_refunded },
              'Charge refunded'
            )
            break
          }

          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            request.log.info(
              { sessionId: session.id, customerId: session.customer },
              'Checkout session completed'
            )
            break
          }

          case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice
            request.log.info(
              { invoiceId: invoice.id, customerId: invoice.customer },
              'Invoice payment succeeded'
            )
            break
          }

          case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            request.log.error(
              { invoiceId: invoice.id, customerId: invoice.customer },
              'Invoice payment failed'
            )
            break
          }

          default:
            request.log.info({ eventType: event.type }, 'Unhandled event type received')
            break
        }

        return reply.status(200).send({ message: 'Webhook processed successfully' })
      } catch (err) {
        request.log.error({ err, eventType: event.type }, 'Error handling webhook event')
        return reply.status(500).send({ error: 'Internal server error' })
      }
    } catch (error) {
      request.log.error({ err: error }, 'Webhook processing failed')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

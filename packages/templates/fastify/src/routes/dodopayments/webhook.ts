
// @ts-nocheck
import { FastifyInstance } from 'fastify'
import { Webhook } from 'standardwebhooks'

export default async function webhookRoutes(fastify: FastifyInstance) {
  const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!)

  fastify.post('/', {
    // Note: To get the raw body reliably, register `fastify-raw-body` in your Fastify app:
    // await fastify.register(import('fastify-raw-body'), { field: 'rawBody', global: false, encoding: 'utf8', runFirst: true })
    // and enable it for this route via `config: { rawBody: true }`.
    config: { rawBody: true }
  }, async (request, reply) => {
    try {
      // Prefer rawBody provided by fastify-raw-body; fallback to re-serializing parsed body
      const rawBody: any = (request as any).rawBody ?? JSON.stringify(request.body ?? {})

      const webhookHeaders = {
        'webhook-id': (request.headers['webhook-id'] as string) || '',
        'webhook-signature': (request.headers['webhook-signature'] as string) || '',
        'webhook-timestamp': (request.headers['webhook-timestamp'] as string) || '',
      }

      await webhook.verify(rawBody, webhookHeaders)
      const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : request.body

      // Emit logs for reference; users can replace with their business logic
      if (payload.data.payload_type === 'Subscription') {
        switch (payload.type) {
          case 'subscription.active':
          case 'subscription.failed':
          case 'subscription.cancelled':
          case 'subscription.renewed':
          case 'subscription.on_hold':
            request.log.info({ payload }, `Received ${payload.type}`)
            break
          default:
            request.log.info({ payload }, 'Unknown subscription event')
        }
      } else if (payload.data.payload_type === 'Payment') {
        switch (payload.type) {
          case 'payment.succeeded':
          case 'payment.failed':
          case 'payment.refunded':
            request.log.info({ payload }, `Received ${payload.type}`)
            break
          default:
            request.log.info({ payload }, 'Unknown payment event')
        }
      }

      return reply.status(200).send({ message: 'Webhook processed successfully' })
    } catch (error) {
      request.log.error({ err: error }, 'Webhook verification failed')
      return reply.status(400).send({ error: 'Webhook verification failed' })
    }
  })
}

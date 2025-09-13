import { FastifyInstance } from 'fastify'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

export default async function subscriptionsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }
      const subscription = await getDodoPaymentsClient().subscriptions.retrieve(subscription_id)
      return reply.send(subscription)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching subscription')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/list', async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<string, any>
      const params: any = {}
      if (typeof customer_id === 'string') params.customer_id = customer_id
      if (typeof limit === 'string') params.limit = parseInt(limit)
      if (typeof starting_after === 'string') params.starting_after = starting_after

      const subscriptions = await getDodoPaymentsClient().subscriptions.list(params)
      return reply.send(subscriptions)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching subscriptions list')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

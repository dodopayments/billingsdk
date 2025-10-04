import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type Stripe from 'stripe'
import { getStripe } from '../../lib/stripe'

export default async function paymentsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe()

  const refundSchema = z.object({
    amount: z.number().int().min(1).optional(),
    reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  })

  // Get payment intent by ID
  fastify.get('/', async (request, reply) => {
    try {
      const { payment_intent_id } = request.query as Record<string, any>
      if (!payment_intent_id || typeof payment_intent_id !== 'string') {
        return reply.status(400).send({ error: 'payment_intent_id is required' })
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
      return reply.send(paymentIntent)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching payment intent')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // List payment intents
  fastify.get('/list', async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<string, any>
      const params: Stripe.PaymentIntentListParams = {}
      if (typeof customer_id === 'string') params.customer = customer_id

      if (typeof limit === 'string') {
        const parsedLimit = Number.parseInt(limit, 10)
        if (!Number.isFinite(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send({ error: 'limit must be an integer between 1 and 100' })
        }
        params.limit = parsedLimit
      }
      if (typeof starting_after === 'string') params.starting_after = starting_after

      const paymentIntents = await stripe.paymentIntents.list(params)
      return reply.send(paymentIntents)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching payment intents list')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Create refund for a charge
  fastify.post('/refund', async (request, reply) => {
    try {
      const { charge_id } = request.query as Record<string, any>
      if (!charge_id || typeof charge_id !== 'string') {
        return reply.status(400).send({ error: 'charge_id is required' })
      }

      const validationResult = refundSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const refundParams: Stripe.RefundCreateParams = {
        charge: charge_id,
        ...validationResult.data,
      }

      const refund = await stripe.refunds.create(refundParams)
      return reply.send(refund)
    } catch (error) {
      request.log.error({ err: error }, 'Error creating refund')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Get refund by ID
  fastify.get('/refund', async (request, reply) => {
    try {
      const { refund_id } = request.query as Record<string, any>
      if (!refund_id || typeof refund_id !== 'string') {
        return reply.status(400).send({ error: 'refund_id is required' })
      }
      
      const refund = await stripe.refunds.retrieve(refund_id)
      return reply.send(refund)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching refund')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // List refunds
  fastify.get('/refunds', async (request, reply) => {
    try {
      const { charge_id, limit, starting_after } = request.query as Record<string, any>
      const params: Stripe.RefundListParams = {}
      if (typeof charge_id === 'string') params.charge = charge_id

      if (typeof limit === 'string') {
        const parsedLimit = Number.parseInt(limit, 10)
        if (!Number.isFinite(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send({ error: 'limit must be an integer between 1 and 100' })
        }
        params.limit = parsedLimit
      }
      if (typeof starting_after === 'string') params.starting_after = starting_after

      const refunds = await stripe.refunds.list(params)
      return reply.send(refunds)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching refunds list')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type Stripe from 'stripe'
import { getStripe } from '../../lib/stripe'

export default async function subscriptionsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe()

  const subscriptionUpdateSchema = z.object({
    cancel_at_period_end: z.boolean().optional(),
    proration_behavior: z.enum(['create_prorations', 'none', 'always_invoice']).optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  })

  const subscriptionCancelSchema = z.object({
    cancel_at_period_end: z.boolean().optional(),
    cancellation_details: z.object({
      comment: z.string().optional(),
      feedback: z.enum(['too_expensive', 'missing_features', 'switched_service', 'unused', 'other']).optional(),
    }).optional(),
  })

  // Get subscription by ID
  fastify.get('/', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }
      
      const subscription = await stripe.subscriptions.retrieve(subscription_id)
      return reply.send(subscription)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching subscription')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // List subscriptions
  fastify.get('/list', async (request, reply) => {
    try {
      const { customer_id, limit, starting_after, status } = request.query as Record<string, any>
      const params: Stripe.SubscriptionListParams = {}
      
      if (typeof customer_id === 'string') params.customer = customer_id
      if (typeof limit === 'string') {
        const parsedLimit = Number.parseInt(limit, 10)
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send({ error: 'limit must be an integer between 1 and 100' })
        }
        params.limit = parsedLimit
      }
      if (typeof starting_after === 'string') params.starting_after = starting_after
      if (typeof status === 'string') params.status = status as Stripe.Subscription.Status

      const subscriptions = await stripe.subscriptions.list(params)
      return reply.send(subscriptions)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching subscriptions list')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Update subscription
  fastify.put('/', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }

      const validationResult = subscriptionUpdateSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const subscription = await stripe.subscriptions.update(subscription_id, validationResult.data)
      return reply.send(subscription)
    } catch (error) {
      request.log.error({ err: error }, 'Error updating subscription')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Cancel subscription
  fastify.delete('/', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }

      const validationResult = subscriptionCancelSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const subscription = await stripe.subscriptions.cancel(subscription_id, validationResult.data)
      return reply.send(subscription)
    } catch (error) {
      request.log.error({ err: error }, 'Error canceling subscription')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Resume subscription (if paused)
  fastify.post('/resume', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }

      const subscription = await stripe.subscriptions.update(subscription_id, {
        pause_collection: null,
      })
      return reply.send(subscription)
    } catch (error) {
      request.log.error({ err: error }, 'Error resuming subscription')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

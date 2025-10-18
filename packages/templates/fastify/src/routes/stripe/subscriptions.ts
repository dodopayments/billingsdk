import { FastifyInstance } from 'fastify'
import { getStripe } from '../../lib/stripe';
import type Stripe from 'stripe';

const stripe = getStripe();

export default async function subscriptionsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const { subscription_id } = request.query as Record<string, any>
      if (!subscription_id || typeof subscription_id !== 'string') {
        return reply.status(400).send({ error: 'subscription_id is required' })
      }
      const subscription = await stripe.subscriptions.retrieve(subscription_id)
      return reply.send(subscription)
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/list', async (request, reply) => {
    try {
      const { customer_id, limit, starting_after } = request.query as Record<string, any>

      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' });
      }

      const params: Stripe.SubscriptionListParams = {
        customer: customer_id,
      };

      if (limit && typeof limit === 'string') {
        const parsed = parseInt(limit, 10);
        if (!isNaN(parsed)) params.limit = parsed;
      }

      if (starting_after && typeof starting_after === 'string') {
        params.starting_after = starting_after;
      }

      const subscriptions = await stripe.subscriptions.list(params);
      return reply.send(subscriptions.data)
    } catch (error) {
      console.error('Error fetching subscriptions list:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

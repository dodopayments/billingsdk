// @ts-nocheck
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type Stripe from 'stripe';
import { getStripe } from '../../lib/stripe';

const stripe = getStripe();

export default async function customerRoutes(fastify: FastifyInstance) {
  const customerCreateSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(1, 'Name is required'),
    phone_number: z.string().optional().nullable(),
  })

  const customerUpdateSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    name: z.string().min(1, 'Name is required').optional(),
    phone_number: z.string().optional().nullable(),
  })

  fastify.get('/', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }
      const customer = await stripe.customers.retrieve(customer_id)
      return reply.send(customer)
    } catch (error) {
      console.error('Error fetching customer:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.post('/', async (request, reply) => {
    try {
      const validationResult = customerCreateSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const customer = await stripe.customers.create({
        email: validationResult.data.email,
        name: validationResult.data.name,
        phone: validationResult.data.phone_number ?? "",
      });

      return reply.send(customer)
    } catch (error) {
      console.error('Error creating customer:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.put('/', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }

      const validationResult = customerUpdateSchema.safeParse(request.body)
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      const updateData: Stripe.CustomerUpdateParams = {};
      if (validationResult.data.email) updateData.email = validationResult.data.email;
      if (validationResult.data.name) updateData.name = validationResult.data.name;
      if (validationResult.data.phone_number) updateData.phone = validationResult.data.phone_number;

      const customer = await stripe.customers.update(customer_id, updateData);
      return reply.send(customer)
    } catch (error) {
      console.error('Error updating customer:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/subscriptions', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        limit: 100,
      });

      return reply.send(subscriptions.data)
    } catch (error) {
      console.error('Error fetching customer subscriptions:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/payments', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }

      const payments = await stripe.paymentIntents.list({
        customer: customer_id,
        limit: 100,
      });

      return reply.send(payments)
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

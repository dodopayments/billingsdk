// @ts-nocheck
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

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
      const customer = await getDodoPaymentsClient().customers.retrieve(customer_id)
      return reply.send(customer)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching customer')
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

      const customer = await getDodoPaymentsClient().customers.create(validationResult.data)
      return reply.send(customer)
    } catch (error) {
      request.log.error({ err: error }, 'Error creating customer')
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

      const customer = await getDodoPaymentsClient().customers.update(customer_id, validationResult.data)
      return reply.send(customer)
    } catch (error) {
      request.log.error({ err: error }, 'Error updating customer')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/subscriptions', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }

      const subscriptions = await getDodoPaymentsClient().subscriptions.list({
        customer_id,
      })
      return reply.send(subscriptions)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching customer subscriptions')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/payments', async (request, reply) => {
    try {
      const { customer_id } = request.query as Record<string, any>
      if (!customer_id || typeof customer_id !== 'string') {
        return reply.status(400).send({ error: 'customer_id is required' })
      }

      const payments = await getDodoPaymentsClient().payments.list({
        customer_id,
      })
      return reply.send(payments)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching customer payments')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

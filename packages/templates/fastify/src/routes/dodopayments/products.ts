// @ts-nocheck
import { FastifyInstance } from 'fastify'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

export default async function productsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const { limit, starting_after } = request.query as Record<string, any>
      const params: any = {}
      if (typeof limit === 'string') params.limit = parseInt(limit)
      if (typeof starting_after === 'string') params.starting_after = starting_after

      const products = await getDodoPaymentsClient().products.list(params)
      return reply.send(products)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching products')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  fastify.get('/product', async (request, reply) => {
    try {
      const { product_id } = request.query as Record<string, any>
      if (!product_id || typeof product_id !== 'string') {
        return reply.status(400).send({ error: 'product_id is required' })
      }

      const product = await getDodoPaymentsClient().products.retrieve(product_id)
      return reply.send(product)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching product')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

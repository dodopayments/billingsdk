import { FastifyInstance } from 'fastify'
import type Stripe from 'stripe'
import { getStripe } from '../../lib/stripe'

export default async function productsRoutes(fastify: FastifyInstance) {
  const stripe = getStripe()

  // List products
  fastify.get('/', async (request, reply) => {
    try {
      const { limit, starting_after, active } = request.query as Record<string, any>
      const params: Stripe.ProductListParams = {}
      
      if (typeof limit === 'string') {
        const parsedLimit = Number.parseInt(limit, 10)
        if (!Number.isFinite(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send({ error: 'limit must be an integer between 1 and 100' })
        }
        params.limit = parsedLimit
      }
      if (typeof starting_after === 'string') params.starting_after = starting_after
      if (typeof active === 'string') params.active = active === 'true'

      const products = await stripe.products.list(params)
      return reply.send(products)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching products')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Get product by ID
  fastify.get('/product', async (request, reply) => {
    try {
      const { product_id } = request.query as Record<string, any>
      if (!product_id || typeof product_id !== 'string') {
        return reply.status(400).send({ error: 'product_id is required' })
      }

      const product = await stripe.products.retrieve(product_id)
      return reply.send(product)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching product')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // List prices for a product
  fastify.get('/prices', async (request, reply) => {
    try {
      const { product_id, limit, starting_after, active } = request.query as Record<string, any>
      if (!product_id || typeof product_id !== 'string') {
        return reply.status(400).send({ error: 'product_id is required' })
      }

      const params: Stripe.PriceListParams = {
        product: product_id,
      }
      
      if (typeof limit === 'string') {
        const parsedLimit = Number.parseInt(limit, 10)
        if (!Number.isFinite(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send({ error: 'limit must be an integer between 1 and 100' })
        }
        params.limit = parsedLimit
      }
      if (typeof starting_after === 'string') params.starting_after = starting_after
      if (typeof active === 'string') params.active = active === 'true'

      const prices = await stripe.prices.list(params)
      return reply.send(prices)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching prices')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })

  // Get price by ID
  fastify.get('/price', async (request, reply) => {
    try {
      const { price_id } = request.query as Record<string, any>
      if (!price_id || typeof price_id !== 'string') {
        return reply.status(400).send({ error: 'price_id is required' })
      }

      const price = await stripe.prices.retrieve(price_id)
      return reply.send(price)
    } catch (error) {
      request.log.error({ err: error }, 'Error fetching price')
      return reply.status(500).send({ error: 'Internal server error' })
    }
  })
}

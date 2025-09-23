import { Hono } from 'hono'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const limit = c.req.query('limit')
    const starting_after = c.req.query('starting_after')

    const params: any = {}
    if (limit && typeof limit === 'string') {
      params.limit = parseInt(limit)
    }
    if (starting_after && typeof starting_after === 'string') {
      params.starting_after = starting_after
    }

    const products = await getDodoPaymentsClient().products.list(params)
    return c.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/product', async (c) => {
  try {
    const product_id = c.req.query('product_id')

    if (!product_id || typeof product_id !== 'string') {
      return c.json({ error: 'product_id is required' }, 400)
    }

    const product = await getDodoPaymentsClient().products.retrieve(product_id)
    return c.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { app as productsRouter }

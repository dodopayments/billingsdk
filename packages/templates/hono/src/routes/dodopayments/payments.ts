import { Hono } from 'hono'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const payment_id = c.req.query('payment_id')

    if (!payment_id || typeof payment_id !== 'string') {
      return c.json({ error: 'payment_id is required' }, 400)
    }

    const payment = await getDodoPaymentsClient().payments.retrieve(payment_id)
    return c.json(payment)
  } catch (error) {

    console.error('Error fetching payment:', error)
    return c.json({ error: 'Internal server error' }, 500)

  }
})

app.get('/list', async (c) => {
  try {

    const customer_id = c.req.query('customer_id')
    const limit = c.req.query('limit')
    const starting_after = c.req.query('starting_after')

    const params: any = {}
    if (customer_id && typeof customer_id === 'string') {
      params.customer_id = customer_id
    }
    if (limit && typeof limit === 'string') {
      params.limit = parseInt(limit)
    }
    if (starting_after && typeof starting_after === 'string') {
      params.starting_after = starting_after
    }

    const payments = await getDodoPaymentsClient().payments.list(params)
    return c.json(payments)
  } catch (error) {

    console.error('Error fetching payments list:', error)
    return c.json({ error: 'Internal server error' }, 500)
    
  }
})

export { app as paymentsRouter }

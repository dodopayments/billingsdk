import { Hono } from 'hono'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const subscription_id = c.req.query('subscription_id')

    if (!subscription_id || typeof subscription_id !== 'string') {
      return c.json({ error: 'subscription_id is required' }, 400)
    }

    const subscription = await getDodoPaymentsClient().subscriptions.retrieve(subscription_id)
    return c.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
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

    const subscriptions = await getDodoPaymentsClient().subscriptions.list(params)
    return c.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions list:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export { app as subscriptionsRouter }

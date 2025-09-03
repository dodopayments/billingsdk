import express from 'express'
import { Webhook } from 'standardwebhooks'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

const router = express.Router()
const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET
if (!webhookSecret) {
  throw new Error('DODO_PAYMENTS_WEBHOOK_SECRET is missing')
}
const webhook = new Webhook(webhookSecret)

router.use(express.raw({ type: 'application/json', limit: '100kb' }))

router.post('/', async (req, res) => {
  try {
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString() : ''
    const getHeader = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value
    const webhookHeaders = {
      'webhook-id': getHeader(req.headers['webhook-id']) || '',
      'webhook-signature': getHeader(req.headers['webhook-signature']) || '',
      'webhook-timestamp': getHeader(req.headers['webhook-timestamp']) || '',
    }

    if (!webhookHeaders['webhook-id'] || !webhookHeaders['webhook-signature'] || !webhookHeaders['webhook-timestamp']) {
      return res.status(400).json({ error: 'Missing required webhook headers' })
    }

    try {
      await webhook.verify(rawBody, webhookHeaders)
    } catch (e) {
      console.error('Webhook verification failed', { error: (e as Error)?.message })
      return res.status(400).json({ error: 'Invalid webhook signature' })
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch (_e) {
      return res.status(400).json({ error: 'Invalid JSON payload' })
    }

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id)
          const s: any = subscription as any
          console.log('subscription.active', {
            id: s.id,
            status: s.status,
            customer_id: s.customer_id,
            plan_id: s.plan_id,
          })
          break
        case "subscription.failed":
          break
        case "subscription.cancelled":
          break
        case "subscription.renewed":
          break
        case "subscription.on_hold":
          break
        default:
          break
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(payload.data.payment_id)
          const p: any = paymentDataResp as any
          console.log('payment.succeeded', {
            id: p.id,
            status: p.status,
            amount: p.amount,
            currency: p.currency,
            customer_id: p.customer_id,
          })
          break
        default:
          break
      }
    }

    res.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Webhook handler error', { error: (error as Error)?.message })
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

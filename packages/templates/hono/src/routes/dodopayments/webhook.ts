import { Hono } from 'hono'
import { Webhook } from 'standardwebhooks'
import { getDodoPaymentsClient } from '../../lib/dodopayments'

const app = new Hono()

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!)

app.post('/', async (c) => {
  try {
    const rawBody = await c.req.raw.clone().arrayBuffer()
    const bodyText = new TextDecoder().decode(rawBody)
    
    const webhookHeaders = {
      'webhook-id': c.req.header('webhook-id') || '',
      'webhook-signature': c.req.header('webhook-signature') || '',
      'webhook-timestamp': c.req.header('webhook-timestamp') || '',
    }

    await webhook.verify(bodyText, webhookHeaders)
    const payload = JSON.parse(bodyText)

    if (payload.data.payload_type === "Subscription") {
      switch (payload.type) {
        case "subscription.active":
          const subscription = await getDodoPaymentsClient().subscriptions.retrieve(payload.data.subscription_id)
          console.log("-------SUBSCRIPTION DATA START ---------")
          console.log(subscription)
          console.log("-------SUBSCRIPTION DATA END ---------")
          break
        case "subscription.failed":
          console.log("Subscription failed:", payload.data.subscription_id)
          break
        case "subscription.cancelled":
          console.log("Subscription cancelled:", payload.data.subscription_id)
          break
        case "subscription.renewed":
          console.log("Subscription renewed:", payload.data.subscription_id)
          break
        case "subscription.on_hold":
          console.log("Subscription on hold:", payload.data.subscription_id)
          break
        default:
          console.log("Unknown subscription event:", payload.type)
          break
      }
    } else if (payload.data.payload_type === "Payment") {
      switch (payload.type) {
        case "payment.succeeded":
          const paymentDataResp = await getDodoPaymentsClient().payments.retrieve(payload.data.payment_id)
          console.log("-------PAYMENT DATA START ---------")
          console.log(paymentDataResp)
          console.log("-------PAYMENT DATA END ---------")
          break
        case "payment.failed":
          console.log("Payment failed:", payload.data.payment_id)
          break
        case "payment.refunded":
          console.log("Payment refunded:", payload.data.payment_id)
          break
        default:
          console.log("Unknown payment event:", payload.type)
          break
      }
    }

    return c.json({ message: "Webhook processed successfully" }, 200)
  } catch (error) {
    console.error("Webhook verification failed:", error)
    return c.json({ error: "Webhook verification failed" }, 400)
  }
})

export { app as webhookRouter }

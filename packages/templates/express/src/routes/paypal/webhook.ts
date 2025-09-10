import express from 'express'
import paypal from '@paypal/checkout-server-sdk'
import { getPayPalClient } from '../../lib/paypal'

const router = express.Router()

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify PayPal webhook signature
    const client = getPayPalClient()
    const verifyRequest = new paypal.notifications.VerifyWebhookSignatureRequest()
    
    // Get webhook ID from environment variables
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (!webhookId) {
      console.error('PAYPAL_WEBHOOK_ID is not set in environment variables')
      return res.status(500).json({ error: 'Webhook verification not configured' })
    }
    
    // Parse raw body once and reuse
    const event = JSON.parse(req.body.toString())
    verifyRequest.requestBody({
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: event
    })
    
    // Execute verification
    const verifyResponse = await client.execute(verifyRequest)
    
    // Check verification result
    if (verifyResponse.result.verification_status !== 'SUCCESS') {
      console.warn('PayPal webhook signature verification failed')
      return res.status(400).json({ error: 'Webhook signature verification failed' })
    }
    
    // Process verified webhook event
    // event already parsed above
    console.log('Verified PayPal webhook event received:', event.event_type)
    
    // TODO: Handle specific webhook events (e.g., payment completed, subscription cancelled, etc.)
    
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing PayPal webhook:', error)
    res.status(500).json({ error: 'Internal error processing webhook' })
  }
})

export { router as webhookRouter }
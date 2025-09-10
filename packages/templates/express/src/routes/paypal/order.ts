import express from 'express'
import paypal from '@paypal/checkout-server-sdk'
import { getPayPalClient } from '../../lib/paypal'
import { z } from 'zod'

const router = express.Router()

const capSchema = z.object({ orderId: z.string().min(1) })
router.post('/capture', async (req, res) => {
  try {
    const parsed = capSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
    const { orderId } = parsed.data
    
    const client = getPayPalClient()
    const capReq = new paypal.orders.OrdersCaptureRequest(orderId)
    capReq.requestBody({})
    const response = await client.execute(capReq)
    res.json(response.result)
  } catch {
    res.status(500).json({ error: 'Internal error' })
  }
})

router.get('/:orderId', async (req, res) => {
  try {
    // Validate orderId parameter is present and non-empty
    const { orderId } = req.params
    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return res.status(400).json({ error: 'orderId parameter is required and must be a non-empty string' })
    }
    
    const client = getPayPalClient()
    const getReq = new paypal.orders.OrdersGetRequest(orderId)
    const response = await client.execute(getReq)
    res.json(response.result)
  } catch {
    res.status(500).json({ error: 'Internal error' })
  }
})

export { router as orderRouter }
import express from 'express'
import paypal from '@paypal/checkout-server-sdk'
import { z } from 'zod'
import { getPayPalClient } from '../../lib/paypal'

const router = express.Router()

// ISO 4217 currency decimal places lookup
const currencyDecimals: Record<string, number> = {
  'USD': 2, 'EUR': 2, 'GBP': 2, 'CAD': 2, 'AUD': 2, 'CNY': 2,
  'JPY': 0, 'KRW': 0, 'VND': 0, 'CLP': 0, 'PYG': 0, 'XOF': 0,
  'HUF': 2, 'ISK': 0, 'MXN': 2, 'NOK': 2, 'PLN': 2, 'SEK': 2,
  'CHF': 2, 'CZK': 2, 'DKK': 2, 'RON': 2, 'BRL': 2, 'MYR': 2,
  'THB': 2, 'PHP': 2, 'INR': 2, 'SGD': 2, 'ILS': 2, 'TWD': 2,
  'ZAR': 2, 'NZD': 2, 'TRY': 2, 'HKD': 2, 'SAR': 2, 'AED': 2,
  'RUB': 2, 'EGP': 2, 'IDR': 2, 'ARS': 2, 'COP': 2, 'PEN': 2,
  'UYU': 2, 'BOB': 2, 'CRC': 2, 'DOP': 2, 'GTQ': 2, 'HNL': 2,
  'NIO': 2, 'PAB': 2, 'UYI': 0
};

const schema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).refine(val => val > 0, { message: 'Amount must be greater than 0' }),
  currency: z.string().regex(/^[A-Z]{3}$/, { message: 'Currency must be a 3-letter uppercase code' }).refine(currency => ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'].includes(currency), { message: 'Unsupported currency' }),
})

router.post('/', async (req, res) => {
  try {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
    }
    
    // Get the correct number of decimal places for the currency
    const decimals = currencyDecimals[parsed.data.currency] ?? 2;
    
    const requestOrder = new paypal.orders.OrdersCreateRequest()
    requestOrder.headers['Prefer'] = 'return=representation'
    requestOrder.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: parsed.data.currency, value: parsed.data.amount.toFixed(decimals) } }],
    })
    const client = getPayPalClient()
    const response = await client.execute(requestOrder)
    res.json(response.result)
  } catch (e) {
    res.status(500).json({ error: 'Internal error' })
  }
})

export { router as checkoutRouter }
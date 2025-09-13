/**
 * PayPal Checkout Routes
 * 
 * This file contains routes for handling PayPal checkout flows.
 * These routes are designed to work with the PayPal JavaScript SDK on the frontend.
 */

import { Router } from 'express';
import { createPayPalOrder } from '../../lib/paypal';

const checkoutRouter = Router();

/**
 * Create a PayPal order for checkout
 * POST /paypal/checkout
 * 
 * This endpoint is called by the frontend to create a PayPal order
 * before redirecting the user to PayPal for approval.
 * 
 * Request body:
 * - amount: string (required)
 * - currency: string (optional, defaults to 'USD')
 * - description: string (optional)
 */
checkoutRouter.post('/', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'BillingSDK Purchase' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const orderId = await createPayPalOrder(amount, currency, description);
    res.status(200).json({ id: orderId });
  } catch (error) {
    console.error('Error creating PayPal checkout order:', error);
    res.status(500).json({ error: 'Failed to create PayPal checkout order' });
  }
});

export default checkoutRouter;
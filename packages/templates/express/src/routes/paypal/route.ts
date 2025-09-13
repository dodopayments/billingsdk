import { Router } from 'express';
import { capturePayPalOrder, createPayPalOrder, getPayPalOrder } from '../../lib/paypal';

const paypalRouter = Router();

/**
 * Create a PayPal order
 * POST /paypal/order
 * 
 * Request body:
 * - amount: string (required)
 * - currency: string (optional, defaults to 'USD')
 * - description: string (optional)
 */
paypalRouter.post('/order', async (req, res) => {
  try {
    const { amount, currency, description } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const orderId = await createPayPalOrder(amount, currency, description);
    res.status(200).json({ orderId });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

/**
 * Capture a PayPal order
 * POST /paypal/order/:orderId/capture
 * 
 * Path parameters:
 * - orderId: string (required)
 */
paypalRouter.post('/order/:orderId/capture', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const capture = await capturePayPalOrder(orderId);
    res.status(200).json(capture);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

/**
 * Get PayPal order details
 * GET /paypal/order/:orderId
 * 
 * Path parameters:
 * - orderId: string (required)
 */
paypalRouter.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const order = await getPayPalOrder(orderId);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error retrieving PayPal order:', error);
    res.status(500).json({ error: 'Failed to retrieve PayPal order' });
  }
});

export default paypalRouter;
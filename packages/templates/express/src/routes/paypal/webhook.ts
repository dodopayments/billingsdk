/**
 * PayPal Webhook Routes
 * 
 * This file contains routes for handling PayPal webhook events.
 * Webhooks are used to receive real-time notifications about payment events.
 */

import { Router } from 'express';
import { Webhook } from 'standardwebhooks';

const webhookRouter = Router();

// Initialize webhook handler with PayPal webhook ID from environment variables
const webhook = new Webhook(process.env.PAYPAL_WEBHOOK_ID || '');

/**
 * Handle PayPal webhook events
 * POST /paypal/webhook
 * 
 * This endpoint receives webhook events from PayPal and processes them accordingly.
 * The request body contains the event data, and the headers contain the signature
 * for verification.
 */
webhookRouter.post('/', async (req, res) => {
  try {
    // Verify the webhook signature
    const verified = webhook.verify(
      JSON.stringify(req.body),
      req.headers as Record<string, string>
    );
    
    if (!verified) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    
    // Process the webhook event
    const event = req.body;
    const eventType = event.event_type;
    
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Handle successful payment capture
        console.log('Payment captured:', event);
        // Update your database, send confirmation emails, etc.
        break;
        
      case 'PAYMENT.CAPTURE.REFUNDED':
        // Handle payment refund
        console.log('Payment refunded:', event);
        // Update your database, notify user, etc.
        break;
        
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Handle subscription activation
        console.log('Subscription activated:', event);
        // Update your database, grant access to premium features, etc.
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', event);
        // Update your database, revoke access to premium features, etc.
        break;
        
      default:
        console.log('Unhandled PayPal event:', eventType);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default webhookRouter;
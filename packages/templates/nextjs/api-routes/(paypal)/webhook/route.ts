import { NextRequest } from 'next/server';
import { Webhook } from 'standardwebhooks';

/**
 * Handle PayPal webhook events
 * POST /api/(paypal)/webhook
 * 
 * This endpoint receives webhook events from PayPal and processes them accordingly.
 * The request body contains the event data, and the headers contain the signature
 * for verification.
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize webhook handler with PayPal webhook ID from environment variables
    const webhook = new Webhook(process.env.PAYPAL_WEBHOOK_ID || '');
    
    // Get the request body and headers
    const body = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Verify the webhook signature
    const verified = webhook.verify(body, headers);
    
    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse the event data
    const event = JSON.parse(body);
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
    
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
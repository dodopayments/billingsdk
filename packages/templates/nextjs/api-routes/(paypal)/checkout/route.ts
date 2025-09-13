import { NextRequest } from 'next/server';
import { createPayPalOrder } from '../../../lib/paypal';

/**
 * Create a PayPal order for checkout
 * POST /api/(paypal)/checkout
 * 
 * This endpoint is called by the frontend to create a PayPal order
 * before redirecting the user to PayPal for approval.
 * 
 * Request body:
 * - amount: string (required)
 * - currency: string (optional, defaults to 'USD')
 * - description: string (optional)
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'USD', description = 'BillingSDK Purchase' } = await req.json();
    
    if (!amount) {
      return new Response(
        JSON.stringify({ error: 'Amount is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const orderId = await createPayPalOrder(amount, currency, description);
    
    return new Response(
      JSON.stringify({ id: orderId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PayPal checkout order:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to create PayPal checkout order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
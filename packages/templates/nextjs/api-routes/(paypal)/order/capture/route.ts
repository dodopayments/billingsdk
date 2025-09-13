import { NextRequest } from 'next/server';
import { capturePayPalOrder } from '../../../../lib/paypal';

/**
 * Capture a PayPal order
 * POST /api/(paypal)/order/capture
 * 
 * Request body:
 * - orderId: string (required)
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const capture = await capturePayPalOrder(orderId);
    
    return new Response(
      JSON.stringify(capture),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to capture PayPal order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
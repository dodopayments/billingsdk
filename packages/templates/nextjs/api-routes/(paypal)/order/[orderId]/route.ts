import { NextRequest } from 'next/server';
import { getPayPalOrder } from '../../../../lib/paypal';

/**
 * Get PayPal order details
 * GET /api/(paypal)/order/[orderId]
 * 
 * Path parameters:
 * - orderId: string (required)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const order = await getPayPalOrder(orderId);
    
    return new Response(
      JSON.stringify(order),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving PayPal order:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve PayPal order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
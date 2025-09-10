import { NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'
import { getPayPalClient } from '@/lib/paypal'

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    // Validate orderId parameter is present and non-empty
    const { orderId } = params;
    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return NextResponse.json({ error: 'orderId parameter is required and must be a non-empty string' }, { status: 400 });
    }
    
    const client = getPayPalClient();
    const getReq = new paypal.orders.OrdersGetRequest(orderId);
    
    const response = await client.execute(getReq);
    return NextResponse.json(response.result);
  } catch (error) {
    console.error('Error fetching PayPal order:', error);
    return NextResponse.json({ error: 'Internal error fetching order' }, { status: 500 });
  }
}
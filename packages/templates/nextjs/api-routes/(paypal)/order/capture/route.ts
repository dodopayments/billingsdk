import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const capSchema = z.object({ orderId: z.string().min(1) });
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const parsed = capSchema.safeParse(body);
		if (!parsed.success)
			return NextResponse.json(
				{ error: 'Invalid input', details: parsed.error.flatten() },
				{ status: 400 }
			);
		const { orderId } = parsed.data;

		const client = getPayPalClient();
		const capReq = new paypal.orders.OrdersCaptureRequest(orderId);
		capReq.requestBody({});

		const response = await client.execute(capReq);
		return NextResponse.json(response.result);
	} catch (error) {
		console.error('Error capturing PayPal order:', error);
		return NextResponse.json(
			{ error: 'Internal error capturing order' },
			{ status: 500 }
		);
	}
}

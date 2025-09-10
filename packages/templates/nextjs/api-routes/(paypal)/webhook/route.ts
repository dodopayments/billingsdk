import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// Get raw body for webhook verification
		const rawBody = await request.text();

		// Verify PayPal webhook signature
		const client = getPayPalClient();
		const verifyRequest =
			new paypal.notifications.VerifyWebhookSignatureRequest();

		// Get webhook ID from environment variables
		const webhookId = process.env.PAYPAL_WEBHOOK_ID;
		if (!webhookId) {
			console.error('PAYPAL_WEBHOOK_ID is not set in environment variables');
			return NextResponse.json(
				{ error: 'Webhook verification not configured' },
				{ status: 500 }
			);
		}

		// Get headers
		const headers = Object.fromEntries(request.headers.entries());

		// Parse raw body once and reuse
		const event = JSON.parse(rawBody);
		verifyRequest.requestBody({
			auth_algo: headers['paypal-auth-algo'],
			cert_url: headers['paypal-cert-url'],
			transmission_id: headers['paypal-transmission-id'],
			transmission_sig: headers['paypal-transmission-sig'],
			transmission_time: headers['paypal-transmission-time'],
			webhook_id: webhookId,
			webhook_event: event,
		});

		// Execute verification
		const verifyResponse = await client.execute(verifyRequest);

		// Check verification result
		if (verifyResponse.result.verification_status !== 'SUCCESS') {
			console.warn('PayPal webhook signature verification failed');
			return NextResponse.json(
				{ error: 'Webhook signature verification failed' },
				{ status: 400 }
			);
		}

		// Process verified webhook event
		// event already parsed above
		console.log('Verified PayPal webhook event received:', event.event_type);

		// TODO: Handle specific webhook events (e.g., payment completed, subscription cancelled, etc.)

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Error processing PayPal webhook:', error);
		return NextResponse.json(
			{ error: 'Internal error processing webhook' },
			{ status: 500 }
		);
	}
}

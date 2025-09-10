import paypal from '@paypal/checkout-server-sdk';

let paypalClient: paypal.core.PayPalHttpClient | null = null;

export function getPayPalClient(): paypal.core.PayPalHttpClient {
	if (!paypalClient) {
		const clientId = process.env.PAYPAL_CLIENT_ID;
		const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
		if (!clientId || !clientSecret) {
			throw new Error('PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET are not set');
		}
		const environment =
			process.env.PAYPAL_ENV === 'live'
				? new paypal.core.LiveEnvironment(clientId, clientSecret)
				: new paypal.core.SandboxEnvironment(clientId, clientSecret);
		paypalClient = new paypal.core.PayPalHttpClient(environment);
	}
	return paypalClient;
}

import { useCallback, useState } from 'react';

export function usePayPal({ baseUrl }: { baseUrl?: string } = {}) {
	const resolvedBaseUrl =
		baseUrl ??
		process.env.NEXT_PUBLIC_APP_URL ??
		'http://localhost:3000';
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastOrderId, setLastOrderId] = useState<string | null>(null);

	const createOrder = useCallback(
		async (amount: string, currency: string) => {
			try {
				setLoading(true);
				setError(null);
				// In a real implementation, we would validate PayPal environment here
				// For now, we'll just simulate the call
				const response = await fetch(`${resolvedBaseUrl}/api/paypal/checkout`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ amount, currency }),
				});

				if (!response.ok) {
					throw new Error(`Failed to create order: ${response.status}`);
				}

				const order = await response.json();
				setLastOrderId(order.id);
				return order;
			} catch (e: any) {
				setError(e?.message ?? 'Failed to create order');
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[resolvedBaseUrl]
	);

	const captureOrder = useCallback(
		async (orderId: string) => {
			try {
				setLoading(true);
				setError(null);
				// add a timeout to avoid hanging indefinitely
				const controller = new AbortController();
				let t: ReturnType<typeof setTimeout> | null = null;
				t = setTimeout(() => controller.abort(), 10_000);

				const response = await fetch(
					`${resolvedBaseUrl}/api/order/capture`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ orderId }),
						signal: controller.signal,
					}
				);
				if (t) clearTimeout(t);

				if (!response.ok) {
					throw new Error(`Failed to capture order: ${response.status}`);
				}

				const order = await response.json();
				return order;
			} catch (e: any) {
				setError(e?.message ?? 'Failed to capture order');
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[resolvedBaseUrl]
	);

	const fetchOrder = useCallback(
		async (orderId: string) => {
			try {
				setLoading(true);
				setError(null);
				const controller = new AbortController();
				let t: ReturnType<typeof setTimeout> | null = null;
				t = setTimeout(() => controller.abort(), 10_000);
				const response = await fetch(
					`${resolvedBaseUrl}/api/order/${encodeURIComponent(orderId)}`,
					{
						method: 'GET',
						signal: controller.signal,
					}
				);
				if (t) clearTimeout(t);

				if (!response.ok) {
					throw new Error(`Failed to fetch order: ${response.status}`);
				}

				const order = await response.json();
				return order;
			} catch (e: any) {
				setError(e?.message ?? 'Failed to fetch order');
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[resolvedBaseUrl]
	);

	return { loading, error, lastOrderId, createOrder, captureOrder, fetchOrder };
}

'use client';

import {
	checkout,
	createCustomer,
	getCustomer,
	getCustomerPayments,
	getCustomerSubscriptions,
	getProduct,
	getProducts,
	updateCustomer,
} from '@/lib/dodopayments';
import { DodoPayments } from 'dodopayments';
import { useCallback, useState } from 'react';

interface UseBillingState {
	loading: boolean;
	error: string | null;
}

export const useBilling = ({ baseUrl }: { baseUrl?: string }) => {
	const [state, setState] = useState<UseBillingState>({
		loading: false,
		error: null,
	});

	const resolvedBaseUrl = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

	const setLoading = useCallback((loading: boolean) => {
		setState((prev) => ({ ...prev, loading }));
	}, []);

	const setError = useCallback((error: string | null) => {
		setState((prev) => ({ ...prev, error }));
	}, []);

	const handleAsyncOperation = useCallback(
		async <T>(
			operation: () => Promise<T>,
			operationName: string
		): Promise<T> => {
			try {
				setLoading(true);
				setError(null);
				const result = await operation();
				return result;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : `Failed to ${operationName}`;
				setError(errorMessage);
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[setLoading, setError]
	);

	const fetchProducts = useCallback(async () => {
		return handleAsyncOperation(
			() => getProducts({ baseUrl: resolvedBaseUrl }),
			'fetch products'
		);
	}, [handleAsyncOperation, resolvedBaseUrl]);

	const fetchProduct = useCallback(
		async (product_id: string) => {
			return handleAsyncOperation(
				() => getProduct({ baseUrl: resolvedBaseUrl, product_id }),
				'fetch product'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const fetchCustomer = useCallback(
		async (customer_id: string) => {
			return handleAsyncOperation(
				() => getCustomer({ baseUrl: resolvedBaseUrl, customer_id }),
				'fetch customer'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const fetchCustomerSubscriptions = useCallback(
		async (customer_id: string) => {
			return handleAsyncOperation(
				() =>
					getCustomerSubscriptions({ baseUrl: resolvedBaseUrl, customer_id }),
				'fetch customer subscriptions'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const fetchCustomerPayments = useCallback(
		async (customer_id: string) => {
			return handleAsyncOperation(
				() => getCustomerPayments({ baseUrl: resolvedBaseUrl, customer_id }),
				'fetch customer payments'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const createNewCustomer = useCallback(
		async (customer: DodoPayments.Customers.CustomerCreateParams) => {
			return handleAsyncOperation(
				() => createCustomer({ baseUrl: resolvedBaseUrl, customer }),
				'create customer'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const updateExistingCustomer = useCallback(
		async (
			customer_id: string,
			customer: DodoPayments.Customers.CustomerUpdateParams
		) => {
			return handleAsyncOperation(
				() =>
					updateCustomer({ baseUrl: resolvedBaseUrl, customer_id, customer }),
				'update customer'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const createCheckout = useCallback(
		async (
			productCart: Array<{
				product_id: string;
				quantity: number;
				amount?: number;
			}>,
			customer: DodoPayments.Payments.CustomerRequest,
			billing_address: DodoPayments.Payments.BillingAddress,
			return_url: string,
			customMetadata?: Record<string, string>
		) => {
			return handleAsyncOperation(
				() =>
					checkout({
						baseUrl: resolvedBaseUrl,
						productCart,
						customer,
						billing_address,
						return_url,
						customMetadata,
					}),
				'create checkout'
			);
		},
		[handleAsyncOperation, resolvedBaseUrl]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, [setError]);

	return {
		// State
		loading: state.loading,
		error: state.error,

		// Actions
		clearError,

		// Product operations
		fetchProducts,
		fetchProduct,

		// Customer operations
		fetchCustomer,
		fetchCustomerSubscriptions,
		fetchCustomerPayments,
		createNewCustomer,
		updateExistingCustomer,

		// Checkout operations
		createCheckout,
	};
};

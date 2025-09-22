"use client";

import type Stripe from "stripe";
import { useState, useCallback } from "react";

import {
  getProducts,
  getProduct,
  getCustomer,
  getCustomerSubscriptions,
  getCustomerPayments,
  createCustomer,
  updateCustomer,
  checkout,
} from "@/lib/stripe";

interface UseBillingState {
  loading: boolean;
  error: string | null;
}

export const useBilling = ({ baseUrl }: { baseUrl?: string }) => {
  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
  });

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
    []
  );

  const fetchProducts = useCallback(async () => {
    return handleAsyncOperation(
      () => getProducts({ baseUrl }),
      "fetch products"
    );
  }, [handleAsyncOperation]);

  const fetchProduct = useCallback(
    async (product_id: string) => {
      return handleAsyncOperation(
        () => getProduct({ baseUrl, product_id }),
        "fetch product"
      );
    },
    [handleAsyncOperation]
  );

  const fetchCustomer = useCallback(
    async (customer_id: string) => {
      return handleAsyncOperation(
        () => getCustomer({ baseUrl, customer_id }),
        "fetch customer"
      );
    },
    [handleAsyncOperation]
  );

  const fetchCustomerSubscriptions = useCallback(
    async (customer_id: string) => {
      return handleAsyncOperation(
        () => getCustomerSubscriptions({ baseUrl, customer_id }),
        "fetch customer subscriptions"
      );
    },
    [handleAsyncOperation]
  );

  const fetchCustomerPayments = useCallback(
    async (customer_id: string) => {
      return handleAsyncOperation(
        () => getCustomerPayments({ baseUrl, customer_id }),
        "fetch customer payments"
      );
    },
    [handleAsyncOperation]
  );

  const createNewCustomer = useCallback(
    async (customer: Stripe.CustomerCreateParams) => {
      return handleAsyncOperation(
        () => createCustomer({ baseUrl, customer }),
        "create customer"
      );
    },
    [handleAsyncOperation]
  );

  const updateExistingCustomer = useCallback(
    async (customer_id: string, customer: Stripe.CustomerUpdateParams) => {
      return handleAsyncOperation(
        () => updateCustomer({ baseUrl, customer_id, customer }),
        "update customer"
      );
    },
    [handleAsyncOperation]
  );

  const createCheckout = useCallback(
    async (
      productCart: Array<{ price_id: string; quantity: number }>,
      success_url: string,
      cancel_url: string,
      customer?: {
        customer_id?: string;
        email?: string;
        name?: string;
        phone_number?: string;
      },
      metadata?: Record<string, string>
    ) => {
      return handleAsyncOperation(
        () =>
          checkout({
            productCart,
            success_url,
            cancel_url,
            baseUrl,
            customer,
            metadata,
          }),
        "create checkout"
      );
    },
    [handleAsyncOperation]
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

import { useState, useCallback } from "react";
import Stripe from "stripe";
import {
  getProducts,
  getProduct,
  getCustomer,
  getCustomerSubscriptions,
  getCustomerPayments,
  createCustomer,
  updateCustomer,
  checkout,
} from "../../lib/stripe";

interface UseBillingState {
  loading: boolean;
  error: string | null;
}

export function useBilling({ baseUrl }: { baseUrl?: string } = {}) {
  const resolvedBaseUrl =
    baseUrl ?? process.env.VITE_BASE_URL ?? "http://localhost:8080";

  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
  });

  const [products, setProducts] = useState<Stripe.Product[]>([]);
  const [customer, setCustomer] = useState<Stripe.Customer | null>(null);

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

  const fetchProducts = useCallback(async (): Promise<Stripe.Product[]> => {
    const result = await handleAsyncOperation(
      () => getProducts({ baseUrl: resolvedBaseUrl }),
      "fetch products"
    );
    setProducts(result);
    return result;
  }, [handleAsyncOperation, resolvedBaseUrl]);

  const fetchProduct = useCallback(
    async (product_id: string): Promise<Stripe.Product> => {
      return handleAsyncOperation(
        () => getProduct({ baseUrl: resolvedBaseUrl, product_id }),
        "fetch product"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const fetchCustomer = useCallback(
    async (customer_id: string): Promise<Stripe.Customer> => {
      const result = await handleAsyncOperation(
        () => getCustomer({ baseUrl: resolvedBaseUrl, customer_id }),
        "fetch customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const fetchCustomerSubscriptions = useCallback(
    async (customer_id: string): Promise<Stripe.Subscription[]> => {
      return handleAsyncOperation(
        () =>
          getCustomerSubscriptions({ baseUrl: resolvedBaseUrl, customer_id }),
        "fetch customer subscriptions"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const fetchCustomerPayments = useCallback(
    async (customer_id: string): Promise<Stripe.PaymentIntent[]> => {
      return handleAsyncOperation(
        () => getCustomerPayments({ baseUrl: resolvedBaseUrl, customer_id }),
        "fetch customer payments"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const createNewCustomer = useCallback(
    async (
      newCustomer: Stripe.CustomerCreateParams
    ): Promise<Stripe.Customer> => {
      const result = await handleAsyncOperation(
        () =>
          createCustomer({ baseUrl: resolvedBaseUrl, customer: newCustomer }),
        "create customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const updateExistingCustomer = useCallback(
    async (
      customer_id: string,
      updatedCustomer: Stripe.CustomerUpdateParams
    ): Promise<Stripe.Customer> => {
      const result = await handleAsyncOperation(
        () =>
          updateCustomer({
            baseUrl: resolvedBaseUrl,
            customer_id,
            customer: updatedCustomer,
          }),
        "update customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const createCheckout = useCallback(
    async (
      price_id: string,
      success_url: string,
      cancel_url: string,
      customer_id?: string
    ) => {
      return handleAsyncOperation(
        () =>
          checkout({
            baseUrl: resolvedBaseUrl,
            price_id,
            customer_id,
            success_url,
            cancel_url,
          }),
        "create checkout"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    loading: state.loading,
    error: state.error,
    products,
    customer,
    clearError,
    fetchProducts,
    fetchProduct,
    fetchCustomer,
    fetchCustomerSubscriptions,
    fetchCustomerPayments,
    createNewCustomer,
    updateExistingCustomer,
    createCheckout,
  };
}

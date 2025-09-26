import { useState, useCallback } from "react";
import { DodoPayments } from "dodopayments";
import {
  getProducts,
  getProduct,
  getCustomer,
  getCustomerSubscriptions,
  getCustomerPayments,
  createCustomer,
  updateCustomer,
  checkout,
} from "../../lib/dodopayments";

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

  const [products, setProducts] = useState<DodoPayments.Product[]>([]);
  const [customer, setCustomer] =
    useState<DodoPayments.Customers.Customer | null>(null);

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

  const fetchProducts = useCallback(async (): Promise<
    DodoPayments.Product[]
  > => {
    const result = await handleAsyncOperation(
      () => getProducts({ baseUrl: resolvedBaseUrl }),
      "fetch products"
    );
    setProducts(result);
    return result;
  }, [handleAsyncOperation, resolvedBaseUrl]);

  const fetchProduct = useCallback(
    async (product_id: string): Promise<DodoPayments.Product> => {
      return handleAsyncOperation(
        () => getProduct({ baseUrl: resolvedBaseUrl, product_id }),
        "fetch product"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const fetchCustomer = useCallback(
    async (customer_id: string): Promise<DodoPayments.Customers.Customer> => {
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
    async (
      customer_id: string
    ): Promise<DodoPayments.Subscriptions.Subscription[]> => {
      return handleAsyncOperation(
        () =>
          getCustomerSubscriptions({ baseUrl: resolvedBaseUrl, customer_id }),
        "fetch customer subscriptions"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const fetchCustomerPayments = useCallback(
    async (customer_id: string): Promise<DodoPayments.Payments.Payment[]> => {
      return handleAsyncOperation(
        () => getCustomerPayments({ baseUrl: resolvedBaseUrl, customer_id }),
        "fetch customer payments"
      );
    },
    [handleAsyncOperation, resolvedBaseUrl]
  );

  const createNewCustomer = useCallback(
    async (
      newCustomer: DodoPayments.Customers.CustomerCreateParams
    ): Promise<DodoPayments.Customers.Customer> => {
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
      updatedCustomer: DodoPayments.Customers.CustomerUpdateParams
    ): Promise<DodoPayments.Customers.Customer> => {
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

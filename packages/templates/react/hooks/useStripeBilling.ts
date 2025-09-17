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
  
  
} from "../lib/stripe";
import Stripe from "stripe";
import type {Product,
  Customer,
  Subscription,
  PaymentIntent,} from "../lib/stripe";

interface UseBillingState {
  loading: boolean;
  error: string | null;
}

export function useStripeBilling() {
  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const handleAsyncOperation = useCallback(
    async <T,>(operation: () => Promise<T>, operationName: string): Promise<T> => {
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

  // -------- Products --------
  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    const result = await handleAsyncOperation(() => getProducts(), "fetch products");
    setProducts(result);
    return result;
  }, [handleAsyncOperation]);

  const fetchProduct = useCallback(
    async (product_id: string): Promise<Product> => {
      return handleAsyncOperation(() => getProduct(product_id), "fetch product");
    },
    [handleAsyncOperation]
  );

  // -------- Customers --------
  const fetchCustomer = useCallback(
    async (customer_id: string): Promise<Customer> => {
      const result = await handleAsyncOperation(
        () => getCustomer(customer_id),
        "fetch customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation]
  );

  const createNewCustomer = useCallback(
    async (newCustomer: Stripe.CustomerCreateParams): Promise<Customer> => {
      const result = await handleAsyncOperation(
        () => createCustomer(newCustomer),
        "create customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation]
  );

  const updateExistingCustomer = useCallback(
    async (
      customer_id: string,
      updatedCustomer: Stripe.CustomerUpdateParams
    ): Promise<Customer> => {
      const result = await handleAsyncOperation(
        () => updateCustomer(customer_id, updatedCustomer),
        "update customer"
      );
      setCustomer(result);
      return result;
    },
    [handleAsyncOperation]
  );

  // -------- Subscriptions --------
  const fetchCustomerSubscriptions = useCallback(
    async (customer_id: string): Promise<Subscription[]> => {
      return handleAsyncOperation(
        () => getCustomerSubscriptions(customer_id),
        "fetch customer subscriptions"
      );
    },
    [handleAsyncOperation]
  );

  // -------- Payments --------
  const fetchCustomerPayments = useCallback(
    async (customer_id: string): Promise<PaymentIntent[]> => {
      return handleAsyncOperation(
        () => getCustomerPayments(customer_id),
        "fetch customer payments"
      );
    },
    [handleAsyncOperation]
  );

  // -------- Checkout --------
  const createCheckout = useCallback(
    async (opts: {
      product_id: string;
      customer_id?: string;
      success_url: string;
      cancel_url: string;
    }) => {
      return handleAsyncOperation(() => checkout(opts), "create checkout");
    },
    [handleAsyncOperation]
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

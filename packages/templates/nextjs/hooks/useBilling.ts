'use client'

import { useState, useCallback } from 'react'
import { DodoPayments } from 'dodopayments'
import {
  getProducts,
  getProduct,
  getCustomer,
  getCustomerSubscriptions,
  getCustomerPayments,
  createCustomer,
  updateCustomer,
  checkout,
} from '@/lib/dodopayments'

interface UseBillingState {
  loading: boolean
  error: string | null
}

export const useBilling = () => {
  const [state, setState] = useState<UseBillingState>({
    loading: false,
    error: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const result = await operation()
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${operationName}`
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    return handleAsyncOperation(() => getProducts(), 'fetch products')
  }, [handleAsyncOperation])

  const fetchProduct = useCallback(async (product_id: string) => {
    return handleAsyncOperation(() => getProduct(product_id), 'fetch product')
  }, [handleAsyncOperation])

  const fetchCustomer = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(() => getCustomer(customer_id), 'fetch customer')
  }, [handleAsyncOperation])

  const fetchCustomerSubscriptions = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(() => getCustomerSubscriptions(customer_id), 'fetch customer subscriptions')
  }, [handleAsyncOperation])

  const fetchCustomerPayments = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(() => getCustomerPayments(customer_id), 'fetch customer payments')
  }, [handleAsyncOperation])

  const createNewCustomer = useCallback(async (customer: DodoPayments.Customers.CustomerCreateParams) => {
    return handleAsyncOperation(() => createCustomer(customer), 'create customer')
  }, [handleAsyncOperation])

  const updateExistingCustomer = useCallback(async (
    customer_id: string,
    customer: DodoPayments.Customers.CustomerUpdateParams
  ) => {
    return handleAsyncOperation(() => updateCustomer(customer_id, customer), 'update customer')
  }, [handleAsyncOperation])

  const createCheckout = useCallback(async (
    productCart: Array<{ product_id: string; quantity: number; amount?: number }>,
    customer: DodoPayments.Payments.CustomerRequest,
    billing_address: DodoPayments.Payments.BillingAddress,
    return_url: string,
    customMetadata?: Record<string, string>
  ) => {
    return handleAsyncOperation(
      () => checkout(productCart, customer, billing_address, return_url, customMetadata),
      'create checkout'
    )
  }, [handleAsyncOperation])

  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

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
  }
}

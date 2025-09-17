'use client'

import { useState, useCallback } from 'react'
import type Stripe from 'stripe'

interface UseStripeBillingState {
  loading: boolean
  error: string | null
}

export const useStripeBilling = ({ baseUrl }: { baseUrl?: string } = {}) => {
  const [state, setState] = useState<UseStripeBillingState>({
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

  // Product operations
  const fetchProducts = useCallback(async () => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return response.json()
    }, 'fetch products')
  }, [handleAsyncOperation, baseUrl])

  const fetchProduct = useCallback(async (product_id: string) => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/product?product_id=${product_id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return response.json()
    }, 'fetch product')
  }, [handleAsyncOperation, baseUrl])

  // Customer operations
  const fetchCustomer = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/customer?customer_id=${customer_id}`)
      if (!response.ok) throw new Error('Failed to fetch customer')
      return response.json()
    }, 'fetch customer')
  }, [handleAsyncOperation, baseUrl])

  const fetchCustomerSubscriptions = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/customer/subscriptions?customer_id=${customer_id}`)
      if (!response.ok) throw new Error('Failed to fetch customer subscriptions')
      return response.json()
    }, 'fetch customer subscriptions')
  }, [handleAsyncOperation, baseUrl])

  const fetchCustomerPayments = useCallback(async (customer_id: string) => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/customer/payments?customer_id=${customer_id}`)
      if (!response.ok) throw new Error('Failed to fetch customer payments')
      return response.json()
    }, 'fetch customer payments')
  }, [handleAsyncOperation, baseUrl])

  // Checkout operations
  const createCheckout = useCallback(async (
    productCart: Array<{ price_id: string; quantity: number }>,
    customer?: { customer_id: string } | { email: string; name: string; phone_number?: string },
    success_url?: string,
    cancel_url?: string,
    metadata?: Record<string, string>
  ) => {
    return handleAsyncOperation(async () => {
      const response = await fetch(`${baseUrl || ''}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCart,
          customer,
          success_url: success_url || window.location.origin + '/success',
          cancel_url: cancel_url || window.location.origin + '/cancel',
          metadata,
        }),
      })
      if (!response.ok) throw new Error('Failed to create checkout')
      return response.json()
    }, 'create checkout')
  }, [handleAsyncOperation, baseUrl])

  const clearError = useCallback(() => setError(null), [setError])

  return {
    loading: state.loading,
    error: state.error,
    clearError,
    
    // Product operations
    fetchProducts,
    fetchProduct,
    
    // Customer operations
    fetchCustomer,
    fetchCustomerSubscriptions,
    fetchCustomerPayments,
    
    // Checkout operations
    createCheckout,
  }
}
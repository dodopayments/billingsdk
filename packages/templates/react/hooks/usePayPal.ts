import { useState } from 'react';

/**
 * Custom React hook for managing PayPal integration
 * 
 * This hook provides functions and state management for integrating
 * PayPal payments into your React application.
 */

interface PayPalOrder {
  id: string;
  status: string;
  amount: string;
  currency: string;
}

export const usePayPal = () => {
  const [order, setOrder] = useState<PayPalOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a PayPal order
   * 
   * @param amount - The amount to charge
   * @param currency - The currency code (e.g., 'USD')
   * @param description - Description of the purchase
   */
  const createOrder = async (
    amount: string,
    currency: string = 'USD',
    description: string = 'BillingSDK Purchase'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }
      
      const data = await response.json();
      setOrder({
        id: data.id,
        status: 'CREATED',
        amount,
        currency,
      });
      
      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Capture a PayPal order
   * 
   * @param orderId - The PayPal order ID to capture
   */
  const captureOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/paypal/order/${orderId}/capture`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to capture PayPal order');
      }
      
      const data = await response.json();
      setOrder(prev => prev ? { ...prev, status: 'CAPTURED' } : null);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setOrder(null);
    setLoading(false);
    setError(null);
  };

  return {
    order,
    loading,
    error,
    createOrder,
    captureOrder,
    reset,
  };
};
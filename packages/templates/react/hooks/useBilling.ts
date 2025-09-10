import { useState, useCallback } from 'react'
import { assertPayPalEnv, createOrder, captureOrder, getOrder } from '../lib/paypal'

export function useBilling({ baseUrl }: { baseUrl?: string } = {}) {
  const resolvedBaseUrl = baseUrl ?? (import.meta as any).env.VITE_BASE_URL ?? 'http://localhost:3000'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  const create = useCallback(async (amount: string, currency: string) => {
    try {
      setLoading(true); setError(null); assertPayPalEnv(resolvedBaseUrl)
      const order = await createOrder({ baseUrl: resolvedBaseUrl, amount, currency })
      setLastOrderId(order.id)
      return order
    } catch (e: any) { setError(e?.message ?? 'Failed to create order'); throw e } finally { setLoading(false) }
  }, [resolvedBaseUrl])

  const capture = useCallback(async (orderId: string) => {
    try {
      setLoading(true); setError(null)
      const order = await captureOrder({ baseUrl: resolvedBaseUrl, orderId })
      return order
    } catch (e: any) { setError(e?.message ?? 'Failed to capture order'); throw e } finally { setLoading(false) }
  }, [resolvedBaseUrl])

  const fetchOrder = useCallback(async (orderId: string) => {
    try {
      setLoading(true); setError(null)
      const order = await getOrder({ baseUrl: resolvedBaseUrl, orderId })
      return order
    } catch (e: any) { setError(e?.message ?? 'Failed to fetch order'); throw e } finally { setLoading(false) }
  }, [resolvedBaseUrl])

  return { loading, error, lastOrderId, create, capture, fetchOrder }
}

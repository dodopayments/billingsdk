export type PayPalOrder = { id: string; status: string }

export function assertPayPalEnv(baseUrl?: string) {
  if (baseUrl) {
    // If baseUrl is provided, validation passes
    return
  }
  if (!(import.meta as any).env.VITE_BASE_URL) {
    throw new Error('VITE_BASE_URL is not set')
  }
}

export const createOrder = async ({ baseUrl, amount, currency }: { baseUrl: string; amount: string; currency: string }): Promise<PayPalOrder> => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ amount, currency }),
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`Failed to create order: ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(t)
  }
}

export const captureOrder = async ({ baseUrl, orderId }: { baseUrl: string; orderId: string }): Promise<PayPalOrder> => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(`${baseUrl}/api/order/capture`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ orderId }),
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`Failed to capture order: ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(t)
  }
}

export const getOrder = async ({ baseUrl, orderId }: { baseUrl: string; orderId: string }): Promise<PayPalOrder> => {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(`${baseUrl}/api/order/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      signal: controller.signal
    })
    if (!res.ok) throw new Error(`Failed to fetch order: ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(t)
  }
}
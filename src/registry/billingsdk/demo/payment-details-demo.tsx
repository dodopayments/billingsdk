'use client'

import { useState } from 'react'
import { PaymentDetails, type PaymentFormData } from '@/components/billingsdk/payment-details'

export function PaymentDetailsDemo() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSubmit = async (_data: PaymentFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowConfirmation(true)
    
    // Auto-hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false)
    }, 3000)
  }

  const handleDiscard = () => {
    console.log('Form discarded')
  }

  return (
    <div className="w-full flex justify-center">
      <PaymentDetails
        title="Payment Details"
        description="Enter your payment information to complete the transaction."
        onSubmit={handleSubmit}
        onDiscard={handleDiscard}
        showConfirmation={showConfirmation}
        onConfirmationClose={() => setShowConfirmation(false)}
      />
    </div>
  )
}

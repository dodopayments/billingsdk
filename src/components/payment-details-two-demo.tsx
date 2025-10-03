"use client"

import { PaymentDetailsTwo, type PaymentFormData } from "@/components/billingsdk/payment-details-two";


export function PaymentDetailsTwoDemo() {

  //Function that handles onSubmit in the Form
  const handleSubmit = async (_data: PaymentFormData) => {
    // _data contains all the form values entered by the user:
    // e.g., _data.cardNumber, _data.nameOnCard, _data.validTill, _data.cvv, _data.firstName, etc.
    // You can use this object to make an API call to your backend, for example:
    // await fetch('/api/payment', { method: 'POST', body: JSON.stringify(_data) })

    return await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Handle Submit Function")
        resolve('The promise is resolved')
      }, 3000)
    })
  }


  //Function that handles onCancel in the Form
  const handleDiscard = () => {
    console.log("The Discard Function")
  }

  return (
    <PaymentDetailsTwo
      onSubmit={handleSubmit}
      onDiscard={handleDiscard}
    />
  )
}



"use client"

import React, { useState } from "react";
import { PaymentMethodManager, PaymentMethod } from "@/components/billingsdk/payment-method-manager";

const initialMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "credit",
    last4: "1234",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "pm2",
    type: "ach",
    last4: "5678",
    expiry: undefined,
    isDefault: false,
    routing: "123456789",
  },
  {
    id: "pm3",
    type: "credit",
    last4: "4321",
    expiry: "11/27",
    isDefault: false,
  },
];

export function PaymentMethodManagerDemo() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialMethods);

  const handleAdd = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method]);
  };

  const handleEdit = (updated: PaymentMethod) => {
    setPaymentMethods((prev) => prev.map((pm) => pm.id === updated.id ? updated : pm));
  };

  const handleRemove = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) => prev.map((pm) => ({ ...pm, isDefault: pm.id === id })));
  };

  const handleRedirect = (type: 'add' | 'edit', methodId?: string) => {
    console.log("Redirecting...", { type, methodId });
  };

  return (
    <PaymentMethodManager
      paymentMethods={paymentMethods}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onRemove={handleRemove}
      onSetDefault={handleSetDefault}
      onRedirect={handleRedirect}
      className="w-full"
    />
  );
}

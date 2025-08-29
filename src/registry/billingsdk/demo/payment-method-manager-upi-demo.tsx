
"use client";

import React, { useState } from "react";
import PaymentMethodManagerUPI, { PaymentMethodUPI } from "../payment-method-manager-upi";

const initialUPIMethods: PaymentMethodUPI[] = [
  { id: "upi1", vpa: "user@upi", bank: "HDFC", isDefault: true },
  { id: "upi2", vpa: "another@upi", bank: "ICICI", isDefault: false },
  { id: "upi3", vpa: "third@upi", isDefault: false },
];

const Demo = () => {
  const [methods, setMethods] = useState<PaymentMethodUPI[]>(initialUPIMethods);

  const handleAdd = (method: PaymentMethodUPI) => {
    setMethods((prev) => [...prev, method]);
    console.log("Added UPI:", method);
  };

  const handleEdit = (updated: PaymentMethodUPI) => {
    setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    console.log("Edited UPI:", updated);
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    console.log("Removed UPI:", id);
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
    console.log("Set default UPI:", id);
  };

  const handleRedirect = (type: 'add' | 'edit', methodId?: string) => {
    console.log("Redirecting...", { type, methodId });
  };

  return (
    <div className="bg-background p-2">
      <PaymentMethodManagerUPI
        paymentMethods={methods}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onSetDefault={handleSetDefault}
        onRedirect={handleRedirect}
      />
    </div>
  );
};

export default Demo;

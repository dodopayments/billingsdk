"use client";
import dynamic from "next/dynamic";

const PaymentMethodManagerUPIDemo = dynamic(() => import("@/registry/billingsdk/demo/payment-method-manager-upi-demo"), { ssr: false });

export default PaymentMethodManagerUPIDemo;

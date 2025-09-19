'use client';
import {PaymentCard} from "@/components/billingsdk/payment-card";

export function PaymentCardDemo() {
  return <PaymentCard
  title="Final step, make the payment."
  description="To finalize your subscription, kindly complete your payment using a valid credit card."
  price="100"
  finalText={[
    { text: "Automated billing & invoices" },
    { text: "Priority support" },
    { text: "Exclusive member benefits" },
  ]}
  feature="Payment & Invoice"
  featuredescription="Automated billing and invoicing with detailed transaction records. Professional receipts delivered instantly to your email."
  feature2="Priority Support"
  feature2description="Get dedicated customer support with faster response times and direct access to our technical team for any issues."
  onPay={async ({ cardNumber, expiry, cvc }) => {
    console.log(`Payment Processed! ${cardNumber}, exp ${expiry}, cvc ${cvc}`);
  }}
  />;
}

export default PaymentCardDemo;
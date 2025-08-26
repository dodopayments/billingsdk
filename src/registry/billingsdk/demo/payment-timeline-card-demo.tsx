'use client'

import { PaymentTimelineCard, type PaymentTimelineItem } from '@/components/billingsdk/payment-timeline-card';

export default function PaymentTimelineCardDemo() {
  const payments: PaymentTimelineItem[] = [
    {
      id: 'pay_001',
      date: 'Dec 1, 2024',
      amount: '$49.00',
      description: 'Pro Plan - Monthly Subscription',
      status: 'completed',
      paymentMethod: 'Visa •••• 4242',
      transactionId: 'txn_1ABC123',
      receiptUrl: 'https://example.com/receipts/pay_001.pdf',
      type: 'payment'
    },
    {
      id: 'pay_002',
      date: 'Nov 1, 2024',
      amount: '$49.00',
      description: 'Pro Plan - Monthly Subscription',
      status: 'completed',
      paymentMethod: 'Visa •••• 4242',
      transactionId: 'txn_1ABC122',
      receiptUrl: 'https://example.com/receipts/pay_002.pdf',
      type: 'payment'
    },
    {
      id: 'pay_003',
      date: 'Oct 15, 2024',
      amount: '$24.50',
      description: 'Partial Refund - Billing Adjustment',
      status: 'refunded',
      paymentMethod: 'Visa •••• 4242',
      transactionId: 'txn_1ABC121',
      receiptUrl: 'https://example.com/receipts/pay_003.pdf',
      type: 'refund'
    },
    {
      id: 'pay_004',
      date: 'Oct 1, 2024',
      amount: '$49.00',
      description: 'Pro Plan - Monthly Subscription',
      status: 'failed',
      paymentMethod: 'Visa •••• 4242',
      transactionId: 'txn_1ABC120',
      type: 'payment'
    },
    {
      id: 'pay_005',
      date: 'Sep 1, 2024',
      amount: '$49.00',
      description: 'Pro Plan - Monthly Subscription',
      status: 'completed',
      paymentMethod: 'Mastercard •••• 5555',
      transactionId: 'txn_1ABC119',
      receiptUrl: 'https://example.com/receipts/pay_005.pdf',
      type: 'payment'
    },
    {
      id: 'pay_006',
      date: 'Aug 15, 2024',
      amount: '$10.00',
      description: 'Account Credit Adjustment',
      status: 'completed',
      transactionId: 'txn_1ABC118',
      type: 'adjustment'
    },
    {
      id: 'pay_007',
      date: 'Aug 1, 2024',
      amount: '$49.00',
      description: 'Pro Plan - Monthly Subscription',
      status: 'pending',
      paymentMethod: 'Mastercard •••• 5555',
      transactionId: 'txn_1ABC117',
      type: 'payment'
    }
  ];

  const handleDownloadReceipt = (paymentId: string) => {
    console.log('Downloading receipt for payment:', paymentId);
  };

  const handleViewDetails = (paymentId: string) => {
    console.log('Viewing details for payment:', paymentId);
  };

  return (
    <div className="w-full space-y-6">
      {/* Default Payment Timeline */}
      <PaymentTimelineCard
        payments={payments}
        onDownloadReceipt={handleDownloadReceipt}
        onViewDetails={handleViewDetails}
      />

      {/* Limited Items with Custom Title */}
      <PaymentTimelineCard
        title="Recent Payments"
        description="Your last 3 payment transactions."
        payments={payments}
        maxItems={3}
        showTransactionId={true}
        onDownloadReceipt={handleDownloadReceipt}
        onViewDetails={handleViewDetails}
        className="max-w-2xl"
      />

      {/* Minimal Version */}
      <PaymentTimelineCard
        title="Payment Summary"
        payments={payments.slice(0, 4)}
        showPaymentMethod={false}
        showTransactionId={false}
        className="max-w-lg"
      />
    </div>
  );
}


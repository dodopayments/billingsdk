'use client'

import { InvoiceHistory, type InvoiceItem } from '@/components/billingsdk/invoice-history';

export default function InvoiceHistoryDemo() {
  const invoices: InvoiceItem[] = [
    { id: 'inv_001', date: '2025-06-01', amount: '$49.00', status: 'paid', description: 'Pro plan — May 2025', invoiceUrl: 'https://example.com/invoices/inv_001.pdf' },
    { id: 'inv_002', date: '2025-05-01', amount: '$49.00', status: 'paid', description: 'Pro plan — April 2025', invoiceUrl: 'https://example.com/invoices/inv_002.pdf' },
    { id: 'inv_003', date: '2025-04-01', amount: '$49.00', status: 'refunded', description: 'Pro plan — March 2025' },
    { id: 'inv_004', date: '2025-03-01', amount: '$49.00', status: 'open', description: 'Pro plan — February 2025' },
  ];

  return (
    <div className="w-full">
      <InvoiceHistory invoices={invoices} />
    </div>
  );
}



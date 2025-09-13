'use client';

import { InvoiceHistory2 } from '@/registry/billingsdk/invoice-history-2';

export function InvoiceHistory2Demo() {
	return (
		<InvoiceHistory2
			title="Billing History"
			description="Your past invoices and payment records"
			invoices={[
				{
					id: '1',
					date: '2025-08-15',
					description: 'Pro Plan (Monthly)',
					amount: '$29.00',
					status: 'paid',
					invoiceUrl: 'https://example.com/invoice/1',
				},
				{
					id: '2',
					date: '2025-07-15',
					description: 'Pro Plan (Monthly)',
					amount: '$29.00',
					status: 'refunded',
				},
				{
					id: '3',
					date: '2025-06-15',
					description: 'Pro Plan (Monthly)',
					amount: '$29.00',
					status: 'open',
					invoiceUrl: 'https://example.com/invoice/3',
				},
				{
					id: '4',
					date: '2025-05-15',
					// description is now optional
					amount: '$29.00',
					status: 'void',
				},
			]}
			onDownload={(id) => console.log(`Download invoice ${id}`)}
		/>
	);
}

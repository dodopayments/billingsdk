'use client';

import { BillingSummaryCard } from '@/registry/billingsdk/billing-summary-card';

export function BillingSummaryCardDemo() {
	return (
		<BillingSummaryCard
			plan={{
				name: 'Pro',
				price: '$29',
				period: 'month',
				renewalDate: 'Oct 15, 2025',
				paymentMethod: 'Visa ending in 4242',
			}}
			onUpgrade={() => console.log('Upgrade clicked')}
		/>
	);
}

'use client';

import { Alerts } from '@/components/billingsdk/alerts';

export default function AlertsDemo() {
	return (
		<Alerts
			alerts={[
				{
					id: '1',
					type: 'warning',
					title: 'High Usage Alert',
					message:
						"You've used 90% of your API quota. Upgrade to avoid service interruption.",
					actionText: 'Upgrade Plan',
					onAction: () => console.log('Upgrade clicked'),
					dismissible: true,
				},
				{
					id: '2',
					type: 'info',
					title: 'New Feature Available',
					message: 'Check out our new analytics dashboard for better insights.',
					actionText: 'View Dashboard',
					onAction: () => console.log('View dashboard clicked'),
					dismissible: true,
				},
				{
					id: '3',
					type: 'success',
					title: 'Payment Successful',
					message: 'Your payment of $29.00 has been processed successfully.',
					dismissible: true,
				},
				{
					id: '4',
					type: 'error',
					title: 'Payment Failed',
					message:
						'Your payment method was declined. Please update your payment information.',
					actionText: 'Update Payment Method',
					onAction: () => console.log('Update payment clicked'),
					dismissible: true,
				},
			]}
			onDismiss={(id) => console.log('Dismissed alert', id)}
		/>
	);
}

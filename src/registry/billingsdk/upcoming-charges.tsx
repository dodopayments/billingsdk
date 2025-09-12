'use client';

import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export interface ChargeItem {
	id: string;
	description: string;
	amount: string;
	date: string;
	type: 'prorated' | 'recurring' | 'one-time';
}

export interface UpcomingChargesProps {
	className?: string;
	title?: string;
	description?: string;
	nextBillingDate: string;
	totalAmount: string;
	charges: ChargeItem[];
}

export function UpcomingCharges({
	className,
	title = 'Upcoming Charges',
	description,
	nextBillingDate,
	totalAmount,
	charges,
}: UpcomingChargesProps) {
	const getChargeTypeBadge = (type: ChargeItem['type']) => {
		switch (type) {
			case 'prorated':
				return <Badge variant="secondary">Prorated</Badge>;
			case 'recurring':
				return <Badge variant="default">Recurring</Badge>;
			case 'one-time':
				return <Badge variant="outline">One-time</Badge>;
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	return (
		<Card className={cn('w-full', className)}>
			<CardHeader className="pb-4">
				<CardTitle className="text-lg">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="rounded-lg border bg-muted/20 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Calendar className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">
									Next Billing Date
								</p>
								<p className="font-medium">{nextBillingDate}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">Total Amount</p>
							<p className="text-2xl font-bold">{totalAmount}</p>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="font-medium">Charge Breakdown</h3>
					<div className="space-y-2">
						{charges.map((charge) => (
							<div
								key={charge.id}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div>
									<div className="flex items-center gap-2">
										<span className="font-medium">{charge.description}</span>
										{getChargeTypeBadge(charge.type)}
									</div>
									<p className="text-sm text-muted-foreground">{charge.date}</p>
								</div>
								<div className="text-right">
									<p className="font-medium">{charge.amount}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

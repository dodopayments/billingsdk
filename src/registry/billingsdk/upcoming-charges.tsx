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
			<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
				<CardTitle className="text-base sm:text-lg">{title}</CardTitle>
				{description && <CardDescription className="text-sm">{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
				<div className="rounded-lg border bg-muted/20 p-3 sm:p-4">
					<div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
						<div className="flex items-center gap-2 sm:gap-3">
							<Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
							<div className="min-w-0">
								<p className="text-xs sm:text-sm text-muted-foreground">
									Next Billing Date
								</p>
								<p className="font-medium text-sm sm:text-base">{nextBillingDate}</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
							<p className="text-xl sm:text-2xl font-bold">{totalAmount}</p>
						</div>
					</div>
				</div>

				<div className="space-y-2 sm:space-y-3">
					<h3 className="font-medium text-sm sm:text-base">Charge Breakdown</h3>
					<div className="space-y-2">
						{charges.map((charge) => (
							<div
								key={charge.id}
								className="rounded-lg border p-3"
							>
								<div className="flex items-center justify-between gap-3 mb-2">
									<div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
										<span className="font-medium text-sm sm:text-base">{charge.description}</span>
										{getChargeTypeBadge(charge.type)}
									</div>
									<div className="text-right flex-shrink-0">
										<p className="font-medium text-sm sm:text-base">{charge.amount}</p>
									</div>
								</div>
								<p className="text-xs sm:text-sm text-muted-foreground">{charge.date}</p>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, CreditCard } from 'lucide-react';

export type BillingSummaryPlan = {
	name: string;
	price: string;
	period: 'month' | 'year';
	renewalDate: string;
	paymentMethod: string;
};

export interface BillingSummaryCardProps {
	className?: string;
	plan: BillingSummaryPlan;
	onUpgrade?: () => void;
}

export function BillingSummaryCard({
	className,
	plan,
	onUpgrade,
}: BillingSummaryCardProps) {
	return (
		<Card className={cn('w-full', className)}>
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-lg">
					<CreditCard
						aria-hidden="true"
						focusable="false"
						className="h-5 w-5 text-primary"
					/>
					Billing Summary
				</CardTitle>
				<CardDescription>
					Your current plan and billing information
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="rounded-lg border bg-muted/20 p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-xl font-bold">{plan.name} Plan</h3>
							<p className="text-2xl font-bold mt-1">
								{plan.price}
								<span className="text-base font-normal text-muted-foreground">
									/{plan.period}
								</span>
							</p>
						</div>
						<Button
							type="button"
							onClick={onUpgrade}
							disabled={!onUpgrade}
							aria-disabled={!onUpgrade}
							className="whitespace-nowrap"
						>
							Upgrade Plan
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="flex items-center gap-3 rounded-lg border p-4">
						<Calendar
							aria-hidden="true"
							focusable="false"
							className="h-5 w-5 text-muted-foreground"
						/>
						<div>
							<p className="text-sm text-muted-foreground">Renewal Date</p>
							<p className="font-medium">{plan.renewalDate}</p>
						</div>
					</div>
					<div className="flex items-center gap-3 rounded-lg border p-4">
						<CreditCard
							aria-hidden="true"
							focusable="false"
							className="h-5 w-5 text-muted-foreground"
						/>
						<div>
							<p className="text-sm text-muted-foreground">Payment Method</p>
							<p className="font-medium">{plan.paymentMethod}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

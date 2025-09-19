'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface UsageResource {
	name: string;
	used: number;
	limit: number;
	percentage?: number;
	unit?: string;
}

export interface DetailedUsageTableProps {
	className?: string;
	title?: string;
	description?: string;
	resources: UsageResource[];
}

export function DetailedUsageTable({
	className,
	title = 'Detailed Usage',
	description,
	resources,
}: DetailedUsageTableProps) {
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat().format(num);
	};

	const getPercentageBar = (percentage: number) => {
		let bgColor = 'bg-green-500';
		if (percentage >= 90) bgColor = 'bg-red-500';
		else if (percentage >= 75) bgColor = 'bg-yellow-500';

		return (
			<div className="flex items-center gap-2">
				<div className="h-2 w-full rounded-full bg-muted">
					<div
						className={cn('h-2 rounded-full', bgColor)}
						style={{ width: `${Math.max(0, Math.min(percentage, 100))}%` }}
					/>
				</div>
				<span className="text-xs w-10">{Math.round(percentage)}%</span>
			</div>
		);
	};

	return (
		<Card className={cn('w-full', className)}>
			<CardHeader className="pb-4">
				<CardTitle className="text-lg">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableCaption className="sr-only">
							Detailed usage of resources
						</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[200px]">Resource</TableHead>
								<TableHead className="text-right">Used</TableHead>
								<TableHead className="text-right">Limit</TableHead>
								<TableHead className="text-right">%</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{resources.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="h-24 text-center text-muted-foreground"
									>
										No resources found
									</TableCell>
								</TableRow>
							) : (
								resources.map((resource, index) => {
									// Calculate percentage if not provided, protecting against divide-by-zero
									const percentage =
										resource.percentage ??
										(resource.limit > 0
											? (resource.used / resource.limit) * 100
											: 0);

									const unit = resource.unit ? ` ${resource.unit}` : '';

									return (
										<TableRow key={resource.name || index}>
											<TableCell className="font-medium">
												{resource.name}
											</TableCell>
											<TableCell className="text-right font-mono">
												{formatNumber(resource.used)}
												{unit}
											</TableCell>
											<TableCell className="text-right font-mono">
												{formatNumber(resource.limit)}
												{unit}
											</TableCell>
											<TableCell className="text-right">
												{getPercentageBar(percentage)}
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

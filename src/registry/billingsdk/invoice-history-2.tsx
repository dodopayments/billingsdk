'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Download, Eye } from 'lucide-react';

// Updated interface to match invoice-history.tsx
export interface Invoice {
	id: string;
	date: string;
	description?: string;
	amount: string;
	status: 'paid' | 'refunded' | 'open' | 'void';
	invoiceUrl?: string;
}

type ActionName = 'download' | 'view';

export interface InvoiceHistory2Props {
	className?: string;
	title?: string;
	description?: string;
	invoices: Invoice[];
	onDownload?: (id: string) => void;
	/**
	 * Controls which action buttons are shown in the Action column.
	 * Accepts comma-separated string (e.g., "download,view") or an array.
	 * Defaults to both actions when omitted.
	 */
	actions?: ActionName[] | string;
	/** Optional handler for view when no invoiceUrl is present */
	onView?: (id: string) => void;
}

export function InvoiceHistory2({
	className,
	title = 'Invoice History',
	description = 'Your past invoices and payment receipts.',
	invoices,
	onDownload,
	actions,
	onView,
}: InvoiceHistory2Props) {
	const getStatusBadge = (status: Invoice['status']) => {
		switch (status) {
			case 'paid':
				return (
					<Badge className="bg-emerald-600 text-emerald-50 border-emerald-700/40">
						Paid
					</Badge>
				);
			case 'refunded':
				return <Badge variant="secondary">Refunded</Badge>;
			case 'open':
				return <Badge variant="outline">Open</Badge>;
			case 'void':
				return <Badge variant="outline">Void</Badge>;
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	// Determine which actions are allowed
	const isActionName = (v: string): v is ActionName =>
		v === 'download' || v === 'view';

	const normalizedActions: ActionName[] = Array.isArray(actions)
		? actions.filter(isActionName)
		: typeof actions === 'string'
		? actions
				.split(',')
				.map((s) => s.trim())
				.filter(isActionName)
		: ['download', 'view'];

	const allowView = normalizedActions.includes('view');
	const allowDownload = normalizedActions.includes('download');

	// Get aria-labels
	const getViewAriaLabel = (invoice: Invoice) => {
		const base = invoice.description || 'Invoice';
		const amt = invoice.amount ? ` for ${invoice.amount}` : '';
		return invoice.invoiceUrl
			? `View ${base} ${invoice.id}${amt} in new tab`
			: `View ${base} ${invoice.id}${amt}`;
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
							List of invoices with date, description, amount, status, and
							available actions
						</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-right">Amount</TableHead>
								<TableHead className="text-center">Status</TableHead>
								<TableHead className="text-right">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoices.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="h-24 text-center text-muted-foreground"
									>
										No invoices found
									</TableCell>
								</TableRow>
							) : (
								invoices.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell className="font-medium">
											{invoice.date}
										</TableCell>
										<TableCell>{invoice.description || 'Invoice'}</TableCell>
										<TableCell className="text-right font-medium">
											{invoice.amount}
										</TableCell>
										<TableCell className="text-center">
											{getStatusBadge(invoice.status)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												{allowView && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															if (invoice.invoiceUrl) {
																window.open(
																	invoice.invoiceUrl,
																	'_blank',
																	'noopener,noreferrer'
																);
															} else {
																onView?.(invoice.id);
															}
														}}
														aria-label={getViewAriaLabel(invoice)}
														disabled={!invoice.invoiceUrl && !onView}
													>
														<Eye className="h-4 w-4 mr-1" />
														View
													</Button>
												)}
												{allowDownload && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => onDownload?.(invoice.id)}
														aria-label={`Download invoice ${invoice.id}`}
														disabled={!onDownload}
													>
														<Download className="h-4 w-4 mr-1" />
														Download
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

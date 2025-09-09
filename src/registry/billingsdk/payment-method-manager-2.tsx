'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
	AlertCircle,
	Building,
	CheckCircle2,
	CreditCard,
	Eye,
	EyeOff,
	Loader2,
	Pencil,
	Plus,
	Search,
	Star,
	Trash2,
} from 'lucide-react';

import React, { useId, useState } from 'react';

// moved into PaymentMethodItem for per-instance stable ID

export interface PaymentMethod2 {
	id: string;
	type: 'credit' | 'ach';
	last4: string;
	expiry?: string;
	isDefault: boolean;
	brand?: string;
	bankName?: string;
	cardholderName?: string;
	createdAt: string;
	status: 'active' | 'expired' | 'inactive';
}

export interface PaymentMethodManager2Props {
	paymentMethods: PaymentMethod2[];
	onAdd?: () => void;
	onEdit?: (id: string, changes?: Partial<PaymentMethod2>) => void;
	onRemove?: (id: string) => void;
	onSetDefault?: (id: string) => void;
	onViewDetails?: (id: string) => void;
	className?: string;
	isLoading?: boolean;
	error?: string | null;
}

// Payment Method Item Component
interface PaymentMethodItemProps {
	method: PaymentMethod2;
	onEdit: (id: string, changes?: Partial<PaymentMethod2>) => void;
	onRemove: (id: string) => void;
	onSetDefault: (id: string) => void;
	onViewDetails: (id: string) => void;
}

function PaymentMethodItem({
	method,
	onEdit,
	onRemove,
	onSetDefault,
	onViewDetails,
}: PaymentMethodItemProps) {
	const inputId = useId();
	const [isRemoving, setIsRemoving] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		cardholderName: method.cardholderName || '',
	});

	const handleRemove = () => {
		setIsRemoving(true);
	};

	const confirmRemove = () => {
		onRemove(method.id);
		setIsRemoving(false);
	};

	const toggleDetails = () => {
		setShowDetails(!showDetails);
		if (!showDetails) {
			onViewDetails(method.id);
		}
	};

	// Get status color variant for badge
	const getStatusVariant = (status: PaymentMethod2['status']) => {
		switch (status) {
			case 'active':
				return 'default';
			case 'expired':
				return 'destructive';
			case 'inactive':
				return 'secondary';
		}
	};

	// Get status text with proper capitalization
	const getStatusText = (status: PaymentMethod2['status']) => {
		return status.charAt(0).toUpperCase() + status.slice(1);
	};

	// Format expiry date accepting MM/YY, MM/YYYY, YYYY-MM, YYYY/MM
	const formatExpiry = (expiry?: string) => {
		if (!expiry) return 'N/A';
		const s = expiry.trim();
		const m = s.match(/^(\d{1,4})\s*[-/]\s*(\d{1,4})$/);
		if (!m) return s;
		let a = parseInt(m[1], 10),
			b = parseInt(m[2], 10);
		// if first > 12 treat as YYYY-MM
		const month = a > 12 ? b : a;
		const year = a > 12 ? a : b;
		if (!month || month > 12) return s;
		return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
	};

	const handleEditSubmit = () => {
		// In a real app, this would call an API to update the payment method
		console.log('Updating payment method:', method.id, editForm);
		onEdit(method.id, { cardholderName: editForm.cardholderName });
		setIsEditing(false);
	};

	return (
		<>
			<Card className="hover:shadow-md transition-all duration-300 border-border group overflow-hidden rounded-xl">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-3">
							{method.type === 'credit' ? (
								<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
							) : (
								<div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
									<Building className="h-5 w-5 text-green-600 dark:text-green-400" />
								</div>
							)}
							<div>
								<div className="flex items-center gap-2">
									<CardTitle className="text-base font-semibold">
										{method.type === 'credit' ? 'Credit Card' : 'Bank Account'}
									</CardTitle>
									{method.isDefault && (
										<Badge
											variant="default"
											className="gap-1 text-xs py-0.5 px-1.5"
										>
											<CheckCircle2 className="h-3 w-3" />
											Default
										</Badge>
									)}
								</div>
								<CardDescription className="text-xs mt-1">
									{method.type === 'credit'
										? `${method.brand || 'Card'} ending in ${method.last4}`
										: `${method.bankName || 'Bank'} account ending in ${
												method.last4
										  }`}
								</CardDescription>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleDetails}
							className="h-8 w-8 rounded-full hover:bg-muted"
							aria-label={showDetails ? 'Hide details' : 'Show details'}
							aria-expanded={showDetails}
							aria-controls={`pm-details-${method.id}`}
						>
							{showDetails ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</CardHeader>

				<CardContent className="pb-3">
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Cardholder</span>
							<span className="font-medium truncate max-w-[120px]">
								{method.cardholderName || 'Not specified'}
							</span>
						</div>

						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Last 4 digits</span>
							<span className="font-mono">•••• {method.last4}</span>
						</div>

						{method.expiry && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Expires</span>
								<span
									className={cn(
										'font-medium',
										method.status === 'expired' ? 'text-destructive' : ''
									)}
								>
									{formatExpiry(method.expiry)}
									{method.status === 'expired' && ' (Expired)'}
								</span>
							</div>
						)}

						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Status</span>
							<Badge
								variant={getStatusVariant(method.status)}
								className="text-xs py-0.5 px-1.5"
							>
								{getStatusText(method.status)}
							</Badge>
						</div>

						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Added</span>
							<span className="font-medium">
								{(() => {
									const d = new Date(method.createdAt);
									return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
								})()}
							</span>
						</div>
					</div>

					{showDetails && (
						<div
							id={`pm-details-${method.id}`}
							className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300"
						>
							<h4 className="text-sm font-semibold mb-2">Details</h4>
							<div className="text-xs text-muted-foreground space-y-1">
								<p className="flex justify-between">
									<span>ID:</span>
									<span className="font-mono text-xs">{method.id}</span>
								</p>
								{method.type === 'credit' && method.brand && (
									<p className="flex justify-between">
										<span>Brand:</span>
										<span>{method.brand}</span>
									</p>
								)}
								{method.type === 'ach' && method.bankName && (
									<p className="flex justify-between">
										<span>Bank:</span>
										<span>{method.bankName}</span>
									</p>
								)}
								{method.expiry && (
									<p className="flex justify-between">
										<span>Full Expiry:</span>
										<span>{method.expiry}</span>
									</p>
								)}
								<p className="flex justify-between">
									<span>Type:</span>
									<span>
										{method.type === 'credit' ? 'Credit Card' : 'Bank Account'}
									</span>
								</p>
							</div>
						</div>
					)}
				</CardContent>

				<Separator />

				<CardFooter className="flex justify-between items-center pt-3">
					<div className="flex gap-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(true)}
										className="h-8 w-8 p-0 rounded-full hover:bg-muted"
										aria-label={`Edit ${
											method.type === 'credit' ? 'credit card' : 'bank account'
										} ending in ${method.last4}`}
									>
										<Pencil className="h-3.5 w-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Edit payment method</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={handleRemove}
										className="h-8 w-8 p-0 rounded-full hover:bg-muted"
										aria-label={`Remove ${
											method.type === 'credit' ? 'credit card' : 'bank account'
										} ending in ${method.last4}`}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Remove payment method</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					{!method.isDefault && method.status === 'active' && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="default"
										size="sm"
										onClick={() => onSetDefault(method.id)}
										className="h-8 px-3 gap-1 rounded-full"
										aria-label={`Set as default payment method`}
									>
										<Star className="h-3.5 w-3.5" />
										<span className="hidden sm:inline">Set Default</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Set as default payment method</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</CardFooter>
			</Card>

			{/* Remove Confirmation Dialog */}
			<Dialog open={isRemoving} onOpenChange={setIsRemoving}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-destructive" />
							Remove Payment Method
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove this payment method? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
							{method.type === 'credit' ? (
								<CreditCard className="h-5 w-5 text-muted-foreground" />
							) : (
								<Building className="h-5 w-5 text-muted-foreground" />
							)}
							<div>
								<p className="text-sm font-medium">
									{method.type === 'credit' ? 'Credit Card' : 'Bank Account'}
								</p>
								<p className="text-xs text-muted-foreground">
									Ending in {method.last4}
								</p>
							</div>
						</div>
						{method.isDefault && (
							<div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
								<p className="text-xs text-amber-700 dark:text-amber-300">
									⚠️ This is your default payment method. Removing it will
									require you to set a new default.
								</p>
							</div>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button variant="destructive" onClick={confirmRemove}>
							Remove
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Pencil className="h-5 w-5" />
							Edit Payment Method
						</DialogTitle>
						<DialogDescription>
							Update the details for your{' '}
							{method.type === 'credit' ? 'credit card' : 'bank account'} ending
							in {method.last4}.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
							{method.type === 'credit' ? (
								<CreditCard className="h-5 w-5 text-muted-foreground" />
							) : (
								<Building className="h-5 w-5 text-muted-foreground" />
							)}
							<div>
								<p className="text-sm font-medium">
									{method.type === 'credit' ? 'Credit Card' : 'Bank Account'}
								</p>
								<p className="text-xs text-muted-foreground">
									Ending in {method.last4}
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={inputId}>Cardholder Name</Label>
							<Input
								id={inputId}
								value={editForm.cardholderName}
								onChange={(e) =>
									setEditForm({ ...editForm, cardholderName: e.target.value })
								}
								placeholder="Enter cardholder name"
							/>
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button onClick={handleEditSubmit}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

// Empty State Component
interface EmptyStateProps {
	onAdd: () => void;
	isLoading?: boolean;
}

function EmptyState({ onAdd, isLoading }: EmptyStateProps) {
	return (
		<Card className="col-span-full text-center py-12 border-border shadow-sm border-dashed rounded-xl">
			<CardContent className="space-y-4">
				<div className="flex justify-center">
					<div className="rounded-full bg-muted p-4">
						<CreditCard className="h-10 w-10 text-muted-foreground" />
					</div>
				</div>
				<div className="space-y-2">
					<h3 className="text-xl font-semibold">No payment methods yet</h3>
					<p className="text-muted-foreground max-w-md mx-auto">
						Add your first payment method to get started with secure payments.
					</p>
				</div>
				<div className="pt-2">
					<Button
						onClick={onAdd}
						className="gap-2 rounded-full px-6 py-2 text-base"
						aria-label="Add New Payment Method"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							<Plus className="h-5 w-5" />
						)}
						Add Payment Method
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

// Loading Skeleton Component
function LoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{Array.from({ length: 3 }).map((_, index) => (
				<Card key={index} className="animate-pulse rounded-xl">
					<CardHeader className="pb-3">
						<div className="flex items-center space-x-3">
							<div className="h-10 w-10 rounded-lg bg-muted" />
							<div className="space-y-2">
								<div className="h-4 w-24 bg-muted rounded" />
								<div className="h-3 w-32 bg-muted rounded" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="pb-3 space-y-3">
						<div className="h-3 w-full bg-muted rounded" />
						<div className="h-3 w-3/4 bg-muted rounded" />
						<div className="h-3 w-1/2 bg-muted rounded" />
						<div className="h-3 w-2/3 bg-muted rounded" />
					</CardContent>
					<CardFooter className="justify-between">
						<div className="h-8 w-16 bg-muted rounded-full" />
						<div className="h-8 w-24 bg-muted rounded-full" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

// Error State Component
interface ErrorStateProps {
	error: string;
}

function ErrorState({ error }: ErrorStateProps) {
	return (
		<Card className="col-span-full border-destructive/20 bg-destructive/5 rounded-xl">
			<CardContent className="py-6" role="alert" aria-live="polite">
				<div className="flex items-center gap-3">
					<AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
					<div>
						<p className="text-sm font-semibold text-destructive">
							Error loading payment methods
						</p>
						<p className="text-sm text-muted-foreground">{error}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function PaymentMethodManager2({
	paymentMethods,
	onAdd,
	onEdit,
	onRemove,
	onSetDefault,
	onViewDetails,
	className,
	isLoading = false,
	error = null,
}: PaymentMethodManager2Props) {
	// State for search and filters
	const [searchTerm, setSearchTerm] = useState('');

	// Handlers
	const handleAdd = () => {
		if (onAdd) onAdd();
	};

	const handleEdit = (id: string, changes?: Partial<PaymentMethod2>) => {
		if (onEdit) onEdit(id, changes);
	};

	const handleRemove = (id: string) => {
		if (onRemove) onRemove(id);
	};

	const handleSetDefault = (id: string) => {
		if (onSetDefault) onSetDefault(id);
	};

	const handleViewDetails = (id: string) => {
		if (onViewDetails) onViewDetails(id);
	};

	// Filter and sort payment methods
	const filteredAndSortedMethods = React.useMemo(() => {
		let result = [...paymentMethods];

		if (searchTerm) {
			const term = searchTerm.trim().toLowerCase();
			result = result.filter(
				(method) =>
					(method.brand || '').toLowerCase().includes(term) ||
					(method.bankName || '').toLowerCase().includes(term) ||
					(method.last4 || '').toString().includes(term) ||
					(method.cardholderName || '').toLowerCase().includes(term)
			);
		}

		result.sort((a, b) => {
			if (a.isDefault && !b.isDefault) return -1;
			if (!a.isDefault && b.isDefault) return 1;

			if (a.type !== b.type) {
				return a.type === 'credit' ? -1 : 1;
			}

			const ta = Date.parse(a.createdAt) || 0;
			const tb = Date.parse(b.createdAt) || 0;
			return tb - ta;
		});

		return result;
	}, [paymentMethods, searchTerm]);

	return (
		<TooltipProvider>
			<div className={cn('space-y-6', className)}>
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">
							Payment Methods
						</h2>
						<p className="text-muted-foreground">
							Manage your saved payment methods for quick and secure
							transactions.
						</p>
					</div>
					<Button
						variant="default"
						onClick={handleAdd}
						className="gap-2 w-full sm:w-auto rounded-full"
						aria-label="Add New Payment Method"
						disabled={isLoading}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Plus className="h-4 w-4" />
						)}
						Add Payment Method
					</Button>
				</div>

				{/* Search Bar */}
				{!isLoading && !error && paymentMethods.length > 0 && (
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							aria-label="Search payment methods"
							placeholder="Search payment methods..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 rounded-full"
						/>
					</div>
				)}

				{/* Error State */}
				{error && <ErrorState error={error} />}

				{/* Loading State */}
				{isLoading && paymentMethods.length === 0 && <LoadingSkeleton />}

				{/* Empty State or Payment Methods */}
				{!isLoading && !error && (
					<>
						{filteredAndSortedMethods.length === 0 ? (
							searchTerm ? (
								<Card className="col-span-full text-center py-12 rounded-xl">
									<CardContent className="space-y-4">
										<div className="flex justify-center">
											<div className="rounded-full bg-muted p-3">
												<Search className="h-8 w-8 text-muted-foreground" />
											</div>
										</div>
										<div>
											<h3 className="text-lg font-semibold">
												No matching payment methods
											</h3>
											<p className="text-muted-foreground mt-1">
												No payment methods match your search. Try different
												keywords.
											</p>
										</div>
									</CardContent>
								</Card>
							) : (
								<EmptyState onAdd={handleAdd} isLoading={isLoading} />
							)
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
								{filteredAndSortedMethods.map((method) => (
									<PaymentMethodItem
										key={method.id}
										method={method}
										onEdit={handleEdit}
										onRemove={handleRemove}
										onSetDefault={handleSetDefault}
										onViewDetails={handleViewDetails}
									/>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</TooltipProvider>
	);
}

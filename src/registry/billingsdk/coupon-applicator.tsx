'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

// Validation schema for coupon codes
const _couponCodeSchema = z
	.string()
	.min(1, 'Coupon code is required')
	.max(12, 'Coupon code must be 12 characters or less')
	.regex(/^[a-zA-Z0-9]+$/, 'Coupon code must be alphanumeric');

// Simple SVG Icons
const TicketIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
		<path d="M13 5v2" />
		<path d="M13 17v2" />
		<path d="M13 11v2" />
	</svg>
);

const XIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
);

const LoaderIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M12 2v4" />
		<path d="m16.2 7.8 2.9-2.9" />
		<path d="M18 12h4" />
		<path d="m16.2 16.2 2.9 2.9" />
		<path d="M12 18v4" />
		<path d="m4.9 19.1 2.9-2.9" />
		<path d="M2 12h4" />
		<path d="m4.9 4.9 2.9 2.9" />
	</svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
		<path d="m9 11 3 3L22 4" />
	</svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="12" r="10" />
		<path d="m15 9-6 6" />
		<path d="m9 9 6 6" />
	</svg>
);

// Validation result type
export interface ValidationResult {
	isValid: boolean;
	discount?: {
		type: 'percentage' | 'fixed';
		value: number;
	};
	message?: string;
	newTotal?: number;
	savings?: number;
}

// Component props
export interface CouponApplicatorProps {
	onApply: (code: string) => Promise<ValidationResult>;
	currentPrice: number;
	className?: string;
	theme?: 'classic' | 'minimal';
	autoApply?: boolean;
	onRemove?: () => void;
}

export function CouponApplicator({
	onApply,
	currentPrice,
	className,
	theme = 'classic',
	autoApply = false,
	onRemove,
}: CouponApplicatorProps) {
	const [code, setCode] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [validationResult, setValidationResult] =
		useState<ValidationResult | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

// Calculate discount values
const calculateDiscount = () => {
	if (!validationResult?.discount || status !== 'success') return null;

	const { type, value } = validationResult.discount;
	const serverSavings = validationResult.savings;
	const serverNewTotal = validationResult.newTotal;
	let savings =
		type === 'percentage'
			? currentPrice * (value / 100)
			: Math.min(value, currentPrice);

	if (typeof serverSavings === 'number' && !Number.isNaN(serverSavings)) {
		savings = serverSavings;
	}
	const computedNewTotal = Math.max(0, currentPrice - savings);
	const newTotal =
		typeof serverNewTotal === 'number' && !Number.isNaN(serverNewTotal)
			? Math.max(0, serverNewTotal)
			: computedNewTotal;

	return {
		savings,
		newTotal,
		displaySavings: formatCurrency(savings),
		displayNewTotal: formatCurrency(newTotal),
	};
};
	const discountInfo = calculateDiscount();

	// Handle apply
	const handleApply = async () => {
		const trimmedCode = code.trim();
		setStatus('loading');

		try {
			const result = await onApply(trimmedCode.toUpperCase());
			setValidationResult(result);

			if (result.isValid) {
				setStatus('success');
				setMessage(result.message || 'Coupon applied successfully!');
			} else {
				setStatus('error');
				setMessage(result.message || 'Invalid coupon code');
			}
		} catch (error) {
			setStatus('error');
			setMessage('Failed to apply coupon. Please try again.');
			console.error('Coupon application error:', error);
		} finally {
			// preserve success/error state for UI feedback
		}
	};

	// Handle remove
	const handleRemove = () => {
		setCode('');
		setStatus('idle');
		setValidationResult(null);
		setMessage(null);
		if (onRemove) onRemove();
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	// Handle key events
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleApply();
		}
	};

	// Auto apply on blur if enabled
	const handleBlur = () => {
		if (autoApply && code.trim() && status === 'idle') {
			handleApply();
		}
	};

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	return (
		<div className={cn('w-full', className)}>
			<div className="space-y-5">
				<div className="flex items-center gap-3">
					<div className="rounded-lg bg-primary/10 p-2">
						<TicketIcon className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Apply Coupon</h3>
						<p className="text-sm text-muted-foreground">
							Save on your purchase
						</p>
					</div>
				</div>

				{status !== 'success' ? (
					<div className="space-y-4">
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Input
									ref={inputRef}
									type="text"
									value={code}
									onChange={(e) => setCode(e.target.value.toUpperCase())}
									onKeyDown={handleKeyDown}
									onBlur={handleBlur}
									placeholder="Enter coupon code"
									disabled={status === 'loading'}
									className={cn(
										'pr-10 h-12 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
										code && 'pr-12',
										status === 'loading' && 'pr-12',
										theme === 'minimal' &&
											'border-0 border-b border-border rounded-none px-0'
									)}
									aria-label="Coupon code"
								/>
								{code && status !== 'loading' && (
									<button
										onClick={() => setCode('')}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
										aria-label="Clear coupon code"
									>
										<XIcon className="h-4 w-4" />
									</button>
								)}
								{status === 'loading' && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										<LoaderIcon className="h-4 w-4 animate-spin" />
									</div>
								)}
							</div>
							<Button
								onClick={handleApply}
								disabled={status === 'loading' || !code.trim()}
								className={cn(
									'h-12 px-5 rounded-lg font-medium transition-all hover:scale-[1.02]',
									theme === 'minimal' &&
										'bg-transparent text-primary hover:bg-muted'
								)}
							>
								{status === 'loading' ? (
									<LoaderIcon className="h-4 w-4 animate-spin" />
								) : (
									'Apply'
								)}
							</Button>
						</div>

						<div className="text-sm text-muted-foreground flex items-center justify-between bg-muted/50 rounded-lg p-3">
							<span>Current total:</span>
							<span className="font-semibold text-foreground">
								{formatCurrency(currentPrice)}
							</span>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50 text-foreground border-l-4 border-l-emerald-500">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-emerald-500/10 p-2">
									<CheckCircleIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div>
									<p className="font-semibold">
										Coupon Applied
									</p>
									<p className="text-sm text-muted-foreground font-mono">
										{code.toUpperCase()}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleRemove}
								className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
								aria-label="Remove coupon"
							>
								<XIcon className="h-4 w-4" />
							</Button>
						</div>

						{discountInfo && (
							<div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Discount</span>
									<span className="font-semibold text-lg">
										{validationResult?.discount?.type === 'percentage' &&
										validationResult?.discount?.value
											? `${validationResult.discount.value}%`
											: validationResult?.discount?.value
											? formatCurrency(validationResult.discount.value)
											: ''}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">You Save</span>
									<span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
										-{discountInfo.displaySavings}
									</span>
								</div>

								<div className="pt-3 border-t flex justify-between items-center">
									<span className="font-medium">New Total</span>
									<span className="text-2xl font-bold text-primary">
										{discountInfo.displayNewTotal}
									</span>
								</div>
							</div>
						)}
					</div>
				)}

				<AnimatePresence>
					{message && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<div
								className={cn(
									'rounded-lg border p-4 text-sm flex items-start gap-3',
									status === 'error'
										? 'border-destructive/50 bg-destructive/5 text-destructive border-l-4 border-l-destructive'
										: 'border border-border bg-muted/50 text-foreground border-l-4 border-l-emerald-500'
								)}
							>
								{status === 'success' ? (
									<CheckCircleIcon className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
								) : status === 'error' ? (
									<XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-destructive" />
								) : null}
								<span>{message}</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

export default CouponApplicator;

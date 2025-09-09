'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
// Alert component not available, using simple divs instead
import { CheckCircle, Loader2, Ticket, X, XCircle } from 'lucide-react';

// Validation schema for coupon codes
const couponCodeSchema = z
	.string()
	.min(1, 'Coupon code is required')
	.max(12, 'Coupon code must be 12 characters or less')
	.regex(/^[a-zA-Z0-9]+$/, 'Coupon code must be alphanumeric');

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
		const savings =
			type === 'percentage'
				? currentPrice * (value / 100)
				: Math.min(value, currentPrice);

		const newTotal = Math.max(0, currentPrice - savings);

		return {
			savings,
			newTotal,
			displaySavings: formatCurrency(savings),
			displayNewTotal: formatCurrency(newTotal),
		};
	};

	const discountInfo = calculateDiscount();

	// Validate locally
	const validateLocally = (input: string) => {
		const result = couponCodeSchema.safeParse(input.trim());
		return result.success ? null : result.error.errors[0].message;
	};

	// Handle apply
	const handleApply = async () => {
		const trimmedCode = code.trim();

		// Local validation
		const localError = validateLocally(trimmedCode);
		if (localError) {
			setStatus('error');
			setMessage(localError);
			return;
		}

		// Apply coupon
		setStatus('loading');
		setMessage(null);

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
		<div className={cn('w-full max-w-md', className)}>
			<div className="space-y-5">
				<div className="flex items-center gap-3">
					<div className="rounded-lg bg-primary/10 p-2">
						<Ticket className="h-5 w-5 text-primary" />
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
										<X className="h-4 w-4" />
									</button>
								)}
								{status === 'loading' && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin" />
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
									<Loader2 className="h-4 w-4 animate-spin" />
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
						<div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-2">
									<CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div>
									<p className="font-semibold text-emerald-800 dark:text-emerald-200">
										Coupon Applied
									</p>
									<p className="text-sm text-emerald-600 dark:text-emerald-400 font-mono">
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
								<X className="h-4 w-4" />
							</Button>
						</div>

						{discountInfo && (
							<div className="rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-5 space-y-4 shadow-sm">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Discount</span>
									<span className="font-semibold text-lg">
										{validationResult?.discount?.type === 'percentage'
											? `${validationResult.discount.value}%`
											: formatCurrency(validationResult.discount.value)}
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

								<div className="pt-2">
									<div className="w-full bg-muted rounded-full h-2">
										<div
											className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
											style={{
												width: `${Math.min(
													100,
													(discountInfo.savings / currentPrice) * 100
												)}%`,
											}}
										></div>
									</div>
									<div className="flex justify-between text-xs text-muted-foreground mt-1">
										<span>0%</span>
										<span>100%</span>
									</div>
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
										? 'border-destructive/50 bg-destructive/5 text-destructive'
										: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
								)}
							>
								{status === 'success' ? (
									<CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
								) : status === 'error' ? (
									<XCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-destructive" />
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

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
	CouponApplicator,
	type ValidationResult,
} from '@/registry/billingsdk/coupon-applicator';
import { useState } from 'react';

// Predefined coupon codes
const COUPON_CODES = [
	{
		code: 'SAVE10',
		isValid: true,
		discount: { type: 'percentage' as const, value: 10 },
		message: '10% discount applied successfully!',
	},
	{
		code: 'SAVE20',
		isValid: true,
		discount: { type: 'percentage' as const, value: 20 },
		message: '20% discount applied successfully!',
	},
	{
		code: 'FLAT50',
		isValid: true,
		discount: { type: 'fixed' as const, value: 50 },
		message: '$50 discount applied successfully!',
	},
] as const;

export default function CouponApplicatorDemo() {
	const [subtotal] = useState(99.99);
	const [applied, setApplied] = useState(false);

	const handleApply = async (code: string): Promise<ValidationResult> => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		const coupon = COUPON_CODES.find((c) => c.code === code.toUpperCase());

		if (coupon) {
			return {
				isValid: coupon.isValid,
				discount: coupon.discount,
				message: coupon.message,
			};
		}

		return {
			isValid: false,
			message: 'Invalid coupon code. Try SAVE10, SAVE20, or FLAT50.',
		};
	};

	const handleRemove = () => {
		setApplied(false);
	};

	const tax: number = 9.99;
	const shipping: number = 0;
	const total: number = subtotal + tax + shipping;

	return (
		<div className="flex w-full flex-col items-center justify-center p-4">
			<Card className="w-full max-w-3xl border-border shadow-lg">
				<CardHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<CardTitle className="text-2xl font-semibold tracking-tight">
								Secure Checkout
							</CardTitle>
							<CardDescription className="text-sm text-muted-foreground">
								Have a coupon? Apply it below and save instantly
							</CardDescription>
						</div>
						<Badge
							variant="secondary"
							className="text-[10px] uppercase tracking-wide"
						>
							🔒 SSL Secure
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="grid gap-6 md:grid-cols-2">
					{/* Order Summary */}
					<div className="rounded-xl border border-border bg-card p-5 space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="font-medium">${subtotal.toFixed(2)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Tax</span>
							<span className="font-medium">${tax.toFixed(2)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Shipping</span>
							<span className="font-medium text-emerald-600">
								{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
							</span>
						</div>
						<div className="flex items-center justify-between border-t pt-3 text-lg font-semibold">
							<span>Total</span>
							<span className="text-primary">${total.toFixed(2)}</span>
						</div>
					</div>

					{/* Coupon Applicator */}
					<CouponApplicator
						onApply={async (code) => {
							const result = await handleApply(code);
							if (result.isValid) setApplied(true);
							return result;
						}}
						currentPrice={total}
						autoApply
						onRemove={handleRemove}
					/>
				</CardContent>

				<CardFooter className="flex flex-col gap-4">
					<Button
						className="w-full text-base font-medium"
						disabled={!applied}
						size="lg"
					>
						Proceed to Payment
					</Button>

					<p className="text-xs text-center text-muted-foreground leading-relaxed">
						By continuing, you agree to our{' '}
						<a
							href="/terms"
							className="underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="/privacy"
							className="underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
						>
							Privacy Policy
						</a>
						.
					</p>

					<p className="text-[11px] text-center text-emerald-600 font-medium">
						🔒 Payments are encrypted & 100% secure
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

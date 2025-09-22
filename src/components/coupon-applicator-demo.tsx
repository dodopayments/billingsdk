'use client';

import {
	CouponApplicator,
	type ValidationResult,
} from '@/components/billingsdk/coupon-applicator';
import { useState } from 'react';

// Predefined coupon codes for demo
const DEMO_COUPONS = [
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
	const tax = 9.99;
	const total = subtotal + tax;

	const handleApply = async (code: string): Promise<ValidationResult> => {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		const coupon = DEMO_COUPONS.find((c) => c.code === code.toUpperCase());

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

	return (
		<div className="max-w-md mx-auto p-6 space-y-4 border rounded-lg shadow-sm bg-background">
			<div className="text-center space-y-2">
				<h2 className="text-xl font-semibold">Checkout</h2>
				<p className="text-sm text-muted-foreground">
					Apply a coupon code to save on your purchase
				</p>
			</div>
			
			<div className="space-y-3 p-4 rounded-lg border bg-muted/50">
				<div className="flex justify-between text-sm">
					<span>Subtotal:</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Tax:</span>
					<span>${tax.toFixed(2)}</span>
				</div>
				<div className="flex justify-between font-semibold border-t pt-2">
					<span>Total:</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>

			<CouponApplicator
				onApply={handleApply}
				currentPrice={total}
				autoApply
			/>

			<div className="text-xs text-center text-muted-foreground">
				Try codes: SAVE10, SAVE20, or FLAT50
			</div>
		</div>
	);
}

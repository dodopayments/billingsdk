'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Define types for our props
export interface FeatureToggle {
	id: string;
	label: string;
	description: string;
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
}

export interface InputField {
	id: string;
	name: string;
	value?: string;
	defaultValue?: string;
	placeholder: string;
	onChange: (value: string) => void;
	label: string;
	helperText?: string;
	type?: 'text' | 'email' | 'tel' | 'url' | 'number';
}

export interface BillingSettings2Props {
	className?: string;
	title?: string;
	features?: FeatureToggle[];
	inputFields?: InputField[];
	onSave?: () => void;
	onCancel?: () => void;
	saveButtonText?: string;
	cancelButtonText?: string;
	currencyOptions?: { value: string; label: string }[];
	defaultCurrency?: string;
	onCurrencyChange?: (value: string) => void;
}

export function BillingSettings2({
	className,
	title = "Billing Settings",
	features = [
		{
			id: "auto-renewal",
			label: "Auto-Renewal",
			description: "Automatically renew your subscription",
			enabled: true,
			onToggle: () => {},
		},
		{
			id: "invoice-emails",
			label: "Invoice Emails",
			description: "Receive emails when invoices are generated",
			enabled: true,
			onToggle: () => {},
		},
		{
			id: "promotional-emails",
			label: "Promotional Emails",
			description: "Receive occasional updates about new features and offers",
			enabled: true,
			onToggle: () => {},
		},
	],
	inputFields = [
		{
			id: "fullName",
			name: "fullName",
			defaultValue: "",
			placeholder: "John Doe",
			onChange: () => {},
			label: "Full Name",
			type: "text",
		},
		{
			id: "billingEmail",
			name: "billingEmail",
			defaultValue: "",
			placeholder: "user@example.com",
			onChange: () => {},
			label: "Billing Email",
			helperText: "Invoices will be sent to this email address",
			type: "email",
		},
		{
			id: "taxId",
			name: "taxId",
			defaultValue: "",
			placeholder: "EU123456789",
			onChange: () => {},
			label: "Tax ID (Optional)",
			helperText: "For VAT or other tax purposes",
			type: "text",
		},
	],
	onSave = () => {},
	onCancel = () => {},
	saveButtonText = "Save Changes",
	cancelButtonText = "Cancel",
	currencyOptions = [
		{ value: "usd", label: "USD - US Dollar" },
		{ value: "inr", label: "INR - Indian Rupees" },
		{ value: "eur", label: "EUR - Euro" },
		{ value: "gbp", label: "GBP - British Pound" },
		{ value: "jpy", label: "JPY - Japanese Yen" },
		{ value: "aud", label: "AUD - Australian Dollar" },
		{ value: "cad", label: "CAD - Canadian Dollar" },
		{ value: "cny", label: "CNY - Chinese Yuan" },
		{ value: "sgd", label: "SGD - Singapore Dollar" },
		{ value: "chf", label: "CHF - Swiss Franc" },
		{ value: "zar", label: "ZAR - South African Rand" },
		{ value: "aed", label: "AED - UAE Dirham" },
	],
	defaultCurrency = "usd",
	onCurrencyChange = () => {},
}: BillingSettings2Props) {
	return (
		<Card className={cn('mx-auto max-w-5xl', className)}>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<p className="text-sm text-muted-foreground">
					Manage your billing preferences and settings
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{inputFields.map((field) => (
						<div key={field.id} className="space-y-2">
							<Label htmlFor={field.id}>{field.label}</Label>
							<Input
								id={field.id}
								name={field.name}
								{...(field.value !== undefined
									? { value: field.value }
									: { defaultValue: field.defaultValue })}
								placeholder={field.placeholder}
								onChange={(e) => field.onChange(e.target.value)}
								type={field.type || "text"}
								aria-describedby={field.helperText ? `${field.id}-help` : undefined}
							/>
							{field.helperText && (
								<p id={`${field.id}-help`} className="text-xs text-muted-foreground">
									{field.helperText}
								</p>
							)}
						</div>
					))}

					<div className="space-y-2">
						<Label id="currency-label">Currency</Label>
						<Select value={defaultCurrency} onValueChange={onCurrencyChange}>
							<SelectTrigger aria-labelledby="currency-label">
								<SelectValue placeholder="Select currency" />
							</SelectTrigger>
							<SelectContent>
								{currencyOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-4">
					{features.map((feature) => (
						<div 
							key={feature.id} 
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div>
								<div className="font-medium">{feature.label}</div>
								<div className="text-sm text-muted-foreground">
									{feature.description}
								</div>
							</div>
							<Switch 
								aria-label={feature.label}
								checked={feature.enabled}
								onCheckedChange={feature.onToggle}
							/>
						</div>
					))}
				</div>

				<div className="flex items-center justify-end gap-3 pt-2">
					<Button variant="outline" onClick={onCancel}>
						{cancelButtonText}
					</Button>
					<Button onClick={onSave}>
						{saveButtonText}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
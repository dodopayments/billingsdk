'use client';

import { BillingSettings2 } from '@/components/billingsdk/billing-settings-2';
import { useState } from 'react';

export function BillingSettings2Demo() {
	const [inputValues, setInputValues] = useState({
		fullName: '',
		billingEmail: '',
		taxId: '',
	});

	const [featureToggles, setFeatureToggles] = useState({
		autoRenewal: true,
		invoiceEmails: true,
		promotionalEmails: false,
	});

	const [selectedCurrency, setSelectedCurrency] = useState('usd');

	const handleInputChange = (field: string, value: string) => {
		setInputValues(prev => ({
			...prev,
			[field]: value
		}));
	};

	// Wrapper functions for the component's enhanced handlers
	const createInputChangeHandler = (field: string) => (value: string) => {
		handleInputChange(field, value);
	};

	const createCurrencyChangeHandler = (setCurrency: (value: string) => void) => (value: string) => {
		setCurrency(value);
	};

	const handleFeatureToggle = (feature: string, enabled: boolean) => {
		setFeatureToggles(prev => ({
			...prev,
			[feature]: enabled
		}));
	};

	const handleSave = () => {
		// Validation is handled by the component, so if we reach here, validation passed
		alert('Settings saved successfully!');
		console.log('Input values:', inputValues);
		console.log('Feature toggles:', featureToggles);
		console.log('Selected currency:', selectedCurrency);
	};

	const handleCancel = () => {
		alert('Changes cancelled!');
	};

	return (
		<div className="p-6">
			<BillingSettings2
				title="Custom Billing Settings"
				inputFields={[
					{
						id: "fullName",
						name: "fullName",
						value: inputValues.fullName,
						placeholder: "Enter your full name",
						onChange: createInputChangeHandler('fullName'),
						label: "Full Name",
						type: "text",
						required: true,
						validation: {
							minLength: 2,
							maxLength: 50,
						},
					},
					{
						id: "billingEmail",
						name: "billingEmail",
						value: inputValues.billingEmail,
						placeholder: "user@example.com",
						onChange: createInputChangeHandler('billingEmail'),
						label: "Billing Email",
						helperText: "Invoices will be sent to this email address",
						type: "email",
						required: true,
					},
					{
						id: "taxId",
						name: "taxId",
						value: inputValues.taxId,
						placeholder: "EU123456789",
						onChange: createInputChangeHandler('taxId'),
						label: "Tax ID (Optional)",
						helperText: "For VAT or other tax purposes",
						type: "text",
						validation: {
							pattern: /^[A-Z]{2}\d{8,12}$/,
							customValidator: (value: string) => {
								if (value && !/^[A-Z]{2}\d{8,12}$/.test(value)) {
									return "Tax ID should be in format: XX followed by 8-12 digits (e.g., EU123456789)";
								}
								return null;
							},
						},
					},
				]}
				features={[
					{
						id: "auto-renewal",
						label: "Auto-Renewal",
						description: "Automatically renew your subscription",
						enabled: featureToggles.autoRenewal,
						onToggle: (enabled) => handleFeatureToggle('autoRenewal', enabled),
					},
					{
						id: "invoice-emails",
						label: "Invoice Emails",
						description: "Receive emails when invoices are generated",
						enabled: featureToggles.invoiceEmails,
						onToggle: (enabled) => handleFeatureToggle('invoiceEmails', enabled),
					},
					{
						id: "promotional-emails",
						label: "Promotional Emails",
						description: "Receive occasional updates about new features and offers",
						enabled: featureToggles.promotionalEmails,
						onToggle: (enabled) => handleFeatureToggle('promotionalEmails', enabled),
					},
				]}
				currencyOptions={[
					{ value: "usd", label: "USD - US Dollar" },
					{ value: "eur", label: "EUR - Euro" },
					{ value: "gbp", label: "GBP - British Pound" },
				]}
				defaultCurrency={selectedCurrency}
				onCurrencyChange={createCurrencyChangeHandler(setSelectedCurrency)}
				onSave={handleSave}
				onCancel={handleCancel}
				saveButtonText="Save Preferences"
				cancelButtonText="Discard Changes"
			/>
		</div>
	);
}
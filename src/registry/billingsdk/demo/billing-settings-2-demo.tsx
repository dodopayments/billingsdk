'use client';

import { BillingSettings2 } from '@/registry/billingsdk/billing-settings-2';
import { useState } from 'react';

export default function BillingSettings2Demo() {
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

	const handleFeatureToggle = (feature: string, enabled: boolean) => {
		setFeatureToggles(prev => ({
			...prev,
			[feature]: enabled
		}));
	};

	const handleSave = () => {
		alert('Settings saved!');
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
				title="Billing Settings Demo"
				inputFields={[
					{
						id: "fullName",
						name: "fullName",
						value: inputValues.fullName,
						placeholder: "Enter your full name",
						onChange: (value) => handleInputChange('fullName', value),
						label: "Full Name",
						type: "text",
					},
					{
						id: "billingEmail",
						name: "billingEmail",
						value: inputValues.billingEmail,
						placeholder: "user@example.com",
						onChange: (value) => handleInputChange('billingEmail', value),
						label: "Billing Email",
						helperText: "Invoices will be sent to this email address",
						type: "email",
					},
					{
						id: "taxId",
						name: "taxId",
						value: inputValues.taxId,
						placeholder: "EU123456789",
						onChange: (value) => handleInputChange('taxId', value),
						label: "Tax ID (Optional)",
						helperText: "For VAT or other tax purposes",
						type: "text",
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
				onCurrencyChange={setSelectedCurrency}
				onSave={handleSave}
				onCancel={handleCancel}
				saveButtonText="Save Preferences"
				cancelButtonText="Discard Changes"
			/>
		</div>
	);
}
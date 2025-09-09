'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	PaymentMethodManager2,
	type PaymentMethod2,
} from '@/registry/billingsdk/payment-method-manager-2';
import { Building, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function PaymentMethodManager2Demo() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod2[]>([
		{
			id: 'pm_1',
			type: 'credit',
			brand: 'Visa',
			last4: '4242',
			expiry: '12/2027',
			isDefault: true,
			cardholderName: 'John Doe',
			createdAt: '2023-01-15',
			status: 'active',
		},
		{
			id: 'pm_2',
			type: 'credit',
			brand: 'Mastercard',
			last4: '5555',
			expiry: '08/2026',
			isDefault: false,
			cardholderName: 'John Doe',
			createdAt: '2023-03-22',
			status: 'active',
		},
		{
			id: 'pm_3',
			type: 'ach',
			bankName: 'Chase Bank',
			last4: '8765',
			isDefault: false,
			cardholderName: 'John Doe',
			createdAt: '2023-05-10',
			status: 'active',
		},
		{
			id: 'pm_4',
			type: 'credit',
			brand: 'American Express',
			last4: '1234',
			expiry: '05/2024',
			isDefault: false,
			cardholderName: 'John Doe',
			createdAt: '2022-11-08',
			status: 'expired',
		},
		{
			id: 'pm_5',
			type: 'credit',
			brand: 'Discover',
			last4: '9876',
			expiry: '11/2025',
			isDefault: false,
			cardholderName: 'Jane Smith',
			createdAt: '2023-07-19',
			status: 'active',
		},
		{
			id: 'pm_6',
			type: 'ach',
			bankName: 'Bank of America',
			last4: '4321',
			isDefault: false,
			cardholderName: 'Jane Smith',
			createdAt: '2023-02-14',
			status: 'active',
		},
	]);

	// State for add payment method dialog
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [newPaymentMethod, setNewPaymentMethod] = useState<{
		type: 'credit' | 'ach';
		brand: string;
		bankName: string;
		last4: string;
		expiry: string;
		cardholderName: string;
	}>({
		type: 'credit',
		brand: '',
		bankName: '',
		last4: '',
		expiry: '',
		cardholderName: '',
	});

	const handleAdd = () => {
		// Open the add payment method dialog
		setIsAddDialogOpen(true);
	};

	const handleEdit = (id: string, changes?: Partial<PaymentMethod2>) => {
		console.log('Edit payment method', id, changes);
		// In a real app, this would open a dialog or redirect to a payment method edit flow
		alert(
			`Opening edit dialog for payment method ${id} with changes: ${JSON.stringify(
				changes
			)}...`
		);
	};

	const handleRemove = (id: string) => {
		console.log('Remove payment method', id);
		// In a real app, this would call an API to remove the payment method
		setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
	};

	const handleSetDefault = (id: string) => {
		console.log('Set default payment method', id);
		// In a real app, this would call an API to set the default payment method
		setPaymentMethods((prev) =>
			prev.map((method) => ({
				...method,
				isDefault: method.id === id,
			}))
		);
	};

	const handleViewDetails = (id: string) => {
		console.log('View details for payment method', id);
		// In a real app, this might fetch additional details or open a detailed view
	};

	// Handle form input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewPaymentMethod((prev) => ({ ...prev, [name]: value }));
	};

	// Handle select changes
	const handleSelectChange = (name: string, value: string) => {
		if (name === 'type') {
			setNewPaymentMethod((prev) => ({
				...prev,
				[name]: value as 'credit' | 'ach',
			}));
		} else {
			setNewPaymentMethod((prev) => ({ ...prev, [name]: value }));
		}
	};

	// Handle form submission
	const handleAddSubmit = () => {
		// Create a new payment method object
		const newMethod: PaymentMethod2 = {
			id: `pm_${Date.now()}`, // Generate a unique ID
			type: newPaymentMethod.type,
			last4: newPaymentMethod.last4,
			expiry:
				newPaymentMethod.type === 'credit' && newPaymentMethod.expiry
					? newPaymentMethod.expiry
					: undefined,
			isDefault: paymentMethods.length === 0, // First payment method is default
			brand: newPaymentMethod.brand || undefined,
			bankName: newPaymentMethod.bankName || undefined,
			cardholderName: newPaymentMethod.cardholderName,
			createdAt: new Date().toISOString().split('T')[0], // Today's date
			status: 'active',
		};

		// Add the new payment method to the list
		setPaymentMethods((prev) => [...prev, newMethod]);

		// Close the dialog and reset the form
		setIsAddDialogOpen(false);
		setNewPaymentMethod({
			type: 'credit',
			brand: '',
			bankName: '',
			last4: '',
			expiry: '',
			cardholderName: '',
		});
	};

	return (
		<div className="p-4">
			<PaymentMethodManager2
				paymentMethods={paymentMethods}
				onAdd={handleAdd}
				onEdit={handleEdit}
				onRemove={handleRemove}
				onSetDefault={handleSetDefault}
				onViewDetails={handleViewDetails}
			/>

			{/* Add Payment Method Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{newPaymentMethod.type === 'credit' ? (
								<CreditCard className="h-5 w-5" />
							) : (
								<Building className="h-5 w-5" />
							)}
							Add Payment Method
						</DialogTitle>
						<DialogDescription>
							Add a new payment method to your account.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="type">Payment Type</Label>
							<Select
								value={newPaymentMethod.type}
								onValueChange={(value: string) =>
									handleSelectChange('type', value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="credit">Credit Card</SelectItem>
									<SelectItem value="ach">Bank Account</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{newPaymentMethod.type === 'credit' ? (
							<>
								<div className="space-y-2">
									<Label htmlFor="brand">Card Brand</Label>
									<Select
										value={newPaymentMethod.brand}
										onValueChange={(value) =>
											handleSelectChange('brand', value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select brand" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Visa">Visa</SelectItem>
											<SelectItem value="Mastercard">Mastercard</SelectItem>
											<SelectItem value="American Express">
												American Express
											</SelectItem>
											<SelectItem value="Discover">Discover</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="last4">Last 4 Digits</Label>
									<Input
										id="last4"
										name="last4"
										value={newPaymentMethod.last4}
										onChange={handleInputChange}
										placeholder="4242"
										maxLength={4}
										inputMode="numeric"
										pattern="[0-9]{4}"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="expiry">Expiry (MM/YYYY)</Label>
									<Input
										id="expiry"
										name="expiry"
										value={newPaymentMethod.expiry}
										onChange={handleInputChange}
										placeholder="12/2027"
									/>
								</div>
							</>
						) : (
							<>
								<div className="space-y-2">
									<Label htmlFor="bankName">Bank Name</Label>
									<Input
										id="bankName"
										name="bankName"
										value={newPaymentMethod.bankName}
										onChange={handleInputChange}
										placeholder="Bank of America"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="last4">Last 4 Digits</Label>
									<Input
										id="last4"
										name="last4"
										value={newPaymentMethod.last4}
										onChange={handleInputChange}
										placeholder="4321"
										maxLength={4}
										inputMode="numeric"
										pattern="[0-9]{4}"
									/>
								</div>
							</>
						)}

						<div className="space-y-2">
							<Label htmlFor="cardholderName">Cardholder Name</Label>
							<Input
								id="cardholderName"
								name="cardholderName"
								value={newPaymentMethod.cardholderName}
								onChange={handleInputChange}
								placeholder="John Doe"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddSubmit}>Add Payment Method</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

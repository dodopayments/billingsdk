'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, CircleCheck, Info, X } from 'lucide-react';
import { useState } from 'react';

interface AlertProps {
	variant?: 'default' | 'destructive';
	className?: string;
	children?: React.ReactNode;
}

function Alert({ variant = 'default', className, children }: AlertProps) {
	const isDestructive = variant === 'destructive';

	return (
		<div
			className={cn(
				'relative w-full rounded-lg border p-4',
				isDestructive
					? 'bg-destructive/80 text-destructive-foreground border-destructive/50'
					: 'bg-background text-foreground border',
				className
			)}
			role={isDestructive ? 'alert' : 'status'}
			aria-live={isDestructive ? 'assertive' : 'polite'}
		>
			{children}
		</div>
	);
}

export interface AlertItem {
	id: string;
	type: 'warning' | 'info' | 'success' | 'error';
	title: string;
	message: string;
	actionText?: string;
	onAction?: () => void;
	dismissible?: boolean;
}

export interface AlertsBannerProps {
	className?: string;
	alerts: AlertItem[];
	onDismiss?: (id: string) => void;
}

export function Alerts({ className, alerts, onDismiss }: AlertsBannerProps) {
	const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

	const handleDismiss = (id: string) => {
		setDismissedAlerts((prev) => [...prev, id]);
		onDismiss?.(id);
	};

	const getAlertIcon = (type: AlertItem['type']) => {
		switch (type) {
			case 'warning':
				return <AlertTriangle className="h-4 w-4" />;
			case 'success':
				return <CircleCheck className="h-4 w-4" />;
			case 'info':
				return <Info className="h-4 w-4" />;
			case 'error':
				return <AlertTriangle className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
	};

	const getAlertVariant = (type: AlertItem['type']) => {
		switch (type) {
			case 'warning':
				return 'destructive';
			case 'success':
				return 'default';
			case 'info':
				return 'default';
			case 'error':
				return 'destructive';
			default:
				return 'default';
		}
	};

	const visibleAlerts = alerts.filter(
		(alert) => !dismissedAlerts.includes(alert.id)
	);

	if (visibleAlerts.length === 0) return null;

	return (
		<div className={cn('space-y-3', className)}>
			{visibleAlerts.map((alert) => (
				<Alert
					key={alert.id}
					variant={getAlertVariant(alert.type)}
					className="relative"
				>
					<div className="flex items-start">
						<div className="flex-shrink-0 mt-0.5">
							{getAlertIcon(alert.type)}
						</div>
						<div className="ml-3 flex-1">
							<div className="font-medium">{alert.title}</div>
							{alert.message && (
								<div className="text-sm opacity-90 mt-1">{alert.message}</div>
							)}
							{alert.actionText && alert.onAction && (
								<div className="mt-3">
									<Button
										variant={
											alert.type === 'warning' || alert.type === 'error'
												? 'default'
												: 'outline'
										}
										size="sm"
										onClick={alert.onAction}
										type="button"
									>
										{alert.actionText}
									</Button>
								</div>
							)}
						</div>
						{alert.dismissible !== false && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-2 top-2 h-6 w-6 p-0"
								onClick={() => handleDismiss(alert.id)}
								type="button"
								aria-label={`Dismiss ${alert.title} alert`}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				</Alert>
			))}
		</div>
	);
}

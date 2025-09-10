import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Renders a simple presentational alert containing the text "Test alert".
 *
 * Useful for visual testing or as a placeholder alert in UI examples.
 */
export function TestAlert() {
	return (
		<Alert>
			<AlertDescription>Test alert</AlertDescription>
		</Alert>
	);
}

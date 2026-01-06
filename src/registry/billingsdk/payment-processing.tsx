import { Loader2, Shield, LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type PaymentProcessingTypes = {
    status?: boolean;
    title?: string;
    description?: string;
    icon?: LucideIcon;
    processLabel?: string;
    warning?: string;
};

export default function PaymentProcessing({
    status = true,
    title = "Processing Payment",
    description = "This may take a few moments",
    icon: Icon = Shield,
    processLabel = "Secure Transaction",
    warning = "Please do not close this window",
}: PaymentProcessingTypes) {
    return (
        <>
            {status && (
                <div className="bg-background flex min-h-screen items-center justify-center p-4">
                    <div className="bg-card w-full max-w-sm space-y-6 rounded-xl border px-8 py-6 text-center md:p-8 lg:p-10">
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <Loader2 className="text-primary h-12 w-12 animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-muted-foreground text-sm">{description}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Icon className="text-muted-foreground h-4 w-4" />
                                <span className="text-muted-foreground">{processLabel}</span>
                            </div>
                        </div>

                        <Separator />

                        <p className="text-muted-foreground text-xs">{warning}</p>
                    </div>
                </div>
            )}
        </>
    );
}
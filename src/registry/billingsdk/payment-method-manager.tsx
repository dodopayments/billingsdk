
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  Loader2
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  type: "credit" | "ach";
  last4: string;
  expiry?: string;
  isDefault: boolean;
  routing?: string;
  brand?: string; // For credit cards (Visa, Mastercard, etc.)
  bankName?: string; // For ACH accounts
}

export interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAdd?: (method: PaymentMethod) => void;
  onEdit?: (method: PaymentMethod) => void;
  onRemove?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onRedirect: (type: 'add' | 'edit', methodId?: string) => void;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

// Payment Method Card Component
interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
  onRedirect: (type: 'add' | 'edit', methodId?: string) => void;
}

function PaymentMethodCard({
  method,
  onEdit,
  onRemove,
  onSetDefault,
  onRedirect
}: PaymentMethodCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleEdit = () => {
    onEdit(method);
    setEditOpen(true);
  };

  const handleRemove = () => {
    setRemoveOpen(true);
  };

  const handleRedirectToEdit = () => {
    onRedirect('edit', method.id);
    setEditOpen(false);
  };

  const handleSetDefault = () => {
    onSetDefault(method.id);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative flex flex-row items-center space-x-3 px-3 sm:px-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="p-2 rounded-lg bg-muted ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-200">
            {method.type === "credit" ? (
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            ) : (
              <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium leading-none">
              {method.type === "credit" ? "Credit Card" : "ACH Account"}
            </p>
            {method.brand && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {method.brand}
              </p>
            )}
            {method.bankName && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {method.bankName}
              </p>
            )}
          </div>
        </div>
        {method.isDefault && (
          <Badge variant="secondary" className="gap-1 shadow-sm bg-primary/90 text-primary-foreground border-0">
            <CheckCircle2 className="h-3 w-3" />
            Default
          </Badge>
        )}
      </CardHeader>

      <CardContent className="relative space-y-3 pb-4 px-3 sm:px-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded-md bg-muted/30 border border-border/30">
            <span className="text-xs sm:text-sm text-muted-foreground">Last 4 digits:</span>
            <span className="font-mono text-sm sm:text-base font-medium">**** {method.last4}</span>
          </div>
          {method.expiry && (
            <div className="flex justify-between items-center p-2 rounded-md bg-muted/30 border border-border/30">
              <span className="text-xs sm:text-sm text-muted-foreground">Expires:</span>
              <span className="font-mono text-sm sm:text-base font-medium">{method.expiry}</span>
            </div>
          )}
          {method.routing && (
            <div className="flex justify-between items-center p-2 rounded-md bg-muted/30 border border-border/30">
              <span className="text-xs sm:text-sm text-muted-foreground">Routing:</span>
              <span className="font-mono text-sm sm:text-base font-medium">{method.routing}</span>
            </div>
          )}
        </div>
      </CardContent>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      <CardFooter className="relative flex justify-between items-center px-3 sm:px-4">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 px-3 transition-all duration-200 border border-input"
                  aria-label={`Edit ${method.type === "credit" ? "credit card" : "ACH account"} ending in ${method.last4}`}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit payment method</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 px-3 transition-all duration-200 text-destructive hover:bg-destructive/10 hover:text-destructive border border-input"
                aria-label={`Remove ${method.type === "credit" ? "credit card" : "ACH account"} ending in ${method.last4}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              </TooltipTrigger>
              <TooltipContent>Remove payment method</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {!method.isDefault && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSetDefault}
                  className="gap-1 h-8 px-3 shadow-sm hover:shadow-md transition-all duration-200"
                  aria-label={`Set as default payment method`}
                >
                  <span>Set Default</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Set as default payment method</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Edit Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/50">
              <div className="p-2 rounded-lg bg-background shadow-sm">
                {method.type === "credit" ? (
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {method.type === "credit" ? "Credit Card" : "ACH Account"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ending in {method.last4}
                </p>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the payment gateway to update your payment details securely.
                No sensitive payment information is handled directly in this interface.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="default"
              onClick={handleRedirectToEdit}
              className="gap-2 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirect to Gateway
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Dialog */}
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-destructive/10 ring-1 ring-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              Remove Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm">
              Are you sure you want to remove this payment method?
            </p>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-lg border border-destructive/20">
              <div className="p-2 rounded-lg bg-background shadow-sm">
                {method.type === "credit" ? (
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {method.type === "credit" ? "Credit Card" : "ACH Account"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ending in {method.last4}
                </p>
              </div>
            </div>
            {method.isDefault && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  This is your default payment method. Removing it will require you to set a new default.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onRemove(method.id);
                setRemoveOpen(false);
              }}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Empty State Component
interface EmptyStateProps {
  onAdd: () => void;
}

function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <Card className="col-span-full text-center p-8 sm:p-12 border-dashed border-2 shadow-sm bg-gradient-to-b from-muted/30 to-background">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
            <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold">No payment methods yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Add your first payment method to get started with secure and convenient payments.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <Button 
          onClick={onAdd} 
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200" 
          aria-label="Add New Payment Method"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add Payment Method Dialog Component
interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRedirect: () => void;
}

function AddPaymentMethodDialog({
  open,
  onOpenChange,
  onRedirect
}: AddPaymentMethodDialogProps) {
  const handleRedirect = () => {
    onRedirect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
            Add Payment Method
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 p-3 border rounded-lg hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20 transition-all duration-200 cursor-pointer group">
              <div className="p-2 rounded-lg bg-muted ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-200">
                <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <div>
                <p className="text-sm font-medium">Credit Card</p>
                <p className="text-[11px] text-muted-foreground">Visa, Mastercard, etc.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20 transition-all duration-200 cursor-pointer group">
              <div className="p-2 rounded-lg bg-muted ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-200">
                <Banknote className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <div>
                <p className="text-sm font-medium">ACH Account</p>
                <p className="text-[11px] text-muted-foreground">Bank transfer</p>
              </div>
            </div>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground">
              You will be redirected to our secure payment gateway to add your payment details.
              Your information is encrypted and protected.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={handleRedirect}
            className="gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Continue to Gateway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PaymentMethodManager({
  paymentMethods,
  onAdd: _onAdd,
  onEdit: _onEdit,
  onRemove,
  onSetDefault,
  onRedirect,
  className,
  isLoading = false,
  error = null,
}: PaymentMethodManagerProps) {
  // Dialog states
  const [addOpen, setAddOpen] = useState(false);

  // Handlers
  const handleAddRedirect = () => {
    onRedirect('add');
  };

  const handleEdit = (method: PaymentMethod) => {
    if (_onEdit) _onEdit(method);
  };

  const handleRemoveById = (id: string) => {
    if (onRemove) onRemove(id);
  };



  const handleSetDefault = (id: string) => {
    if (onSetDefault) onSetDefault(id);
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header Section */}
        <Card>
          <CardHeader className="px-3 sm:px-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  Payment Methods
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your saved payment methods for quick and secure transactions.
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      onClick={() => setAddOpen(true)}
                      className="gap-2 w-full sm:w-auto transition-all duration-200"
                      aria-label="Add New Payment Method"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Add Payment Method
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add a new payment method</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-destructive/10 ring-1 ring-destructive/20 flex-shrink-0">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-destructive">Error loading payment methods</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && paymentMethods.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse shadow-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 bg-muted-foreground/20 rounded" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="space-y-2">
                    <div className="p-2 rounded-md bg-muted/50 border border-border/30">
                      <div className="h-4 w-full bg-muted rounded" />
                    </div>
                    <div className="p-2 rounded-md bg-muted/50 border border-border/30">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-muted rounded" />
                    <div className="h-8 w-20 bg-muted rounded" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Methods Grid */}
        {!isLoading && (
          <>
            {paymentMethods.length === 0 ? (
              <EmptyState onAdd={() => setAddOpen(true)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={handleEdit}
                    onRemove={handleRemoveById}
                    onSetDefault={handleSetDefault}
                    onRedirect={onRedirect}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Add Payment Method Dialog */}
        <AddPaymentMethodDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onRedirect={handleAddRedirect}
        />
      </div>
    </TooltipProvider>
  );
};

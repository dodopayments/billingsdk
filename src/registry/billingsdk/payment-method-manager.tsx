
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, CheckCircle2, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export interface PaymentMethod {
  id: string;
  type: "credit" | "ach";
  last4: string;
  expiry?: string;
  isDefault: boolean;
  routing?: string;
}

export interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAdd?: (method: PaymentMethod) => void;
  onEdit?: (method: PaymentMethod) => void;
  onRemove?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onRedirect: (type: 'add' | 'edit', methodId?: string) => void;
  className?: string;
}

export function PaymentMethodManager({
  paymentMethods,
  onAdd: _onAdd,
  onEdit: _onEdit,
  onRemove,
  onSetDefault,
  onRedirect,
  className,
}: PaymentMethodManagerProps) {
  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Handlers
  const handleAddOpen = () => {
    setAddOpen(true);
  };

  const handleEditOpen = (pm: PaymentMethod) => {
    setSelectedMethod(pm);
    setEditOpen(true);
  };

  const handleRemoveOpen = (pm: PaymentMethod) => {
    setSelectedMethod(pm);
    setRemoveOpen(true);
  };

  const handleRedirectToGateway = (type: 'add' | 'edit') => {
    if (type === 'add') {
      onRedirect('add');
      setAddOpen(false);
    } else if (type === 'edit' && selectedMethod) {
      onRedirect('edit', selectedMethod.id);
      setEditOpen(false);
    }
  };

  const handleRemoveConfirm = () => {
    if (selectedMethod) {
      if (onRemove) onRemove(selectedMethod.id);
      else console.log("Remove Payment Method", selectedMethod.id);
    }
    setRemoveOpen(false);
  };

  const handleSetDefault = (id: string) => {
    if (onSetDefault) onSetDefault(id);
    else console.log("Set Default Payment Method", id);
  };

  return (
    <div className={cn("p-4 border rounded bg-background", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={handleAddOpen} aria-label="Add New Payment Method">
              Add New Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-muted-foreground">
                You will be redirected to the payment gateway to add your payment details securely. 
                No sensitive payment information is handled directly in this interface.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="button" 
                variant="default" 
                onClick={() => handleRedirectToGateway('add')}
              >
                Redirect to Gateway
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {paymentMethods.length === 0 ? (
        <Card className="col-span-full text-center p-6 border-border shadow-sm">
          <CardContent>
            No payment methods added yet.
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => setAddOpen(true)} aria-label="Add New Payment Method">Add New Method</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
          {paymentMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-md transition-shadow border-border">
              <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                {method.type === "credit" ? (
                  <CreditCard size={20} className="text-muted-foreground" aria-label="Credit Card" />
                ) : (
                  <Banknote size={20} className="text-muted-foreground" aria-label="ACH" />
                )}
                <p className="text-md font-semibold">{method.type === "credit" ? "Credit Card" : "ACH Account"}</p>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last 4:</span>
                  <span>{method.last4}</span>
                </div>
                {method.expiry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry:</span>
                    <span>{method.expiry}</span>
                  </div>
                )}
                {method.routing && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routing:</span>
                    <span>{method.routing}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t border-border">
                {method.isDefault ? (
                  <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" aria-label="Default" /> Default</Badge>
                ) : <span />}
                <div className="flex gap-2">
                  <Dialog open={editOpen && selectedMethod?.id === method.id} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditOpen(method)} className="gap-1" aria-label="Edit payment method">
                        <Pencil className="h-3 w-3" aria-label="Edit" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <p className="text-muted-foreground">
                          You will be redirected to the payment gateway to update your payment details securely.
                          No sensitive payment information is handled directly in this interface.
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          type="button" 
                          variant="default" 
                          onClick={() => handleRedirectToGateway('edit')}
                        >
                          Redirect to Gateway
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={removeOpen && selectedMethod?.id === method.id} onOpenChange={setRemoveOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveOpen(method)} className="gap-1" aria-label="Remove payment method">
                        <Trash2 className="h-3 w-3" aria-label="Remove" /> Remove
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">Are you sure you want to remove <span className="font-bold">{method.type === "credit" ? "Credit Card" : "ACH Account"} ending in {method.last4}</span>?</div>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="button" variant="destructive" onClick={handleRemoveConfirm}>Remove</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {!method.isDefault && (
                    <Button variant="default" size="sm" onClick={() => onSetDefault?.(method.id)} className="gap-1" aria-label="Set default payment method">
                      <Star className="h-3 w-3" aria-label="Set Default" /> Set Default
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

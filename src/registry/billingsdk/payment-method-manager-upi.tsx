

"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle2, Pencil, Trash2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

export interface PaymentMethodUPI {
  id: string;
  vpa: string;
  bank?: string;
  isDefault: boolean;
}

export interface PaymentMethodManagerUPIProps {
  paymentMethods: PaymentMethodUPI[];
  onAdd: (method: PaymentMethodUPI) => void;
  onEdit: (method: PaymentMethodUPI) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
  onRedirect: (type: 'add' | 'edit', methodId?: string) => void;
  className?: string;
}



export const PaymentMethodManagerUPI: React.FC<PaymentMethodManagerUPIProps> = ({
  paymentMethods,
  onAdd: _onAdd,
  onEdit: _onEdit,
  onRemove,
  onSetDefault,
  onRedirect,
  className,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodUPI | null>(null);

  const handleRedirectToGateway = (type: 'add' | 'edit') => {
    if (type === 'add') {
      onRedirect('add');
      setAddOpen(false);
    } else if (type === 'edit' && selectedMethod) {
      onRedirect('edit', selectedMethod.id);
      setEditOpen(false);
      setSelectedMethod(null);
    }
  };

  const handleRemove = () => {
    if (selectedMethod) {
      onRemove?.(selectedMethod.id);
      setRemoveOpen(false);
      setSelectedMethod(null);
    }
  };

  const isEmpty = paymentMethods.length === 0;

  return (
    <TooltipProvider>
      <div className={cn("w-full", className)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">UPI Payment Methods</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button aria-label="Add New UPI" variant="default" onClick={() => setAddOpen(true)}>
                Add New UPI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New UPI</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-muted-foreground text-sm">
                  You will be redirected to the payment gateway to add your UPI details securely. 
                  No sensitive payment information is handled directly in this interface.
                </p>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="default" 
                  aria-label="Redirect to Gateway" 
                  onClick={() => handleRedirectToGateway('add')}
                >
                  Redirect to Gateway
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" aria-label="Cancel Add UPI">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit UPI</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-muted-foreground text-sm">
                You will be redirected to the payment gateway to update your UPI details securely.
                No sensitive payment information is handled directly in this interface.
              </p>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="default" 
                aria-label="Redirect to Gateway" 
                onClick={() => handleRedirectToGateway('edit')}
              >
                Redirect to Gateway
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary" aria-label="Cancel Edit UPI">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Remove Dialog */}
        <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Remove UPI</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              <p>Are you sure you want to remove <span className="font-semibold">{selectedMethod?.vpa}</span>?</p>
            </div>
            <DialogFooter>
              <Button variant="destructive" aria-label="Confirm Remove UPI" onClick={handleRemove}>Remove</Button>
              <DialogClose asChild>
                <Button variant="secondary" aria-label="Cancel Remove UPI">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Card className="w-full max-w-md text-center p-6 shadow-sm rounded-md">
              <CardHeader>
                <Smartphone className="mx-auto h-8 w-8 text-muted-foreground mb-2" aria-label="UPI Icon" />
                <h3 className="text-lg font-semibold">No UPI methods added yet.</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Add your first UPI payment method to get started.</p>
                <Button aria-label="Add New UPI" variant="default" onClick={() => setAddOpen(true)}>
                  Add New UPI
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="shadow-sm rounded-md border border-border p-4 bg-card">
                  <CardHeader className="flex flex-row items-center space-x-2 pb-2 bg-muted/50 rounded-t-md">
                    <Smartphone className="h-5 w-5 text-muted-foreground" aria-label="UPI Icon" />
                    <p className="text-md font-semibold">UPI</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">VPA:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono cursor-pointer underline decoration-dotted">{method.vpa}</span>
                        </TooltipTrigger>
                        <TooltipContent>Full VPA: {method.vpa}</TooltipContent>
                      </Tooltip>
                    </div>
                    {method.bank && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Bank:</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-mono cursor-pointer underline decoration-dotted">{method.bank}</span>
                          </TooltipTrigger>
                          <TooltipContent>Bank: {method.bank}</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-border gap-2">
                    {method.isDefault ? (
                      <Badge variant="secondary" className="gap-1" aria-label="Default UPI">
                        <CheckCircle2 className="h-3 w-3" /> Default
                      </Badge>
                    ) : (
                      <span />
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        aria-label={`Edit UPI ${method.vpa}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMethod(method);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Remove UPI ${method.vpa}`}
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedMethod(method);
                          setRemoveOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!method.isDefault && (
                        <Button
                          aria-label={`Set Default UPI ${method.vpa}`}
                          variant="default"
                          size="sm"
                          onClick={() => onSetDefault(method.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PaymentMethodManagerUPI;

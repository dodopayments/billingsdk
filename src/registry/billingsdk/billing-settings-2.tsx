"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import currencyCodes from "currency-codes";

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
  type?: "text" | "email" | "tel" | "url" | "number";
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => string | null;
  };
}

export interface ValidationError {
  field: string;
  message: string;
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
  currencies?: string[]; // Array of currency codes to show (e.g., ['USD', 'EUR', 'GBP'])
  currencyOptions?: { value: string; label: string }[]; // Override for custom currency options
  defaultCurrency?: string;
  onCurrencyChange?: (value: string) => void;
  enableValidation?: boolean;
  currencyRequired?: boolean;
}

// Validation helper functions
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

const validateField = (value: string, field: InputField): string | null => {
  // Check required validation
  if (field.required && !value.trim()) {
    return `${field.label} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value.trim() && !field.required) {
    return null;
  }

  // Check email validation
  if (field.type === "email") {
    return validateEmail(value);
  }

  // Check custom validation
  if (field.validation?.customValidator) {
    return field.validation.customValidator(value);
  }

  // Check pattern validation
  if (field.validation?.pattern && !field.validation.pattern.test(value)) {
    return `Invalid ${field.label.toLowerCase()} format`;
  }

  // Check length validations
  if (
    field.validation?.minLength &&
    value.length < field.validation.minLength
  ) {
    return `${field.label} must be at least ${field.validation.minLength} characters`;
  }

  if (
    field.validation?.maxLength &&
    value.length > field.validation.maxLength
  ) {
    return `${field.label} must be no more than ${field.validation.maxLength} characters`;
  }

  return null;
};

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
      required: true,
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
      required: true,
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
  currencies, // Array of specific currency codes to show
  currencyOptions, // Custom currency options override
  defaultCurrency = "USD",
  onCurrencyChange = () => {},
  enableValidation = true,
  currencyRequired = true,
}: BillingSettings2Props) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  // Generate currency options from currency-codes package
  const generatedCurrencyOptions = useMemo(() => {
    // If custom currencyOptions are provided, use them
    if (currencyOptions) {
      return currencyOptions;
    }

    // Get all currency data
    const allCurrencies = currencyCodes.data;

    // If specific currencies are requested, filter to those
    if (currencies && currencies.length > 0) {
      return currencies
        .map((code) => {
          const currency = allCurrencies.find(
            (c) => c.code === code.toUpperCase(),
          );
          return currency
            ? {
                value: currency.code.toLowerCase(),
                label: `${currency.code} - ${currency.currency}`,
              }
            : null;
        })
        .filter(Boolean) as { value: string; label: string }[];
    }

    // Return all currencies if no specific ones requested
    return allCurrencies
      .filter((currency) => currency.code && currency.currency) // Filter out invalid entries
      .map((currency) => ({
        value: currency.code.toLowerCase(),
        label: `${currency.code} - ${currency.currency}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically
  }, [currencies, currencyOptions]);

  // Normalize the defaultCurrency to lowercase to match generated options
  const normalizedDefaultCurrency = defaultCurrency?.toLowerCase();

  // Validate all fields
  const validateAllFields = (): boolean => {
    if (!enableValidation) return true;

    const errors: ValidationError[] = [];
    let hasCurrencyError = false;

    // Validate input fields
    inputFields.forEach((field) => {
      const value =
        field.value !== undefined ? field.value : field.defaultValue || "";
      const error = validateField(value, field);
      if (error) {
        errors.push({ field: field.id, message: error });
      }
    });

    // Validate currency if required
    if (currencyRequired && !normalizedDefaultCurrency) {
      setCurrencyError("Please select a currency");
      hasCurrencyError = true;
    } else {
      setCurrencyError(null);
    }

    setValidationErrors(errors);
    return errors.length === 0 && !hasCurrencyError;
  };

  // Handle save with validation
  const handleSave = () => {
    if (validateAllFields()) {
      onSave();
    }
  };

  // Get error for a specific field
  const getFieldError = (fieldId: string): string | undefined => {
    return validationErrors.find((error) => error.field === fieldId)?.message;
  };

  // Clear validation error for a specific field
  const clearFieldError = (fieldId: string) => {
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== fieldId),
    );
  };

  // Clear currency error
  const clearCurrencyError = () => {
    setCurrencyError(null);
  };

  // Enhanced input change handler that clears validation errors
  const handleInputChange = (
    fieldId: string,
    value: string,
    originalOnChange: (value: string) => void,
  ) => {
    // Clear the validation error for this field when user starts typing
    clearFieldError(fieldId);
    // Call the original onChange handler
    originalOnChange(value);
  };

  // Enhanced currency change handler
  const handleCurrencyChange = (
    value: string,
    originalOnChange: (value: string) => void,
  ) => {
    // Clear currency error when user makes a selection
    clearCurrencyError();
    // Call the original onChange handler
    originalOnChange(value);
  };
  return (
    <Card className={cn("mx-auto max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Manage your billing preferences and settings
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {inputFields.map((field) => {
            const error = getFieldError(field.id);
            return (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id={field.id}
                  name={field.name}
                  {...(field.value !== undefined
                    ? { value: field.value }
                    : { defaultValue: field.defaultValue })}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    handleInputChange(field.id, e.target.value, field.onChange)
                  }
                  type={field.type || "text"}
                  aria-describedby={
                    field.helperText ? `${field.id}-help` : undefined
                  }
                  className={error ? "border-red-500 focus:border-red-500" : ""}
                />
                {error ? (
                  <p className="text-xs text-red-500">{error}</p>
                ) : field.helperText ? (
                  <p
                    id={`${field.id}-help`}
                    className="text-muted-foreground text-xs"
                  >
                    {field.helperText}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="min-w-0 space-y-2">
            <Label id="currency-label">
              Currency
              {currencyRequired && <span className="ml-1 text-red-500">*</span>}
            </Label>
            <Select
              value={normalizedDefaultCurrency}
              onValueChange={(value) =>
                handleCurrencyChange(value, onCurrencyChange)
              }
            >
              <SelectTrigger
                aria-labelledby="currency-label"
                className={cn(
                  "w-[280px] flex-shrink-0",
                  currencyError ? "border-red-500 focus:border-red-500" : "",
                )}
              >
                <SelectValue
                  placeholder="Select currency"
                  className="truncate overflow-hidden text-ellipsis whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] w-[280px]">
                {generatedCurrencyOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="w-full"
                  >
                    <span
                      className="block w-full truncate"
                      title={option.label}
                    >
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currencyError && (
              <p className="text-xs text-red-500">{currencyError}</p>
            )}
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
                <div className="text-muted-foreground text-sm">
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
          <Button
            onClick={handleSave}
            disabled={
              enableValidation &&
              (validationErrors.length > 0 || !!currencyError)
            }
          >
            {saveButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

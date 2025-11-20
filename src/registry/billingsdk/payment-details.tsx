"use client";

import { useState } from "react";
import { Calendar, Shield, Check, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/lib/themes";
import { Country, State, City, IState, ICity } from "country-state-city";
/**
 * Detects the card type based on the card number
 * @param cardNumber - The card number to analyze
 * @returns The detected card type (visa, mastercard, amex, rupay, diners, or unknown)
 * @note This is a best-effort detection based on known BIN ranges
 */
const detectCardType = (
  cardNumber: string,
):
  | "visa"
  | "mastercard"
  | "amex"
  | "rupay"
  | "diners"
  | "discover"
  | "unknown" => {
  const number = cardNumber.replace(/\s/g, "");

  // Order matters: check more specific patterns first
  if (/^4/.test(number)) return "visa";
  if (/^3[47]/.test(number)) return "amex";
  // Diners Club with expanded prefixes
  if (/^3(?:0[0-5]|09|095|6|8)/.test(number)) return "diners";
  // Mastercard with expanded range (51-55 and 2221-2720)
  if (
    /^5[1-5]/.test(number) ||
    /^222[1-9]/.test(number) ||
    /^22[3-9]\d/.test(number) ||
    /^2[3-6]\d{2}/.test(number) ||
    /^27[0-1]\d/.test(number) ||
    /^2720/.test(number)
  )
    return "mastercard";
  // Discover with expanded prefixes
  if (
    /^6011/.test(number) ||
    /^65/.test(number) ||
    /^64[4-9]/.test(number) ||
    /^622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])/.test(number)
  )
    return "discover";
  // More specific RuPay BIN ranges (best effort)
  if (
    /^60/.test(number) ||
    /^81/.test(number) ||
    /^82/.test(number) ||
    /^508/.test(number)
  )
    return "rupay";

  return "unknown";
};

/**
 * Formats a card number by adding spaces every 4 digits
 * @param value - The raw card number input
 * @returns The formatted card number with spaces
 */
const formatCardNumber = (value: string): string => {
  const number = value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
  const matches = number.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return number;
  }
};

/**
 * Formats an expiry date in MM/YY format
 * @param value - The raw expiry date input
 * @returns The formatted expiry date (MM/YY)
 */
const formatExpiryDate = (value: string): string => {
  const number = value.replace(/\D/g, "");
  if (number.length >= 2) {
    return number.substring(0, 2) + "/" + number.substring(2, 4);
  }
  return number;
};

/**
 * Validates a card number using the Luhn algorithm
 * @param cardNumber - The card number to validate
 * @returns Boolean indicating if the card number is valid
 */
const validateLuhn = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, "");
  if (!number || !/^\d+$/.test(number)) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop through values starting from the rightmost digit
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Validates the payment form data
 * @param data - The form data to validate
 * @param validators - Optional validation configuration
 * @returns Object containing validation errors
 */
const validateForm = (
  data: PaymentFormData,
  validators?: ValidationConfig,
): Partial<PaymentFormData> => {
  const errors: Partial<PaymentFormData> = {};
  const cardType = detectCardType(data.cardNumber || "");

  if (!data.nameOnCard?.trim()) errors.nameOnCard = "Name is required";

  // Card number validation with Luhn algorithm
  const strippedCardNumber = data.cardNumber?.replace(/\s/g, "") || "";
  if (
    !strippedCardNumber ||
    strippedCardNumber.length < 13 ||
    !validateLuhn(strippedCardNumber)
  ) {
    errors.cardNumber = "Valid card number is required";
  }

  // Expiry date validation
  if (!data.validTill || !/^\d{2}\/\d{2}$/.test(data.validTill)) {
    errors.validTill = "Valid expiry date is required (MM/YY)";
  } else {
    const [month, year] = data.validTill.split("/");
    const expiryMonth = parseInt(month);
    const expiryYear = 2000 + parseInt(year);

    const currentDate = new Date();

    if (expiryMonth < 1 || expiryMonth > 12) {
      errors.validTill = "Invalid expiry month";
    } else {
      // Create date for last day of expiry month
      const expiryDate = new Date(expiryYear, expiryMonth, 0); // Day 0 gives last day of previous month
      expiryDate.setHours(23, 59, 59, 999); // Set to last moment of the day

      if (expiryDate < currentDate) {
        errors.validTill = "Card has expired";
      }
    }
  }

  // CVV validation based on card type
  const requiredCvvLength = cardType === "amex" ? 4 : 3;
  if (!data.cvv || data.cvv.length !== requiredCvvLength) {
    errors.cvv = `Valid ${requiredCvvLength}-digit CVV is required`;
  }

  if (!data.firstName?.trim()) errors.firstName = "First name is required";
  if (!data.middleLastName?.trim())
    errors.middleLastName = "Last name is required";
  if (!data.billingAddress?.trim())
    errors.billingAddress = "Billing address is required";
  // PIN code validation - configurable based on country
  const pinCodePattern = validators?.pinCode || /^\d{6}$/;
  if (!data.pinCode || !pinCodePattern.test(data.pinCode)) {
    errors.pinCode = validators?.pinCodeErrorMessage || "Invalid postal code";
  }

  // Contact number validation - configurable based on country
  const contactNumberPattern = validators?.contactNumber || /^\d{10}$/;
  if (!data.contactNumber || !contactNumberPattern.test(data.contactNumber)) {
    errors.contactNumber =
      validators?.contactNumberErrorMessage || "Invalid phone number";
  }

  return errors;
};

const CardLogo = ({ type }: { type: string }) => {
  switch (type) {
    case "visa":
      return (
        <div className="flex h-6 w-10 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
          VISA
        </div>
      );
    case "mastercard":
      return (
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full bg-red-500"></div>
          <div className="-ml-2 h-5 w-5 rounded-full bg-orange-400"></div>
        </div>
      );
    case "amex":
      return (
        <div className="flex h-6 w-10 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
          AMEX
        </div>
      );
    case "rupay":
      return (
        <div className="flex h-6 w-10 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
          RuPay
        </div>
      );
    case "discover":
      return (
        <div className="flex h-6 w-10 items-center justify-center rounded bg-orange-600 text-xs font-bold text-white">
          DISC
        </div>
      );
    default:
      return <CreditCard className="text-muted-foreground h-5 w-5" />;
  }
};

/**
 * Payment form data interface
 */
export interface PaymentFormData {
  /** Name as it appears on the card */
  nameOnCard?: string;
  /** Card number (will be formatted automatically) */
  cardNumber?: string;
  /** Expiry date in MM/YY format */
  validTill?: string;
  /** Card verification value (CVV) */
  cvv?: string;
  /** Customer's first name */
  firstName?: string;
  /** Customer's middle and last name */
  middleLastName?: string;
  /** Customer's country */
  country?: string;
  /** Customer's state */
  state?: string;
  /** Customer's city */
  city?: string;
  /** Customer's billing address */
  billingAddress?: string;
  /** Customer's PIN code */
  pinCode?: string;
  /** Customer's phone number */
  contactNumber?: string;
  /** General form error message */
  general?: string;
}

/**
 * Validation configuration interface
 */
export interface ValidationConfig {
  /** Custom PIN code validation regex */
  pinCode?: RegExp;
  /** Custom PIN code error message */
  pinCodeErrorMessage?: string;
  /** Custom contact number validation regex */
  contactNumber?: RegExp;
  /** Custom contact number error message */
  contactNumberErrorMessage?: string;
  /** Country code for phone validation */
  countryCode?: string;
}

/**
 * Payment form component props
 */
export interface PaymentFormProps {
  /** Additional CSS classes for styling */
  className?: string;
  /** Main title for the payment form */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Initial form data */
  initialData?: Partial<PaymentFormData>;
  /** Validation configuration */
  validators?: ValidationConfig;
  /** Callback when form is submitted */
  onSubmit?: (data: PaymentFormData) => void | Promise<void>;
  /** Callback when discard button is clicked */
  onDiscard?: () => void;
  /** Text for submit button */
  submitButtonText?: string;
  /** Text for discard button */
  discardButtonText?: string;
  /** External loading state */
  isLoading?: boolean;
  /** Show success confirmation modal */
  showConfirmation?: boolean;
  /** Title for confirmation modal */
  confirmationTitle?: string;
  /** Message for confirmation modal */
  confirmationMessage?: string;
  /** Callback when confirmation is closed */
  onConfirmationClose?: () => void;
}

/**
 * PaymentDetails component - A comprehensive payment form with card details and billing information
 *
 * Features:
 * - Card type detection (Visa, Mastercard, Amex, RuPay, Diners)
 * - Real-time input formatting and validation
 * - Responsive design with mobile support
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Customizable confirmation modal
 * - Support for multiple themes
 * - Country, state, and city selection
 *
 * @param props - PaymentFormProps object
 * @returns JSX element containing the payment details form
 */
export function PaymentDetails({
  className,
  title = "Payment Details",
  description = "Enter your payment information to complete the transaction.",
  initialData = {},
  validators,
  onSubmit,
  onDiscard,
  submitButtonText = "Save Changes",
  discardButtonText = "Discard",
  isLoading = false,
  showConfirmation = false,
  confirmationTitle = "Payment Details Saved!",
  confirmationMessage = "Your payment information has been securely saved and updated.",
  onConfirmationClose,
}: PaymentFormProps) {
  const { currentTheme, previewDarkMode } = useTheme();
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [availableStates, setAvailableStates] = useState<IState[]>([]);
  const [availableCities, setAvailableCities] = useState<ICity[]>([]);

  const allCountries = Country.getAllCountries();

  // Initialize with empty strings, allowing initialData to override if provided
  const [formData, setFormData] = useState<PaymentFormData>({
    nameOnCard: "",
    cardNumber: "",
    validTill: "",
    cvv: "",
    firstName: "",
    middleLastName: "",
    country: "",
    state: "",
    city: "",
    billingAddress: "",
    pinCode: "",
    contactNumber: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardType, setCardType] = useState(
    detectCardType(formData.cardNumber || ""),
  );

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    let formattedValue = value;

    const isField = <K extends keyof PaymentFormData>(
      f: keyof PaymentFormData,
      k: K,
    ): f is K => f === k;

    if (isField(field, "cardNumber")) {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (isField(field, "cvv")) {
      const maxLength = cardType === "amex" ? 4 : 3;
      formattedValue = value.slice(0, maxLength);
    } else if (isField(field, "validTill")) {
      formattedValue = formatExpiryDate(value);
    } else if (isField(field, "pinCode")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 6);
    } else if (isField(field, "contactNumber")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 10);
    }

    // Handle country change - load states and reset state/city
    if (isField(field, "country")) {
      const selectedCountry = allCountries.find((c) => c.name === value);
      if (selectedCountry) {
        setSelectedCountryCode(selectedCountry.isoCode);
        const states = State.getStatesOfCountry(selectedCountry.isoCode);
        setAvailableStates(states);
        setAvailableCities([]);
        setFormData((prev) => ({
          ...prev,
          country: value,
          state: "",
          city: "",
        }));
        setSelectedStateCode("");
      }
      return;
    }

    // Handle state change - load cities and reset city
    if (isField(field, "state")) {
      const selectedState = availableStates.find((s) => s.name === value);
      if (selectedState) {
        setSelectedStateCode(selectedState.isoCode);
        const cities = City.getCitiesOfState(
          selectedCountryCode,
          selectedState.isoCode,
        );
        setAvailableCities(cities);
        setFormData((prev) => ({ ...prev, state: value, city: "" }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm(formData, validators);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Set user-facing error message
      setErrors((prev) => ({
        ...prev,
        general: "Payment submission failed. Please try again.",
      }));
      // Could also send to monitoring service if integrated
      // monitoringService.captureException(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative w-full max-w-xl rounded-3xl p-6 shadow-sm",
          className,
        )}
        style={themeStyles}
      >
        <div className="mb-6">
          <h1 className="text-foreground mb-2 font-sans text-3xl font-bold">
            {title}
          </h1>
          <p className="text-muted-foreground font-sans">{description}</p>
        </div>
        {/* Card Details Section */}
        <div className="border-border bg-card/50 mb-6 rounded-2xl border p-6">
          <h2 className="text-foreground mb-5 font-sans text-2xl font-semibold">
            Card Details
          </h2>

          <div className="space-y-4">
            {/* Name on Card and Valid Till */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Name On Card <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameOnCard || ""}
                  onChange={(e) =>
                    handleInputChange("nameOnCard", e.target.value)
                  }
                  className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                    errors.nameOnCard
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border"
                  }`}
                />
                {errors.nameOnCard && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.nameOnCard}
                  </p>
                )}
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Valid Till <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Calendar className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.validTill || ""}
                    onChange={(e) =>
                      handleInputChange("validTill", e.target.value)
                    }
                    className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border py-3 pr-4 pl-12 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                      errors.validTill
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border"
                    }`}
                  />
                </div>
                {errors.validTill && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.validTill}
                  </p>
                )}
              </div>
            </div>

            {/* Card Number and CVV */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Card Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 left-4 flex -translate-y-1/2 transform items-center">
                    <CardLogo type={cardType} />
                  </div>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber || ""}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border py-3 pr-4 pl-20 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                      errors.cardNumber
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border"
                    }`}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.cardNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  CVV <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Shield className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
                  <input
                    type="password"
                    placeholder="123"
                    value={formData.cvv || ""}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border py-3 pr-4 pl-12 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                      errors.cvv
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border"
                    }`}
                  />
                </div>
                {errors.cvv && (
                  <p className="text-destructive mt-1 text-sm">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider between sections */}
        <div className="border-border my-6 border-t"></div>

        {/* Billing Details Section */}
        <div className="border-border bg-card/50 mb-6 rounded-2xl border p-6">
          <h2 className="text-foreground mb-5 font-sans text-2xl font-semibold">
            Billing Details
          </h2>

          <div className="space-y-4">
            {/* First Name and Middle & Last Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                    errors.firstName
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Middle & Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.middleLastName || ""}
                  onChange={(e) =>
                    handleInputChange("middleLastName", e.target.value)
                  }
                  className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                    errors.middleLastName
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border"
                  }`}
                />
                {errors.middleLastName && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.middleLastName}
                  </p>
                )}
              </div>
            </div>

            {/* Country, State and City */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Country
                </label>
                <select
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="border-border bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border custom-select w-full appearance-none rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2"
                >
                  <option value="">Country</option>
                  {allCountries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  State
                </label>
                <select
                  value={formData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  disabled={
                    !selectedCountryCode || availableStates.length === 0
                  }
                  className="border-border bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border custom-select w-full appearance-none rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">State</option>
                  {availableStates.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  City
                </label>
                <select
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!selectedStateCode || availableCities.length === 0}
                  className="border-border bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border custom-select w-full appearance-none rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">City</option>
                  {availableCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <label className="text-muted-foreground mb-2 block text-sm font-medium">
                Billing Address <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.billingAddress || ""}
                onChange={(e) =>
                  handleInputChange("billingAddress", e.target.value)
                }
                rows={3}
                className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full resize-none rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                  errors.billingAddress
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border"
                }`}
              />
              {errors.billingAddress && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.billingAddress}
                </p>
              )}
            </div>

            {/* Pin Code and Contact Number */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Pin Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={formData.pinCode || ""}
                  onChange={(e) => handleInputChange("pinCode", e.target.value)}
                  className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                    errors.pinCode
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border"
                  }`}
                />
                {errors.pinCode && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.pinCode}
                  </p>
                )}
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={formData.contactNumber || ""}
                  onChange={(e) =>
                    handleInputChange("contactNumber", e.target.value)
                  }
                  className={`bg-background text-foreground focus:ring-ring focus:border-ring hover:border-border w-full rounded-xl border px-4 py-3 font-sans font-medium transition-all duration-200 focus:ring-2 ${
                    errors.contactNumber
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border"
                  }`}
                />
                {errors.contactNumber && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display general error message */}
        {errors.general && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-6 rounded-xl border p-4">
            {errors.general}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="text-muted-foreground border-border bg-background hover:bg-muted hover:border-border/80 rounded-xl border px-6 py-3 font-sans font-medium transition-all duration-200"
            onClick={onDiscard}
            disabled={isSubmitting || isLoading}
          >
            {discardButtonText}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className={`flex transform items-center gap-2 rounded-xl px-6 py-3 font-sans font-medium shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 ${
              isSubmitting || isLoading
                ? "bg-primary text-primary-foreground cursor-not-allowed opacity-70"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25"
            }`}
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                Saving...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 duration-300">
          <div className="bg-background border-border animate-in zoom-in-95 mx-4 max-w-md rounded-2xl border p-8 shadow-lg duration-300">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-foreground mb-2 font-sans text-xl font-semibold">
                {confirmationTitle}
              </h3>
              <p className="text-muted-foreground font-sans">
                {confirmationMessage}
              </p>
              <button
                onClick={onConfirmationClose}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 transform rounded-xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

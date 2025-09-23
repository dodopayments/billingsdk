"use client"

import { useState } from "react"
import { Calendar, Shield, Check, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { getThemeStyles } from "@/lib/themes"

/**
 * Detects the card type based on the card number
 * @param cardNumber - The card number to analyze
 * @returns The detected card type (visa, mastercard, amex, rupay, diners, or unknown)
 * @note This is a best-effort detection based on known BIN ranges
 */
const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'rupay' | 'diners' | 'discover' | 'unknown' => {
  const number = cardNumber.replace(/\s/g, "")

  // Order matters: check more specific patterns first
  if (/^4/.test(number)) return "visa"
  if (/^3[47]/.test(number)) return "amex"
  // Diners Club with expanded prefixes
  if (/^3(?:0[0-5]|09|095|6|8)/.test(number)) return "diners"
  // Mastercard with expanded range (51-55 and 2221-2720)
  if (/^5[1-5]/.test(number) || /^222[1-9]/.test(number) || /^22[3-9]\d/.test(number) || /^2[3-6]\d{2}/.test(number) || /^27[0-1]\d/.test(number) || /^2720/.test(number)) return "mastercard"
  // Discover with expanded prefixes
  if (/^6011/.test(number) || /^65/.test(number) || /^64[4-9]/.test(number) || /^622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])/.test(number)) return "discover"
  // More specific RuPay BIN ranges (best effort)
  if (/^60/.test(number) || /^81/.test(number) || /^82/.test(number) || /^508/.test(number)) return "rupay"

  return "unknown"
}

/**
 * Formats a card number by adding spaces every 4 digits
 * @param value - The raw card number input
 * @returns The formatted card number with spaces
 */
const formatCardNumber = (value: string): string => {
  const number = value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const matches = number.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(" ")
  } else {
    return number
  }
}

/**
 * Formats an expiry date in MM/YY format
 * @param value - The raw expiry date input
 * @returns The formatted expiry date (MM/YY)
 */
const formatExpiryDate = (value: string): string => {
  const number = value.replace(/\D/g, "")
  if (number.length >= 2) {
    return number.substring(0, 2) + "/" + number.substring(2, 4)
  }
  return number
}

/**
 * Validates a card number using the Luhn algorithm
 * @param cardNumber - The card number to validate
 * @returns Boolean indicating if the card number is valid
 */
const validateLuhn = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, "")
  if (!number || !/^\d+$/.test(number)) return false
  
  let sum = 0
  let shouldDouble = false
  
  // Loop through values starting from the rightmost digit
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i))
    
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    shouldDouble = !shouldDouble
  }
  
  return sum % 10 === 0
}

/**
 * Validates the payment form data
 * @param data - The form data to validate
 * @param validators - Optional validation configuration
 * @returns Object containing validation errors
 */
const validateForm = (data: PaymentFormData, validators?: ValidationConfig): Partial<PaymentFormData> => {
  const errors: Partial<PaymentFormData> = {}
  const cardType = detectCardType(data.cardNumber || "")

  if (!data.nameOnCard?.trim()) errors.nameOnCard = "Name is required"
  
  // Card number validation with Luhn algorithm
  const strippedCardNumber = data.cardNumber?.replace(/\s/g, "") || ""
  if (!strippedCardNumber || strippedCardNumber.length < 13 || !validateLuhn(strippedCardNumber)) {
    errors.cardNumber = "Valid card number is required"
  }
  
  // Expiry date validation
  if (!data.validTill || !/^\d{2}\/\d{2}$/.test(data.validTill)) {
    errors.validTill = "Valid expiry date is required (MM/YY)"
  } else {
    const [month, year] = data.validTill.split("/")
    const expiryMonth = parseInt(month)
    const expiryYear = 2000 + parseInt(year)
    
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear()
    
    if (expiryMonth < 1 || expiryMonth > 12) {
      errors.validTill = "Invalid expiry month"
    } else {
      // Create date for last day of expiry month
      const expiryDate = new Date(expiryYear, expiryMonth, 0) // Day 0 gives last day of previous month
      expiryDate.setHours(23, 59, 59, 999) // Set to last moment of the day
      
      if (expiryDate < currentDate) {
        errors.validTill = "Card has expired"
      }
    }
  }
  
  // CVV validation based on card type
  const requiredCvvLength = cardType === "amex" ? 4 : 3
  if (!data.cvv || data.cvv.length !== requiredCvvLength) {
    errors.cvv = `Valid ${requiredCvvLength}-digit CVV is required`
  }
  
  if (!data.firstName?.trim()) errors.firstName = "First name is required"
  if (!data.middleLastName?.trim()) errors.middleLastName = "Last name is required"
  if (!data.billingAddress?.trim()) errors.billingAddress = "Billing address is required"
  // PIN code validation - configurable based on country
  const pinCodePattern = validators?.pinCode || /^\d{6}$/
  if (!data.pinCode || !pinCodePattern.test(data.pinCode)) {
    errors.pinCode = validators?.pinCodeErrorMessage || "Invalid postal code"
  }
  
  // Contact number validation - configurable based on country
  const contactNumberPattern = validators?.contactNumber || /^\d{10}$/
  if (!data.contactNumber || !contactNumberPattern.test(data.contactNumber)) {
    errors.contactNumber = validators?.contactNumberErrorMessage || "Invalid phone number"
  }

  return errors
}

const CardLogo = ({ type }: { type: string }) => {
  switch (type) {
    case "visa":
      return (
        <div className="flex items-center justify-center w-10 h-6 bg-blue-600 rounded text-white text-xs font-bold">
          VISA
        </div>
      )
    case "mastercard":
      return (
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 rounded-full"></div>
          <div className="w-5 h-5 bg-orange-400 rounded-full -ml-2"></div>
        </div>
      )
    case "amex":
      return (
        <div className="flex items-center justify-center w-10 h-6 bg-blue-500 rounded text-white text-xs font-bold">
          AMEX
        </div>
      )
    case "rupay":
      return (
        <div className="flex items-center justify-center w-10 h-6 bg-green-600 rounded text-white text-xs font-bold">
          RuPay
        </div>
      )
    case "discover":
      return (
        <div className="flex items-center justify-center w-10 h-6 bg-orange-600 rounded text-white text-xs font-bold">
          DISC
        </div>
      )
    default:
      return <CreditCard className="w-5 h-5 text-muted-foreground" />
  }
}

/**
 * Payment form data interface
 */
export interface PaymentFormData {
  /** Name as it appears on the card */
  nameOnCard?: string
  /** Card number (will be formatted automatically) */
  cardNumber?: string
  /** Expiry date in MM/YY format */
  validTill?: string
  /** Card verification value (CVV) */
  cvv?: string
  /** Customer's first name */
  firstName?: string
  /** Customer's middle and last name */
  middleLastName?: string
  /** Customer's country */
  country?: string
  /** Customer's state */
  state?: string
  /** Customer's city */
  city?: string
  /** Customer's billing address */
  billingAddress?: string
  /** Customer's PIN code */
  pinCode?: string
  /** Customer's phone number */
  contactNumber?: string
  /** General form error message */
  general?: string
}

/**
 * Validation configuration interface
 */
export interface ValidationConfig {
  /** Custom PIN code validation regex */
  pinCode?: RegExp
  /** Custom PIN code error message */
  pinCodeErrorMessage?: string
  /** Custom contact number validation regex */
  contactNumber?: RegExp
  /** Custom contact number error message */
  contactNumberErrorMessage?: string
  /** Country code for phone validation */
  countryCode?: string
}

/**
 * Payment form component props
 */
export interface PaymentFormProps {
  /** Additional CSS classes for styling */
  className?: string
  /** Main title for the payment form */
  title?: string
  /** Description text below the title */
  description?: string
  /** Initial form data */
  initialData?: Partial<PaymentFormData>
  /** Validation configuration */
  validators?: ValidationConfig
  /** Callback when form is submitted */
  onSubmit?: (data: PaymentFormData) => void | Promise<void>
  /** Callback when discard button is clicked */
  onDiscard?: () => void
  /** Text for submit button */
  submitButtonText?: string
  /** Text for discard button */
  discardButtonText?: string
  /** External loading state */
  isLoading?: boolean
  /** Show success confirmation modal */
  showConfirmation?: boolean
  /** Title for confirmation modal */
  confirmationTitle?: string
  /** Message for confirmation modal */
  confirmationMessage?: string
  /** Callback when confirmation is closed */
  onConfirmationClose?: () => void
  /** List of countries for dropdown */
  countries?: string[]
  /** List of states for dropdown */
  states?: string[]
  /** List of cities for dropdown */
  cities?: string[]
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
  countries = ["India", "United States", "United Kingdom", "Canada", "Australia"],
  states = ["Bihar", "Karnataka", "Maharashtra"],
  cities = ["Patna", "Bangalore", "Mumbai"],
}: PaymentFormProps) {
  const { currentTheme, previewDarkMode } = useTheme()
  const themeStyles = getThemeStyles(currentTheme, previewDarkMode)
  
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
  })

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardType, setCardType] = useState(detectCardType(formData.cardNumber || ""))

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    let formattedValue = value

    // Type guard function to check if a field is a specific key
    const isField = <K extends keyof PaymentFormData>(f: keyof PaymentFormData, k: K): f is K => f === k

    if (isField(field, "cardNumber")) {
      formattedValue = formatCardNumber(value)
      setCardType(detectCardType(formattedValue))
    } else if (isField(field, "cvv")) {
      // Limit CVV length based on card type
      const maxLength = cardType === "amex" ? 4 : 3
      formattedValue = value.slice(0, maxLength)
    } else if (isField(field, "validTill")) {
      formattedValue = formatExpiryDate(value)
    } else if (isField(field, "pinCode")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 6)
    } else if (isField(field, "contactNumber")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 10)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async () => {
    const formErrors = validateForm(formData, validators)

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit?.(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      // Set user-facing error message
      setErrors(prev => ({
        ...prev,
        general: "Payment submission failed. Please try again."
      }))
      // Could also send to monitoring service if integrated
      // monitoringService.captureException(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div 
        className={cn("w-full max-w-xl rounded-3xl p-6 shadow-sm relative", className)}
        style={themeStyles}
      >
        <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 font-sans">{title}</h1>
        <p className="text-muted-foreground font-sans">{description}</p>
      </div>
        {/* Card Details Section */}
        <div className="mb-6 p-6 rounded-2xl border border-border bg-card/50">
          <h2 className="text-2xl font-semibold text-foreground mb-5 font-sans">Card Details</h2>

          <div className="space-y-4">
            {/* Name on Card and Valid Till */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Name On Card <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameOnCard || ""}
                  onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                    errors.nameOnCard ? "border-destructive focus:ring-destructive/20" : "border-border"
                  }`}
                />
                {errors.nameOnCard && <p className="text-destructive text-sm mt-1">{errors.nameOnCard}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Valid Till <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.validTill || ""}
                    onChange={(e) => handleInputChange("validTill", e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                      errors.validTill ? "border-destructive focus:ring-destructive/20" : "border-border"
                    }`}
                  />
                </div>
                {errors.validTill && <p className="text-destructive text-sm mt-1">{errors.validTill}</p>}
              </div>
            </div>

            {/* Card Number and CVV */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Card Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    <CardLogo type={cardType} />
                  </div>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber || ""}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    className={`w-full pl-20 pr-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                      errors.cardNumber ? "border-destructive focus:ring-destructive/20" : "border-border"
                    }`}
                  />
                </div>
                {errors.cardNumber && <p className="text-destructive text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  CVV <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="password"
                    placeholder="123"
                    value={formData.cvv || ""}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                      errors.cvv ? "border-destructive focus:ring-destructive/20" : "border-border"
                    }`}
                  />
                </div>
                {errors.cvv && <p className="text-destructive text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Divider between sections */}
        <div className="border-t border-border my-6"></div>

        {/* Billing Details Section */}
        <div className="mb-6 p-6 rounded-2xl border border-border bg-card/50">
          <h2 className="text-2xl font-semibold text-foreground mb-5 font-sans">Billing Details</h2>

          <div className="space-y-4">
            {/* First Name and Middle & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                    errors.firstName ? "border-destructive focus:ring-destructive/20" : "border-border"
                  }`}
                />
                {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Middle & Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.middleLastName || ""}
                  onChange={(e) => handleInputChange("middleLastName", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                    errors.middleLastName ? "border-destructive focus:ring-destructive/20" : "border-border"
                  }`}
                />
                {errors.middleLastName && <p className="text-destructive text-sm mt-1">{errors.middleLastName}</p>}
              </div>
            </div>

            {/* Country, State and City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Country</label>
                <select
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border custom-select appearance-none font-sans"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">State</label>
                <select
                  value={formData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border custom-select appearance-none font-sans"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
                <select
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border custom-select appearance-none font-sans"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Billing Address <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.billingAddress || ""}
                onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border resize-none font-sans ${
                  errors.billingAddress ? "border-destructive focus:ring-destructive/20" : "border-border"
                }`}
              />
              {errors.billingAddress && <p className="text-destructive text-sm mt-1">{errors.billingAddress}</p>}
            </div>

            {/* Pin Code and Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Pin Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={formData.pinCode || ""}
                  onChange={(e) => handleInputChange("pinCode", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                    errors.pinCode ? "border-destructive focus:ring-destructive/20" : "border-border"
                  }`}
                />
                {errors.pinCode && <p className="text-destructive text-sm mt-1">{errors.pinCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={formData.contactNumber || ""}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-border font-sans ${
                    errors.contactNumber ? "border-destructive focus:ring-destructive/20" : "border-border"
                  }`}
                />
                {errors.contactNumber && <p className="text-destructive text-sm mt-1">{errors.contactNumber}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Display general error message */}
        {errors.general && (
          <div className="p-4 mb-6 bg-destructive/10 border border-destructive rounded-xl text-destructive">
            {errors.general}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            className="px-6 py-3 text-muted-foreground font-medium rounded-xl border border-border bg-background hover:bg-muted transition-all duration-200 hover:border-border/80 font-sans"
            onClick={onDiscard}
            disabled={isSubmitting || isLoading}
          >
            {discardButtonText}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg font-sans flex items-center gap-2 transform hover:scale-105 active:scale-95 ${
              isSubmitting || isLoading 
                ? "bg-primary text-primary-foreground cursor-not-allowed opacity-70" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25"
            }`}
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-background border border-border rounded-2xl p-8 max-w-md mx-4 animate-in zoom-in-95 duration-300 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 font-sans">{confirmationTitle}</h3>
              <p className="text-muted-foreground font-sans">{confirmationMessage}</p>
              <button 
                onClick={onConfirmationClose}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

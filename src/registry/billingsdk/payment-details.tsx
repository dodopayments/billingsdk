"use client"

import { useState } from "react"
import { Calendar, Shield, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Country, State, City, IState, ICity } from 'country-state-city'

/**
 * Detects the card type based on the card number
 */
const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'rupay' | 'diners' | 'discover' | 'unknown' => {
  const number = cardNumber.replace(/\s/g, "")
  if (/^4/.test(number)) return "visa"
  if (/^3[47]/.test(number)) return "amex"
  if (/^3(?:0[0-5]|09|095|6|8)/.test(number)) return "diners"
  if (/^5[1-5]/.test(number) || /^222[1-9]/.test(number) || /^22[3-9]\d/.test(number) || /^2[3-6]\d{2}/.test(number) || /^27[0-1]\d/.test(number) || /^2720/.test(number)) return "mastercard"
  if (/^6011/.test(number) || /^65/.test(number) || /^64[4-9]/.test(number) || /^622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])/.test(number)) return "discover"
  if (/^60/.test(number) || /^81/.test(number) || /^82/.test(number) || /^508/.test(number)) return "rupay"
  return "unknown"
}

/**
 * Formats a card number by adding spaces every 4 digits
 */
const formatCardNumber = (value: string): string => {
  const number = value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
  const matches = number.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ""
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  return parts.length ? parts.join(" ") : number
}

/**
 * Formats an expiry date in MM/YY format
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
 */
const validateLuhn = (cardNumber: string): boolean => {
  const number = cardNumber.replace(/\s/g, "")
  if (!number || !/^\d+$/.test(number)) return false
  let sum = 0
  let shouldDouble = false
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
 */
const validateForm = (data: PaymentFormData, validators?: ValidationConfig): Partial<PaymentFormData> => {
  const errors: Partial<PaymentFormData> = {}
  const cardType = detectCardType(data.cardNumber || "")

  if (!data.nameOnCard?.trim()) errors.nameOnCard = "Name is required"

  const strippedCardNumber = data.cardNumber?.replace(/\s/g, "") || ""
  if (!strippedCardNumber || strippedCardNumber.length < 13 || !validateLuhn(strippedCardNumber)) {
    errors.cardNumber = "Valid card number is required"
  }

  if (!data.validTill || !/^\d{2}\/\d{2}$/.test(data.validTill)) {
    errors.validTill = "Valid expiry date is required (MM/YY)"
  } else {
    const [month, year] = data.validTill.split("/")
    const expiryMonth = parseInt(month)
    const expiryYear = 2000 + parseInt(year)
    const currentDate = new Date()

    if (expiryMonth < 1 || expiryMonth > 12) {
      errors.validTill = "Invalid expiry month"
    } else {
      const expiryDate = new Date(expiryYear, expiryMonth, 0)
      expiryDate.setHours(23, 59, 59, 999)
      if (expiryDate < currentDate) {
        errors.validTill = "Card has expired"
      }
    }
  }

  const requiredCvvLength = cardType === "amex" ? 4 : 3
  if (!data.cvv || data.cvv.length !== requiredCvvLength) {
    errors.cvv = `Valid ${requiredCvvLength}-digit CVV is required`
  }

  if (!data.firstName?.trim()) errors.firstName = "First name is required"
  if (!data.middleLastName?.trim()) errors.middleLastName = "Last name is required"
  if (!data.billingAddress?.trim()) errors.billingAddress = "Billing address is required"

  const pinCodePattern = validators?.pinCode || /^\d{6}$/
  if (!data.pinCode || !pinCodePattern.test(data.pinCode)) {
    errors.pinCode = validators?.pinCodeErrorMessage || "Invalid postal code"
  }

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

export interface PaymentFormData {
  nameOnCard?: string
  cardNumber?: string
  validTill?: string
  cvv?: string
  firstName?: string
  middleLastName?: string
  country?: string
  state?: string
  city?: string
  billingAddress?: string
  pinCode?: string
  contactNumber?: string
  general?: string
}

export interface ValidationConfig {
  pinCode?: RegExp
  pinCodeErrorMessage?: string
  contactNumber?: RegExp
  contactNumberErrorMessage?: string
  countryCode?: string
}

export interface PaymentFormProps {
  className?: string
  title?: string
  description?: string
  initialData?: Partial<PaymentFormData>
  validators?: ValidationConfig
  onSubmit?: (data: PaymentFormData) => void | Promise<void>
  onDiscard?: () => void
  submitButtonText?: string
  discardButtonText?: string
  isLoading?: boolean
  showConfirmation?: boolean
  confirmationTitle?: string
  confirmationMessage?: string
  onConfirmationClose?: () => void
}

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
  const [selectedCountryCode, setSelectedCountryCode] = useState("")
  const [selectedStateCode, setSelectedStateCode] = useState("")
  const [availableStates, setAvailableStates] = useState<IState[]>([])
  const [availableCities, setAvailableCities] = useState<ICity[]>([])

  const allCountries = Country.getAllCountries()

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

    const isField = <K extends keyof PaymentFormData>(f: keyof PaymentFormData, k: K): f is K => f === k

    if (isField(field, "cardNumber")) {
      formattedValue = formatCardNumber(value)
      setCardType(detectCardType(formattedValue))
    } else if (isField(field, "cvv")) {
      const maxLength = cardType === "amex" ? 4 : 3
      formattedValue = value.slice(0, maxLength)
    } else if (isField(field, "validTill")) {
      formattedValue = formatExpiryDate(value)
    } else if (isField(field, "pinCode")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 6)
    } else if (isField(field, "contactNumber")) {
      formattedValue = value.replace(/\D/g, "").substring(0, 10)
    }

    if (isField(field, "country")) {
      const selectedCountry = allCountries.find(c => c.name === value)
      if (selectedCountry) {
        setSelectedCountryCode(selectedCountry.isoCode)
        const states = State.getStatesOfCountry(selectedCountry.isoCode)
        setAvailableStates(states)
        setAvailableCities([])
        setFormData(prev => ({ ...prev, country: value, state: "", city: "" }))
        setSelectedStateCode("")
      }
      return
    }

    if (isField(field, "state")) {
      const selectedState = availableStates.find(s => s.name === value)
      if (selectedState) {
        setSelectedStateCode(selectedState.isoCode)
        const cities = City.getCitiesOfState(selectedCountryCode, selectedState.isoCode)
        setAvailableCities(cities)
        setFormData(prev => ({ ...prev, state: value, city: "" }))
      }
      return
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

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
      setErrors(prev => ({
        ...prev,
        general: "Payment submission failed. Please try again."
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={cn("w-full max-w-3xl mx-auto", className)}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-6">
          {/* Card Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nameOnCard">
                    Name On Card <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nameOnCard"
                    value={formData.nameOnCard || ""}
                    onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                    className={errors.nameOnCard ? "border-destructive" : ""}
                  />
                  {errors.nameOnCard && (
                    <p className="text-sm text-destructive">{errors.nameOnCard}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validTill">
                    Valid Till <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="validTill"
                      placeholder="MM/YY"
                      value={formData.validTill || ""}
                      onChange={(e) => handleInputChange("validTill", e.target.value)}
                      className={cn("pl-9", errors.validTill ? "border-destructive" : "")}
                    />
                  </div>
                  {errors.validTill && (
                    <p className="text-sm text-destructive">{errors.validTill}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cardNumber">
                    Card Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 flex items-center">
                      <CardLogo type={cardType} />
                    </div>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber || ""}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      className={cn("pl-10", errors.cardNumber ? "border-destructive" : "")}
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">
                    CVV <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={formData.cvv || ""}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={cn("pl-9", errors.cvv ? "border-destructive" : "")}
                    />
                  </div>
                  {errors.cvv && (
                    <p className="text-sm text-destructive">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleLastName">
                    Middle & Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="middleLastName"
                    value={formData.middleLastName || ""}
                    onChange={(e) => handleInputChange("middleLastName", e.target.value)}
                    className={errors.middleLastName ? "border-destructive" : ""}
                  />
                  {errors.middleLastName && (
                    <p className="text-sm text-destructive">{errors.middleLastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country || ""}
                    onValueChange={(value) => handleInputChange("country", value)}
                  >
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="Select country" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                      {allCountries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.name}
                          className="cursor-pointer"
                        >
                          <span className="block truncate" title={country.name}>
                            {country.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.state || ""}
                    onValueChange={(value) => handleInputChange("state", value)}
                    disabled={!selectedCountryCode || availableStates.length === 0}
                  >
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Select state" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                      {availableStates.map((state) => (
                        <SelectItem
                          key={state.isoCode}
                          value={state.name}
                          className="cursor-pointer"
                        >
                          <span className="block truncate" title={state.name}>
                            {state.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city || ""}
                    onValueChange={(value) => handleInputChange("city", value)}
                    disabled={!selectedStateCode || availableCities.length === 0}
                  >
                    <SelectTrigger id="city" className="w-full">
                      <SelectValue placeholder="Select city" className="truncate" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[var(--radix-select-trigger-width)]">
                      {availableCities.map((city) => (
                        <SelectItem
                          key={city.name}
                          value={city.name}
                          className="cursor-pointer"
                        >
                          <span className="block truncate" title={city.name}>
                            {city.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">
                  Billing Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="billingAddress"
                  value={formData.billingAddress || ""}
                  onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                  rows={3}
                  className={errors.billingAddress ? "border-destructive" : ""}
                />
                {errors.billingAddress && (
                  <p className="text-sm text-destructive">{errors.billingAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pinCode">
                    Pin Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pinCode"
                    placeholder="123456"
                    value={formData.pinCode || ""}
                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                    className={errors.pinCode ? "border-destructive" : ""}
                  />
                  {errors.pinCode && (
                    <p className="text-sm text-destructive">{errors.pinCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="9876543210"
                    value={formData.contactNumber || ""}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className={errors.contactNumber ? "border-destructive" : ""}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-destructive">{errors.contactNumber}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onDiscard}
              disabled={isSubmitting || isLoading}
            >
              {discardButtonText}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Saving...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={onConfirmationClose}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">{confirmationTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {confirmationMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={onConfirmationClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

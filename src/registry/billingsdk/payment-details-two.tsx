"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { detectCardType, formatCardNumber, formatExpiryDate, validateLuhn } from "@/utils/card-validation"
import { Check, CreditCard, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'motion/react'
import { Country, State, City } from 'country-state-city'


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

const CardLogo = ({ type }: { type: string }) => {
  switch (type) {
    case "visa":
      return <div className="flex items-center justify-center w-10 h-5 bg-blue-600 rounded text-white text-xs font-bold">VISA</div>
    case "mastercard":
      return <div className="flex items-center"><div className="w-5 h-5 bg-red-500 rounded-full"></div><div className="w-5 h-5 bg-orange-400 rounded-full -ml-2"></div></div>
    case "amex":
      return <div className="flex items-center justify-center w-10 h-6 bg-blue-500 rounded text-white text-xs font-bold">AMEX</div>
    case "rupay":
      return <div className="flex items-center justify-center w-10 h-5 bg-green-600 rounded text-white text-xs font-bold">RuPay</div>
    case "discover":
      return <div className="flex items-center justify-center w-10 h-6 bg-orange-600 rounded text-white text-xs font-bold">DISC</div>
    default:
      return <CreditCard className="w-5 h-5 text-muted-foreground" />
  }
}

export function PaymentDetailsTwo({
  className,
  onSubmit,
  onDiscard,
  countries,
  states,
  cities,
}: {
  className?: string
  onSubmit?: (data: PaymentFormData) => void
  onDiscard?: () => void,
  countries?: { name: string; isoCode: string }[]
  states?: { name: string; isoCode: string }[],
  cities?: { name: string }[],
}) {
  const [step, setStep] = useState(1)
  const [cardType, setCardType] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [defaultCountries, setDefaultCountries] = useState<{ name: string; isoCode: string }[]>([])
  const [defaultStates, setDefaultStates] = useState<{ name: string; isoCode: string }[]>([])
  const [defaultCities, setDefaultCities] = useState<{ name: string }[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<PaymentFormData>({
    defaultValues: {
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
    },
  })

  useEffect(() => {
    // fetch all countries
    if (countries && countries?.length > 0) {
      setDefaultCountries(countries)
    } else {
      const countryData = Country.getAllCountries()
      setDefaultCountries(countryData)
    }
  }, [])

  useEffect(() => {
    if (states && states.length > 0) {
      setDefaultStates(states)
    }
    else {
      const stateData = State.getStatesOfCountry(selectedCountry)
      setDefaultStates(stateData)
    }
  }, [selectedCountry])


  useEffect(() => {

    if (cities && cities.length > 0) {
      setDefaultCities(cities)
    }
    else {
      const cityData = City.getCitiesOfState(selectedCountry, selectedState)
      setDefaultCities(cityData)
    }

  }, [selectedCountry, selectedState])


  const handleFormSubmit = async (data: PaymentFormData) => {
    if (!onSubmit) return;
    try {
      await onSubmit(data);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscardClick = () => {
    if (onDiscard) {
      onDiscard();
    } else {
      reset();
      setIsSaved(false);
    }
  };

  const formatAndSetCard = (val: string) => {
    const raw = val.replace(/\s+/g, "")
    const formatted = formatCardNumber(raw)
    setValue("cardNumber", formatted)
    setCardType(detectCardType(formatted))
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto pb-0", className)}>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription className="mt-1.5">
            {step === 1 ? "Enter your card information" : "Enter your billing address"}
          </CardDescription>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
              step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
            )}>
              1
            </div>
            <div className="flex-1 h-1 rounded-full bg-border">
              <div className={cn(
                "h-full rounded-full bg-primary transition-all duration-300",
                step === 2 ? "w-full" : "w-0"
              )} />
            </div>
          </div>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
            step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            2
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="min-h-[420px] py-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on card</Label>
                  <Input
                    id="nameOnCard"
                    placeholder="John Doe"
                    {...register("nameOnCard", { required: "Name is required" })}
                  />
                  {errors.nameOnCard && <p className="text-sm text-destructive">{errors.nameOnCard.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10"><CardLogo type={cardType} /></div>
                    <Input
                      id="cardNumber"
                      className="pl-14 font-mono tracking-wide"
                      placeholder="1234 5678 9012 3456"
                      maxLength={20}
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      {...register("cardNumber", {
                        required: "Card number is required",
                        validate: (val) => val ? validateLuhn(val) : "Invalid card number"
                      })}
                      onChange={(e) => formatAndSetCard(e.target.value)}
                    />
                  </div>
                  {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validTill">Expiry date</Label>
                    <Input
                      id="validTill"
                      className="font-mono"
                      placeholder="MM/YY"
                      maxLength={5}
                      {...register("validTill", {
                        required: "Valid expiry date is required (MM/YY)",
                        validate: (val?: string) => {
                          if (!val) return "Valid expiry date is required (MM/YY)";
                          if (!/^\d{2}\/\d{2}$/.test(val)) return "Invalid format (MM/YY)";
                          const [mm, yy] = val.split("/").map(Number);
                          if (mm < 1 || mm > 12) return "Invalid month";
                          const now = new Date();
                          const expiry = new Date(2000 + yy, mm - 1, 1);
                          if (expiry < now) return "Card expired";
                          return true;
                        },
                      })}
                      onChange={(e) => setValue("validTill", formatExpiryDate(e.target.value))}
                    />
                    {errors.validTill && <p className="text-sm text-destructive">{errors.validTill.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Input
                        id="cvv"
                        type="password"
                        className="pl-10 font-mono"
                        placeholder="123"
                        maxLength={4}
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        {...register("cvv", {
                          required: "Valid CVV is required",
                          validate: (val) =>
                            (cardType === "amex" ? val?.length === 4 : val?.length === 3) ||
                            "Invalid CVV length",
                        })}
                      />
                    </div>
                    {errors.cvv && <p className="text-sm text-destructive">{errors.cvv.message}</p>}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName", { required: "Required" })}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleLastName">Last name</Label>
                    <Input
                      id="middleLastName"
                      placeholder="Doe"
                      {...register("middleLastName", { required: "Required" })}
                    />
                    {errors.middleLastName && <p className="text-sm text-destructive">{errors.middleLastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select onValueChange={(val) => {
                      setValue("country", val)
                      setSelectedCountry(val)
                    }}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultCountries.map((c) => <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(val) => {
                      setValue("state", val)
                      setSelectedState(val)
                    }}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultStates.length > 0 ? defaultStates.map((s) => <SelectItem key={s.isoCode} value={s.isoCode}>{s.name} </SelectItem>) : <SelectItem disabled value="No state found">No state found</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select onValueChange={(val) => setValue("city", val)}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultCities.length > 0 ? defaultCities.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>) : <SelectItem disabled value="No city found">No city found</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea
                    id="billingAddress"
                    placeholder="Enter Billing Address"
                    {...register("billingAddress", { required: "Required" })}
                  />
                  {errors.billingAddress && <p className="text-sm text-destructive">{errors.billingAddress.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">Pincode</Label>
                    <Input
                      id="pinCode"
                      placeholder="110024"
                      {...register("pinCode", {
                        required: "Required",
                        pattern: { value: /^[0-9]{6}$/, message: "Invalid pincode" },
                      })}
                    />
                    {errors.pinCode && <p className="text-sm text-destructive">{errors.pinCode.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Mobile</Label>
                    <Input
                      id="contactNumber"
                      placeholder="9991023558"
                      {...register("contactNumber", {
                        required: "Required",
                        pattern: { value: /^[0-9]{10}$/, message: "Invalid number" },
                      })}
                    />
                    {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-muted/30 py-6">
          {step === 1 ? (
            <>
              <Button type="button" variant="ghost" onClick={handleDiscardClick}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNext} className="min-w-[100px]">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting || isSaved} className="min-w-[120px]">
                <AnimatePresence mode="wait" initial={false}>
                  {isSubmitting ? (
                    <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </motion.div>
                  ) : isSaved ? (
                    <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </motion.div>
                  ) : (
                    <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Save Changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

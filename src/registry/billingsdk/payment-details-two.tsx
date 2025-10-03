"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { detectCardType, formatCardNumber, formatExpiryDate, validateLuhn } from "@/utils/card-validation"
import { Check, CreditCard, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'motion/react'
import {Country, State, City} from 'country-state-city'


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
  countries ,
  states,
  cities,
}: {
  className?: string
  onSubmit?: (data: PaymentFormData) => void
  onDiscard?: () => void,
  countries? :{ name: string; isoCode: string }[]
  states? : { name: string; isoCode: string }[],
  cities ?: { name: string}[],
}) {
  const [cardType, setCardType] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [defaultCountries, setDefaultCountries] = useState<{ name: string; isoCode: string }[]>([])
  const [defaultStates, setDefaultStates] = useState<{ name: string; isoCode: string }[]>([])
  const [defaultCities, setDefaultCities] = useState<{ name: string }[]>([])
  const [selectedCountry , setSelectedCountry] = useState<string>("")
  const [selectedState , setSelectedState] = useState<string>("")

  const { register, handleSubmit, setValue, reset,  formState: { errors, isSubmitting } } = useForm<PaymentFormData>({
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
    if(countries && countries?.length > 0){
      setDefaultCountries(countries)
    }else{
      const countryData = Country.getAllCountries()
      setDefaultCountries(countryData)
    }
  }, [])

  useEffect(()=>{  
    if(states && states.length > 0){
      setDefaultStates(states)
    }
    else{
        const stateData =  State.getStatesOfCountry(selectedCountry)
        setDefaultStates(stateData)
    }
  },[selectedCountry])
  

  useEffect(() => {

    if(cities && cities.length > 0){
      setDefaultCities(cities)
    }
    else{
      const cityData = City.getCitiesOfState(selectedCountry ,selectedState)
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn(" max-w-2xl  w-full mx-auto space-y-6", className)}>
      {/* Card Section */}
      <div className="flex flex-col border  rounded-lg gap-6 p-6 bg-card/50 shadow-md">
        <h2 className="text-lg font-medium text-center">Card Details</h2>

        <div>
          <Label className=" md:text-[15px] font-medium">Name on card</Label>
          <Input
            className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
            placeholder="Placeholder name"
            {...register("nameOnCard", { required: "Name is required" })}
          />
          {errors.nameOnCard && <p className="text-red-500 text-sm">{errors.nameOnCard.message}</p>}
        </div>

        <div>
          <Label className=" md:text-[15px] font-medium">Card number</Label>
          <div className="relative flex items-center">
            <div className="absolute left-3"><CardLogo type={cardType} /></div>
            <Input
              className="mb-1.5 mt-1.5 pl-14 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
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
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
        </div>

        <div className="flex gap-6">
          <div className="w-full">
            <Label className=" md:text-[15px] font-medium">Expiry</Label>
            <Input
              className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
              placeholder="MM/YY"
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
            {errors.validTill && <p className="text-red-500 text-sm">{errors.validTill.message}</p>}
          </div>
          <div className="w-full">
            <Label className=" md:text-[15px] font-medium">CVV</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                className="mb-1.5 mt-1.5 pl-8 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
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
            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv.message}</p>}
          </div>
        </div>
      </div>

      <div className="w-full border-t "></div>

      {/* Billing Section */}
      <div className="flex flex-col border bg-card/50 rounded-lg gap-6 pt-4 px-6 pb-6 shadow-md ">
        <h2 className="text-lg font-medium pb-2 text-center">Billing Details</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <Label className=" md:text-[15px] font-medium">Firstname</Label>
            <Input
              className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
              placeholder="Firstname"
              {...register("firstName", { required: "Required" })}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="w-full">
            <Label className=" md:text-[15px] font-medium">Lastname</Label>
            <Input
              className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
              placeholder="Lastname"
              {...register("middleLastName", { required: "Required" })}
            />
            {errors.middleLastName && <p className="text-red-500 text-sm">{errors.middleLastName.message}</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <Label className="md:text-[15px] font-medium">Country</Label>
            <Select onValueChange={(val) => {setValue("country", val) 
              setSelectedCountry(val)
            }}>
              <SelectTrigger className="mb-1.5 mt-1.5 w-full shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]">
                <SelectValue placeholder="Select country " />
              </SelectTrigger>
              <SelectContent>
                {defaultCountries.map((c) => <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="md:text-[15px] font-medium">State</Label>
            <Select onValueChange={(val) => {setValue("state", val) 
            setSelectedState(val)
            }}>
              <SelectTrigger className="mb-1.5 mt-1.5 shadow-md w-full !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {defaultStates.length > 0 ? defaultStates.map((s) => <SelectItem key={s.isoCode} value={s.isoCode}>{s.name} </SelectItem>) : <SelectItem disabled value="No state found">No state found</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="md:text-[15px] font-medium">City</Label>
            <Select onValueChange={(val) => setValue("city", val)}>
              <SelectTrigger className="mb-1.5 mt-1.5 shadow-md w-full !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {defaultCities.length > 0 ? defaultCities.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>):<SelectItem disabled value="No city found">No city found</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="md:text-[15px] font-medium">Billing Address</Label>
          <Textarea
            className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
            placeholder="Enter Billing Address"
            {...register("billingAddress", { required: "Required" })}
          />
          {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress.message}</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <Label className="md:text-[15px] font-medium">Pincode</Label>
            <Input
              className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
              placeholder="110024"
              {...register("pinCode", {
                required: "Required",
                pattern: { value: /^[0-9]{6}$/, message: "Invalid pincode" },
              })}
            />
            {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
          </div>

          <div className="w-full">
            <Label className="md:text-[15px] font-medium">Mobile</Label>
            <Input
              className="mb-1.5 mt-1.5 shadow-md !bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-[2px] md:text-[15px]"
              placeholder="9991023558"
              {...register("contactNumber", {
                required: "Required",
                pattern: { value: /^[0-9]{10}$/, message: "Invalid number" },
              })}
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleDiscardClick} disabled={isSubmitting}>
            Discard
          </Button>
          <Button type="submit" disabled={isSubmitting || isSaved} className="flex items-center justify-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              {isSubmitting ? (
                <motion.div key="saving" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
                  <div className="w-5 h-5 border border-background border-t-transparent rounded-full animate-spin" />
                  <span>Saving</span>
                </motion.div>
              ) : isSaved ? (
                <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                  <div className="w-5 h-5 border bg-green-200 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Saved</span>
                </motion.div>
              ) : (
                <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Save Changes
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </form>
  )
}

'use client';
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {Card,CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CreditCard, Gift, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export interface finalTextProps {
  text: string;
}

export interface PaymentCardProps {
  title: string;
  description: string;
  price: string;
  feature?: string;
  featuredescription?: string;
  feature2?: string;
  feature2description?: string;
  finalText?:finalTextProps[];
  onPay?: (data: { cardNumber: string; expiry: string; cvc: string }) => Promise<void> | void;
  className?: string;
}

export function PaymentCard({ title, description, price, feature, featuredescription, feature2, feature2description, finalText = [], onPay, className }: PaymentCardProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState<{ card?: string; expiry?: string; cvc?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    // Card number validation
    if (!/^[0-9 ]{16,19}$/.test(cardNumber)) {
      newErrors.card = "Card number must be 16 digits and only numbers.";
    }

    // Expiry validation 
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Enter a valid expiry date (MM/YY).";
    } else {
      const [month, year] = expiry.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + year, month - 1);
      if (expDate < now) {
        newErrors.expiry = "Expiry date cannot be in the past.";
      }
    }

    // CVC validation
    if (!/^[0-9]{3,4}$/.test(cvc)) {
      newErrors.cvc = "CVC must be 3 or 4 digits.";
    }

    setErrors(newErrors);
    if(Object.keys(newErrors).length === 0){
      return true;
    }
    return false;
  };

  const handlePay = ()=>{
    if (validate()) {
      if(onPay){
        onPay({ cardNumber, expiry, cvc });
        console.log("Payment processed!");
      }
      else{
        console.log("error");
      }
    }
  };

 // Final text animation
  useEffect(() => {
    if (!finalText || finalText.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % finalText.length)
    }, 2000) 

    return () => clearInterval(interval)
  }, [finalText])

  return (
    <Card
      className={cn(
        "w-full max-w-4xl px-1 md:px-5 md:py-3 flex flex-col md:flex-row overflow-hidden md:gap-1 gap-2 pt-1",
        className
      )}
    >
      {/* Right: Summary */}
      <CardContent className="order-1 md:order-2 w-full md:max-w-[350px]
       py-2 px-2 sm:py-3 md:py-6 h-fit my-auto md:px-4 md:w-1/2  
        rounded-lg bg-gradient-to-br from-[#F8CEF8]/15 via-background to-[#F8CEF8]/10  
        flex flex-col gap-4 md:gap-6">
        <div className=" px-2 py-1">
          <h2 className="md:text-lg text-xl font-medium ">You've to pay</h2>
          <p className="text-xl md:text-2xl lg:text-3xl font-mono text-foreground mt-1">
           ${price || "320"}
        <span className="text-xs  font-mono text-foreground">.00</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mt-4 px-2">
          <div>
          <h3 className="flex items-center gap-2 text-foreground  text-sm md:text-base">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M9 12l2 2 4-4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
          </motion.svg>
            {feature || "Payment & Invoice"}
          </h3>
            <p className="text-xs md:text-sm  mt-2 leading-relaxed">
              {featuredescription || "Automated billing and invoicing with detailed transaction records. Professional receipts delivered instantly to your email."}
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2   text-sm md:text-base">
          <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        >
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M9 12l2 2 4-4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
        </motion.svg>
   {feature2 || "Priority Support"}
            </h3>
            <p className="text-xs md:text-sm  mt-2 leading-relaxed text-foreground">
              {feature2description || "Get dedicated customer support with faster response times and direct access to our technical team for any issues."}
            </p>
          </div>

        
        </div>

        <div className=" rounded-lg py-2 md:px-1 md:py-4 text-foreground  md:mt-2 flex justify-center items-center overflow-hidden ">
        <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm text-center leading-relaxed absolute text-center overflow-hidden text-foreground"
        >
          {finalText[index].text}
        </motion.p>
      </AnimatePresence>
        </div>
      </CardContent>

      {/* Left: Payment Form */}
      <CardContent className="order-2 md:order-1 w-full py-6 px-4 sm:py-8 sm:px-6 lg:px-10 flex flex-col gap-6 md:flex-1">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-xl sm:text-2xl font-medium">
              {title || "Final step, make the payment."}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-foreground">
              {description ||"To finalize your subscription, kindly complete your payment using a valid credit card."}
            </p>
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-3">
  <label className="text-sm font-medium text-foreground flex items-center gap-2">
    <CreditCard className="w-4 h-4" /> Card number
  </label>
  <div className="relative">
    <div className="flex items-center rounded-lg border border-border bg-card px-4 py-3 w-full transition-colors hover:border-muted-foreground/50 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
      
      {/* Animated Logos */}
      <div className="relative w-16 h-6  overflow-hidden flex items-center">
  <AnimatePresence mode="wait">
    <motion.img
      key={index} 
      src={[
        "https://img.icons8.com/color/48/visa.png",
        "https://img.icons8.com/color/48/mastercard-logo.png",
        "https://img.icons8.com/color/48/amex.png",
        "https://img.icons8.com/color/48/rupay.png",
      ][index % 4]}
      alt="card"
      className="w-6 h-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    />
  </AnimatePresence>
    </div>

      {/* Input */}
      <input
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        placeholder="1234 5678 9012 3456"
        maxLength={19}
      />
    </div>
    {errors.card && (
      <p className="text-xs text-destructive mt-1">{errors.card}</p>
    )}
      </div>
    </div>
          <div className="flex gap-6 items-start">
            <div className="flex flex-col gap-1 w-fit">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> Expiry
              </label>
              <div className="relative w-20 pt-2">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-center placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiry && (
                  <p className="text-xs text-destructive mt-1">{errors.expiry}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-fit">
              <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1 sm:gap-2">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> CVC
              </label>
              <div className="relative w-20 pt-2">
                <input
                 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-center placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="text-xs text-destructive mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Gift className="w-4 h-4" /> Discount code
            </label>
            <div className="flex items-center sm:flex-row gap-3">
              <input
                className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/50 focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                placeholder="Enter discount code"
                maxLength={12}
              />
              <Button variant="outline" size="default" className="px-3 whitespace-nowrap">
                Apply
              </Button>
            </div>
          </div>
          <Button 
            variant="default"
            className="mt-6 w-full sm:w-auto px-8 py-3 text-base font-medium" 
            onClick={handlePay}
          >
            Pay now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

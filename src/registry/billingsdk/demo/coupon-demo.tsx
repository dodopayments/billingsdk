
"use client"

import {CouponGenerator} from "@/registry/billingsdk/coupon"

function generateRandomCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function CouponDemo() {
  const handleGenerate = (couponData: {
    code: string
    discount: number
    rule: string
    startDate?: string
    endDate?: string
  }) => {
    console.log("Generated Coupon:", couponData)
  }

  const handleCopy = (code: string) => {
    console.log("Copied Coupon Code:", code)
    navigator.clipboard.writeText(code)
  }

  const handleShare = (code: string) => {
    console.log("Sharing Coupon Code:", code)
  }

  return (
    <div className="w-full flex justify-center items-center p-4 bg-background">
      <CouponGenerator
        companyName="Dodopayments"
        applicableOptions={[
          { label: "For new users only", value: "new-users" },
          { label: "For existing users only", value: "existing-users" },
          { label: "For all users", value: "all-users" },
          { label: "Premium subscribers", value: "premium-subscribers" },
        ]}
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onShare={handleShare}
        defaultCode={generateRandomCode()} 
      />
    </div>
  )
}
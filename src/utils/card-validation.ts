
// Detect card type
export const detectCardType = (
  cardNumber: string
): "visa" | "mastercard" | "amex" | "rupay" | "diners" | "discover" | "unknown" => {
  const number = cardNumber.replace(/\s/g, "")

  if (/^4/.test(number)) return "visa"
  if (/^3[47]/.test(number)) return "amex"
  if (/^3(?:0[0-5]|09|095|6|8)/.test(number)) return "diners"
  if (/^5[1-5]/.test(number) || /^222[1-9]/.test(number) || /^22[3-9]\d/.test(number) || /^2[3-6]\d{2}/.test(number) || /^27[0-1]\d/.test(number) || /^2720/.test(number)) return "mastercard"
  if (/^6011/.test(number) || /^65/.test(number) || /^64[4-9]/.test(number) || /^622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])/.test(number)) return "discover"
  if (/^60/.test(number) || /^81/.test(number) || /^82/.test(number) || /^508/.test(number)) return "rupay"

  return "unknown"
}

// Luhn algorithm
export const validateLuhn = (cardNumber: string): true | string => {
  const number = cardNumber.replace(/\s/g, "")
  if (!number || !/^\d+$/.test(number)) return "Invalid card number"

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

  return sum % 10 === 0 ? true : "Invalid card number"
}



/**
 * Formats a card number by adding spaces every 4 digits
 * @param value - The raw card number input
 * @returns The formatted card number with spaces
 */
export const formatCardNumber = (value: string): string => {
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
 * Formats an expiry date of the card
 * @param value - The raw card expiry input
 * @returns The formatted expiry date with / in between
 */
export const formatExpiryDate = (value ?: string): string => {
  if (!value) return ""
  const number = value.replace(/\D/g, "")
  if (number.length >= 2) {
    return number.substring(0, 2) + "/" + number.substring(2, 4)
  }
  return number
}


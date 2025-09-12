"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Copy, Scissors, Share2 } from "lucide-react"
import { ChangeEvent, useState } from "react"

export interface CouponGeneratorProps {
    companyName: string
    applicableOptions?: { label: string; value: string }[]
    onGenerate: (couponData: {
        code: string
        discount: number
        rule: string
        startDate?: string
        endDate?: string
    }) => void
    onCopy?: (code: string) => void
    onShare?: (code: string) => void
    className?: string
    cardClassName?: string
    generateButtonClassName?: string
    defaultCode?: string
}

export function CouponGenerator({
    companyName,
    applicableOptions = [],
    onGenerate,
    onCopy,
    onShare,
    className,
    cardClassName,
    generateButtonClassName,
    defaultCode,
}: CouponGeneratorProps) {
    const [enabled, setEnabled] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [generated, setGenerated] = useState(false)
    const [customCode, setCustomCode] = useState("DODO20")
    const [discount, setDiscount] = useState<number | "">(20)
    const [discountError, setDiscountError] = useState("")
    const [selectedRule, setSelectedRule] = useState("")
    const [generatedCouponCode, setGeneratedCouponCode] = useState("")
    const [dateError, setDateError] = useState("")

    const isDateValid = startDate && endDate && new Date(startDate) < new Date(endDate);

    const isDiscountValid = discount !== "" && !isNaN(Number(discount)) && Number(discount) >= 0 && Number(discount) <= 100;

    const isFormValid =
        selectedRule.trim() !== "" &&
        startDate.trim() !== "" &&
        endDate.trim() !== "" &&
        isDateValid &&
        isDiscountValid;

    function generateCouponCode() {
        let rnd = Math.floor(Math.random() * 1_000_000);
        if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            rnd = arr[0] % 1_000_000;
        }
        return `COUPON${rnd.toString().padStart(6, "0")}`;
    }

    const handleGenerate = () => {
        let valid = true;

        if (!selectedRule.trim() || !startDate.trim() || !endDate.trim()) {
            setDateError("Please fill in all required fields: Applicable rule, Start date, and End date");
            valid = false;
        } else if (!isDateValid) {
            setDateError("Start date must be before end date.");
            valid = false;
        } else {
            setDateError("");
        }

        if (discount === "" || isNaN(Number(discount))) {
            setDiscountError("Discount must be a number.");
            valid = false;
        } else if (Number(discount) < 0) {
            setDiscountError("Discount cannot be negative.");
            valid = false;
        } else if (Number(discount) > 100) {
            setDiscountError("Discount cannot exceed 100%.");
            valid = false;
        } else {
            setDiscountError("");
        }

        if (!valid) return;

        let code: string
        if (enabled && customCode.trim()) {
            code = customCode.trim()
        } else if (defaultCode) {
            code = defaultCode
        } else {
            code = generateCouponCode();
        }

        const couponData = {
            code,
            discount: Number(discount),
            rule: selectedRule,
            startDate,
            endDate,
        }

        setGeneratedCouponCode(code)
        onGenerate(couponData)
        setGenerated(true)
    }

    const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setDiscount("");
            setDiscountError("");
            return;
        }
        const num = Number(value);
        if (isNaN(num)) {
            setDiscountError("Discount must be a number.");
        } else if (num < 0) {
            setDiscountError("Discount cannot be negative.");
        } else if (num > 100) {
            setDiscountError("Discount cannot exceed 100%.");
        } else {
            setDiscountError("");
        }
        setDiscount(num); 
    };

    return (
        <div className={className}>
            {generated ? (
                <Card
                    className={`w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700 
                    bg-background text-foreground
                    border border-border shadow-2xl 
                    ${cardClassName || ""}`}
                >
                    <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                            <div className="bg-zinc-900 dark:bg-zinc-100 p-6 relative">
                                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
                                </div>
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center gap-2 mb-2">
                                        <Scissors className="w-4 h-4 text-white dark:text-zinc-900" />
                                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                                            Coupon
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-white dark:text-zinc-900 tracking-tight mb-1">
                                        {generatedCouponCode}
                                    </div>
                                    <div className="text-sm text-zinc-300 dark:text-zinc-700 font-medium">{companyName}</div>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-zinc-900">
                                <div className="text-center space-y-2">
                                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{discount}% OFF</div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Valid until {endDate}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-zinc-50 dark:bg-zinc-950 rounded-full -ml-3 border-2 border-zinc-200 dark:border-zinc-800"></div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-zinc-50 dark:bg-zinc-950 rounded-full -mr-3 border-2 border-zinc-200 dark:border-zinc-800"></div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center p-4 border-t border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGenerated(false)}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCopy?.(generatedCouponCode)}
                                className="border-border hover:bg-muted transition-colors bg-transparent"
                            >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onShare?.(generatedCouponCode)}
                                className="border-border hover:bg-muted transition-colors bg-transparent"
                            >
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Card
                    className={`w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700 
                    bg-background text-foreground
                    border border-border shadow-2xl 
                    ${cardClassName || ""}`}
                >
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-semibold text-center">
                            Create Coupon Code
                        </CardTitle>
                    </CardHeader>

                    <div className="h-px bg-border mx-6"></div>

                    <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="discount" className="text-sm font-medium">
                                    Discount (%)
                                </Label>
                                <Input
                                    type="number"
                                    id="discount"
                                    value={discount}
                                    onChange={handleDiscountChange}
                                    min={0}
                                    max={100}
                                    className="bg-background border-border text-foreground"
                                />
                                {discountError && (
                                    <div className="text-sm text-red-500">{discountError}</div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="applicable" className="text-sm font-medium">
                                    Applicable to <span className="text-red-500">*</span>
                                </Label>
                                <Select value={selectedRule} onValueChange={setSelectedRule}>
                                    <SelectTrigger className="bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select rule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Rules</SelectLabel>
                                            {applicableOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                    className="text-foreground hover:bg-muted"
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Validity Period <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date" className="text-xs">
                                        Start Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date" className="text-xs">
                                        End Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="end-date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                            </div>
                            {dateError && (
                                <div className="text-sm text-red-500 mt-2">{dateError}</div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Switch
                                    id="custom-code"
                                    checked={enabled}
                                    onCheckedChange={setEnabled}
                                    className="data-[state=checked]:bg-zinc-900 data-[state=unchecked]:bg-zinc-200 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=unchecked]:bg-zinc-700"
                                />
                                <Label htmlFor="custom-code" className="text-sm font-medium">
                                    Custom Code
                                </Label>
                            </div>
                            {enabled && (
                                <Input
                                    className="bg-background border-border text-foreground"
                                    placeholder="DODO20"
                                    value={customCode}
                                    onChange={(e) => setCustomCode(e.target.value)}
                                />
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end p-6 pt-0">
                        <Button
                            onClick={handleGenerate}
                            disabled={!isFormValid}
                            className={`bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-zinc-900 dark:disabled:bg-zinc-100 ${generateButtonClassName || ""}`}
                        >
                            Generate Coupon
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
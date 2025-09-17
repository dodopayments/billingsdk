"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, ArrowLeft, Share2, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <>
            {generated ? (
                <Card className={cn("w-full max-w-md mx-auto", cardClassName)}>
                    <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                            <div className="bg-primary p-8 relative">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
                                </div>
                                <div className="relative z-10 text-center space-y-3">
                                    <div className="inline-flex items-center gap-2">
                                        <Scissors className="w-4 h-4 text-primary-foreground" />
                                        <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">
                                            Coupon
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-primary-foreground tracking-tight">
                                        {generatedCouponCode}
                                    </div>
                                    <div className="text-sm text-primary-foreground/80 font-medium">{companyName}</div>
                                </div>
                            </div>

                            <div className="p-8 bg-card">
                                <div className="text-center space-y-3">
                                    <div className="text-2xl font-bold text-card-foreground">{discount}% OFF</div>
                                    <div className="text-sm text-muted-foreground">
                                        Valid until {endDate}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-background rounded-full -ml-3 border-2 border-border"></div>
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-background rounded-full -mr-3 border-2 border-border"></div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center p-6 border-t">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGenerated(false)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onCopy?.(generatedCouponCode)}
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onShare?.(generatedCouponCode)}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Card className={cn("w-full max-w-md mx-auto", cardClassName)}>
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-lg sm:text-xl text-center">
                            Create Coupon Code
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                />
                                {discountError && (
                                    <p className="text-sm text-destructive">{discountError}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="applicable" className="text-sm font-medium">
                                    Applicable to <span className="text-destructive">*</span>
                                </Label>
                                <Select value={selectedRule} onValueChange={setSelectedRule}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Rules</SelectLabel>
                                            {applicableOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-medium">
                                Validity Period <span className="text-destructive">*</span>
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date" className="text-sm">
                                        Start Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="start-date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date" className="text-sm">
                                        End Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="end-date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            {dateError && (
                                <p className="text-sm text-destructive">{dateError}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Switch
                                    id="custom-code"
                                    checked={enabled}
                                    onCheckedChange={setEnabled}
                                />
                                <Label htmlFor="custom-code" className="text-sm font-medium">
                                    Custom Code
                                </Label>
                            </div>
                            {enabled && (
                                <Input
                                    placeholder="DODO20"
                                    value={customCode}
                                    onChange={(e) => setCustomCode(e.target.value)}
                                />
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end p-6">
                        <Button
                            onClick={handleGenerate}
                            disabled={!isFormValid}
                            className={cn("w-full sm:w-auto", generateButtonClassName)}
                        >
                            Generate Coupon
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </>
    )
}
import { cva, VariantProps } from "class-variance-authority"
import {type Plan} from "@/lib/billingsdk-config"
export const sectionVariants = cva("mt-10 max-w-7xl mx-auto", {
  variants: {
    variant: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
  },
  defaultVariants: {
    variant: "small",
  },
})

export const toggleContainerVariants = cva(
  "bg-muted flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg",
  {
    variants: {
      variant: {
        small: "h-9 text-base",
        medium: "h-10 text-lg",
        large: "h-11 text-lg",
      },
    },
    defaultVariants: {
      variant: "large",
    },
  }
)

export const labelPaddingVariants = cva("px-7", {
  variants: {
    variant: {
      small: "px-5",
      medium: "px-6",
      large: "px-7",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export const cardTitleVariants = cva("text-xl", {
  variants: {
    variant: {
      small: "text-lg",
      medium: "text-xl",
      large: "text-xl",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export const cardDescriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-sm",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export const priceTextVariants = cva("text-4xl font-medium", {
  variants: {
    variant: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-4xl",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export const featureIconVariants = cva("w-4 h-4", {
  variants: {
    variant: {
      small: "w-3 h-3",
      medium: "w-4 h-4",
      large: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export const footerWrapperVariants = cva(
  "flex items-center justify-between bg-muted/50 p-6 border-t border-border",
  {
    variants: {
      variant: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
      },
    },
    defaultVariants: {
      variant: "large",
    },
  }
)

 export const footerTextVariants = cva("text-lg font-medium text-card-foreground text-left w-full my-auto", {
  variants: {
    variant: {
      small: "text-base",
      medium: "text-lg",
      large: "text-lg",
    },
  },
  defaultVariants: {
    variant: "large",
  },
})

export interface PricingTableProps extends VariantProps<typeof sectionVariants> {
  className?: string
  plans: Plan[]
  onPlanSelect?: (planId: string) => void
  showFooter?: boolean
  footerText?: string
  footerButtonText?: string
  onFooterButtonClick?: () => void
}

export function calculateDiscount(monthlyPrice: string, yearlyPrice: string): number {
    const monthly = parseFloat(monthlyPrice);
    const yearly = parseFloat(yearlyPrice);

    if (
      monthlyPrice.toLowerCase() === "custom" ||
      yearlyPrice.toLowerCase() === "custom" ||
      isNaN(monthly) ||
      isNaN(yearly) ||
      monthly === 0
    ) {
      return 0;
    }

    const discount = ((monthly * 12 - yearly) / (monthly * 12)) * 100;
    return Math.round(discount);
  }
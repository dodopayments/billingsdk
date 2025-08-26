"use client"

import { cva, type VariantProps } from "class-variance-authority";
import { type Plan } from "@/lib/billingsdk-config";


export const sectionVariants = cva("py-32", {
  variants: {
    size: {
      small: "py-12",
      medium: "py-20",
      large: "py-32",
    },
    theme: {
      minimal: "",
      classic: "bg-gradient-to-b from-background to-muted/20 relative overflow-hidden",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

export const titleVariants = cva("mb-2 font-semibold", {
  variants: {
    size: {
      small: "text-2xl lg:text-3xl",
      medium: "text-3xl lg:text-4xl",
      large: "text-3xl lg:text-5xl",
    },
    theme: {
      minimal: "",
      classic: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent font-bold",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const descriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      small: "text-sm lg:text-base",
      medium: "text-base lg:text-lg",
      large: "lg:text-lg",
    },
    theme: {
      minimal: "",
      classic: "text-center max-w-2xl mx-auto",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const toggleWrapperVariants = cva("flex justify-center items-center gap-3", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-7",
      large: "mt-8",
    },
    theme: {
      minimal: "",
      classic: "mt-10",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const toggleLabelVariants = cva("font-medium text-sm transition-all", {
  variants: {
    size: {
      small: "text-xs",
      medium: "text-sm",
      large: "text-sm",
    },
    theme: {
      minimal: "",
      classic: "font-semibold",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const switchScaleVariants = cva("transition-all", {
  variants: {
    size: {
      small: "scale-90",
      medium: "scale-95",
      large: "",
    },
    theme: {
      minimal: "",
      classic: "data-[state=checked]:bg-primary",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const plansWrapperVariants = cva("flex", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
    theme: {
      minimal: "",
      classic: "mt-12",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const cardVariants = cva(
  "bg-card text-card-foreground border shadow-sm flex w-full flex-col justify-between text-center rounded-xl md:rounded-none transition-all duration-300",
  {
    variants: {
      size: {
        small: "py-4 gap-6",
        medium: "py-5 gap-7",
        large: "py-6 gap-8",
      },
      theme: {
        minimal: "",
        classic: "hover:shadow-xl backdrop-blur-sm bg-card/50 border-border/50",
      },
      highlight: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        theme: "classic",
        highlight: true,
        className: "bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden shadow-2xl",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted/30 shadow-lg",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

export const priceTextVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-5xl",
    },
    theme: {
      minimal: "",
      classic: "text-6xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const priceSubTextVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      small: "mt-2",
      medium: "mt-3",
      large: "mt-3",
    },
    theme: {
      minimal: "",
      classic: "font-medium",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const tableWrapperVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
    theme: {
      minimal: "",
      classic: "mt-16 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const featureIconVariants = cva("mx-auto", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
      large: "size-5",
    },
    theme: {
      minimal: "",
      classic: "text-emerald-500",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const firstColWidthVariants = cva("", {
  variants: {
    size: {
      small: "w-[140px]",
      medium: "w-[180px]",
      large: "w-[200px]",
    },
  },
  defaultVariants: {
    size: "large",
  },
});

export const buttonVariants = cva("w-full hover:cursor-pointer transition-all duration-300", {
  variants: {
    theme: {
      minimal: "",
      classic: "hover:shadow-xl active:scale-95",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

export interface PricingTableTwoProps extends VariantProps<typeof sectionVariants> {
  className?: string;
  plans: Plan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string) => void;
}

export const calculateDiscount = (monthlyPrice: string, yearlyPrice: string) => {
  const monthly = parseFloat(monthlyPrice) * 12;
  const yearly = parseFloat(yearlyPrice);
  const discount = ((monthly - yearly) / monthly) * 100;
  return Math.round(discount);
};
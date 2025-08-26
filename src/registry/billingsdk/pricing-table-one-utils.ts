"use client"

import { cva } from "class-variance-authority";
import { type Plan } from "@/lib/billingsdk-config"

export interface PricingTableOneProps {
  className?: string;
  plans: Plan[];
  title?: string;
  description?: string;
  onPlanSelect?: (planId: string) => void;
  size?: "small" | "medium" | "large";
  theme?: "minimal" | "classic";
}

export const sectionVariants = cva("py-32", {
  variants: {
    size: {
      small: "py-6 md:py-12",
      medium: "py-10 md:py-20",
      large: "py-16 md:py-32",
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

export const titleVariants = cva("text-pretty text-left font-bold", {
  variants: {
    size: {
      small: "text-3xl lg:text-4xl",
      medium: "text-4xl lg:text-5xl",
      large: "text-4xl lg:text-6xl",
    },
    theme: {
      minimal: "",
      classic: "text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent p-1",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const descriptionVariants = cva("text-muted-foreground max-w-3xl", {
  variants: {
    size: {
      small: "text-base lg:text-lg",
      medium: "text-lg lg:text-xl",
      large: "lg:text-xl",
    },
    theme: {
      minimal: "text-left",
      classic: "text-center mx-auto",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const cardVariants = cva(
  "flex w-full flex-col rounded-lg border text-left h-full transition-all duration-300",
  {
    variants: {
      size: {
        small: "p-4",
        medium: "p-5",
        large: "p-6",
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
        className: "ring-2 ring-primary/20 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "bg-muted",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

export const priceTextVariants = cva("font-medium", {
  variants: {
    size: {
      small: "text-3xl",
      medium: "text-4xl",
      large: "text-4xl",
    },
    theme: {
      minimal: "",
      classic: "text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const featureIconVariants = cva("", {
  variants: {
    size: {
      small: "size-3",
      medium: "size-4",
      large: "size-4",
    },
    theme: {
      minimal: "text-primary",
      classic: "text-emerald-500",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

export const highlightBadgeVariants = cva("mb-8 block w-fit", {
  variants: {
    theme: {
      minimal: "",
      classic: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

export const toggleVariants = cva("flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg", {
  variants: {
    theme: {
      minimal: "bg-muted",
      classic: "bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg",
    },
  },
  defaultVariants: {
    theme: "minimal",
  },
});

export const buttonVariants = cva(
  "gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300",
  {
    variants: {
      theme: {
        minimal: "shadow hover:bg-primary/90 h-9 py-2 group bg-primary text-primary-foreground ring-primary before:from-primary-foreground/20 after:from-primary-foreground/10 relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-md px-3 text-left text-sm font-medium ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay hover:cursor-pointer",
        classic: "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:shadow-xl active:scale-95 border border-primary/20",
      },
    },
    defaultVariants: {
      theme: "minimal",
    },
  }
);

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
"use client";

import { Check, Minus } from "lucide-react";
import { useState, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Plan } from "@/lib/billingsdk-config";
import { cn } from "@/lib/utils";

const sectionVariants = cva("py-32", {
  variants: {
    size: {
      small: "py-6 md:py-12",
      medium: "py-10 md:py-20",
      large: "py-16 md:py-32",
    },
    theme: {
      minimal: "",
      classic:
        "bg-gradient-to-b from-background to-muted/20 relative overflow-hidden",
    },
  },
  defaultVariants: {
    size: "medium",
    theme: "minimal",
  },
});

const titleVariants = cva("text-pretty text-left font-bold", {
  variants: {
    size: {
      small: "text-3xl lg:text-4xl",
      medium: "text-4xl lg:text-5xl",
      large: "text-4xl lg:text-6xl",
    },
    theme: {
      minimal: "",
      classic:
        "text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent p-1",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const descriptionVariants = cva("text-muted-foreground max-w-3xl", {
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

const cardVariants = cva(
  "relative w-full rounded-xl border-0 text-left transition-all duration-500 shadow-sm overflow-hidden",
  {
    variants: {
      size: {
        small: "min-h-[400px]",
        medium: "min-h-[450px]",
        large: "min-h-[500px]",
      },
      theme: {
        minimal: "",
        classic: "hover:shadow-xl backdrop-blur-sm bg-card/50",
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
        className:
          "ring-2 ring-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden",
      },
      {
        theme: "minimal",
        highlight: true,
        className: "ring-2 ring-primary/20 shadow-lg",
      },
    ],
    defaultVariants: {
      size: "large",
      theme: "minimal",
      highlight: false,
    },
  }
);

const flipCardVariants = cva(
  "w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
  {
    variants: {
      flipped: {
        true: "rotate-y-180",
        false: "",
      },
    },
    defaultVariants: {
      flipped: false,
    },
  }
);

const flipSideVariants = cva(
  "absolute inset-0 w-full h-full backface-hidden flex flex-col",
  {
    variants: {
      side: {
        front: "",
        back: "rotate-y-180",
      },
    },
    defaultVariants: {
      side: "front",
    },
  }
);

const imageContainerVariants = cva(
  "relative flex-1 overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10",
  {
    variants: {
      size: {
        small: "min-h-[180px]",
        medium: "min-h-[200px]",
        large: "min-h-[220px]",
      },
    },
    defaultVariants: {
      size: "large",
    },
  }
);

const tableWrapperVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    size: {
      small: "mt-6",
      medium: "mt-8",
      large: "mt-10",
    },
    theme: {
      minimal: "",
      classic:
        "mt-16 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const featureIconVariants = cva("mx-auto", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
      large: "size-5",
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

const firstColWidthVariants = cva("", {
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

const contentContainerVariants = cva(
  "flex flex-col bg-muted/30 backdrop-blur-sm rounded-b-xl",
  {
    variants: {
      size: {
        small: "p-4 gap-4",
        medium: "p-5 gap-5",
        large: "p-6 gap-6",
      },
    },
    defaultVariants: {
      size: "large",
    },
  }
);

const priceTextVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-2xl",
      medium: "text-3xl",
      large: "text-4xl",
    },
    theme: {
      minimal: "",
      classic:
        "text-5xl font-extrabold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
    },
  },
  defaultVariants: {
    size: "large",
    theme: "minimal",
  },
});

const badgeVariants = cva(
  "absolute px-3 py-1 text-xs font-medium rounded-full bg-black text-white border border-white/20",
  {
    variants: {
      position: {
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
      },
    },
    defaultVariants: {
      position: "top-left",
    },
  }
);

const toggleVariants = cva(
  "flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg",
  {
    variants: {
      theme: {
        minimal: "bg-muted",
        classic:
          "bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg",
      },
    },
    defaultVariants: {
      theme: "minimal",
    },
  }
);

const buttonVariants = cva(
  "w-full transition-all duration-300 hover:cursor-pointer",
  {
    variants: {
      theme: {
        minimal: "bg-primary text-primary-foreground hover:bg-primary/90",
        classic:
          "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold border border-primary/20 hover:shadow-xl active:scale-95",
      },
      highlight: {
        true: "",
        false: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    compoundVariants: [
      {
        theme: "minimal",
        highlight: true,
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
    ],
    defaultVariants: {
      theme: "minimal",
      highlight: false,
    },
  }
);

/**
 * Props for the PricingTableSix component - an advanced pricing table with comprehensive image support
 * and interactive flip animations.
 */
export interface PricingTableSixProps
  extends VariantProps<typeof sectionVariants> {
  /** Additional CSS classes for styling customization */
  className?: string;
  /** Array of pricing plans to display */
  plans: Plan[];
  /** Main title for the pricing section */
  title?: string;
  /** Subtitle description for the pricing section */
  description?: string;
  /** Callback function triggered when a plan is selected */
  onPlanSelect?: (planId: string) => void;
  /**
   * Custom background images for each plan.
   *
   * **Comprehensive Format Support:**
   * - PNG, JPG, JPEG, WebP, GIF, BMP, TIFF formats
   * - HTTP/HTTPS URLs: `'https://example.com/image.jpg'`
   * - Base64 data URIs: `'data:image/png;base64,iVBORw0KGgo...'`
   * - Local file paths: `'./images/plan.webp'`
   *
   * **Smart Behavior:**
   * - When images provided: Clean image display with borders, no background gradients
   * - When no images: Theme-aware gradient overlays with animated shapes
   * - Automatic format detection and fallback handling
   *
   * @example
   * ```tsx
   * backgroundImages={{
   *   'starter': 'https://images.unsplash.com/photo-starter',
   *   'pro': 'data:image/png;base64,iVBORw0KGgoAAAANS...',
   *   'enterprise': './assets/enterprise.webp'
   * }}
   * ```
   */
  backgroundImages?: {
    [key: string]: string;
  };
  /**
   * Custom height for the image section in pixels.
   *
   * Controls the height of the top image container. When not specified,
   * height is automatically calculated based on the size prop:
   * - small: 180px
   * - medium: 200px
   * - large: 220px
   *
   * @example
   * ```tsx
   * imageHeight={300}  // Set to 300px height
   * ```
   */
  imageHeight?: string | number;
  /** Whether to show the feature comparison table below the cards */
  showFeatureTable?: boolean;
}

/**
 * PricingTableSix - Advanced pricing table component with comprehensive image support.
 *
 * **Key Features:**
 * - 🖼️ **Multi-format Image Support**: PNG, JPG, JPEG, WebP, GIF, BMP, TIFF
 * - 🔄 **Interactive Flip Animation**: Hover to reveal detailed features
 * - 🎨 **Theme-Aware Gradients**: Beautiful fallbacks when no images provided
 * - 📱 **Responsive Design**: Optimized for all screen sizes
 * - ⚡ **Smart Detection**: Automatic image format detection with fallback handling
 *
 * **Image Behavior:**
 * - With custom images: Clean display with borders, no competing backgrounds
 * - Without images: Animated theme-aware gradient overlays with floating shapes
 *
 * @param props - Component props including plans, images, and configuration options
 * @returns JSX element with interactive pricing cards
 */
export function PricingTableSix({
  className,
  plans,
  title,
  description,
  onPlanSelect,
  size,
  theme = "minimal",
  backgroundImages = {},
  imageHeight,
  showFeatureTable = true,
}: PricingTableSixProps) {
  const [isAnnually, setIsAnnually] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [cardHeights, setCardHeights] = useState<{ [key: string]: number }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const uniqueId = useId();

  const calculateCardHeight = (planId: string, isFlipped: boolean): number => {
    const frontRef = cardRefs.current[`${planId}-front`];
    const backRef = cardRefs.current[`${planId}-back`];

    if (!frontRef || !backRef) return 500; // Default height

    const frontHeight = frontRef.scrollHeight;
    const backHeight = backRef.scrollHeight;

    return Math.max(frontHeight, backHeight);
  };

  useEffect(() => {
    const newHeights: { [key: string]: number } = {};
    plans.forEach((plan) => {
      newHeights[plan.id] = calculateCardHeight(
        plan.id,
        flippedCards.has(plan.id)
      );
    });
    setCardHeights(newHeights);
  }, [plans, flippedCards]);

  const handleCardHover = (planId: string, isHovering: boolean) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (isHovering) {
        newSet.add(planId);
      } else {
        newSet.delete(planId);
      }
      return newSet;
    });
  };

  function calculateDiscount(
    monthlyPrice: string,
    yearlyPrice: string
  ): number {
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

  const yearlyPriceDiscount = plans.length
    ? Math.max(
        ...plans.map((plan) =>
          calculateDiscount(plan.monthlyPrice, plan.yearlyPrice)
        )
      )
    : 0;

  const getBackgroundImage = (planId: string) => {
    return backgroundImages[planId] || null;
  };

  /**
   * Comprehensive image detection function that supports multiple formats and input methods.
   *
   * **Supported Formats**: PNG, JPG, JPEG, WebP, GIF, BMP, TIFF
   * **Input Methods**:
   * - HTTP/HTTPS URLs
   * - Base64 data URIs (data:image/[format];base64,...)
   * - Local file paths with extensions
   *
   * @param planId - The ID of the plan to check for custom images
   * @returns boolean - true if a valid image is detected, false otherwise
   */
  const hasCustomImage = (planId: string) => {
    const bgImage = backgroundImages[planId];
    if (!bgImage) return false;

    // Check if it's a real image (URL, base64, or common image formats)
    return (
      bgImage.startsWith("http://") ||
      bgImage.startsWith("https://") ||
      bgImage.startsWith("data:image/png") ||
      bgImage.startsWith("data:image/jpg") ||
      bgImage.startsWith("data:image/jpeg") ||
      bgImage.startsWith("data:image/webp") ||
      bgImage.startsWith("data:image/gif") ||
      bgImage.startsWith("data:image/bmp") ||
      bgImage.startsWith("data:image/tiff") ||
      bgImage.endsWith(".png") ||
      bgImage.endsWith(".jpg") ||
      bgImage.endsWith(".jpeg") ||
      bgImage.endsWith(".webp") ||
      bgImage.endsWith(".gif") ||
      bgImage.endsWith(".bmp") ||
      bgImage.endsWith(".tiff")
    );
  };

  const getDefaultGradient = () => {
    if (theme === "classic") {
      return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><radialGradient id="gradClassic" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23000000;stop-opacity:0.1" /><stop offset="50%" style="stop-color:%23374151;stop-opacity:0.05" /><stop offset="100%" style="stop-color:%23111827;stop-opacity:0.03" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23gradClassic)" /><circle cx="100" cy="80" r="60" fill="%23f3f4f6" opacity="0.1" /><circle cx="300" cy="120" r="80" fill="%23e5e7eb" opacity="0.08" /></svg>';
    }
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><defs><radialGradient id="grad1" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:%23a855f7;stop-opacity:0.8" /><stop offset="50%" style="stop-color:%233b82f6;stop-opacity:0.6" /><stop offset="100%" style="stop-color:%236366f1;stop-opacity:0.4" /></radialGradient></defs><rect width="100%" height="100%" fill="url(%23grad1)" /><circle cx="100" cy="80" r="60" fill="%23ec4899" opacity="0.3" /><circle cx="300" cy="120" r="80" fill="%23f59e0b" opacity="0.2" /></svg>';
  };

  return (
    <section className={cn(sectionVariants({ size, theme }), className)}>
      {/* Classic theme background elements */}
      {theme === "classic" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
        </>
      )}

      <div className={cn("container relative", "p-0 md:p-[1rem]")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div
            className={cn(
              "flex flex-col gap-4",
              theme === "classic" && "text-center"
            )}
          >
            <h2 className={cn(titleVariants({ size, theme }))}>
              {title || "Image-Enhanced Pricing"}
            </h2>
          </div>

          <div
            className={cn(
              "flex flex-col justify-between gap-5 md:gap-10",
              theme === "classic"
                ? "md:flex-col md:items-center"
                : "md:flex-row"
            )}
          >
            <p className={cn(descriptionVariants({ size, theme }))}>
              {description ||
                "Choose the perfect plan with our image-enhanced pricing cards featuring comprehensive format support and theme-aware gradients."}
            </p>
            <div
              className={cn(
                toggleVariants({ theme }),
                theme === "classic" && "mx-auto"
              )}
            >
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === "annually");
                }}
              >
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="monthly"
                    id={`${uniqueId}-monthly`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${uniqueId}-monthly`}
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center px-2 md:px-7 font-semibold transition-all hover:text-foreground"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="annually"
                    id={`${uniqueId}-annually`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`${uniqueId}-annually`}
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 px-2 md:px-7 font-semibold transition-all hover:text-foreground"
                  >
                    Yearly
                    {yearlyPriceDiscount > 0 && (
                      <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary border border-primary/20 font-medium">
                        Save {yearlyPriceDiscount}%
                      </span>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  cardVariants({
                    size,
                    theme,
                    highlight: plan.highlight,
                  })
                )}
                style={{
                  height: cardHeights[plan.id]
                    ? `${cardHeights[plan.id]}px`
                    : "auto",
                  perspective: "1000px",
                }}
                onMouseEnter={() => handleCardHover(plan.id, true)}
                onMouseLeave={() => handleCardHover(plan.id, false)}
              >
                <div
                  className={cn(
                    flipCardVariants({
                      flipped: flippedCards.has(plan.id),
                    })
                  )}
                >
                  {/* Front Side */}
                  <div
                    ref={(el) => {
                      cardRefs.current[`${plan.id}-front`] = el;
                    }}
                    className={cn(flipSideVariants({ side: "front" }))}
                  >
                    {/* Image Container - Top Half */}
                    <div
                      className={cn(
                        imageContainerVariants({ size })
                      )}
                      style={{
                        height: imageHeight ? (typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight) : undefined,
                      }}
                    >
                      {/* Background Image - Only show if custom image exists */}
                      {hasCustomImage(plan.id) && (
                        <div
                          className="absolute inset-0 bg-center bg-cover"
                          style={{
                            backgroundImage: `url("${getBackgroundImage(
                              plan.id
                            )}")`,
                          }}
                        />
                      )}

                      {/* Gradient Overlay - Only show if no custom image */}
                      {!hasCustomImage(plan.id) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/8" />
                      )}

                      {/* Abstract Shapes for fluid effect - Only show if no custom image */}
                      {!hasCustomImage(plan.id) && (
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div
                            className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-xl bg-gradient-to-br from-primary/10 to-secondary/8"
                            animate={{
                              x: [0, 20, 0],
                              y: [0, -15, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full blur-lg bg-gradient-to-br from-accent/8 to-muted/6"
                            animate={{
                              x: [0, -25, 0],
                              y: [0, 10, 0],
                              scale: [1, 0.9, 1],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                          />
                        </div>
                      )}

                      {/* Plan Type Badge - Top Left */}
                      <Badge
                        className={cn(badgeVariants({ position: "top-left" }))}
                      >
                        {plan.title}
                      </Badge>

                      {/* Most Popular Badge - Top Right */}
                      {plan.highlight && (
                        <Badge
                          className={cn(
                            badgeVariants({ position: "top-right" })
                          )}
                        >
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    {/* Content Container - Bottom Half */}
                    <div
                      className={cn(
                        contentContainerVariants({ size }),
                        hasCustomImage(plan.id) &&
                          "border-t border-x border-border/30"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isAnnually ? "year" : "month"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-baseline gap-2"
                          >
                            {isAnnually ? (
                              <>
                                <span
                                  className={cn(
                                    priceTextVariants({ size, theme })
                                  )}
                                >
                                  {parseFloat(plan.yearlyPrice) >= 0 && (
                                    <>{plan.currency}</>
                                  )}
                                  {plan.yearlyPrice}
                                  {calculateDiscount(
                                    plan.monthlyPrice,
                                    plan.yearlyPrice
                                  ) > 0 && (
                                    <span
                                      className={cn(
                                        "text-xs ml-2",
                                        theme === "classic"
                                          ? "text-emerald-500 font-semibold"
                                          : "text-primary"
                                      )}
                                    >
                                      {calculateDiscount(
                                        plan.monthlyPrice,
                                        plan.yearlyPrice
                                      )}
                                      % off
                                    </span>
                                  )}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  per year
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={cn(
                                    priceTextVariants({ size, theme })
                                  )}
                                >
                                  {parseFloat(plan.monthlyPrice) >= 0 && (
                                    <>{plan.currency}</>
                                  )}
                                  {plan.monthlyPrice}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  per month
                                </span>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <Button
                        className={cn(
                          buttonVariants({ theme, highlight: plan.highlight })
                        )}
                        onClick={() => onPlanSelect?.(plan.id)}
                        aria-label={`Select ${plan.title} plan`}
                      >
                        {plan.buttonText}
                        {theme === "classic" && plan.highlight && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    ref={(el) => {
                      cardRefs.current[`${plan.id}-back`] = el;
                    }}
                    className={cn(flipSideVariants({ side: "back" }))}
                  >
                    {/* Features List - Top Section */}
                    <div className="flex-1 bg-muted/30 backdrop-blur-sm border border-border/30 relative overflow-hidden rounded-t-xl">
                      {/* No background image on back side - just muted background */}

                      {/* Features Content */}
                      <div className="relative z-10 p-6 h-full">
                        <div className="mb-4">
                          <Badge
                            className={cn(
                              badgeVariants({ position: "top-left" })
                            )}
                            style={{ position: "relative", top: 0, left: 0 }}
                          >
                            {plan.title} Features
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: featureIndex * 0.1,
                              }}
                              className="flex items-center gap-3 text-foreground"
                            >
                              {feature.icon === "check" ? (
                                <Check className="size-5 text-green-600 flex-shrink-0" />
                              ) : feature.icon === "minus" ? (
                                <Minus className="size-5 text-muted-foreground flex-shrink-0" />
                              ) : null}
                              <span className="text-sm font-medium">
                                {feature.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Button - Bottom Section */}
                    <div
                      className={cn(
                        contentContainerVariants({ size }),
                        "border-t border-x border-border/30"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isAnnually ? "year" : "month"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-baseline gap-2"
                          >
                            {isAnnually ? (
                              <>
                                <span
                                  className={cn(
                                    priceTextVariants({ size, theme })
                                  )}
                                >
                                  {parseFloat(plan.yearlyPrice) >= 0 && (
                                    <>{plan.currency}</>
                                  )}
                                  {plan.yearlyPrice}
                                  {calculateDiscount(
                                    plan.monthlyPrice,
                                    plan.yearlyPrice
                                  ) > 0 && (
                                    <span
                                      className={cn(
                                        "text-xs ml-2",
                                        theme === "classic"
                                          ? "text-emerald-500 font-semibold"
                                          : "text-primary"
                                      )}
                                    >
                                      {calculateDiscount(
                                        plan.monthlyPrice,
                                        plan.yearlyPrice
                                      )}
                                      % off
                                    </span>
                                  )}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  per year
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  className={cn(
                                    priceTextVariants({ size, theme })
                                  )}
                                >
                                  {parseFloat(plan.monthlyPrice) >= 0 && (
                                    <>{plan.currency}</>
                                  )}
                                  {plan.monthlyPrice}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  per month
                                </span>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <Button
                        className={cn(
                          buttonVariants({ theme, highlight: plan.highlight })
                        )}
                        onClick={() => onPlanSelect?.(plan.id)}
                        aria-label={`Select ${plan.title} plan`}
                      >
                        {plan.buttonText}
                        {theme === "classic" && plan.highlight && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          {showFeatureTable && (
            <motion.div
              className={cn(tableWrapperVariants({ size, theme }))}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Table className={cn(theme === "classic" && "bg-transparent")}>
                <TableHeader>
                  <TableRow
                    className={cn(theme === "classic" && "border-border/30")}
                  >
                    <TableHead
                      className={firstColWidthVariants({ size })}
                    ></TableHead>
                    {plans.map((plan: Plan) => (
                      <TableHead
                        key={plan.id}
                        className={cn(
                          "text-center font-bold text-primary",
                          theme === "classic" && "text-lg"
                        )}
                      >
                        {plan.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const allFeatures = new Set<string>();
                    plans.forEach((plan) => {
                      plan.features.forEach((feature) => {
                        allFeatures.add(feature.name);
                      });
                    });
                    return Array.from(allFeatures).map(
                      (featureName, featureIndex) => (
                        <TableRow
                          key={featureIndex}
                          className={cn(
                            theme === "classic" &&
                              "border-border/20 hover:bg-muted/30"
                          )}
                        >
                          <TableCell
                            className={cn(
                              "font-medium text-left",
                              theme === "classic" &&
                                "font-semibold text-foreground/90"
                            )}
                          >
                            {featureName}
                          </TableCell>
                          {plans.map((plan: Plan) => {
                            const feature = plan.features.find(
                              (f) => f.name === featureName
                            );
                            return (
                              <TableCell key={plan.id} className="text-center">
                                {feature ? (
                                  feature.icon === "check" ? (
                                    <Check
                                      className={cn(
                                        featureIconVariants({ size, theme })
                                      )}
                                    />
                                  ) : feature.icon === "minus" ? (
                                    <Minus
                                      className={cn(
                                        featureIconVariants({ size, theme })
                                      )}
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        "text-sm text-muted-foreground",
                                        theme === "classic" &&
                                          "font-medium text-foreground/70"
                                      )}
                                    >
                                      {feature.name}
                                    </span>
                                  )
                                ) : (
                                  <Minus
                                    className={cn(
                                      featureIconVariants({ size, theme })
                                    )}
                                  />
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      )
                    );
                  })()}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

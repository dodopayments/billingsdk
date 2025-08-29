import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SectionHeadingProps {
  children: ReactNode;
  highlightedText?: string;
  description?: string;
  className?: string;
  size?: "default" | "large";
}

export function SectionHeading({ 
  children, 
  highlightedText, 
  description, 
  className,
  size = "default"
}: SectionHeadingProps) {
  const headingSize = size === "large" 
    ? "text-5xl md:text-6xl lg:text-7xl" 
    : "text-4xl md:text-5xl lg:text-6xl";

  return (
    <div className={cn("text-center mb-16", className)}>
      <motion.h2 
        className={cn(
          "font-bold font-display text-foreground mb-6",
          headingSize
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        {children}
        {highlightedText && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {highlightedText}
          </span>
        )}
      </motion.h2>
      
      {description && (
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

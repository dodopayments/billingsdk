import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "accent";
}

export function SectionWrapper({ 
  children, 
  className,
  id,
  background = "default"
}: SectionWrapperProps) {
  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-accent/5"
  };

  return (
    <section 
      id={id}
      className={cn(
        "py-24 md:py-32 relative overflow-hidden",
        backgroundClasses[background],
        className
      )}
    >
      {/* Consistent background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/5 to-accent/5"></div>
      
      {/* Content container */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
        {children}
      </div>
    </section>
  );
}

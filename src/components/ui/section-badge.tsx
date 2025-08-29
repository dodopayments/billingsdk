import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SectionBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SectionBadge({ children, icon, className }: SectionBadgeProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.div>
  );
}

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export const ShineButton = ({
  className,
  containerClassName,
  label,
  Icon,
}: {
  className?: string;
  containerClassName?: string;
  label: string;
  Icon?: LucideIcon;
}) => {
  return (
    <motion.div
      className={cn(
        "group relative top-0 left-0 flex h-9 rounded-full p-px text-xs leading-6 font-semibold text-white",
        className,
      )}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
    >
      <span className="via-primary/40 absolute -top-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      {/* Inner container like button */}
      <div
        className={cn(
          "relative z-10 flex items-center gap-2 rounded-full px-4 py-0.5 ring-1 ring-white/10",
          containerClassName,
        )}
      >
        {Icon && <Icon className="text-primary size-3" />}
        <div className="text-sm font-normal whitespace-nowrap text-white">
          {label}
        </div>
      </div>
      {/* Underline effect like Tailwind Connect */}
      <span className="via-primary/90 absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </motion.div>
  );
};

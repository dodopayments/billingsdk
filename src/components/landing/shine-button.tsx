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
        "flex relative top-0 left-0 rounded-full p-px text-xs font-semibold leading-6 h-9 text-white group",
        className,
      )}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
    >
      <span
        className="absolute -top-0 left-[1.125rem] h-px 
                   w-[calc(100%-2.25rem)] 
                   bg-gradient-to-r from-emerald-400/0 via-primary/40 
                   transition-opacity duration-500 group-hover:opacity-40"
      ></span>
      {/* Inner container like button */}
      <div
        className={cn(
          "relative flex items-center gap-2 z-10 rounded-full py-0.5 px-4 ring-1 ring-white/10",
          containerClassName,
        )}
      >
        {Icon && <Icon className="text-primary size-3" />}
        <div className="text-white text-sm font-normal whitespace-nowrap">
          {label}
        </div>
      </div>
      {/* Underline effect like Tailwind Connect */}
      <span
        className="absolute -bottom-0 left-[1.125rem] h-px 
                   w-[calc(100%-2.25rem)] 
                   bg-gradient-to-r from-emerald-400/0 via-primary/90  
                   transition-opacity duration-500 group-hover:opacity-40"
      ></span>
    </motion.div>
  );
};

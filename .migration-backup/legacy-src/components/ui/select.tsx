import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "w-full h-12 pl-4 pr-10 appearance-none bg-surface border border-white/10 rounded-xl text-white text-sm font-light focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold transition-colors hover:border-white/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

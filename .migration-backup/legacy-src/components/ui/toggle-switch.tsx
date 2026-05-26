import * as React from "react";
import { cn } from "../../lib/utils";

interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onToggle'> {
  onToggle?: (checked: boolean) => void;
}

export const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ className, checked, onToggle, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onToggle?.(e.target.checked)}
          ref={ref} 
          {...props} 
        />
        <div className={cn(
          "w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold",
          className
        )}></div>
      </label>
    );
  }
);
ToggleSwitch.displayName = "ToggleSwitch";

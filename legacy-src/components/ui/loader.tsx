import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
}

export function LoadingSpinner({ className, size = "md", text }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div className={cn("absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse", sizeClasses[size])} />
        <Loader2 className={cn("animate-spin text-gold relative z-10", sizeClasses[size])} />
      </div>
      {text && <p className="text-sm font-mono tracking-widest text-gold/80 uppercase">{text}</p>}
    </div>
  );
}

export function LoadingScreen({ text = "Preparing space..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-primary-base/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm ring-offset-primary-base placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-white/20 text-white font-light resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

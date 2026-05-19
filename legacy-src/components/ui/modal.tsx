import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function Modal({ isOpen, onClose, children, title, description, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={cn(
          "relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-surface-base border border-white/10 shadow-2xl transition-all",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8">
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <h2 className="font-serif text-2xl font-medium tracking-wide text-white mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm font-light text-gray-400">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

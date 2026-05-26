import { Quote } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  imageUrl?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  imageUrl,
  className
}: TestimonialCardProps) {
  return (
    <Card className={cn("p-8 relative overflow-hidden group hover:border-gold/30 transition-all duration-500", className)}>
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-16 h-16 text-gold rotate-180" />
      </div>
      
      <div className="relative z-10">
        <p className="text-lg md:text-xl text-gray-300 font-serif leading-relaxed mb-8 italic">
          "{quote}"
        </p>
        
        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={author} 
              className="w-12 h-12 rounded-full object-cover border border-gold/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-surface-hover border border-white/10 flex items-center justify-center text-white font-medium">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div>
            <h4 className="text-white font-medium">{author}</h4>
            {role && <p className="text-sm text-gray-500 font-mono tracking-wider">{role}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}

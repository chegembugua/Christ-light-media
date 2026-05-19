import { BookOpen, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

interface DevotionCardProps {
  id: string;
  title: string;
  author: string;
  date: string | Date;
  excerpt: string;
  readTime?: string;
  category?: string;
  imageUrl?: string;
  className?: string;
}

export function DevotionCard({
  id,
  title,
  author,
  date,
  excerpt,
  readTime = "5 min read",
  category = "Daily Devotional",
  imageUrl,
  className
}: DevotionCardProps) {
  const formattedDate = typeof date === 'string' ? date : format(date, 'MMM d, yyyy');

  return (
    <Card className={cn("group flex flex-col sm:flex-row overflow-hidden hover:border-gold/30 hover:shadow-[0_0_20px_rgba(200,162,74,0.15)] transition-all duration-500", className)}>
      <div className="sm:w-1/3 relative h-48 sm:h-auto overflow-hidden bg-surface-base">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
            <BookOpen className="w-12 h-12 text-gold/50 group-hover:text-gold transition-colors" />
          </div>
        )}
        <div className="absolute top-4 left-4 sm:hidden">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-md">{category}</Badge>
        </div>
      </div>
      
      <div className="sm:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="hidden sm:inline-flex">{category}</Badge>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1.5 uppercase tracking-widest"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
            </div>
          </div>
          
          <Link to={`/devotions/${id}`} className="block">
            <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-gold transition-colors mb-3 line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-400 font-light line-clamp-2 leading-relaxed mb-6">
              {excerpt}
            </p>
          </Link>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs text-gold font-medium">
               {author.charAt(0).toUpperCase()}
             </div>
             <div className="flex flex-col">
               <span className="text-sm text-white font-medium">{author}</span>
               <span className="text-xs text-gray-500 font-mono tracking-wider">AUTHOR</span>
             </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> {readTime}
          </span>
        </div>
      </div>
    </Card>
  );
}

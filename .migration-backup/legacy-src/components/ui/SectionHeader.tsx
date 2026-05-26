import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  linkTo?: string;
  linkLabel?: string;
}

export default function SectionHeader({ title, subtitle, icon, linkTo, linkLabel }: SectionHeaderProps) {
  // Split title if it contains a space to colorize the last word
  const words = title.split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;
  const firstPart = words.join(' ');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-surface-hover relative"
    >
      <div className="absolute -bottom-[1px] left-0 w-32 h-[1px] bg-gradient-to-r from-gold to-transparent"></div>
      
      <div>
        <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
          {icon && <span className="text-gold">{icon}</span>}
          {lastWord ? (
            <>
              {firstPart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light tracking-tight">{lastWord}</span>
            </>
          ) : (
            title
          )}
        </h2>
        {subtitle && (
          <p className="text-gray-400 mt-2 font-light text-lg tracking-wide max-w-2xl">{subtitle}</p>
        )}
      </div>

      {linkTo && (
        <Link 
          to={linkTo} 
          className="group inline-flex items-center text-xs text-gold hover:text-white uppercase tracking-widest transition-colors font-medium self-start sm:self-end mb-1"
        >
          {linkLabel || 'See All'}
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

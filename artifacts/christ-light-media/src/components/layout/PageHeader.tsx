
import { motion } from 'framer-motion';

interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
}

export default function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-purple-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-gold text-sm tracking-[0.3em] mb-4 uppercase font-bold">{label}</p>
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-tighter mb-5 text-shine leading-[1.1]">
            {title}
          </h1>
          <p className="text-gray-400 max-w-xl text-lg font-inter leading-relaxed">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

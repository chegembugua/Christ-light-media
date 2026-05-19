import { motion } from 'framer-motion';

export default function MissionStatement() {
  return (
    <section className="py-32 bg-surface relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444065381814-865dc9da92c0?q=80')] bg-cover bg-center opacity-5 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-base/80 to-transparent z-0" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
         >
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-relaxed font-bold tracking-tight">
              "We exist to spread the light of Christ through media, creativity, and digital ministry."
            </h2>
         </motion.div>
      </div>
    </section>
  );
}

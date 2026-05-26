import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sun, Moon, CloudSun } from 'lucide-react';

export default function PersonalizedGreeting() {
  const { user } = useAuth();
  
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  let Icon = Moon;
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    Icon = Sun;
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
    Icon = CloudSun;
  }

  const name = user?.displayName ? user.displayName.split(' ')[0] : 'friend';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3 text-white border-b border-white/5 pb-4"
    >
      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <div>
        <h2 className="text-2xl font-serif">
          {greeting}, <span className="text-gold italic">{name}</span>
        </h2>
        <p className="text-gray-400 text-sm tracking-wide">
          Here is some handpicked content to encourage your faith today.
        </p>
      </div>
    </motion.div>
  );
}

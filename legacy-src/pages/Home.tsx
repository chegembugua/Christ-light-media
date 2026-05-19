import { useEffect, useState } from 'react';
import { devotionService, DevotionItem } from '../services/devotionService';
import { sermonService, SermonItem } from '../services/sermonService';

import PremiumHero from '../components/home/PremiumHero';
import PremiumExperience from '../components/home/PremiumExperience';
import PremiumOfferings from '../components/home/PremiumOfferings';
import PremiumRadioSpotlight from '../components/home/PremiumRadioSpotlight';
import PremiumTestimonies from '../components/home/PremiumTestimonies';
import PremiumCTA from '../components/home/PremiumCTA';
import PersonalizedGreeting from '../components/home/PersonalizedGreeting';

export default function Home() {
  const [devotions, setDevotions] = useState<DevotionItem[]>([]);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      setLoading(true);
      try {
        const [devRes, serRes] = await Promise.all([
          devotionService.getAllItems(),
          sermonService.getAllItems()
        ]);

        if (devRes.success && devRes.data) setDevotions(devRes.data.sort((a, b) => b.createdAt - a.createdAt));
        if (serRes.success && serRes.data) setSermons(serRes.data.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const featuredDevotion = devotions.find(d => d.isFeatured) || (devotions.length > 0 ? devotions[0] : null);
  const featuredSermon = sermons.find(s => s.isFeatured) || (sermons.length > 0 ? sermons[0] : undefined);
  
  return (
    <div className="bg-primary-base min-h-screen text-white font-sans selection:bg-gold/30">
      <PremiumHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8 relative z-20">
         <PersonalizedGreeting />
      </div>

      <PremiumExperience devotion={featuredDevotion} sermon={featuredSermon} />
      
      <PremiumOfferings />
      
      <PremiumRadioSpotlight />
      
      <PremiumTestimonies />
      
      <PremiumCTA />
    </div>
  );
}

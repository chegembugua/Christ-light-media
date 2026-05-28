import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Select } from "../components/ui/select";
import { ToggleSwitch } from "../components/ui/toggle-switch";
import { LoadingSpinner } from "../components/ui/loader";
import { SectionHeader } from "../components/ui/section-header";
import { HeroSection } from "../components/ui/hero-section";
import { MediaCard } from "../components/media/MediaCard";
import { DevotionCard } from "../components/media/DevotionCard";
import { PrayerRequestCard } from "../components/community/PrayerRequestCard";
import { EmptyState } from "../components/ui/empty-state";
import { CategorySelector } from "../components/ui/category-selector";
import { useState } from "react";

import { TestimonialCard } from "../components/ui/testimonial-card";

export default function DesignSystem() {
  const [toggleVal, setToggleVal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-primary-base pb-24">
      <HeroSection 
        title="Design System" 
        subtitle="A luxurious, spiritual, and welcoming UI library for In For Christ Media House."
      >
        <Button variant="gold" size="lg">Explore Components</Button>
      </HeroSection>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        
        {/* Buttons */}
        <section>
          <SectionHeader title="Buttons" align="left" subtitle="Interactive elements with spiritual elegance." />
          <div className="flex flex-wrap gap-6 items-center p-8 bg-surface-base border border-white/5 rounded-3xl">
            <Button variant="gold">Primary Gold</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary">Primary White</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="secondary" className="text-red-500">Destructive-like</Button>
          </div>
        </section>

        {/* Form Elements */}
        <section>
           <SectionHeader title="Form Controls" align="left" />
           <div className="grid md:grid-cols-2 gap-8 p-8 bg-surface-base border border-white/5 rounded-3xl">
             <div className="space-y-6">
                <div>
                   <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-2 block">Standard Input</label>
                   <Input placeholder="Enter your email address..." />
                </div>
                <div>
                   <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-2 block">Textarea</label>
                   <Textarea placeholder="Share your prayer request..." />
                </div>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-2 block">Select Dropdown</label>
                   <Select 
                     options={[
                       { label: "Morning Devotion", value: "morning" },
                       { label: "Evening Prayer", value: "evening" }
                     ]}
                   />
                </div>
                <div>
                   <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-2 block">Toggle Switch</label>
                   <div className="flex items-center gap-4">
                     <ToggleSwitch checked={toggleVal} onToggle={setToggleVal} />
                     <span className="text-white text-sm">{toggleVal ? 'Enabled' : 'Disabled'}</span>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* Badges & Loaders */}
        <section>
          <SectionHeader title="Indicators" align="left" />
          <div className="flex flex-col gap-12 p-8 bg-surface-base border border-white/5 rounded-3xl">
            <div>
              <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-4 block">Badges</label>
              <div className="flex gap-4 flex-wrap">
                <Badge variant="default">Gold Accent</Badge>
                <Badge variant="secondary">Secondary Info</Badge>
                <Badge variant="outline">Border Outline</Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 font-mono tracking-widest uppercase mb-8 block">Loaders</label>
              <div className="flex gap-12 items-center flex-wrap">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" text="Loading Spirit..." />
              </div>
            </div>
          </div>
        </section>

        {/* Content Cards */}
        <section>
          <SectionHeader title="Media Cards" align="left" subtitle="For Sermons, Podcasts, and Music." />
          <div className="grid md:grid-cols-3 gap-6">
            <MediaCard 
              title="Walking in Faith"
              speaker="Pastor John Doe"
              category="Sermon"
              coverImage="https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=2000"
              duration="45:00"
              playCount={1200}
              onPlay={() => {}}
            />
            <MediaCard 
              title="Morning Worship"
              category="Music"
              coverImage="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2000"
              duration="3:45"
              isPlaying={true}
              onPlay={() => {}}
            />
          </div>
        </section>

        {/* Devotion Cards */}
        <section>
          <SectionHeader title="Devotion Card" align="left" />
          <DevotionCard 
            id="1"
            title="Finding Peace in the Storm"
            author="Sarah Jenkins"
            date={new Date()}
            excerpt="When the waves of life threaten to overwhelm you, remember that Jesus is in the boat with you. Peace is not the absence of storms, but His presence within them."
          />
        </section>

        {/* Prayer Cards */}
        <section>
          <SectionHeader title="Prayer Requests" align="left" />
          <div className="grid md:grid-cols-2 gap-6">
            <PrayerRequestCard 
              id="1"
              title="Healing for my mother"
              content="Please pray for my mother who is undergoing surgery tomorrow morning. We are believing God for a successful operation and complete recovery."
              authorName="David M."
              category="Healing"
              createdAt={new Date()}
              prayerCount={24}
              commentCount={5}
            />
            <PrayerRequestCard 
              id="2"
              title="Guidance for new job"
              content="I have two job offers and I need wisdom to choose the path God has prepared for me. Please pray for clarity."
              authorName="Esther O."
              category="Guidance"
              createdAt={new Date()}
              prayerCount={12}
              commentCount={1}
              hasPrayed={true}
            />
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <SectionHeader title="Testimonials" align="left" subtitle="Social proof styling." />
          <div className="grid md:grid-cols-2 gap-6">
            <TestimonialCard 
              quote="This app has completely transformed my daily prayer time. The devotions are spot on and the music is so uplifting."
              author="Michael T."
              role="Premium Member"
            />
            <TestimonialCard 
              quote="I love being able to tune into the live radio while I work. Such a blessing!"
              author="Sarah H."
            />
          </div>
        </section>

        {/* Layout Utilities */}
        <section>
           <SectionHeader title="Layout Utilities" align="left" />
           <div className="space-y-12">
             <div>
               <CategorySelector 
                 categories={[
                   { id: "all", label: "All" },
                   { id: "sermons", label: "Sermons" },
                   { id: "music", label: "Music" },
                   { id: "devotions", label: "Devotions" }
                 ]}
                 activeCategory={activeCategory}
                 onSelect={setActiveCategory}
               />
             </div>
             
             <EmptyState 
               title="No Saved Items"
               description="You haven't saved any devotions or sermons yet. Explore our library to find content that speaks to you."
               actionLabel="Browse Sermons"
               actionLink="/sermons"
             />
           </div>
        </section>
      </div>
    </div>
  );
}


import { useState } from 'react';
;
import { BookOpen, Clock, Users, Award, PlayCircle, Lock } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['All', 'Theology', 'Leadership', 'Apologetics', 'Marriage', 'Finances'];

const COURSES = [
  {
    id: 'c1',
    title: 'Foundations of Faith',
    instructor: 'Pastor David Chen',
    category: 'Theology',
    lessons: 12,
    duration: '6h 30m',
    students: 1250,
    price: 0,
    image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=2070',
    progress: 45, // if enrolled
    isEnrolled: true,
  },
  {
    id: 'c2',
    title: 'Defending the Gospel',
    instructor: 'Dr. James T.',
    category: 'Apologetics',
    lessons: 8,
    duration: '4h 15m',
    students: 840,
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973',
    progress: 0,
    isEnrolled: false,
  },
  {
    id: 'c3',
    title: 'Kingdom Leadership',
    instructor: 'Sarah Okafor',
    category: 'Leadership',
    lessons: 15,
    duration: '8h 45m',
    students: 2100,
    price: 0,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    progress: 0,
    isEnrolled: false,
  },
  {
    id: 'c4',
    title: 'Biblical Finances',
    instructor: 'Daniel K.',
    category: 'Finances',
    lessons: 6,
    duration: '3h 20m',
    students: 1560,
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070',
    progress: 0,
    isEnrolled: false,
  },
];

export default function SchoolPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses = activeCategory === 'All' 
    ? COURSES 
    : COURSES.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="EQUIPPING BELIEVERS" 
        title="Bible School" 
        description="Structured, deep theological training designed to equip you for ministry, leadership, and a resilient walk with Christ." 
      />

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Category Filter */}
          <ScrollReveal>
            <div className="flex gap-3 mb-12 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="p-0 overflow-hidden flex flex-col group h-full">
                
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {course.price === 0 ? (
                      <span className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Free
                      </span>
                    ) : (
                      <span className="bg-black/70 backdrop-blur-md text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gold/30">
                        Premium
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {course.category}
                    </span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-gold/90 rounded-full flex items-center justify-center backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform shadow-xl">
                      <PlayCircle size={32} className="text-black" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10 bg-card">
                  <h3 className="text-xl font-cinzel font-bold mb-2 group-hover:text-gold transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 font-inter">
                    by {course.instructor}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <BookOpen size={14} className="text-gold/50" /> {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Clock size={14} className="text-gold/50" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Users size={14} className="text-gold/50" /> {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Award size={14} className="text-gold/50" /> Certificate
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    {course.isEnrolled ? (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                          <span>Progress</span>
                          <span className="text-gold">{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold rounded-full" 
                            style={{ width: `${course.progress}%` }} 
                          />
                        </div>
                        <Button variant="outline" className="w-full mt-4 h-10 text-xs">
                          Continue Learning
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full h-12 flex items-center justify-center gap-2">
                        {course.price === 0 ? 'Enroll Now' : `Enroll for $${course.price}`}
                        {course.price > 0 && <Lock size={14} />}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </StaggerContainer>

        </div>
      </section>
    </div>
  );
}

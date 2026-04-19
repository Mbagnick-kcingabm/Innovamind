import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Filter } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image: string;
  featured?: boolean;
}

interface EventsSectionProps {
  EVENTS: EventData[];
  startEventLoading: (event: EventData) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ EVENTS, startEventLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = useMemo(() => {
    const cats = new Set(EVENTS.map(e => e.category));
    return ['Tous', ...Array.from(cats)];
  }, [EVENTS]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'Tous') return EVENTS;
    return EVENTS.filter(e => e.category === selectedCategory);
  }, [EVENTS, selectedCategory]);

  // For infinite scroll, we need enough items. If filtered list is small, we repeat it more times.
  const displayEvents = useMemo(() => {
    if (filteredEvents.length === 0) return [];
    const repeats = Math.max(3, Math.ceil(10 / filteredEvents.length));
    return Array(repeats).fill(filteredEvents).flat();
  }, [filteredEvents]);

  return (
    <motion.section
      id="events"
      className="py-16 sm:py-20 bg-gradient-to-b from-[#0a1f14] via-[#0d2d1a] to-[#081910] overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-6 sm:px-12 md:px-20 mb-8 sm:mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-g-bright/10 border border-g-bright/20 text-g-bright px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-4">
          ✦ À l'affiche
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
          Évènements <span className="text-transparent bg-clip-text bg-gradient-to-r from-g-bright to-g-light">Couverts</span>
        </h2>
        <p className="mt-4 text-xs sm:text-base text-white/50 font-light max-w-2xl mx-auto leading-relaxed">Des expériences uniques sélectionnées pour vous au cœur de Dakar et au-delà.</p>

        {/* Category Filters */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-g-bright text-dark border-g-bright shadow-lg shadow-g-bright/20 scale-105'
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-g-bright/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Track */}
      <div className="relative mt-4 sm:mt-8">
        <div className="absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-[#0a1f14] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-[#0a1f14] to-transparent z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex overflow-hidden mask-fade-x"
          >
            <div className="flex gap-4 sm:gap-6 md:gap-8 py-8 px-4 animate-infinite-scroll pause-on-hover pause-on-touch">
              {displayEvents.map((event, i) => (
                <div
                  key={`${event.id}-${i}`}
                  className={`flex-shrink-0 w-[260px] sm:w-80 md:w-96 group cursor-pointer ${event.featured ? 'md:w-[450px]' : ''}`}
                  onClick={() => startEventLoading(event)}
                >
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-g-bright/40 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_-15px_rgba(125,255,188,0.3)]">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-g-bright text-dark text-[9px] sm:text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      {event.category}
                    </div>
                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[9px] sm:text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        ★ Vedette
                      </div>
                    )}
                    
                    <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8">
                      <div className="flex items-center gap-2 text-g-bright text-[10px] sm:text-xs font-bold mb-2">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>
                      <h3 className="font-serif text-lg sm:text-2xl font-bold text-white leading-tight group-hover:text-g-bright transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="mt-5 px-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-serif font-bold text-base sm:text-xl">{event.price.toLocaleString()} FCFA</span>
                      <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest font-bold">/ billet</span>
                    </div>
                    <button className="bg-white/5 border border-white/10 text-white/80 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-g-bright hover:text-dark hover:border-g-bright transition-all active:scale-95 shadow-lg">
                      Réserver →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default EventsSection;
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
      className="py-12 bg-gradient-to-b from-[#0a1f14] via-[#0d2d1a] to-[#081910] overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-6 md:px-20 mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-g-bright/10 border border-g-bright/20 text-g-bright px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          ✦ À l'affiche
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-white">
          Évènements <span className="text-transparent bg-clip-text bg-gradient-to-r from-g-bright to-g-light">Couverts</span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-white/50 font-light">Des expériences uniques sélectionnées pour vous</p>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a1f14] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a1f14] to-transparent z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex overflow-hidden mask-fade-x"
          >
            <div className="flex gap-4 md:gap-6 py-10 px-4 animate-infinite-scroll pause-on-hover pause-on-touch">
              {displayEvents.map((event, i) => (
                <div
                  key={`${event.id}-${i}`}
                  className={`flex-shrink-0 w-[280px] sm:w-80 group cursor-pointer ${event.featured ? 'sm:w-96' : ''}`}
                  onClick={() => startEventLoading(event)}
                >
                  <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 group-hover:border-g-bright/30 transition-all group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-g-bright/20">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-g-bright text-dark text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {event.category}
                    </div>
                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-g-bright to-g-mid text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        ★ Vedette
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 text-g-bright text-xs font-bold mb-2">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white leading-tight group-hover:text-g-bright transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-4 px-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-serif font-bold text-lg">{event.price.toLocaleString()} FCFA</span>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">/ billet</span>
                    </div>
                    <button className="bg-g-bright/10 border border-g-bright/30 text-g-bright px-4 py-2 rounded-full text-xs font-bold hover:bg-g-bright hover:text-dark transition-all">
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
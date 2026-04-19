import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface HeroSectionProps {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  HERO_SLIDES: string[];
  handleCommanderClick: () => void;
  setIsAuthOpen: (isOpen: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentSlide,
  setCurrentSlide,
  HERO_SLIDES,
  handleCommanderClick,
  setIsAuthOpen
}) => {
  return (
    <motion.section
      id="accueil"
      className="relative h-[100dvh] min-h-[600px] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Top Center Logo */}
      <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-30">
        <Logo className="scale-100 sm:scale-125" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_SLIDES[currentSlide]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-g-deep/80 via-g-mid/50 to-dark/80" />
        </motion.div>
      </AnimatePresence>

      {/* Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute -bottom-[5%] -left-[5%] w-[50vw] sm:w-[35vw] h-[130vh] bg-gradient-to-t from-white/40 via-white/10 to-transparent blur-[20px] sm:blur-[25px] animate-swing-l origin-bottom opacity-50 sm:opacity-100" style={{ clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)' }} />
        <div className="absolute -bottom-[5%] -right-[5%] w-[50vw] sm:w-[35vw] h-[130vh] bg-gradient-to-t from-white/40 via-white/10 to-transparent blur-[20px] sm:blur-[25px] animate-swing-r origin-bottom opacity-50 sm:opacity-100" style={{ clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)' }} />
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-g-bright/20 border border-g-bright/30 text-g-light px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 w-fit"
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-g-bright animate-live-pulse" />
          Événements en direct
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white text-shadow-glow"
        >
          Vivez des moments<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-g-bright to-g-light">inoubliables</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a href="#events" className="group bg-gradient-to-r from-g-bright to-g-mid text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-g-bright/30">
            Voir plus…
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="group bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-500/30"
          >
            Connectez Vous
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 sm:mt-12 md:mt-16 flex gap-6 sm:gap-8 md:gap-12"
        >
          {[
            { label: 'Événements', value: '250+' },
            { label: 'Billets vendus', value: '50k+' },
            { label: 'Villes', value: '12' }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white text-g-bright">{stat.value}</span>
              <span className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-widest text-white/80">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Badge & Call to Action */}
      <div className="absolute right-4 sm:right-10 md:right-20 bottom-8 sm:top-1/2 sm:-translate-y-1/2 flex flex-col items-end sm:items-center gap-4 sm:gap-6 z-20 w-fit ml-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCommanderClick}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-black text-xs sm:text-base md:text-lg animate-alert-pulse relative group shadow-2xl shadow-orange-500/50 flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            🎟️ Commander
          </span>
          <div className="absolute -inset-2 rounded-full border-2 border-orange-400/70 animate-ring-out" />
        </motion.button>

        <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl flex-row sm:flex-col items-center gap-3 sm:gap-4 w-auto sm:w-44 md:w-52 text-left sm:text-center animate-float-badge">
          <Logo eventTitle="FIDAK 2026" className="w-8 h-8 sm:w-16 sm:h-16 md:w-24 md:h-24" />
          <div className="flex-1 sm:flex-none">
            <h3 className="font-serif font-bold text-white text-[10px] sm:text-sm md:text-base">FIDAK 2026</h3>
            <p className="text-[8px] sm:text-[10px] md:text-[13px] text-white/50 mt-0.5 sm:mt-1">L'événement majeur</p>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Aller au slide ${i + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-6 sm:w-8 bg-g-bright' : 'w-1.5 sm:w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HeroSection;
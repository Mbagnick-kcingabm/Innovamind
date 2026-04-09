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
      className="relative h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Top Center Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <Logo className="scale-125" />
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
        <div className="absolute -bottom-[5%] -left-[5%] w-[35vw] h-[130vh] bg-gradient-to-t from-white/40 via-white/10 to-transparent blur-[25px] animate-swing-l origin-bottom" style={{ clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)' }} />
        <div className="absolute -bottom-[5%] -right-[5%] w-[35vw] h-[130vh] bg-gradient-to-t from-white/40 via-white/10 to-transparent blur-[25px] animate-swing-r origin-bottom" style={{ clipPath: 'polygon(46% 100%, 54% 100%, 100% 0%, 0% 0%)' }} />
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-g-bright/20 border border-g-bright/30 text-g-light px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-fit"
        >
          <div className="w-2 h-2 rounded-full bg-g-bright animate-live-pulse" />
          Événements en direct
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white text-shadow-glow"
        >
          Vivez des moments<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-g-bright to-g-light">inoubliables</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#events" className="group bg-gradient-to-r from-g-bright to-g-mid text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-g-bright/30">
            Voir plus…
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="group bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-500/30"
          >
            Connectez Vous
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 md:mt-16 flex gap-8 md:gap-12"
        >
          {[
            { label: 'Événements', value: '250+' },
            { label: 'Billets vendus', value: '50k+' },
            { label: 'Villes', value: '12' }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-white text-g-bright">{stat.value}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/100">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Badge */}
      <div className="absolute right-6 md:right-20 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
        <button
          onClick={handleCommanderClick}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-lg animate-alert-pulse relative group"
        >
          <span className="relative z-10 flex items-center gap-2">
            🎟️ Commander
          </span>
          <div className="absolute -inset-2 rounded-full border-2 border-orange-400/70 animate-ring-out" />
          <div className="absolute -inset-4 rounded-full border border-orange-400/40 animate-ring-out-delay" />
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl flex flex-col items-center gap-4 w-40 md:w-52 text-center animate-float-badge hidden sm:flex">
          <Logo eventTitle="FIDAK 2026" className="w-5 h-5 md:w-34 md:h-34" />
          <div>
            <h3 className="font-serif font-bold text-white text-sm md:text-base">FIDAK 2026</h3>
            <p className="text-[10px] md:text-[15px] text-white/100 mt-1">L'événement majeur de l'année</p>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Aller au slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-g-bright' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HeroSection;
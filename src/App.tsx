/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Ticket, 
  Download, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// --- Types ---
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

// --- Data ---
const EVENTS: EventData[] = [
  {
    id: 'fidak',
    title: 'FIDAK 2026',
    category: 'Foire / Exposition',
    date: '15 - 31 Décembre 2026',
    location: 'CICES, Dakar',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: '1',
    title: 'Grand Festival Jazz de Dakar',
    category: 'Concert',
    date: '15 Avril 2026',
    location: 'CICES, Dakar',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop',
    featured: true
  },
  {
    id: '2',
    title: 'Les Misérables – Spectacle',
    category: 'Théâtre',
    date: '22 Avril 2026',
    location: 'Théâtre Daniel Sorano',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=700&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Marathon International de Dakar',
    category: 'Sport',
    date: '30 Avril 2026',
    location: 'Corniche Ouest, Dakar',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Sommet Africa Business Forum',
    category: 'Forum',
    date: '5 Mai 2026',
    location: 'King Fahd Palace, Dakar',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&auto=format&fit=crop'
  },
  {
    id: '5',
    title: "Festival Saveurs d'Afrique",
    category: 'Gastronomie',
    date: '12 Mai 2026',
    location: 'Almadies, Dakar',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'FESPACO – Films Africains',
    category: 'Cinéma',
    date: '20 Mai 2026',
    location: 'Institut Français, Dakar',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=700&auto=format&fit=crop'
  }
];

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f74eccf877e2?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop'
];

// --- Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src="/Logo.png" alt="CICES Logo" className="h-10 w-auto object-contain" />
    <span className="font-serif text-2xl font-black tracking-tighter text-white">
      CICES<span className="text-g-bright">EVENTS</span>
    </span>
  </div>
);

export default function App() {
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [eventLoadProgress, setEventLoadProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventData>(EVENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ticket, setTicket] = useState<{ 
    id: string; 
    qrData: string;
    name: string;
    email: string;
    event: string;
    type: string;
    date: string;
    places: number;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    event: EVENTS[0].title,
    places: 1,
    type: 'Standard',
    honeypot: '',
    terms: false
  });

  // Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Function to handle "Commander" button click specifically for FIDAK
  const handleCommanderClick = () => {
    const fidak = EVENTS.find(e => e.title === 'FIDAK 2026') || EVENTS[0];
    startEventLoading(fidak);
  };

  // Loading animation for event selection
  const startEventLoading = (event: EventData) => {
    setIsEventLoading(true);
    setEventLoadProgress(0);
    
    document.getElementById('commande')?.scrollIntoView({ behavior: 'smooth' });

    const interval = setInterval(() => {
      setEventLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsEventLoading(false);
            setSelectedEvent(event);
            setForm(prevForm => ({ ...prevForm, event: event.title }));
          }, 500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 80);
  };

  // Loading animation for booking
  const startLoading = () => {
    setIsLoading(true);
    setLoadProgress(0);
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
  };

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // 1. Honeypot check (Bot protection)
    if (form.honeypot) {
      console.warn("Bot detected via honeypot");
      return;
    }

    // 2. Sanitization & Validation
    const sanitizedName = form.name.trim();
    const sanitizedEmail = form.email.trim().toLowerCase();
    const errors: { [key: string]: string } = {};

    if (sanitizedName.length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      errors.email = "Veuillez entrer une adresse e-mail valide";
    }

    if (!form.terms) {
      errors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    startLoading();
    const tid = `CICES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    const qrData = JSON.stringify({
      id: tid,
      name: sanitizedName,
      email: sanitizedEmail,
      event: form.event,
      places: form.places,
      type: form.type
    });
    
    setTimeout(() => {
      setTicket({ 
        id: tid, 
        qrData,
        name: sanitizedName,
        email: sanitizedEmail,
        event: form.event,
        type: form.type,
        date: selectedEvent.date,
        places: form.places
      });

      // Clear the form
      setForm({
        name: '',
        email: '',
        event: form.event, // Keep the current event selected
        places: 1,
        type: 'Standard',
        honeypot: '',
        terms: false
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#4ade80', '#ffffff']
      });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-dark selection:bg-g-bright selection:text-dark">
      {/* Hero Section */}
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
            className="font-serif text-4xl sm:text-5xl md:text-8xl font-black leading-tight text-white text-shadow-glow"
          >
            Vivez des moments<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-g-bright to-g-light">inoubliables</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-white/80 max-w-xl leading-relaxed font-light"
          >
            Découvrez, réservez et vivez les meilleurs événements culturels, sportifs et artistiques au Sénégal et en Afrique.
          </motion.p>

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
                <span className="font-serif text-2xl md:text-3xl font-bold text-g-bright">{stat.value}</span>
                <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/50">{stat.label}</span>
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
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-g-bright to-g-mid rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-g-bright/40">
              🎉
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm md:text-base">FIDAK 2026</h3>
              <p className="text-[8px] md:text-[10px] text-white/50 mt-1">L'événement majeur de l'année</p>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-g-bright' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Infinite Scroll Events Section */}
      <motion.section 
        id="events" 
        className="py-8 bg-gradient-to-b from-[#0a1f14] via-[#0d2d1a] to-[#081910] overflow-hidden"
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
        </div>

        {/* Infinite Scroll Track */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a1f14] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a1f14] to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden mask-fade-x">
            <div className="flex gap-4 md:gap-6 py-10 px-4 animate-infinite-scroll pause-on-hover pause-on-touch">
              {[...EVENTS, ...EVENTS, ...EVENTS].map((event, i) => (
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
          </div>
        </div>
      </motion.section>

      {/* Booking Section */}
      <motion.section 
        id="commande" 
        className="relative min-h-[50vh] bg-[#030d07] flex flex-col lg:flex-row"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Loading Overlay for Event Selection */}
        <AnimatePresence>
          {isEventLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-dark flex flex-col items-center justify-center"
            >
              <Logo className="mb-8 scale-150" />
              <div className="text-white/70 uppercase tracking-[0.3em] text-sm mb-6 animate-pulse">Chargement de l'événement…</div>
              <div className="flex gap-2 mb-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-g-bright animate-dot-b" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-g-mid via-g-bright to-g-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${eventLoadProgress}%` }}
                />
              </div>
              <div className="mt-4 font-mono text-white/40 text-xs">{Math.floor(eventLoadProgress)}%</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay for Ticket Generation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-dark flex flex-col items-center justify-center"
            >
              <Logo className="mb-8 scale-150" />
              <div className="text-white/70 uppercase tracking-[0.3em] text-sm mb-6 animate-pulse">Génération du ticket…</div>
              <div className="flex gap-2 mb-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-g-bright animate-dot-b" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-g-mid via-g-bright to-g-light"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                />
              </div>
              <div className="mt-4 font-mono text-white/40 text-xs">{Math.floor(loadProgress)}%</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Side: Event Image */}
        <div className="relative flex-1 min-h-[400px] lg:min-h-screen overflow-hidden">
          <motion.img
            key={selectedEvent.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={selectedEvent.image}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-dark/30 to-[#030d07]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-[#030d07] via-transparent to-transparent">
            <div className="bg-g-bright text-dark text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit mb-4">
              {selectedEvent.category}
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              {selectedEvent.title}
            </h2>
            <div className="flex flex-wrap gap-4 md:gap-6 text-white/60 text-xs md:text-sm">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-g-bright" /> {selectedEvent.date}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-g-bright" /> {selectedEvent.location}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-gradient-to-br from-[#031f10] via-[#052e18] to-[#031a0d] p-4 md:p-6 flex items-center justify-center">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-[1.5rem] shadow-2xl relative overflow-hidden min-h-[350px]">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-g-bright/10 rounded-full blur-3xl" />
            
            <AnimatePresence mode="wait">
              {!isEventLoading && (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Logo className="scale-75 origin-left" />
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <h3 className="font-serif text-lg font-black text-white">Réserver votre Ticket</h3>
                    </div>
                  </div>

                  <p className="text-white/50 text-[10px] font-light leading-relaxed mb-6">
                    Remplissez le formulaire — votre billet personnalisé avec QR code est généré instantanément.
                  </p>

                  <form onSubmit={handleBooking} className="space-y-3">
                    {/* Honeypot field - hidden from users */}
                    <div className="hidden" aria-hidden="true">
                      <input 
                        type="text" 
                        name="honeypot" 
                        tabIndex={-1} 
                        autoComplete="off" 
                        value={form.honeypot}
                        onChange={e => setForm({ ...form, honeypot: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Nom complet</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Amadou Diallo"
                        className={`w-full bg-black/20 border ${formErrors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-3 py-2 text-xs text-white focus:border-g-bright focus:bg-g-bright/5 transition-all outline-none`}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                      {formErrors.name && <p className="text-[8px] text-red-400 ml-1">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Adresse e-mail</label>
                      <input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        className={`w-full bg-black/20 border ${formErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-3 py-2 text-xs text-white focus:border-g-bright focus:bg-g-bright/5 transition-all outline-none`}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                      {formErrors.email && <p className="text-[8px] text-red-400 ml-1">{formErrors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Événement</label>
                        <select
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-g-bright focus:bg-g-bright/5 transition-all outline-none appearance-none"
                          value={form.event}
                          onChange={e => {
                            setForm({ ...form, event: e.target.value });
                            const ev = EVENTS.find(ev => ev.title === e.target.value);
                            if (ev) setSelectedEvent(ev);
                          }}
                        >
                          {EVENTS.map(ev => <option key={ev.id} value={ev.title} className="bg-dark">{ev.title}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Places</label>
                        <input
                          type="number"
                          readOnly
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 cursor-not-allowed outline-none"
                          value="1"
                        />
                        <p className="text-[7px] text-g-bright/50 mt-1 italic">Limite : 1 ticket par personne</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1">Type de billet</label>
                      <select
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-g-bright focus:bg-g-bright/5 transition-all outline-none appearance-none"
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="Standard" className="bg-dark">Standard</option>
                        <option value="VIP" className="bg-dark">VIP</option>
                        <option value="VVIP – Lounge Privé" className="bg-dark">VVIP – Lounge Privé</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="mt-0.5 w-3 h-3 rounded border-white/10 bg-black/20 text-g-bright focus:ring-g-bright/20"
                          checked={form.terms}
                          onChange={e => setForm({ ...form, terms: e.target.checked })}
                        />
                        <span className="text-[8px] text-white/40 group-hover:text-white/60 transition-colors">
                          J'accepte les conditions d'utilisation et la politique de confidentialité de Cices Events.
                        </span>
                      </label>
                      {formErrors.terms && <p className="text-[8px] text-red-400 ml-1 mt-1">{formErrors.terms}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-g-bright to-g-mid text-white font-black uppercase tracking-widest py-3 rounded-lg mt-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-g-bright/20 flex items-center justify-center gap-2 text-xs"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Ticket className="w-4 h-4" />
                      )}
                      {isLoading ? 'Génération...' : 'Générer mon Ticket'}
                    </button>
                  </form>

                  <AnimatePresence>
                    {ticket && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ 
                          height: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.5, delay: 0.5 }
                        }}
                        className="mt-8 p-6 bg-white/10 border border-white/20 rounded-2xl text-center overflow-hidden relative"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-g-bright to-transparent opacity-50" />
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div className="text-g-bright font-serif font-bold mb-1">✅ Ticket Confirmé !</div>
                          <div className="font-mono text-[10px] text-white/40 mb-6"># {ticket.id}</div>
                          
                          <div className="bg-white p-3 rounded-xl w-fit mx-auto mb-6 shadow-2xl">
                            <QRCodeSVG value={ticket.qrData} size={140} />
                          </div>

                          <div className="text-xs text-white/70 leading-relaxed mb-6">
                            <strong className="text-white">{ticket.name}</strong> — {ticket.email}<br />
                            🎭 <strong>{ticket.event}</strong><br />
                            📅 {ticket.date} · {ticket.places} place(s) · <strong>{ticket.type}</strong>
                          </div>

                          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Télécharger le QR Code
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#0d1a11] pt-24 pb-12 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-g-bright/40 to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Logo />
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              La plateforme de référence pour découvrir et réserver les meilleurs événements au Sénégal et en Afrique de l'Ouest.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { Icon: Facebook, name: 'Facebook' },
                { Icon: Instagram, name: 'Instagram' },
                { Icon: Youtube, name: 'Youtube' },
                { Icon: Twitter, name: 'Twitter' }
              ].map(({ Icon, name }, i) => (
                <a key={i} href="#" className="flex items-center gap-3 text-white/50 hover:text-g-bright transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-g-bright group-hover:text-dark group-hover:border-g-bright transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
              Liens Utiles
            </h4>
            <ul className="space-y-4">
              {['À propos de nous', 'Centre d\'aide', 'Blog', 'Lieux', 'Envoyez-nous un e-mail'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-g-bright transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
              Catégories
            </h4>
            <ul className="space-y-4">
              {['Cinéma', 'Concert / Musique', 'Foire / Exposition', 'Parc de loisir'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-g-bright transition-colors flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-g-bright" />
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" className="text-sm text-g-bright font-bold hover:underline">Toutes les catégories →</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
              Contact
            </h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-g-bright/10 border border-g-bright/20 flex items-center justify-center text-g-bright">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/60">+221 33 859 96 33</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-g-bright/10 border border-g-bright/20 flex items-center justify-center text-g-bright">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm text-white/60">contact@cicesticket.com</span>
              </div>
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-g-bright hover:border-g-bright/40 transition-all">
                <Globe className="w-4 h-4" />
                Français 🇫🇷
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-white/20">
            © Copyright 2026 – <span className="text-g-bright/50">Cices Events</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['Conditions d\'utilisation', 'Politique de confidentialité', 'Cookies', 'GDPR'].map(item => (
              <a key={item} href="#" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  Globe,
  ArrowUp
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import imgfndb from './asset/imgfndb.jpeg';
import imgfndf from './asset/imgfndf.jpeg';
import imgfndd from './asset/imgfndd.jpeg';
import imgfndl from './asset/imgfndl.jpeg';
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import BookingSection from './components/BookingSection';
import FooterSection from './components/FooterSection';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import OrganizerDashboard from './components/OrganizerDashboard.tsx';
import CreateEventPage from './pages/CreateEventPage';

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

interface OrganizerEvent extends EventData {
  status: 'published' | 'draft' | 'closed' | 'cancelled' | 'active' | 'paused';
  ticketsSold: number;
  maxCapacity: number;
  revenue: number;
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
  imgfndb,
  imgfndf,
  imgfndd,
  imgfndl,
  imgfndb
];

// --- Components ---

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
    phone: string;
    phoneCode: string;
    event: string;
    type: string;
    date: string;
    places: number;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isOrganizerLoggedIn, setIsOrganizerLoggedIn] = useState(false);
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPage, setOrganizerPage] = useState<'dashboard' | 'create-event'>('dashboard');
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEvent[]>(() =>
    EVENTS.slice(0, 3).map((event, index) => ({
      ...event,
      status: ['published', 'draft', 'closed'][index] as OrganizerEvent['status'],
      ticketsSold: Math.floor(Math.random() * 50),
      maxCapacity: 100,
      revenue: Math.floor(Math.random() * 50000)
    }))
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    phoneCode: '+221',
    event: EVENTS[0].title,
    places: 1,
    type: 'Standard',
    honeypot: '',
    terms: false
  });

  // Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev:any) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to Top Handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      setEventLoadProgress((prev:any) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsEventLoading(false);
            setSelectedEvent(event);
            setForm((prevForm: typeof form) => ({ ...prevForm, event: event.title }));
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
      setLoadProgress((prev: number) => {
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
    const sanitizedPhone = form.phone.trim();
    const errors: { [key: string]: string } = {};

    if (sanitizedName.length < 3) {
      errors.name = "Le nom doit contenir au moins 3 caractères";
    }

    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(sanitizedPhone.replace(/\s/g, ''))) {
      errors.phone = "Veuillez entrer un numéro de téléphone valide (7-15 chiffres)";
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
      phone: form.phoneCode + ' ' + sanitizedPhone,
      event: form.event,
      places: form.places,
      type: form.type
    });
    
    setTimeout(() => {
      setTicket({ 
        id: tid,
        qrData,
        name: sanitizedName,
        phone: sanitizedPhone,
        phoneCode: form.phoneCode,
        event: form.event,
        type: form.type,
        date: selectedEvent.date,
        places: form.places
      });

      // Clear the form
      setForm({
        name: '',
        phone: '',
        phoneCode: '+221',
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

  const handleLoginSuccess = (role: 'admin' | 'organizer' | 'user', email: string) => {
    if (role === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminEmail(email);
    } else if (role === 'organizer') {
      setIsOrganizerLoggedIn(true);
      setOrganizerEmail(email);
    }
    setIsAuthOpen(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail('');
    setIsAuthOpen(false);
  };

  const handleOrganizerLogout = () => {
    setIsOrganizerLoggedIn(false);
    setOrganizerEmail('');
    setIsAuthOpen(false);
    setOrganizerPage('dashboard');
  };

  if (isOrganizerLoggedIn) {
    return (
      <div className="min-h-screen bg-dark selection:bg-g-bright selection:text-dark">
        {organizerPage === 'dashboard' ? (
          <OrganizerDashboard
            organizerEmail={organizerEmail}
            organizerEvents={organizerEvents}
            onLogout={handleOrganizerLogout}
            onCreateEvent={() => setOrganizerPage('create-event')}
          />
        ) : (
          <CreateEventPage
            onSave={(event) => {
              setOrganizerEvents((current) => [
                {
                  id: event.id,
                  title: event.title,
                  category: event.category,
                  date: event.startDateTime ? new Date(event.startDateTime).toLocaleDateString('fr-FR') : '',
                  location: event.venue,
                  price: event.tickets[0]?.price ?? 0,
                  image: event.imageUrl || '',
                  status: event.status,
                  ticketsSold: event.ticketsSold,
                  maxCapacity: event.maxCapacity,
                  revenue: event.revenue
                },
                ...current
              ]);
              setOrganizerPage('dashboard');
            }}
            onCancel={() => setOrganizerPage('dashboard')}
            onLogout={handleOrganizerLogout}
          />
        )}
      </div>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-dark selection:bg-g-bright selection:text-dark">
        <AdminDashboard
          EVENTS={EVENTS}
          latestTicket={ticket}
          adminEmail={adminEmail}
          onLogout={handleAdminLogout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark selection:bg-g-bright selection:text-dark">
      <HeroSection
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        HERO_SLIDES={HERO_SLIDES}
        handleCommanderClick={handleCommanderClick}
        setIsAuthOpen={setIsAuthOpen}
      />

      <EventsSection EVENTS={EVENTS} startEventLoading={startEventLoading} />

      <BookingSection
        isEventLoading={isEventLoading}
        eventLoadProgress={eventLoadProgress}
        isLoading={isLoading}
        loadProgress={loadProgress}
        selectedEvent={selectedEvent}
        ticket={ticket}
        form={form}
        formErrors={formErrors}
        handleBooking={handleBooking}
        setForm={setForm}
        setSelectedEvent={setSelectedEvent}
        EVENTS={EVENTS}
      />

      {/* Footer */}

      <FooterSection />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 8 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-yellow-500 text-dark p-3 rounded-full shadow-[0_20px_50px_-18px_rgba(251,146,60,0.8)] hover:shadow-[0_24px_80px_-30px_rgba(251,146,60,0.9)] transition-shadow duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

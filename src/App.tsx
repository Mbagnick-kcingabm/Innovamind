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
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import BookingSection from './components/BookingSection';
import FooterSection from './components/FooterSection';

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
      setCurrentSlide((prev:any) => (prev + 1) % HERO_SLIDES.length);
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
      <HeroSection
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        HERO_SLIDES={HERO_SLIDES}
        handleCommanderClick={handleCommanderClick}
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
    </div>
  );
}

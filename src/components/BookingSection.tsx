import React, { FormEvent, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, Download, Share2, ArrowLeft, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import waveIcon from '../asset/iconcash/wave.jpg';
import orangeIcon from '../asset/iconcash/om.png';
import cardIcon from '../asset/iconcash/carte.jpg';
import cinetpayIcon from '../asset/iconcash/cinetpay.svg';
import Logo from './Logo';

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

interface TicketData {
  id: string;
  qrData: string;
  name: string;
  phone: string;
  phoneCode: string;
  event: string;
  type: string;
  date: string;
  places: number;
}

interface FormData {
  name: string;
  phone: string;
  phoneCode: string;
  event: string;
  places: number;
  type: string;
  honeypot: string;
  terms: boolean;
}

interface BookingSectionProps {
  isEventLoading: boolean;
  eventLoadProgress: number;
  isLoading: boolean;
  loadProgress: number;
  selectedEvent: EventData;
  ticket: TicketData | null;
  form: FormData;
  formErrors: { [key: string]: string };
  handleBooking: (e: FormEvent) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventData>>;
  EVENTS: EventData[];
}

const BookingSection: React.FC<BookingSectionProps> = ({
  isEventLoading,
  eventLoadProgress,
  isLoading,
  loadProgress,
  selectedEvent,
  ticket,
  form,
  formErrors,
  handleBooking,
  setForm,
  setSelectedEvent,
  EVENTS
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'cinetpay' | 'card' | null>(null);
  const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = () => {
    const trimmedName = form.name.trim();
    const cleanedPhone = form.phone.replace(/\D/g, '');

    if (!trimmedName) {
      setValidationError('Le nom est requis.');
      return false;
    }

    if (!cleanedPhone) {
      setValidationError('Le numéro de téléphone est requis.');
      return false;
    }

    if (!/^[0-9]{9,15}$/.test(cleanedPhone)) {
      setValidationError('Le numéro de téléphone est invalide.');
      return false;
    }

    if (!form.type) {
      setValidationError('Veuillez sélectionner un type de billet.');
      return false;
    }

    if (!form.terms) {
      setValidationError("Vous devez accepter les conditions d'utilisation.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const isPhoneValid = /^[0-9]{7,15}$/.test(form.phone.replace(/\D/g, ''));
  const canProceedToPayment = !!form.name.trim() && isPhoneValid && form.terms && !!form.type;

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    setStep('payment');
  };

  const downloadQRCode = () => {
    if (!qrRef.current || !ticket) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2; // Higher resolution
      canvas.height = img.height * 2;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ticket-${ticket.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareOnWhatsApp = () => {
    if (!ticket) return;

    const ticketInfo = `🎫 *${ticket.event}*\n\n` +
      `👤 *Nom:* ${ticket.name}\n` +
      `📱 *Téléphone:* ${ticket.phoneCode}${ticket.phone}\n` +
      `🎭 *Type:* ${ticket.type}\n` +
      `📅 *Date:* ${ticket.date}\n` +
      `🎟️ *Places:* ${ticket.places}\n` +
      `🔖 *ID Ticket:* ${ticket.id}\n\n` +
      `Cices Events - Réservation Confirmée ✅`;

    const phoneNumber = ticket.phoneCode.replace('+', '');
    const encodedText = encodeURIComponent(ticketInfo);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  const downloadPDF = () => {
    if (!ticket) return;

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="max-width: 800px; margin: 20px auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #0a2e1a 0%, #051a0d 100%); color: white; padding: 40px; border-radius: 20px; text-align: center;">
        <h1 style="color: #7dffbc; margin-bottom: 30px; font-size: 28px;">🎫 Ticket Confirmé</h1>
        <div style="background: rgba(0,0,0,0.3); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h2 style="margin: 10px 0; color: #7dffbc;">${ticket.event}</h2>
          <p style="margin: 5px 0; font-size: 14px;">${ticket.type}</p>
          <p style="margin: 20px 0; font-weight: bold; color: #7dffbc; word-break: break-all;">#${ticket.id}</p>
        </div>
        <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <p style="margin: 8px 0;"><strong>👤 Nom:</strong> ${ticket.name}</p>
          <p style="margin: 8px 0;"><strong>📱 Téléphone:</strong> ${ticket.phoneCode}${ticket.phone}</p>
          <p style="margin: 8px 0;"><strong>🎭 Type de Billet:</strong> ${ticket.type}</p>
          <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${ticket.date}</p>
          <p style="margin: 8px 0;"><strong>🎟️ Places:</strong> ${ticket.places}</p>
        </div>
        <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 10px; display: inline-block;">
          <p style="color: #333; margin: 0; font-size: 12px; margin-bottom: 10px;">QR Code</p>
          <div id="qr-pdf"></div>
        </div>
        <p style="margin-top: 30px; font-size: 11px; color: rgba(255,255,255,0.6);">Cices Events - Réservation Confirmée ✅</p>
      </div>
    `;

    // Create canvas from SVG for QR code
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const qrDataUrl = canvas.toDataURL('image/png');
            const qrDiv = element.querySelector('#qr-pdf');
            if (qrDiv) {
              qrDiv.innerHTML = `<img src="${qrDataUrl}" style="max-width: 150px; height: auto;" />`;
            }
            generatePDFDownload(element);
          }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  const generatePDFDownload = (element: HTMLElement) => {
    // Create a simple HTML-to-PDF approach using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;
    
    // Create a temporary container for html2canvas simulation
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write(element.outerHTML);
      printWindow.document.close();
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
    }
  };

  return (
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
            <Logo eventTitle={selectedEvent.title} className="mb-8 scale-150 animate-pulse" />
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
            <Logo eventTitle={selectedEvent.title} className="mb-8 scale-150 animate-pulse" />
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
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
            {selectedEvent.title === 'FIDAK 2026' 
              ? 'Le plus grand salon international de Dakar, rassemblant exposants et visiteurs du monde entier pour une expérience unique.'
              : selectedEvent.category === 'Concert' 
                ? 'Vivez une soirée musicale inoubliable avec des artistes de renommée internationale.'
                : selectedEvent.category === 'Théâtre'
                  ? 'Plongez dans l\'univers fascinant du théâtre avec une production exceptionnelle.'
                  : selectedEvent.category === 'Sport'
                    ? 'Participez à un événement sportif majeur et ressentez l\'adrénaline de la compétition.'
                    : selectedEvent.category === 'Forum'
                      ? 'Échangez avec des experts et leaders dans ce forum de haut niveau.'
                      : selectedEvent.category === 'Gastronomie'
                        ? 'Découvrez les saveurs authentiques de l\'Afrique dans une ambiance conviviale.'
                        : 'Découvrez cet événement unique et enrichissant pour tous les passionnés.'
            }
          </p>
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
            {step === 'form' && !isEventLoading && (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Logo eventTitle={selectedEvent.title} className="scale-75 origin-left animate-bounce" />
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <h3 className="font-serif text-lg font-black text-white">Réserver votre Ticket</h3>
                  </div>
                </div>

                <p className="text-white/50 text-[13px] font-light leading-relaxed mb-6">
                  Remplissez le formulaire — votre billet sera généré instantanément.
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
                    <label className="text-[12px] font-bold uppercase tracking-widest text-white ml-1">Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Donald TRUMP"
                      className={`w-full bg-slate-800/60 border ${formErrors.name ? 'border-red-500/70' : 'border-white/20'} rounded-lg px-3 py-2 text-xs text-white font-medium placeholder-white/40 focus:border-g-bright focus:bg-slate-800/80 transition-all outline-none hover:bg-slate-800/70 hover:border-white/40 shadow-sm`}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    {formErrors.name && <p className="text-[8px] text-red-400 ml-1">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white ml-1">Numéro de téléphone</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          className="bg-slate-800/80 border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-medium focus:border-g-bright focus:bg-slate-800 transition-all outline-none w-24 appearance-none pr-8 cursor-pointer hover:bg-slate-700/80 hover:border-white/40 shadow-lg"
                          value={form.phoneCode}
                          onChange={e => setForm({ ...form, phoneCode: e.target.value })}
                          title="Sélectionner le code pays"
                        >
                          <option value="+221">🇸🇳 +221</option>
                          <option value="+33">🇫🇷 +33</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+49">🇩🇪 +49</option>
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="77 123 45 67"
                        className={`flex-1 bg-slate-800/60 border ${formErrors.phone ? 'border-red-500/70' : 'border-white/20'} rounded-lg px-3 py-2 text-xs text-white font-medium placeholder-white/40 focus:border-g-bright focus:bg-slate-800/80 transition-all outline-none hover:bg-slate-800/70 hover:border-white/40 shadow-sm`}
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        title="Numéro de téléphone"
                      />
                    </div>
                    {formErrors.phone && <p className="text-[8px] text-red-400 ml-1">{formErrors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white ml-1">Événement</label>
                    <div className="w-full bg-slate-800/80 border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-medium shadow-lg">
                      {selectedEvent.title}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/70 ml-1">Type de billet</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'Standard' })}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border ${
                          form.type === 'Standard'
                            ? 'bg-g-bright/20 border-g-bright text-g-bright shadow-lg shadow-g-bright/30'
                            : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-white/40 hover:bg-slate-800/80'
                        }`}
                        title="Accès général"
                      >
                        🎫 Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'VIP' })}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border ${
                          form.type === 'VIP'
                            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400 shadow-lg shadow-yellow-400/30'
                            : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-white/40 hover:bg-slate-800/80'
                        }`}
                        title="Zone privilégiée"
                      >
                        ⭐ VIP
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: 'VVIP – Lounge Privé' })}
                        className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border ${
                          form.type === 'VVIP – Lounge Privé'
                            ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-lg shadow-purple-400/30'
                            : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-white/40 hover:bg-slate-800/80'
                        }`}
                        title="Lounge Privé"
                      >
                        👑 VVIP
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-3 h-3 rounded border-white/20 bg-slate-800 text-g-bright focus:ring-g-bright/20"
                        checked={form.terms}
                        onChange={e => setForm({ ...form, terms: e.target.checked })}
                      />
                      <span className="text-[11px] text-white group-hover:text-white transition-colors">
                        J'accepte les conditions d'utilisation et la politique de confidentialité de Cices Events.
                      </span>
                    </label>
                    {formErrors.terms && <p className="text-[8px] text-red-400 ml-1 mt-1">{formErrors.terms}</p>}
                    {validationError && <p className="text-[10px] text-red-400 ml-1 mt-2">{validationError}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={isLoading || !canProceedToPayment}
                    className="w-full bg-gradient-to-r from-g-bright to-g-mid text-white font-black uppercase tracking-widest py-3 rounded-lg mt-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-g-bright/20 flex items-center justify-center gap-2 text-xs"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Ticket className="w-4 h-4" />
                    )}
                    {isLoading ? 'Génération...' : 'Continuer vers Paiement'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && !isEventLoading && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                    title="Retour au formulaire"
                    aria-label="Retour au formulaire de réservation"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <div>
                    <h3 className="font-serif text-lg font-black text-white">Sélectionner un Moyen de Paiement</h3>
                  </div>
                </div>

                <p className="text-white/50 text-[13px] font-light leading-relaxed mb-6">
                  Choisissez votre méthode de paiement préférée pour finaliser votre réservation.
                </p>

                <div className="space-y-2 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('wave');
                      setTimeout(() => {
                        handleBooking({ preventDefault: () => {} } as FormEvent);
                        setStep('confirmation');
                      }, 1000);
                    }}
                    className={`w-full py-4 px-4 rounded-lg border-2 transition-all font-bold flex items-center justify-between ${
                      paymentMethod === 'wave'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                        : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-blue-400/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <img src={waveIcon} alt="Wave" className="w-7 h-7 rounded-full object-cover" />
                      <span>
                        <div className="text-sm font-black">Wave</div>
                        <div className="text-[11px] opacity-70">Paiement Mobile</div>
                      </span>
                    </span>
                    {paymentMethod === 'wave' && <Check className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('orange');
                      setTimeout(() => {
                        handleBooking({ preventDefault: () => {} } as FormEvent);
                        setStep('confirmation');
                      }, 1000);
                    }}
                    className={`w-full py-4 px-4 rounded-lg border-2 transition-all font-bold flex items-center justify-between ${
                      paymentMethod === 'orange'
                        ? 'bg-orange-500/20 border-orange-400 text-orange-400'
                        : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-orange-400/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <img src={orangeIcon} alt="Orange Money" className="w-7 h-7 rounded-full object-cover" />
                      <span>
                        <div className="text-sm font-black">Orange Money</div>
                        <div className="text-[11px] opacity-70">Portefeuille Digital</div>
                      </span>
                    </span>
                    {paymentMethod === 'orange' && <Check className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cinetpay');
                      setTimeout(() => {
                        handleBooking({ preventDefault: () => {} } as FormEvent);
                        setStep('confirmation');
                      }, 1000);
                    }}
                    className={`w-full py-4 px-4 rounded-lg border-2 transition-all font-bold flex items-center justify-between ${
                      paymentMethod === 'cinetpay'
                        ? 'bg-green-500/20 border-green-400 text-green-400'
                        : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-green-400/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <img src={cinetpayIcon} alt="CinetPay" className="w-7 h-7 rounded-full object-cover" />
                      <span>
                        <div className="text-sm font-black">CinetPay</div>
                        <div className="text-[11px] opacity-70">Plateforme de Paiement</div>
                      </span>
                    </span>
                    {paymentMethod === 'cinetpay' && <Check className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setTimeout(() => {
                        handleBooking({ preventDefault: () => {} } as FormEvent);
                        setStep('confirmation');
                      }, 1000);
                    }}
                    className={`w-full py-4 px-4 rounded-lg border-2 transition-all font-bold flex items-center justify-between ${
                      paymentMethod === 'card'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400'
                        : 'bg-slate-800/60 border-white/20 text-white/70 hover:border-purple-400/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <img src={cardIcon} alt="Carte Bancaire" className="w-7 h-7 rounded-full object-cover" />
                      <span>
                        <div className="text-sm font-black">Carte Bancaire</div>
                        <div className="text-[11px] opacity-70">Visa / Mastercard</div>
                      </span>
                    </span>
                    {paymentMethod === 'card' && <Check className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-white/40 text-[11px] text-center">
                  💡 Tous vos paiements sont sécurisés avec les meilleur standards cryptographiques.
                </p>
              </motion.div>
            )}

            {step === 'confirmation' && ticket && !isEventLoading && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-g-bright/10">
                    <Check className="w-5 h-5 text-g-bright" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-black text-white">Réservation Confirmée</h3>
                  </div>
                </div>

                <p className="text-white/50 text-[13px] font-light leading-relaxed mb-6">
                  Votre ticket a été généré avec succès. Partagez-le ou téléchargez-le maintenant.
                </p>

                <div ref={qrRef} className="bg-white p-4 rounded-xl w-fit mx-auto mb-6 shadow-2xl">
                  <QRCodeSVG value={ticket.qrData} size={160} />
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 text-xs text-white/70 space-y-2">
                  <div className="flex justify-between">
                    <span>👤 Nom:</span>
                    <strong className="text-white">{ticket.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>📱 Téléphone:</span>
                    <strong className="text-white">{ticket.phoneCode}{ticket.phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🎭 Événement:</span>
                    <strong className="text-white">{ticket.event}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🎟️ Type:</span>
                    <strong className="text-white">{ticket.type}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>📅 Date:</span>
                    <strong className="text-white">{ticket.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>🔖 ID:</span>
                    <strong className="text-white font-mono text-[10px]">{ticket.id}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button 
                    onClick={downloadPDF}
                    className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </button>
                  <button 
                    onClick={shareOnWhatsApp}
                    className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>

                <button 
                  onClick={() => {
                    setStep('form');
                    setPaymentMethod(null);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  ← Réserver un autre ticket
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default BookingSection;
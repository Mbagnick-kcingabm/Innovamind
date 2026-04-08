import React, { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
  email: string;
  event: string;
  type: string;
  date: string;
  places: number;
}

interface FormData {
  name: string;
  email: string;
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
  );
};

export default BookingSection;
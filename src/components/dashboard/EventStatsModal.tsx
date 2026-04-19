import { motion } from 'motion/react';
import { X, Ticket, DollarSign, Users, Activity, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { EventItem } from '../../types/dashboard';

interface EventStatsModalProps {
  event: EventItem;
  onClose: () => void;
  formatCurrency: (val: number) => string;
}

const EventStatsModal = ({ event, onClose, formatCurrency }: EventStatsModalProps) => {
  const fillRate = Math.round((event.ticketsSold / event.maxCapacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image Background */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-40" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 opacity-40"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <div className="absolute top-6 right-6">
            <button
              onClick={onClose}
              className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white/70 hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-6 left-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#F2B759]/20 border border-[#F2B759]/30 text-[#F2B759] text-[10px] font-bold uppercase tracking-widest">
                {event.category}
              </span>
              <span className="text-white/50 text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {event.venue}, {event.city}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">{event.title}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Ticket, label: 'Tickets Vendus', value: event.ticketsSold, sub: `Sur ${event.maxCapacity}`, color: '#F2B759' },
              { icon: DollarSign, label: 'Recette Totale', value: formatCurrency(event.revenue), sub: 'Ventes brutes', color: '#F2B759' },
              { icon: Activity, label: 'Taux de Remplissage', value: `${fillRate}%`, sub: 'Occupation', color: '#F2B759' },
              { icon: Users, label: 'Visiteurs Uniques', value: Math.round(event.ticketsSold * 1.2), sub: 'Estimés', color: '#F2B759' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-3xl group hover:border-[#F2B759]/20 transition-colors">
                <div className="flex items-center gap-2 text-[#F2B759]/70 mb-3">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-white/30 mt-1 uppercase font-bold">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Detailed Stats Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ticket Breakdown */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <TrendingUp className="w-5 h-5 text-[#F2B759]" /> Répartition des Billets
              </h3>
              <div className="space-y-4">
                {event.tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-white">{ticket.name}</span>
                      <span className="text-[#F2B759] font-black">{formatCurrency(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-2">
                      <span>Vendus: {event.ticketsSold}</span>
                      <span>Capacité: {ticket.quantity}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F2B759] rounded-full" style={{ width: `${Math.min(100, (event.ticketsSold / ticket.quantity) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Timeline / Info */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <Calendar className="w-5 h-5 text-[#F2B759]" /> Informations Clés
              </h3>
              <div className="grid gap-4">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3">Description de l'événement</p>
                  <p className="text-sm text-white/60 leading-relaxed italic">
                    "{event.description}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Langue</p>
                    <p className="text-sm font-bold text-white">{event.language}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Statut</p>
                    <p className="text-sm font-bold text-[#F2B759] uppercase tracking-wider">{event.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
          >
            Fermer
          </button>
          <button className="px-8 py-3 rounded-2xl bg-[#F2B759] text-slate-950 font-black text-sm hover:shadow-lg hover:shadow-[#F2B759]/20 transition-all">
            Exporter le Rapport PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventStatsModal;

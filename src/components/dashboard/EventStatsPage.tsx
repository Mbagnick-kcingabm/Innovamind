import { motion } from 'motion/react';
import { Ticket, DollarSign, Users, Activity, TrendingUp, Calendar, MapPin, ArrowLeft, Download } from 'lucide-react';
import { EventItem } from '../../types/dashboard';

interface EventStatsPageProps {
  event: EventItem;
  onBack: () => void;
  formatCurrency: (val: number) => string;
}

const EventStatsPage = ({ event, onBack, formatCurrency }: EventStatsPageProps) => {
  const fillRate = Math.round((event.ticketsSold / event.maxCapacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Retour aux événements</span>
        </button>
        
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F2B759] text-slate-950 font-black text-sm hover:shadow-lg hover:shadow-[#F2B759]/20 transition-all active:scale-95">
          <Download className="w-4 h-4" /> Exporter le Rapport
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-20" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F2B759]/10 to-transparent"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-[#F2B759]/20 border border-[#F2B759]/30 text-[#F2B759] text-[10px] font-black uppercase tracking-widest">
                  {event.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#F2B759]" /> {event.venue}, {event.city}
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{event.title}</h1>
              <p className="text-white/40 text-sm sm:text-base max-w-2xl leading-relaxed">
                Statistiques détaillées et analyse de performance en temps réel pour votre événement.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-6 rounded-3xl w-full md:w-auto justify-center md:justify-start">
               <div className="text-center px-4 border-r border-white/10">
                  <p className="text-[10px] text-white/30 uppercase font-black mb-1">Statut</p>
                  <p className="text-sm font-bold text-[#F2B759] uppercase tracking-widest">{event.status}</p>
               </div>
               <div className="text-center px-4">
                  <p className="text-[10px] text-white/30 uppercase font-black mb-1">Langue</p>
                  <p className="text-sm font-bold text-white">{event.language}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { icon: Ticket, label: 'Tickets Vendus', value: event.ticketsSold, sub: `Sur ${event.maxCapacity}`, color: 'from-[#F2B759] to-[#FFD580]' },
          { icon: DollarSign, label: 'Recette Totale', value: formatCurrency(event.revenue), sub: 'Ventes brutes', color: 'from-[#0A4A3C] to-[#0F6A52]' },
          { icon: Activity, label: 'Remplissage', value: `${fillRate}%`, sub: 'Occupation', color: 'from-sky-500 to-indigo-500' },
          { icon: Users, label: 'Visiteurs', value: Math.round(event.ticketsSold * 1.2), sub: 'Uniques estimés', color: 'from-purple-500 to-pink-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/20 transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform group-hover:scale-150`}></div>
            <div className="flex items-center gap-3 text-white/40 mb-4">
              <stat.icon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/30 mt-2 font-bold uppercase tracking-wider">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Content Sections */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Ticket Sales Analysis */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-xl font-black text-white">
              <TrendingUp className="w-6 h-6 text-[#F2B759]" /> Performance des Ventes
            </h3>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Analyse par catégorie</span>
          </div>

          <div className="space-y-6">
            {event.tickets.map((ticket) => (
              <div key={ticket.id} className="bg-black/20 p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-white text-lg">{ticket.name}</h4>
                    <p className="text-xs text-white/40 mt-1">{ticket.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#F2B759]">{formatCurrency(ticket.price)}</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Prix unitaire</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                    <span>Progression des ventes</span>
                    <span>{event.ticketsSold} / {ticket.quantity}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (event.ticketsSold / ticket.quantity) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#F2B759] to-[#FFD580] rounded-full shadow-[0_0_15px_rgba(242,183,89,0.3)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <p className="text-[9px] text-white/30 uppercase font-black mb-1">Revenu catégorie</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(event.ticketsSold * ticket.price)}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                    <p className="text-[9px] text-white/30 uppercase font-black mb-1">Reste en stock</p>
                    <p className="text-sm font-bold text-white">{ticket.quantity - event.ticketsSold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details & Info */}
        <div className="space-y-8">
           <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-black text-white">
                <Calendar className="w-6 h-6 text-[#F2B759]" /> Informations de l'événement
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Description officielle</p>
                  <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 italic">
                    "{event.description}"
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="p-3 rounded-xl bg-[#F2B759]/10 text-[#F2B759]">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase font-black">Date & Heure</p>
                      <p className="text-sm font-bold text-white">15 Juin 2026 • 20:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="p-3 rounded-xl bg-[#F2B759]/10 text-[#F2B759]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-white/30 uppercase font-black">Localisation</p>
                      <p className="text-sm font-bold text-white">{event.venue}, {event.city}</p>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-gradient-to-br from-[#F2B759]/20 to-transparent border border-[#F2B759]/20 p-8 rounded-[2.5rem] space-y-6">
              <h4 className="text-lg font-black text-white uppercase tracking-widest">Actions Rapides</h4>
              <div className="grid gap-3">
                 <button className="w-full py-4 rounded-2xl bg-[#F2B759] text-slate-950 font-black text-sm hover:scale-[1.02] transition-transform">
                    Modifier l'événement
                 </button>
                 <button className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all">
                    Envoyer une annonce aux participants
                 </button>
                 <button className="w-full py-4 rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-sm hover:bg-rose-500/20 transition-all">
                    Annuler l'événement
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventStatsPage;

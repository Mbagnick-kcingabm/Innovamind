import { MapPin, Edit2, Copy, X, Plus, Activity } from 'lucide-react';
import { EventItem } from '../../types/dashboard';

interface EventsTabProps {
  events: EventItem[];
  onCreateEvent: () => void;
  onEditEvent: (event: EventItem) => void;
  onDuplicateEvent: (event: EventItem) => void;
  onCancelEvent: (event: EventItem) => void;
  onViewStats: (event: EventItem) => void;
  formatCurrency: (val: number) => string;
  statusLabels: Record<string, string>;
  statusStyles: Record<string, string>;
}

const EventsTab = ({
  events,
  onCreateEvent,
  onEditEvent,
  onDuplicateEvent,
  onCancelEvent,
  onViewStats,
  formatCurrency,
  statusLabels,
  statusStyles,
}: EventsTabProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <button
          onClick={onCreateEvent}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-slate-950 font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          style={{ backgroundColor: '#F2B759' }}
        >
          <Plus className="w-5 h-5" /> Créer un nouvel événement
        </button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3" style={{ color: '#F2B759' }}>
            <MapPin className="w-5 h-5" />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">Liste des événements</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Gestion des statuts</h2>
            </div>
          </div>
          <div className="text-sm text-white/60">{events.length} événements suivis</div>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 sm:p-6 shadow-xl shadow-black/20 hover:border-[#F2B759]/30 transition-all duration-300 group/card cursor-pointer"
              onClick={() => onViewStats(event)}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base sm:text-lg font-bold text-white truncate group-hover/card:text-[#F2B759] transition-colors">{event.title}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                      event.status === 'published'
                        ? 'bg-[#0A4A3C]/20 border-[#F2B759] text-[#F2B759]'
                        : statusStyles[event.status] + ' border-current'
                    }`}
                    >
                      {statusLabels[event.status]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#F2B759]/60" />
                    <span>{event.category} • {event.venue} • {event.city}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-[11px] sm:text-xs">
                    <div className="bg-white/5 px-3 py-1.5 rounded-full text-white/70">
                      <span className="font-bold text-[#F2B759]">{event.ticketsSold}</span> / {event.maxCapacity} vendus
                    </div>
                    <div className="bg-white/5 px-3 py-1.5 rounded-full text-white/70">
                      Revenu : <span className="font-bold text-[#F2B759]">{formatCurrency(event.revenue)}</span>
                    </div>
                  </div>
                  {event.status === 'cancelled' && (
                    <p className="mt-4 text-sm text-rose-400 font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Événement annulé, remboursement en cours.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEditEvent(event)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    <Edit2 className="w-4 h-4" /> Modifier
                  </button>
                  <button
                    onClick={() => onDuplicateEvent(event)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl border border-[#F2B759]/20 bg-[#F2B759]/10 px-5 py-3 text-sm font-bold text-[#F2B759] transition-all hover:bg-[#F2B759]/20 active:scale-95"
                  >
                    <Copy className="w-4 h-4" /> Dupliquer
                  </button>
                  <button
                    onClick={() => onCancelEvent(event)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
                  >
                    <X className="w-4 h-4" /> Annuler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsTab;

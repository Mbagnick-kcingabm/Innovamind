import { motion } from 'motion/react';
import { CalendarDays, Ticket, DollarSign, Activity } from 'lucide-react';
import { EventItem, Transaction } from '../../types/dashboard';

interface OverviewTabProps {
  events: EventItem[];
  totalTickets: number;
  totalRevenue: number;
  fillRate: number;
  averageOrder: number;
  maxRevenue: number;
  trendData: { day: string; value: number }[];
  formatCurrency: (val: number) => string;
  statusLabels: Record<string, string>;
  statusProgressStyles: Record<string, string>;
  eventsByStatus: Record<string, number>;
}

const OverviewTab = ({
  events,
  totalTickets,
  totalRevenue,
  fillRate,
  averageOrder,
  maxRevenue,
  trendData,
  formatCurrency,
  statusLabels,
  statusProgressStyles,
  eventsByStatus,
}: OverviewTabProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { icon: CalendarDays, label: 'Événements', value: events.length, sub: 'Total actifs', color: '#F2B759' },
          { icon: Ticket, label: 'Ventes', value: totalTickets, sub: 'Billets émis', color: '#F2B759' },
          { icon: DollarSign, label: 'Revenus', value: formatCurrency(totalRevenue), sub: 'Chiffre d’affaires', color: '#F2B759' },
          { icon: Activity, label: 'Remplissage', value: `${fillRate}%`, sub: 'Taux moyen', color: '#F2B759' }
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/15 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2B759]/5 rounded-full blur-2xl -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
            <div className="flex items-center gap-2 mb-3 text-[#F2B759] relative z-10">
              <kpi.icon className="w-4 h-4" />
              <span className="uppercase text-[10px] tracking-[0.28em] font-bold text-white/40">{kpi.label}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black relative z-10 text-white tracking-tight">{kpi.value}</p>
            <p className="text-[10px] text-white/40 mt-2 relative z-10 font-medium uppercase tracking-wider">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 mb-8">
        <div className="space-y-4">
          {/* Status Tracking */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/50">Statuts des événements</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Suivi des publications</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-white/70">{eventsByStatus.published} publiés</div>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {(['draft', 'published', 'closed', 'cancelled'] as const).map((status) => (
                <div key={status} className="rounded-3xl border border-white/10 bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{statusLabels[status]}</span>
                    <span>{eventsByStatus[status]}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${statusProgressStyles[status]}`}
                      style={{ width: `${events.length ? Math.round((eventsByStatus[status] / events.length) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/50">Graphique de ventes</p>
                <h2 className="mt-1 text-lg font-semibold text-white">7 jours glissants</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-white/70">
                Moyenne : {formatCurrency(averageOrder)}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
              <div className="flex flex-col gap-4">
                <div className="flex-1 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">
                    <span>Revenu total</span>
                    <span className="text-[#F2B759]">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round((totalRevenue / (maxRevenue * 7)) * 100))}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#F2B759] to-[#FFD580]"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] text-white/60">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="uppercase tracking-widest text-[9px] text-white/30 mb-1">Top Jour</p>
                      <p className="font-bold text-white">Dimanche</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="uppercase tracking-widest text-[9px] text-white/30 mb-1">Panier Moyen</p>
                      <p className="font-bold text-white">{formatCurrency(averageOrder)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Croissance</p>
                      <p className="text-xl font-black text-g-bright">+18.4%</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-g-bright/10 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-g-bright" />
                   </div>
                </div>
              </div>

              <div className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-6 sm:p-8">
                <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-[220px] sm:h-[280px]">
                  {trendData.map((point) => {
                    const height = `${Math.max((point.value / maxRevenue) * 100, 15)}%`;
                    return (
                      <div key={point.day} className="flex flex-col items-center gap-4 h-full group/bar">
                        <div className="h-full w-full max-w-[24px] overflow-hidden rounded-full bg-white/5 relative flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height }}
                            transition={{ duration: 0.7, delay: trendData.indexOf(point) * 0.1 }}
                            className="w-full rounded-full bg-gradient-to-t from-[#F2B759] to-[#FFD580] group-hover/bar:brightness-110 transition-all shadow-[0_0_20px_rgba(242,183,89,0.2)]"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase group-hover/bar:text-white transition-colors">{point.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

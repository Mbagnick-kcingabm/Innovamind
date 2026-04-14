import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  Copy,
  DollarSign,
  Edit2,
  MapPin,
  Plus,
  Ticket,
  Users,
  X,
  Zap
} from 'lucide-react';
import Logo from './Logo';

interface Transaction {
  id: string;
  customerName: string;
  event: string;
  amount: number;
  date: string;
  status: 'Confirmé' | 'En attente' | 'Annulé';
}

interface AlertItem {
  id: string;
  title: string;
  description: string;
  variant: 'success' | 'warning' | 'info';
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  saleStart: string;
  saleEnd: string;
}

interface EventItem {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  ticketsSold: number;
  maxCapacity: number;
  revenue: number;
  description: string;
  language: string;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  tickets: TicketType[];
}

interface OrganizerDashboardProps {
  organizerEmail: string;
  organizerEvents: {
    id: string;
    title: string;
    category: string;
    date: string;
    location: string;
    price: number;
    status: 'published' | 'draft' | 'closed' | 'cancelled' | 'active' | 'paused';
    ticketsSold: number;
    maxCapacity: number;
    revenue: number;
  }[];
  onLogout: () => void;
  onCreateEvent: () => void;
}

const revenueData = [112000, 138000, 150000, 125000, 142000, 158000, 164000];
const ticketData = [28, 31, 34, 28, 40, 45, 49];
const weekLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const languages = ['Français', 'Anglais', 'Portugais', 'Espagnol'];

const transactionsSeed: Transaction[] = [
  {
    id: 'TX-001',
    customerName: 'Aminata Diop',
    event: 'FIDAK 2026',
    amount: 76000,
    date: '12 Avr 2026',
    status: 'Confirmé'
  },
  {
    id: 'TX-002',
    customerName: 'Mamadou Fall',
    event: 'Festival Jazz',
    amount: 45000,
    date: '12 Avr 2026',
    status: 'En attente'
  },
  {
    id: 'TX-003',
    customerName: 'Seynabou Ba',
    event: 'Marathon Dakar',
    amount: 20000,
    date: '11 Avr 2026',
    status: 'Confirmé'
  },
  {
    id: 'TX-004',
    customerName: 'Ousmane Ndao',
    event: 'Sommet Business',
    amount: 125000,
    date: '10 Avr 2026',
    status: 'Annulé'
  },
  {
    id: 'TX-005',
    customerName: 'Fatou Thiam',
    event: "Festival Saveurs d'Afrique",
    amount: 90000,
    date: '09 Avr 2026',
    status: 'Confirmé'
  }
];

const alertsSeed: AlertItem[] = [
  {
    id: 'A1',
    title: 'Nouveau paiement en attente',
    description: 'Une commande Orange Money attend une confirmation.',
    variant: 'warning'
  },
  {
    id: 'A2',
    title: 'Objectif hebdomadaire presque atteint',
    description: 'Les ventes sont à 92% de l’objectif semaine.',
    variant: 'success'
  },
  {
    id: 'A3',
    title: 'Nouvelle demande de remboursement',
    description: '1 demande de remboursement sur le billet VIP en attente.',
    variant: 'info'
  }
];

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 });

const statusLabels: Record<EventItem['status'], string> = {
  draft: 'Brouillon',
  published: 'Publié',
  closed: 'Clôturé',
  cancelled: 'Annulé'
};

const statusStyles: Record<EventItem['status'], string> = {
  draft: 'bg-white/10 text-white',
  published: 'text-white',
  closed: 'bg-slate-500/15 text-slate-200',
  cancelled: 'bg-rose-500/15 text-rose-200'
};

const statusProgressStyles: Record<EventItem['status'], string> = {
  draft: 'from-slate-500 to-slate-600',
  published: 'from-[#0A4A3C] to-[#0F6A52]',
  closed: 'from-indigo-500 to-violet-500',
  cancelled: 'from-rose-500 to-pink-500'
};

const OrganizerDashboard = ({ organizerEmail, organizerEvents, onLogout, onCreateEvent }: OrganizerDashboardProps) => {
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedTickets, setAnimatedTickets] = useState(0);
  const [animatedClients, setAnimatedClients] = useState(0);
  const [animatedFillRate, setAnimatedFillRate] = useState(0);

  const [events, setEvents] = useState<EventItem[]>(
    organizerEvents.map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status === 'active' ? 'published' : event.status === 'paused' ? 'draft' : event.status,
      ticketsSold: event.ticketsSold,
      maxCapacity: event.maxCapacity,
      revenue: event.revenue,
      description: `Présentation de ${event.title} et ses points forts.`,
      language: 'Français',
      imageUrl: '',
      startDateTime: '',
      endDateTime: '',
      venue: event.location,
      address: '',
      city: 'Dakar',
      latitude: '14.6928',
      longitude: '-17.4467',
      tickets: [
        {
          id: `ticket-${event.id}-1`,
          name: 'Standard',
          price: event.price,
          quantity: 100,
          description: 'Accès général à l’événement.',
          saleStart: '',
          saleEnd: ''
        }
      ]
    }))
  );

  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactionsSeed);
  const [alertsState, setAlertsState] = useState<AlertItem[]>(alertsSeed);
  const [cancellationModal, setCancellationModal] = useState<{ eventId: string; refund: number } | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);

  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalTickets = events.reduce((sum, event) => sum + event.ticketsSold, 0);
  const totalClients = Math.max(1280, events.length * 45);
  const fillRate = events.length > 0
    ? Math.round((events.reduce((sum, event) => sum + event.ticketsSold, 0) / events.reduce((sum, event) => sum + event.maxCapacity, 0)) * 100)
    : 92;
  const averageOrder = totalTickets > 0 ? Math.round(totalRevenue / totalTickets) : 0;
  const maxRevenue = Math.max(...revenueData);

  const eventsByStatus = useMemo(
    () => ({
      draft: events.filter((event) => event.status === 'draft').length,
      published: events.filter((event) => event.status === 'published').length,
      closed: events.filter((event) => event.status === 'closed').length,
      cancelled: events.filter((event) => event.status === 'cancelled').length
    }),
    [events]
  );

  useEffect(() => {
    const animate = (target: number, setter: (value: number) => void) => {
      let frame = 0;
      const steps = 40;
      const delta = target / steps;
      setter(0);
      const timer = window.setInterval(() => {
        frame += 1;
        setter(Math.min(Math.round(delta * frame), target));
        if (frame >= steps) window.clearInterval(timer);
      }, 20);
      return () => window.clearInterval(timer);
    };

    const cleanRevenue = animate(totalRevenue, setAnimatedRevenue);
    const cleanTickets = animate(totalTickets, setAnimatedTickets);
    const cleanClients = animate(totalClients, setAnimatedClients);
    const cleanFill = animate(fillRate, setAnimatedFillRate);

    return () => {
      cleanRevenue();
      cleanTickets();
      cleanClients();
      cleanFill();
    };
  }, [totalRevenue, totalTickets, totalClients, fillRate]);

  const kpiCards = [
    {
      title: 'Revenu 7 derniers jours',
      value: formatCurrency(animatedRevenue),
      subtitle: '+18% vs semaine dernière',
      icon: DollarSign,
      accent: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Billets vendus',
      value: `${animatedTickets}`,
      subtitle: 'Croissance de 27%',
      icon: Ticket,
      accent: 'from-violet-500 to-fuchsia-500'
    },
    {
      title: 'Clients actifs',
      value: `${animatedClients}+`,
      subtitle: 'Engagement stable',
      icon: Users,
      accent: 'from-sky-500 to-cyan-500'
    },
    {
      title: 'Taux de remplissage',
      value: `${animatedFillRate}%`,
      subtitle: 'Optimisation confirmée',
      icon: Activity,
      accent: 'from-orange-500 to-amber-500'
    }
  ];

  const publishedEvents = events.length;
  const trendData = useMemo(
    () => revenueData.map((value, index) => ({ day: weekLabels[index], value })),
    []
  );

  const handleCancel = (event: EventItem) => {
    setDeleteConfirmModal(event.id);
  };

  const handleDeleteEvent = () => {
    if (!deleteConfirmModal) return;
    setEvents((current) => current.filter((event) => event.id !== deleteConfirmModal));
    
    const deletedEvent = events.find((event) => event.id === deleteConfirmModal);
    if (deletedEvent) {
      setAlertsState((current) => [
        {
          id: `A-${Date.now()}`,
          title: 'Événement supprimé',
          description: `"${deletedEvent.title}" a été supprimé de la liste.`,
          variant: 'warning'
        },
        ...current
      ]);
    }
    setDeleteConfirmModal(null);
  };

  const handleDuplicate = (event: EventItem) => {
    const duplicatedEvent: EventItem = {
      ...event,
      id: Date.now().toString(),
      status: 'draft',
      title: `${event.title} (Copie)`,
      ticketsSold: 0,
      revenue: 0
    };
    setEvents((current) => [...current, duplicatedEvent]);
    setAlertsState((current) => [
      {
        id: `A-${Date.now()}`,
        title: 'Événement dupliqué',
        description: `"${event.title}" a été dupliqué avec succès.`,
        variant: 'success'
      },
      ...current
    ]);
  };

  const confirmCancellation = () => {
    if (!cancellationModal) return;
    const cancelledEvent = events.find((event) => event.id === cancellationModal.eventId);
    if (!cancelledEvent) return;

    setEvents((current) =>
      current.map((event) =>
        event.id === cancellationModal.eventId ? { ...event, status: 'cancelled' } : event
      )
    );

    setTransactionsState((current) =>
      current.map((tx) =>
        tx.event === cancelledEvent.title ? { ...tx, status: 'Annulé' } : tx
      )
    );

    setAlertsState((current) => [
      {
        id: `A-${Date.now()}`,
        title: 'Événement annulé',
        description: `Remboursement de ${formatCurrency(cancellationModal.refund)} initié pour ${cancelledEvent.title}.`,
        variant: 'warning'
      },
      ...current
    ]);

    setCancellationModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="px-6 py-6 md:px-12 lg:px-20">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="text-left space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em]" style={{color: '#F2B759'}}>Tableau organisateur</p>
            <p className="text-2xl font-semibold text-white">Bonjour, {organizerEmail}</p>
          </div>
          
          <div className="flex-1 flex justify-center">
            <Logo className="h-12 w-auto" />
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              onClick={onCreateEvent}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg transition-all duration-300 hover:shadow-lg"
              style={{backgroundColor: '#F2B759'}}>
              <Plus className="w-4 h-4" />
              + Créer un événement
            </motion.button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-300"
              style={{borderColor: '#F2B759', color: '#F2B759', backgroundColor: 'transparent'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2B759' + '20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-4 mb-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3" style={{color: '#F2B759'}}>
            <CalendarDays className="w-4 h-4" />
            <span className="uppercase text-[10px] tracking-[0.28em] font-semibold text-white/60">Événements</span>
          </div>
          <p className="text-3xl font-semibold">{events.length}</p>
          <p className="text-xs text-white/50 mt-2">Total de la liste</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3" style={{color: '#F2B759'}}>
            <Ticket className="w-4 h-4" />
            <span className="uppercase text-[10px] tracking-[0.28em] font-semibold text-white/60">Tickets vendus</span>
          </div>
          <p className="text-3xl font-semibold">{totalTickets}</p>
          <p className="text-xs text-white/50 mt-2">Performance totale</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3" style={{color: '#F2B759'}}>
            <DollarSign className="w-4 h-4" />
            <span className="uppercase text-[10px] tracking-[0.28em] font-semibold text-white/60">Revenus</span>
          </div>
          <p className="text-3xl font-semibold">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-white/50 mt-2">Générés</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-3" style={{color: '#F2B759'}}>
            <Activity className="w-5 h-5" />
            <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Taux de remplissage</span>
          </div>
          <p className="text-3xl font-black">{fillRate}%</p>
          <p className="text-sm text-white/50 mt-2">Capacité</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.75fr] mb-8">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/50">Statuts des événements</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Suivi des publications</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-white/70">{eventsByStatus.published} publiés</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-white/50">Graphique de ventes</p>
                <h2 className="mt-1 text-xl font-semibold text-white">7 jours glissants</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-white/70">
                Moyenne : {formatCurrency(averageOrder)}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-3">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Revenu total</span>
                  <span>{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0A4A3C] to-[#0F6A52]"
                    style={{ width: `${Math.min(100, Math.round((totalRevenue / (maxRevenue * 7)) * 100))}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/60">
                  <div className="rounded-3xl bg-white/5 p-2">
                    <p className="uppercase tracking-[0.18em]">Meilleure journée</p>
                    <p className="mt-1 font-semibold text-white">Dim.</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-2">
                    <p className="uppercase tracking-[0.18em]">Tickets</p>
                    <p className="mt-1 font-semibold text-white">{totalTickets}</p>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-3">
                <div className="grid grid-cols-7 gap-1 items-end h-[170px]">
                  {trendData.map((point) => {
                    const height = Math.max((point.value / maxRevenue) * 140, 18);
                    return (
                      <div key={point.day} className="flex flex-col items-center gap-1">
                        <div className="h-full w-full overflow-hidden rounded-full bg-slate-950/40">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="w-full rounded-full bg-gradient-to-t from-[#F2B759] to-[#FFD580]"
                          />
                        </div>
                        <span className="text-[10px] text-white/60">{point.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
                  <span>Comparé à la semaine</span>
                  <span>+18%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3" style={{color: '#F2B759'}}>
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
                <div key={event.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-sm shadow-black/20">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-white truncate">{event.title}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.status === 'published'
                            ? 'text-white'
                            : statusStyles[event.status]
                        }`}
                        style={event.status === 'published' ? { backgroundColor: '#0A4A3C', borderColor: '#F2B759', border: '1px solid #F2B759' } : {}}
                        >
                          {statusLabels[event.status]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-white/60">{event.category} • {event.venue} • {event.city}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
                        <span>Vendus : {event.ticketsSold}</span>
                        <span>Capacité : {event.maxCapacity}</span>
                        <span>Revenu : {formatCurrency(event.revenue)}</span>
                      </div>
                      {event.status === 'cancelled' && (
                        <p className="mt-3 text-sm text-rose-300">Cet événement a été annulé, remboursement en cours.</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const eventToEdit = events.find(e => e.id === event.id);
                          if (eventToEdit) {
                            localStorage.setItem('editingEvent', JSON.stringify(eventToEdit));
                            onCreateEvent();
                          }
                        }}
                        aria-label="Modifier l'événement"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <Edit2 className="w-2 h-2" /> Modifier
                      </button>
                      <button
                        onClick={() => handleDuplicate(event)}
                        aria-label="Dupliquer l'événement"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
                      >
                        <Copy className="w-2 h-2" /> Dupliquer
                      </button>
                      <button
                        onClick={() => handleCancel(event)}
                        aria-label="Annuler l'événement"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                      >
                        <X className="w-2 h-2" /> Annuler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/15">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Alertes</p>
                <h2 className="mt-1 text-sm font-semibold text-white">Priorités</h2>
              </div>
              <Bell className="h-4 w-4 text-sky-400" />
            </div>
            <div className="space-y-2">
              {alertsState.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-2 text-[12px] ${
                    alert.variant === 'success'
                      ? 'border-[#F2B759]/20 bg-[#0A4A3C]/30 text-[#F2B759]'
                      : alert.variant === 'warning'
                      ? 'border-amber-400/20 bg-amber-500/10 text-amber-200'
                      : 'border-sky-400/20 bg-sky-500/10 text-sky-200'
                  }`}
                >
                  <p className="font-semibold text-white">{alert.title}</p>
                  <p className="mt-1 text-[11px] leading-4 text-white/70">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/15">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Transactions</p>
                <h2 className="mt-1 text-sm font-semibold text-white">Activité</h2>
              </div>
            </div>
            <div className="space-y-2">
              {transactionsState.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-2 text-[11px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{transaction.customerName}</p>
                      <p className="mt-0.5 text-[10px] text-white/60">{transaction.event}</p>
                    </div>
                    <p className="text-right font-semibold text-white text-[10px]">{formatCurrency(transaction.amount)}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-white/50">
                    <span>{transaction.date}</span>
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                        transaction.status === 'Confirmé'
                          ? 'bg-[#0A4A3C]/30 text-[#F2B759]'
                          : transaction.status === 'En attente'
                          ? 'bg-amber-500/15 text-amber-200'
                          : 'bg-rose-500/15 text-rose-200'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {deleteConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/50">Suppression d'événement</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Confirmation</h3>
              </div>
              <button
                onClick={() => setDeleteConfirmModal(null)}
                aria-label="Fermer"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <p className="text-sm text-white/70">
                Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible et l'événement sera retiré de la liste.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  aria-label="Annuler la suppression"
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteEvent}
                  aria-label="Confirmer la suppression"
                  className="rounded-3xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {cancellationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/50">Annulation d’événement</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Gestion des remboursements</h3>
              </div>
              <button
                onClick={() => setCancellationModal(null)}
                aria-label="Fermer"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <p className="text-sm text-white/70">
                Vous êtes sur le point d’annuler un événement. Entrez le montant de remboursement à appliquer et confirmez la clôture.
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <label className="block text-sm font-semibold text-white/80 mb-2">Montant du remboursement</label>
                <input
                  type="number"
                  value={cancellationModal.refund}
                  onChange={(e) => setCancellationModal({ ...cancellationModal, refund: Number(e.target.value) })}
                  title="Montant du remboursement"
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setCancellationModal(null)}
                  aria-label="Annuler l'annulation"
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmCancellation}
                  aria-label="Confirmer l’annulation"
                  className="rounded-3xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Confirmer l’annulation
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
   </div>
  );
};

export default OrganizerDashboard;

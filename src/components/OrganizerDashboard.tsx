import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  CreditCard,
  X
} from 'lucide-react';

import { EventItem, Transaction, AlertItem, MenuItem } from '../types/dashboard';
import OrganizerSidebar from './dashboard/OrganizerSidebar';
import NotificationsPanel from './dashboard/NotificationsPanel';
import OverviewTab from './dashboard/OverviewTab';
import EventsTab from './dashboard/EventsTab';
import TransactionsTab from './dashboard/TransactionsTab';
import SubscriptionTab from './dashboard/SubscriptionTab';
import EventStatsPage from './dashboard/EventStatsPage';

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

const transactionsSeed: Transaction[] = [
  { id: 'TX-001', customerName: 'Aminata Diop', event: 'FIDAK 2026', amount: 76000, date: '12 Avr 2026', status: 'Confirmé' },
  { id: 'TX-002', customerName: 'Mamadou Fall', event: 'Festival Jazz', amount: 45000, date: '12 Avr 2026', status: 'En attente' },
  { id: 'TX-003', customerName: 'Seynabou Ba', event: 'Marathon Dakar', amount: 20000, date: '11 Avr 2026', status: 'Confirmé' },
  { id: 'TX-004', customerName: 'Ousmane Ndao', event: 'Sommet Business', amount: 125000, date: '10 Avr 2026', status: 'Annulé' },
  { id: 'TX-005', customerName: 'Fatou Thiam', event: "Festival Saveurs d'Afrique", amount: 90000, date: '09 Avr 2026', status: 'Confirmé' }
];

const alertsSeed: AlertItem[] = [
  { id: 'A1', title: 'Nouveau paiement en attente', description: 'Une commande Orange Money attend une confirmation.', variant: 'warning' },
  { id: 'A2', title: 'Objectif hebdomadaire presque atteint', description: 'Les ventes sont à 92% de l’objectif semaine.', variant: 'success' },
  { id: 'A3', title: 'Nouvelle demande de remboursement', description: '1 demande de remboursement sur le billet VIP en attente.', variant: 'info' }
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
      tickets: [{ id: `ticket-${event.id}-1`, name: 'Standard', price: event.price, quantity: 100, description: 'Accès général.', saleStart: '', saleEnd: '' }]
    }))
  );

  const [transactionsState] = useState<Transaction[]>(transactionsSeed);
  const [alertsState] = useState<AlertItem[]>(alertsSeed);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedEventForStats, setSelectedEventForStats] = useState<EventItem | null>(null);
  const [cancellationModal, setCancellationModal] = useState<{ eventId: string; refund: number } | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);

  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalTickets = events.reduce((sum, event) => sum + event.ticketsSold, 0);
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
      const interval = setInterval(() => {
        frame++;
        setter(Math.round((target / steps) * frame));
        if (frame === steps) clearInterval(interval);
      }, 20);
    };
    animate(totalRevenue, setAnimatedRevenue);
    animate(totalTickets, setAnimatedTickets);
    animate(fillRate, setAnimatedFillRate);
  }, [totalRevenue, totalTickets, fillRate]);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'events', label: 'Mes événements', icon: Calendar },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'subscription', label: 'Abonnement', icon: CreditCard },
  ];

  const trendData = useMemo(() => [
    { day: 'Lun', value: 112000 },
    { day: 'Mar', value: 138000 },
    { day: 'Mer', value: 150000 },
    { day: 'Jeu', value: 125000 },
    { day: 'Ven', value: 142000 },
    { day: 'Sam', value: 158000 },
    { day: 'Dim', value: 164000 }
  ], []);

  const handleEditEvent = (event: EventItem) => {
    localStorage.setItem('editingEvent', JSON.stringify(event));
    onCreateEvent();
  };

  const handleDuplicate = (event: EventItem) => {
    const newEvent = { ...event, id: `copy-${Date.now()}`, title: `${event.title} (Copie)`, ticketsSold: 0, revenue: 0 };
    setEvents([newEvent, ...events]);
  };

  const handleCancel = (event: EventItem) => setCancellationModal({ eventId: event.id, refund: 0 });

  const confirmCancellation = () => {
    if (!cancellationModal) return;
    setEvents(events.map(e => e.id === cancellationModal.eventId ? { ...e, status: 'cancelled' } : e));
    setCancellationModal(null);
  };

  const handleDeleteEvent = () => {
    if (!deleteConfirmModal) return;
    setEvents(events.filter(e => e.id !== deleteConfirmModal));
    setDeleteConfirmModal(null);
  };

  return (
    <div className="flex h-[100dvh] bg-slate-950 text-white overflow-hidden">
      <OrganizerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        menuItems={menuItems}
        organizerEmail={organizerEmail}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col h-full overflow-y-auto pt-20 lg:pt-0">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div className="flex-1">
              <motion.h1 
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              >
                {menuItems.find((m) => m.id === activeTab)?.label}
              </motion.h1>
              <p className="mt-2 text-white/50 text-sm md:text-base max-w-2xl">
                {activeTab === 'dashboard' && "Analyse en temps réel de vos performances, ventes et engagement."}
                {activeTab === 'events' && 'Gérez le cycle de vie de vos événements et suivez les stocks de billets.'}
                {activeTab === 'transactions' && 'Suivi complet de vos flux financiers et historique des paiements.'}
                {activeTab === 'subscription' && 'Ajustez votre offre SaaS pour répondre à vos besoins croissants.'}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              {activeTab !== 'event-details' && (
                <NotificationsPanel 
                  alerts={alertsState} 
                  isNotificationsOpen={isNotificationsOpen} 
                  setIsNotificationsOpen={setIsNotificationsOpen} 
                />
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <OverviewTab 
                  events={events} 
                  totalTickets={animatedTickets} 
                  totalRevenue={animatedRevenue} 
                  fillRate={animatedFillRate}
                  averageOrder={averageOrder}
                  maxRevenue={maxRevenue}
                  trendData={trendData}
                  formatCurrency={formatCurrency}
                  statusLabels={statusLabels}
                  statusProgressStyles={statusProgressStyles}
                  eventsByStatus={eventsByStatus}
                />
              )}
              
              {activeTab === 'events' && (
                <EventsTab 
                  events={events}
                  onCreateEvent={onCreateEvent}
                  onEditEvent={handleEditEvent}
                  onDuplicateEvent={handleDuplicate}
                  onCancelEvent={handleCancel}
                  onViewStats={(event) => {
                    setSelectedEventForStats(event);
                    setActiveTab('event-details');
                  }}
                  formatCurrency={formatCurrency}
                  statusLabels={statusLabels}
                  statusStyles={statusStyles}
                />
              )}
              
              {activeTab === 'transactions' && (
                <TransactionsTab 
                  transactions={transactionsState} 
                  events={events}
                  totalRevenue={totalRevenue} 
                  formatCurrency={formatCurrency} 
                />
              )}

              {activeTab === 'subscription' && (
                <SubscriptionTab formatCurrency={formatCurrency} />
              )}

              {activeTab === 'event-details' && selectedEventForStats && (
                <EventStatsPage 
                  event={selectedEventForStats} 
                  onBack={() => {
                    setActiveTab('events');
                    setSelectedEventForStats(null);
                  }} 
                  formatCurrency={formatCurrency} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {cancellationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Annuler l’événement</h3>
                <button onClick={() => setCancellationModal(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-sm text-white/70 mb-6">Souhaitez-vous vraiment annuler cet événement ? Cette action déclenchera la procédure de remboursement.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setCancellationModal(null)} className="px-5 py-2.5 rounded-xl bg-white/5 text-sm font-bold">Conserver</button>
                <button onClick={confirmCancellation} className="px-5 py-2.5 rounded-xl bg-rose-500 text-sm font-bold">Confirmer l'annulation</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizerDashboard;

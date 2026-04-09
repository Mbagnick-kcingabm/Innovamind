import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BarChart3, Ticket, Calendar, Users, Plus, Edit2, Trash2, Pause, Play, AlertCircle, X } from 'lucide-react';

interface EventSummary {
  id?: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  featured?: boolean;
}

interface LatestTicket {
  id: string;
  event: string;
  name: string;
  type: string;
  date: string;
  places: number;
}

interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
}

interface AdminDashboardProps {
  adminEmail: string;
  EVENTS: EventSummary[];
  latestTicket: LatestTicket | null;
  onLogout: () => void;
}

const AdminDashboard = ({ adminEmail, EVENTS, latestTicket, onLogout }: AdminDashboardProps) => {
  const [events, setEvents] = useState<(EventSummary & { status: 'active' | 'paused' })[]>(
    EVENTS.map((e) => ({ ...e, status: 'active' }))
  );

  const [showOrganizerPanel, setShowOrganizerPanel] = useState(false);
  const [organizers, setOrganizers] = useState<Organizer[]>([
    { id: '1', name: 'Mohamed Diallo', email: 'diallo@example.com', phone: '+221 77 123 45 67', company: 'Diallo Events', status: 'active' },
    { id: '2', name: 'Fatou Ndiaye', email: 'fatou@example.com', phone: '+221 78 234 56 78', company: 'Ndiaye Productions', status: 'active' },
  ]);
  const organizerPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showOrganizerPanel) {
      organizerPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showOrganizerPanel]);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newOrganizer, setNewOrganizer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const toggleEventStatus = (eventId: string) => {
    setEvents(
      events.map((e) =>
        (e.id || e.title) === eventId
          ? { ...e, status: e.status === 'active' ? 'paused' : 'active' }
          : e
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => (e.id || e.title) !== eventId));
    setDeleteConfirm(null);
  };

  const addOrganizer = () => {
    if (!newOrganizer.name || !newOrganizer.email || !newOrganizer.phone || !newOrganizer.company) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    setOrganizers([
      ...organizers,
      {
        id: Date.now().toString(),
        ...newOrganizer,
        status: 'active',
      },
    ]);
    setNewOrganizer({ name: '', email: '', phone: '', company: '' });
  };

  const removeOrganizer = (organizerId: string) => {
    setOrganizers(organizers.filter((o) => o.id !== organizerId));
  };

  const categoryCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#03120f] text-white px-6 py-8 md:px-12 lg:px-20">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-g-bright/70">Tableau de bord administrateur</p>
          <h1 className="text-3xl md:text-4xl font-black mt-3">Bienvenue, Administrateur</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">Accédez aux statistiques, évènements et aux derniers tickets générés.</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 md:flex-row">
          <button
            onClick={() => setShowOrganizerPanel(!showOrganizerPanel)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-g-bright/10 px-5 py-3 text-sm font-semibold text-g-bright transition hover:bg-g-bright/20"
            title="Gérer les organisateurs"
          >
            <Users className="w-4 h-4" />
            Organisateurs
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 lg:grid-cols-3 mb-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 text-g-bright mb-4">
            <Calendar className="w-5 h-5" />
            <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Évènements actifs</span>
          </div>
          <p className="text-5xl font-black">{events.filter((e) => e.status === 'active').length}</p>
          <p className="text-sm text-white/50 mt-2">{events.filter((e) => e.status === 'paused').length} en pause</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 text-g-bright mb-4">
            <Ticket className="w-5 h-5" />
            <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Dernier ticket</span>
          </div>
          {latestTicket ? (
            <>
              <p className="text-3xl font-black break-all">{latestTicket.id}</p>
              <p className="text-sm text-white/50 mt-2">{latestTicket.name} • {latestTicket.event}</p>
            </>
          ) : (
            <p className="text-sm text-white/50">Aucun ticket généré.</p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 text-g-bright mb-4">
            <Users className="w-5 h-5" />
            <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Organisateurs</span>
          </div>
          <p className="text-5xl font-black">{organizers.length}</p>
          <p className="text-sm text-white/50 mt-2">{organizers.filter((o) => o.status === 'active').length} actifs</p>
        </div>
      </div>

      {/* Events Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-g-bright" />
            <h2 className="text-xl font-bold">Gestion des Évènements</h2>
          </div>
          <span className="text-sm text-white/50">{events.length} événement(s)</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-2xl border p-4 transition ${
                event.status === 'paused'
                  ? 'border-white/5 bg-white/2 opacity-50'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{event.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-white/60">
                    <span className="inline-block px-2 py-1 rounded bg-g-bright/20 text-g-bright">{event.category}</span>
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                    <span className="font-bold text-white">{event.price.toLocaleString()} FCFA</span>
                  </div>
                  {event.status === 'paused' && (
                    <p className="text-xs text-yellow-500 mt-2">⏸️ Événement suspendu</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleEventStatus(event.id || event.title)}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                    title={event.status === 'active' ? 'Suspendre' : 'Reprendre'}
                  >
                    {event.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => alert('Modification non disponible pour le moment')}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(event.id || event.title)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-white/50 py-8">Aucun événement à afficher</p>
        )}
      </motion.div>

      {/* Categories Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 mb-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-g-bright" />
          <h2 className="text-lg font-bold">Évènements par catégorie</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="rounded-2xl bg-white/5 px-4 py-3 border border-white/10">
              <p className="text-sm text-white/70">{category}</p>
              <p className="text-2xl font-bold text-g-bright mt-2">{count}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Organizers Panel */}
      <AnimatePresence>
        {showOrganizerPanel && (
          <motion.div
            ref={organizerPanelRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 mb-10"
          >
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-3 text-g-bright/70 uppercase tracking-[0.3em] text-xs font-bold">
                <span>Organizers Panel</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-g-bright" />
                  <h2 className="text-xl font-bold">Gestion des Organisateurs</h2>
                </div>
                <button
                  onClick={() => setShowOrganizerPanel(false)}
                  className="p-2 rounded-lg text-white/50 hover:text-white transition"
                  title="Fermer"
                  aria-label="Fermer le panel des organisateurs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Organizers List */}
              <div>
                <h3 className="font-bold text-lg mb-4">Liste des Organisateurs</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {organizers.map((org) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-2xl border p-4 ${
                        org.status === 'active'
                          ? 'border-white/10 bg-white/5'
                          : 'border-white/5 bg-white/2 opacity-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{org.name}</h4>
                          <div className="space-y-1 mt-2 text-xs text-white/60">
                            <p>📧 {org.email}</p>
                            <p>📱 {org.phone}</p>
                            <p>🏢 {org.company}</p>
                          </div>
                          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                            org.status === 'active'
                              ? 'bg-g-bright/20 text-g-bright'
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {org.status === 'active' ? '✓ Actif' : 'Inactif'}
                          </span>
                        </div>
                        <button
                          onClick={() => removeOrganizer(org.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition shrink-0"
                          title="Supprimer l'organisateur"
                          aria-label={`Supprimer ${org.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Add Organizer Form */}
              <div>
                <h3 className="font-bold text-lg mb-4">Ajouter un Organisateur</h3>
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={newOrganizer.name}
                    onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:border-g-bright"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newOrganizer.email}
                    onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:border-g-bright"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={newOrganizer.phone}
                    onChange={(e) => setNewOrganizer({ ...newOrganizer, phone: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:border-g-bright"
                  />
                  <input
                    type="text"
                    placeholder="Société/Entreprise"
                    value={newOrganizer.company}
                    onChange={(e) => setNewOrganizer({ ...newOrganizer, company: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 outline-none focus:border-g-bright"
                  />
                  <button
                    onClick={addOrganizer}
                    className="w-full bg-gradient-to-r from-g-bright to-g-mid text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Ajouter Organisateur
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 max-w-sm shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Confirmation de suppression</h3>
              </div>
              <p className="text-white/70 mb-6">
                Êtes-vous certains de vouloir supprimer cet événement ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-bold text-white hover:bg-white/10 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => deleteConfirm && deleteEvent(deleteConfirm)}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

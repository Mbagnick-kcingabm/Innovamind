import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, BarChart3, Ticket, Calendar, Users, 
  Plus, Edit2, Trash2, Pause, Play, AlertCircle, X, 
  LayoutDashboard, LogOut, Menu 
} from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [organizers, setOrganizers] = useState<Organizer[]>([
    { id: '1', name: 'Mohamed Diallo', email: 'diallo@example.com', phone: '+221 77 123 45 67', company: 'Diallo Events', status: 'active' },
    { id: '2', name: 'Fatou Ndiaye', email: 'fatou@example.com', phone: '+221 78 234 56 78', company: 'Ndiaye Productions', status: 'active' },
  ]);

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

  const menuItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'events', label: 'Évènements', icon: Calendar },
    { id: 'organizers', label: 'Organisateurs', icon: Users },
  ];

  return (
    <div className="flex h-[100dvh] bg-[#03120f] text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white/5 border-r border-white/10 relative z-10 backdrop-blur-md">
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-black tracking-tight text-g-bright">
            Innova<span className="text-white">Admin</span>
          </h2>
          <p className="text-xs font-medium text-white/50 mt-2 bg-black/20 px-3 py-1.5 rounded-full inline-block truncate max-w-full">
            {adminEmail}
          </p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-g-bright/20 to-transparent text-g-bright font-bold border-l-4 border-g-bright' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-g-bright' : 'text-white/50'}`} />
              <span className="text-[15px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay Sidebar */}
      <header className="lg:hidden absolute top-0 left-0 w-full flex items-center justify-between p-5 bg-[#03120f]/90 backdrop-blur-md z-20 border-b border-white/10">
        <h2 className="text-xl font-black text-g-bright">Innova<span className="text-white">Admin</span></h2>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/10 rounded-xl active:scale-95 transition">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-4/5 max-w-sm h-[100dvh] bg-[#051a15] border-r border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <h2 className="text-2xl font-black text-g-bright">Innova<span className="text-white">Admin</span></h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-lg text-white/70">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      activeTab === item.id 
                        ? 'bg-g-bright/20 text-g-bright font-bold' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-white/10">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-500/10 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pt-20 lg:pt-0">
        <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
          
          <div className="mb-10">
            <motion.h1 
              key={activeTab}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black"
            >
              {menuItems.find((m) => m.id === activeTab)?.label}
            </motion.h1>
            <p className="mt-2 text-white/50 text-sm md:text-base">
              {activeTab === 'dashboard' && 'Aperçu global de vos statistiques et évènements.'}
              {activeTab === 'events' && 'Gérez la liste de vos évènements actifs et suspendus.'}
              {activeTab === 'organizers' && 'Ajoutez et gérez vos partenaires organisateurs.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 md:space-y-8">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-g-bright/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <div className="flex items-center gap-3 text-g-bright mb-4 relative z-10">
                        <Calendar className="w-5 h-5" />
                        <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Évènements</span>
                      </div>
                      <p className="text-4xl sm:text-5xl font-black relative z-10">{events.filter((e) => e.status === 'active').length}</p>
                      <p className="text-xs sm:text-sm text-white/50 mt-2 relative z-10">{events.filter((e) => e.status === 'paused').length} en pause</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <div className="flex items-center gap-3 text-blue-400 mb-4 relative z-10">
                        <Ticket className="w-5 h-5" />
                        <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Dernier ticket</span>
                      </div>
                      {latestTicket ? (
                        <div className="relative z-10">
                          <p className="text-2xl sm:text-3xl font-black break-all">{latestTicket.id}</p>
                          <p className="text-xs sm:text-sm text-white/50 mt-2">{latestTicket.name} • {latestTicket.event}</p>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-white/50 relative z-10">Aucun ticket généré.</p>
                      )}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                      <div className="flex items-center gap-3 text-purple-400 mb-4 relative z-10">
                        <Users className="w-5 h-5" />
                        <span className="uppercase text-[11px] tracking-[0.32em] font-bold text-white/60">Organisateurs</span>
                      </div>
                      <p className="text-4xl sm:text-5xl font-black relative z-10">{organizers.length}</p>
                      <p className="text-xs sm:text-sm text-white/50 mt-2 relative z-10">{organizers.filter((o) => o.status === 'active').length} actifs</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                      <BarChart3 className="w-6 h-6 text-g-bright" />
                      <h2 className="text-xl font-bold">Répartition par catégorie</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {Object.entries(categoryCounts).map(([category, count]) => (
                        <div key={category} className="rounded-2xl bg-white/5 px-5 py-4 border border-white/10 hover:bg-white/10 transition-colors">
                          <p className="text-sm font-medium text-white/60 uppercase tracking-wider">{category}</p>
                          <p className="text-3xl font-black text-white mt-2">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === 'events' && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-g-bright" /> Tous les évènements
                    </h2>
                    <span className="text-sm font-medium px-4 py-2 rounded-full bg-white/10 text-white/70">
                      {events.length} au total
                    </span>
                  </div>

                  <div className="space-y-4">
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-5 transition-all duration-300 ${
                          event.status === 'paused'
                            ? 'border-white/5 bg-white/5 opacity-60'
                            : 'border-white/10 bg-gradient-to-r from-white/5 to-transparent hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate flex items-center gap-3">
                              {event.title}
                              {event.status === 'paused' && (
                                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md">En pause</span>
                              )}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-3 text-xs sm:text-sm text-white/60">
                              <span className="px-3 py-1 rounded-full bg-g-bright/20 text-g-bright font-medium">{event.category}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {event.date}</span>
                              <span className="flex items-center gap-1">📍 {event.location}</span>
                              <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg ml-auto">{event.price.toLocaleString()} FCFA</span>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex items-center justify-end gap-2 sm:gap-3 pt-4 lg:pt-0 border-t border-white/5 lg:border-t-0 mt-2 lg:mt-0">
                            <button
                              onClick={() => toggleEventStatus(event.id || event.title)}
                              className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/20 transition hover:scale-105"
                              title={event.status === 'active' ? 'Mettre en pause' : 'Reprendre'}
                            >
                              {event.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-g-bright" />}
                            </button>
                            <button
                              onClick={() => alert('Modification non disponible pour le moment')}
                              className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition hover:scale-105"
                              title="Modifier"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(event.id || event.title)}
                              className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition hover:scale-105"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {events.length === 0 && (
                      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                        <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 text-lg">Aucun événement trouvé.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ORGANIZERS TAB */}
              {activeTab === 'organizers' && (
                <div className="grid gap-8 xl:grid-cols-3">
                  <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-g-bright" /> Liste des Organisateurs
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {organizers.map((org) => (
                        <div
                          key={org.id}
                          className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 group hover:border-white/20 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-g-bright/20 flex items-center justify-center text-g-bright font-black text-xl shrink-0">
                              {org.name.charAt(0)}
                            </div>
                            <button
                              onClick={() => removeOrganizer(org.id)}
                              className="p-2 rounded-lg text-white/30 hover:bg-red-500/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                              title="Supprimer l'organisateur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="font-bold text-lg truncate">{org.name}</h4>
                          <p className="text-sm font-medium text-white/50 truncate mb-4">{org.company}</p>
                          <div className="space-y-2 text-sm text-white/70 bg-black/20 p-3 rounded-xl">
                            <p className="flex items-center gap-2 truncate"><span className="text-white/40">@</span> {org.email}</p>
                            <p className="flex items-center gap-2 truncate"><span className="text-white/40">📞</span> {org.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-g-bright/10 to-white/5 p-6 md:p-8 shadow-xl h-fit">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-g-bright" /> Nouvel Organisateur
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Nom complet</label>
                        <input
                          type="text"
                          value={newOrganizer.name}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, name: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-g-bright transition-colors"
                          placeholder="Ex: Amadou Fall"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Email</label>
                        <input
                          type="email"
                          value={newOrganizer.email}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, email: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-g-bright transition-colors"
                          placeholder="contact@exemple.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Téléphone</label>
                        <input
                          type="tel"
                          value={newOrganizer.phone}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, phone: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-g-bright transition-colors"
                          placeholder="+221 77..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Entreprise</label>
                        <input
                          type="text"
                          value={newOrganizer.company}
                          onChange={(e) => setNewOrganizer({ ...newOrganizer, company: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-g-bright transition-colors"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <button
                        onClick={addOrganizer}
                        className="w-full bg-g-bright text-black font-black py-3.5 rounded-xl hover:bg-white transition-colors mt-4 shadow-lg shadow-g-bright/20"
                      >
                        Créer le profil
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl border border-red-500/20 bg-[#110505] p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white text-center mb-2">Supprimer ?</h3>
              <p className="text-white/60 text-center mb-8">
                Êtes-vous certain de vouloir supprimer cet élément ? Cette action est irréversible.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => deleteConfirm && deleteEvent(deleteConfirm)}
                  className="w-full rounded-xl bg-red-500 px-4 py-3.5 font-bold text-white hover:bg-red-600 transition"
                >
                  Oui, supprimer
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3.5 font-bold text-white hover:bg-white/5 transition"
                >
                  Annuler
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

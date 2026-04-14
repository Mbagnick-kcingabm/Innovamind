import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, MapPin, Plus, Ticket, Zap, X, Upload } from 'lucide-react';
import Logo from '../components/Logo';

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

interface CreateEventPageProps {
  onSave: (event: EventItem) => void;
  onCancel: () => void;
  onLogout: () => void;
}

const languages = ['Français', 'Anglais', 'Portugais', 'Espagnol'];
const eventCategories = ['Concert', 'Festival', 'Conférence', 'Atelier', 'Séminaire', 'Exposition', 'Spectacle', 'Marathon', 'Mariage', 'Réunion'];

const getEmptyEvent = (): EventItem => ({
  id: Date.now().toString(),
  title: '',
  category: '',
  status: 'draft',
  ticketsSold: 0,
  maxCapacity: 0,
  revenue: 0,
  description: '',
  language: 'Français',
  imageUrl: '',
  startDateTime: '',
  endDateTime: '',
  venue: '',
  address: '',
  city: '',
  latitude: '14.6928',
  longitude: '-17.4467',
  tickets: [
    {
      id: 'ticket-1',
      name: 'Standard',
      price: 0,
      quantity: 100,
      description: '',
      saleStart: '',
      saleEnd: ''
    }
  ]
});

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 });

const CreateEventPage = ({ onSave, onCancel, onLogout }: CreateEventPageProps) => {
  const [wizardStep, setWizardStep] = useState(1);
  const [formEvent, setFormEvent] = useState<EventItem>(() => {
    const editingEvent = localStorage.getItem('editingEvent');
    if (editingEvent) {
      return JSON.parse(editingEvent);
    }
    return getEmptyEvent();
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nettoyer le localStorage après chargement
  useEffect(() => {
    return () => {
      localStorage.removeItem('editingEvent');
    };
  }, []);

  const addTicketType = () => {
    setFormEvent((current) => ({
      ...current,
      tickets: [
        ...current.tickets,
        {
          id: `ticket-${Date.now()}`,
          name: 'VIP',
          price: 0,
          quantity: 100,
          description: '',
          saleStart: '',
          saleEnd: ''
        }
      ]
    }));
  };

  const updateTicketField = (ticketId: string, field: keyof TicketType, value: string | number) => {
    setFormEvent((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const removeTicketType = (ticketId: string) => {
    setFormEvent((current) => ({
      ...current,
      tickets: current.tickets.filter((ticket) => ticket.id !== ticketId)
    }));
  };

  const handleSave = () => {
    const errors = [];
    if (!formEvent.title) errors.push('Titre');
    if (!formEvent.category) errors.push('Catégorie');
    if (!formEvent.description) errors.push('Description');
    if (!formEvent.startDateTime) errors.push('Date début');
    if (!formEvent.endDateTime) errors.push('Date fin');
    if (!formEvent.venue) errors.push('Lieu');
    if (!formEvent.address) errors.push('Adresse');
    if (!formEvent.city) errors.push('Ville');
    if (!formEvent.tickets || formEvent.tickets.length === 0) errors.push('Au moins 1 billet');
    
    formEvent.tickets.forEach((ticket, idx) => {
      if (!ticket.name) errors.push(`Billet ${idx + 1}: Nom`);
      if (!ticket.price || ticket.price === 0) errors.push(`Billet ${idx + 1}: Prix`);
      if (!ticket.quantity) errors.push(`Billet ${idx + 1}: Quantité`);
    });
    
    if (errors.length > 0) {
      setError(`Champs obligatoires: ${errors.join(', ')}`);
      return;
    }
    setError('');
    onSave(formEvent);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormEvent({ ...formEvent, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
        <Logo className="h-8 w-auto" />
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
            style={{borderColor: '#F2B759', color: '#F2B759', backgroundColor: 'transparent'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2B759' + '15'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <button
            onClick={onLogout}
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{backgroundColor: '#0A4A3C', color: 'white'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F6A52'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A4A3C'}
          >
            Se déconnecter
          </button>
        </div>
      </nav>

      <div className="px-6 py-6 md:px-12 lg:px-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Création d’événement</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Nouveau parcours de publication</h1>
          </div>
          <div className="rounded-3xl bg-white/5 px-3 py-2 text-xs text-white/70">Étape {wizardStep} / 4</div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          {['Informations', 'Date & lieu', 'Billetterie', 'Aperçu'].map((label, index) => (
            <div
              key={label}
              className={`rounded-3xl p-4 text-center border border-white/10 ${
                wizardStep === index + 1
                  ? 'text-white'
                  : 'bg-white/5 text-white/60'
              }`}
              style={wizardStep === index + 1 ? { backgroundColor: '#0A4A3C' } : {}}
            >
              <p className="text-xs uppercase tracking-[0.24em]">ETAPE {index + 1}</p>
              <p className="mt-2 text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {wizardStep === 1 && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-white/80">Titre de l’événement</label>
                <input
                  value={formEvent.title}
                  onChange={(e) => setFormEvent({ ...formEvent, title: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  placeholder="Nom de votre événement"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <label className="block text-sm font-semibold text-white/80">Description</label>
                <textarea
                  value={formEvent.description}
                  onChange={(e) => setFormEvent({ ...formEvent, description: e.target.value })}
                  rows={6}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  placeholder="Détaillez le programme"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Type d'événement</label>
                    <select
                      value={formEvent.category}
                      onChange={(e) => setFormEvent({ ...formEvent, category: e.target.value })}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                      onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {eventCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">Langue</label>
                    <select
                      value={formEvent.language}
                      onChange={(e) => setFormEvent({ ...formEvent, language: e.target.value })}
                      className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                      onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                      {languages.map((language) => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-white/50 mb-4">Image de l’événement</p>
                <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-white/60 cursor-pointer transition" style={{borderColor: '#F2B759'}} onClick={() => fileInputRef.current?.click()}>
                  {formEvent.imageUrl ? (
                    <img src={formEvent.imageUrl} alt="Aperçu" className="h-48 w-full rounded-3xl object-cover" />
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{color: '#F2B759'}} />
                      <p className="font-semibold text-white">Cliquez pour télécharger</p>
                      <p className="mt-2 text-sm text-white/50">JPG, PNG jusqu'à 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full rounded-3xl border px-4 py-3 text-sm font-semibold transition"
                  style={{borderColor: '#F2B759', color: '#F2B759', backgroundColor: 'transparent'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2B759' + '15'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Télécharger une image
                </button>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-white/80">Date & heure de début</label>
                <input
                  type="datetime-local"
                  value={formEvent.startDateTime}
                  onChange={(e) => setFormEvent({ ...formEvent, startDateTime: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <label className="block text-sm font-semibold text-white/80">Date & heure de fin</label>
                <input
                  type="datetime-local"
                  value={formEvent.endDateTime}
                  onChange={(e) => setFormEvent({ ...formEvent, endDateTime: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-white/80">Nom du lieu</label>
                <input
                  value={formEvent.venue}
                  onChange={(e) => setFormEvent({ ...formEvent, venue: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  placeholder="Nom du lieu"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <label className="block text-sm font-semibold text-white/80">Adresse</label>
                <input
                  value={formEvent.address}
                  onChange={(e) => setFormEvent({ ...formEvent, address: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  placeholder="Adresse compléte"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <label className="block text-sm font-semibold text-white/80">Ville</label>
                <input
                  value={formEvent.city}
                  onChange={(e) => setFormEvent({ ...formEvent, city: e.target.value })}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                  placeholder="Ville"
                  onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Billetterie</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Types de billets</h3>
                </div>
                <button
                  onClick={addTicketType}
                  className="inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-semibold transition"
                  style={{backgroundColor: '#0A4A3C' + '20', color: '#F2B759'}}
                >
                  <Plus className="w-4 h-4" /> Ajouter un type
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-white/70">Configurez les différents types de billets disponibles pour votre événement. Chaque billet doit avoir un nom, un prix et une quantité limitée.</p>
                {formEvent.tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-semibold text-white">Billet {ticket.name || 'Sans nom'}</p>
                        <p className="text-xs text-white/50 mt-1">Prix: {formatCurrency(ticket.price)} | Quantité: {ticket.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeTicketType(ticket.id)}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-rose-500/20"
                        title="Supprimer ce type de billet"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Nom du billet *</label>
                          <input
                            value={ticket.name}
                            onChange={(e) => updateTicketField(ticket.id, 'name', e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="Ex: Standard, VIP, Enfant..."
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Prix en XOF *</label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketField(ticket.id, 'price', Number(e.target.value))}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="10000"
                            min="0"
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Quantité disponible *</label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => updateTicketField(ticket.id, 'quantity', Number(e.target.value))}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="100"
                            min="1"
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Description</label>
                          <input
                            value={ticket.description}
                            onChange={(e) => updateTicketField(ticket.id, 'description', e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="Ex: Accès général"
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Début de vente</label>
                          <input
                            type="datetime-local"
                            value={ticket.saleStart}
                            onChange={(e) => updateTicketField(ticket.id, 'saleStart', e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="Ex: 2026-04-15"
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-2">Fin de vente</label>
                          <input
                            type="datetime-local"
                            value={ticket.saleEnd}
                            onChange={(e) => updateTicketField(ticket.id, 'saleEnd', e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none"
                            placeholder="Ex: 2026-05-01"
                            onFocus={(e) => e.target.style.borderColor = '#F2B759'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/50">Aperçu de l’événement</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{formEvent.title || 'Titre à renseigner'}</h3>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60">{formEvent.status === 'draft' ? 'Brouillon' : 'Publié'}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/60">{formEvent.description || 'Aucune description ajoutée.'}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">Dates</p>
                    <p className="mt-3 text-sm text-white">{formEvent.startDateTime || '—'}</p>
                    <p className="text-sm text-white">{formEvent.endDateTime || '—'}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">Lieu</p>
                    <p className="mt-3 text-sm text-white">{formEvent.venue || '—'}</p>
                    <p className="text-sm text-white/60">{formEvent.address}</p>
                    <p className="text-sm text-white/60">{formEvent.city}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Billets</p>
                  <div className="mt-3 space-y-3">
                    {formEvent.tickets.map((ticket) => (
                      <div key={ticket.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{ticket.name}</p>
                            <p className="text-sm text-white/60">{ticket.description}</p>
                          </div>
                          <p className="text-sm text-white">{formatCurrency(ticket.price)}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
                          <span>Quantité: {ticket.quantity}</span>
                          <span>Vente: {ticket.saleStart || '—'} → {ticket.saleEnd || '—'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 text-white/80 mb-4">
                  <Zap className="w-5 h-5" style={{color: '#F2B759'}} />
                  <p className="text-sm uppercase tracking-[0.24em]">Vue finale</p>
                </div>
                <p className="text-sm text-white/70">Contrôlez votre événement et choisissez de le publier ou de sauvegarder le brouillon.</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <p className="text-sm text-white/60">Langue</p>
                    <p className="mt-2 text-white">{formEvent.language}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <p className="text-sm text-white/60">Image</p>
                    {formEvent.imageUrl ? (
                      <img src={formEvent.imageUrl} alt="Aperçu" className="mt-3 h-32 w-full rounded-3xl object-cover" />
                    ) : (
                      <p className="mt-3 text-white/50">Aucune image sélectionnée.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
              className="rounded-3xl border px-5 py-3 text-sm font-semibold transition"
              style={{borderColor: '#F2B759', color: '#F2B759', backgroundColor: 'transparent'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2B759' + '15'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Retour
            </button>
            <button
              onClick={() => setWizardStep(Math.min(4, wizardStep + 1))}
              className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-950 transition"
              style={{backgroundColor: '#F2B759'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFD580'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2B759'}
            >
              Suivant
            </button>
          </div>
          <button
            onClick={handleSave}
            className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-950 transition"
            style={{backgroundColor: '#0A4A3C'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F6A52'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0A4A3C'}
          >
            Sauvegarder et revenir
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreateEventPage;

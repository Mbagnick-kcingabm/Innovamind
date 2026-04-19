import { Zap, Check } from 'lucide-react';

interface SubscriptionTabProps {
  formatCurrency: (val: number) => string;
}

const SubscriptionTab = ({ formatCurrency }: SubscriptionTabProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Current Plan Card */}
      <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2B759]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2B759]/20 border border-[#F2B759]/30 text-[#F2B759] text-xs font-bold uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Plan Actuel : Professionnel
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Gérez votre abonnement SaaS</h2>
            <p className="text-white/60 max-w-xl leading-relaxed">
              Votre abonnement se renouvelle automatiquement le <span className="text-white font-bold">15 Mai 2026</span>. 
              Vous utilisez actuellement le forfait Pro pour maximiser la portée de vos événements.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-full lg:min-w-[280px] lg:w-auto">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2 font-bold text-center lg:text-left">Prochain prélèvement</p>
            <p className="text-3xl font-black text-white text-center lg:text-left">{formatCurrency(25000)} <span className="text-sm font-normal text-white/40">/ mois</span></p>
            <button className="w-full mt-6 py-3.5 rounded-2xl bg-[#F2B759] text-slate-950 font-black text-sm transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#F2B759]/20">
              Renouveler Maintenant
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50">
              <span>Événements Publiés</span>
              <span className="text-white">5 / 10</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F2B759] rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50">
              <span>Tickets Mis en Vente</span>
              <span className="text-white">2.5k / 5k</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F2B759] rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50">
              <span>Stockage Médias</span>
              <span className="text-white">1.2 GB / 5 GB</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F2B759] rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { 
            name: 'Basique', 
            price: 10000, 
            features: ['3 Événements simultanés', '500 Tickets par mois', 'Support par email', 'Statistiques basiques'],
            popular: false
          },
          { 
            name: 'Professionnel', 
            price: 25000, 
            features: ['10 Événements simultanés', '5000 Tickets par mois', 'Support prioritaire 24/7', 'Analytiques avancés', 'Personnalisation du profil'],
            popular: true
          },
          { 
            name: 'Entreprise', 
            price: 75000, 
            features: ['Événements illimités', 'Tickets illimités', 'Account Manager dédié', 'Accès API complet', 'Marque blanche'],
            popular: false
          }
        ].map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-[2rem] border p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col ${
              plan.popular 
                ? 'border-[#F2B759] bg-[#F2B759]/5 shadow-2xl shadow-[#F2B759]/10 relative' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F2B759] text-slate-950 text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                Le plus populaire
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-3xl font-black text-white">{formatCurrency(plan.price)}</span>
              <span className="text-white/40 text-sm"> / mois</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="w-5 h-5 text-[#F2B759] shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                plan.popular 
                  ? 'bg-[#F2B759] text-slate-950 hover:shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {plan.name === 'Professionnel' ? 'Gérer mon plan' : 'Changer pour ce plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History Link */}
      <div className="text-center pb-8">
         <button className="text-sm font-bold text-white/40 hover:text-[#F2B759] transition-colors uppercase tracking-widest">
            Consulter l'historique complet des factures →
          </button>
      </div>
    </div>
  );
};

export default SubscriptionTab;

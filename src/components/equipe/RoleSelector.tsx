import { HandCoins, ScanLine, Calculator, Smartphone, CheckCircle2 } from 'lucide-react';
import { RoleType } from './types';

interface RoleSelectorProps {
  selectedRole: RoleType | null;
  onSelectRole: (role: RoleType) => void;
}

const roleCards: { id: RoleType; name: string; icon: any; color: string; desc: string; chips: string[] }[] = [
  {
    id: 'collecteur',
    name: 'Collecteur',
    icon: HandCoins,
    color: 'amber',
    desc: 'Collecte les paiements en présentiel (cash, Mobile Money)',
    chips: ['Vente billets', 'Paiement cash', 'Mobile Money']
  },
  {
    id: 'controleur',
    name: 'Contrôleur',
    icon: ScanLine,
    color: 'blue',
    desc: 'Vérifie et valide les billets à l\'entrée de l\'événement',
    chips: ['Scan QR Code', 'Validation billets', 'Accès entrée']
  },
  {
    id: 'caissier',
    name: 'Caissier',
    icon: Calculator,
    color: 'emerald',
    desc: 'Gère la caisse et les encaissements sur place',
    chips: ['Gestion caisse', 'Encaissements', 'Rapports ventes']
  },
  {
    id: 'agent_pda',
    name: 'Agent PDA',
    icon: Smartphone,
    color: 'purple',
    desc: 'Utilise le terminal PDA pour la vente et le contrôle terrain',
    chips: ['Vente terrain', 'Scan QR', 'Mode offline', 'Sync auto']
  }
];

// Map colors to actual Tailwind classes
const colorMap: Record<string, { border: string; bgSelected: string; iconText: string; iconBg: string }> = {
  amber: { border: 'border-amber-500', bgSelected: 'bg-amber-500/5', iconText: 'text-amber-500', iconBg: 'bg-amber-500/10' },
  blue: { border: 'border-blue-500', bgSelected: 'bg-blue-500/5', iconText: 'text-blue-500', iconBg: 'bg-blue-500/10' },
  emerald: { border: 'border-emerald-500', bgSelected: 'bg-emerald-500/5', iconText: 'text-emerald-500', iconBg: 'bg-emerald-500/10' },
  purple: { border: 'border-purple-500', bgSelected: 'bg-purple-500/5', iconText: 'text-purple-500', iconBg: 'bg-purple-500/10' }
};

export const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roleCards.map((role) => {
        const isSelected = selectedRole === role.id;
        const colors = colorMap[role.color];

        return (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
              isSelected
                ? `${colors.border} ${colors.bgSelected}`
                : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-900'
            }`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className={`w-5 h-5 ${colors.iconText}`} />
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
                <role.icon className={`w-5 h-5 ${colors.iconText}`} />
              </div>
              <h4 className={`font-bold text-base ${isSelected ? 'text-white' : 'text-white/90'}`}>{role.name}</h4>
            </div>
            
            <p className="text-sm text-white/50 mb-4 line-clamp-2 min-h-[40px]">{role.desc}</p>
            
            <div className="flex flex-wrap gap-1.5">
              {role.chips.map((chip, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/60 font-medium">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

import { Users, HandCoins, ScanLine, Calculator, Smartphone } from 'lucide-react';
import { Membre } from './types';

interface MembresStatsProps {
  membres: Membre[];
}

export const MembresStats = ({ membres }: MembresStatsProps) => {
  const stats = {
    total: membres.length,
    collecteursActifs: membres.filter(m => m.role === 'collecteur' && m.status === 'actif').length,
    controleursActifs: membres.filter(m => m.role === 'controleur' && m.status === 'actif').length,
    pdaActifs: membres.filter(m => m.role === 'agent_pda' && m.status === 'actif').length,
  };

  const rolesSummary = [
    {
      id: 'collecteur',
      name: 'Collecteurs',
      icon: HandCoins,
      count: membres.filter(m => m.role === 'collecteur').length,
      activeCount: membres.filter(m => m.role === 'collecteur' && m.status === 'actif').length,
      borderAccent: 'border-l-amber-500',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10'
    },
    {
      id: 'controleur',
      name: 'Contrôleurs',
      icon: ScanLine,
      count: membres.filter(m => m.role === 'controleur').length,
      activeCount: membres.filter(m => m.role === 'controleur' && m.status === 'actif').length,
      borderAccent: 'border-l-blue-500',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10'
    },
    {
      id: 'caissier',
      name: 'Caissiers',
      icon: Calculator,
      count: membres.filter(m => m.role === 'caissier').length,
      activeCount: membres.filter(m => m.role === 'caissier' && m.status === 'actif').length,
      borderAccent: 'border-l-emerald-500',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10'
    },
    {
      id: 'agent_pda',
      name: 'Agents PDA',
      icon: Smartphone,
      count: membres.filter(m => m.role === 'agent_pda').length,
      activeCount: membres.filter(m => m.role === 'agent_pda' && m.status === 'actif').length,
      borderAccent: 'border-l-purple-500',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-bold text-white/50">Total membres</p>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-white">{stats.total}</p>
          </div>
        </div>
        
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <HandCoins className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-white/50">Collecteurs actifs</p>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-white">{stats.collecteursActifs}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <ScanLine className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-bold text-white/50">Contrôleurs actifs</p>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-white">{stats.controleursActifs}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 relative overflow-hidden group hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-sm font-bold text-white/50">Agents PDA actifs</p>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-white">{stats.pdaActifs}</p>
          </div>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolesSummary.map((role) => (
          <div key={role.id} className={`rounded-3xl border border-white/10 bg-slate-900/50 p-5 border-l-4 ${role.borderAccent} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${role.iconBg}`}>
                <role.icon className={`w-5 h-5 ${role.iconColor}`} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{role.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{role.count} membre{role.count > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-emerald-400">{role.activeCount} actif{role.activeCount > 1 ? 's' : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

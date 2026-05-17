import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, UserPlus } from 'lucide-react';
import { Membre, RoleType, StatusType } from './types';
import { MembreRow } from './MembreRow';

interface MembresTableProps {
  membres: Membre[];
  onAddMembre: () => void;
  onEditRole: (membre: Membre) => void;
  onResendInvite: (membre: Membre) => void;
  onDeactivate: (membre: Membre) => void;
  onDelete: (membre: Membre) => void;
}

export const MembresTable = ({
  membres,
  onAddMembre,
  onEditRole,
  onResendInvite,
  onDeactivate,
  onDelete
}: MembresTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType | 'tous'>('tous');
  const [selectedStatus, setSelectedStatus] = useState<StatusType | 'tous'>('tous');

  const filteredMembres = useMemo(() => {
    return membres.filter((m) => {
      const matchSearch =
        searchQuery === '' ||
        m.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery);

      const matchRole = selectedRole === 'tous' || m.role === selectedRole;
      const matchStatus = selectedStatus === 'tous' || m.status === selectedStatus;

      return matchSearch && matchRole && matchStatus;
    });
  }, [membres, searchQuery, selectedRole, selectedStatus]);

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl shadow-black/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B759]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      
      {/* Table Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white">Liste des membres</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Nom, email, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#F2B759]/50 transition-all"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-white/40" />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleType | 'tous')}
              className="appearance-none w-full sm:w-48 bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-10 py-3 outline-none focus:border-[#F2B759]/50 transition-all cursor-pointer"
            >
              <option value="tous">Tous les rôles</option>
              <option value="collecteur">Collecteur</option>
              <option value="controleur">Contrôleur</option>
              <option value="caissier">Caissier</option>
              <option value="agent_pda">Agent PDA</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-white/30" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as StatusType | 'tous')}
              className="appearance-none w-full sm:w-40 bg-slate-900 border border-white/10 text-white text-sm rounded-xl px-4 pr-10 py-3 outline-none focus:border-[#F2B759]/50 transition-all cursor-pointer"
            >
              <option value="tous">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="en_attente">En attente</option>
              <option value="inactif">Inactif</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="relative z-10 bg-slate-950/60 rounded-3xl border border-white/10 overflow-hidden">
        {/* Table Header (Desktop) */}
        <div className="hidden md:flex items-center justify-between p-4 px-5 border-b border-white/10 bg-white/5 text-xs font-bold text-white/50 uppercase tracking-wider">
          <div className="flex-1">Membre</div>
          <div className="w-[100px] shrink-0">Rôle</div>
          <div className="w-[100px] shrink-0">Statut</div>
          <div className="hidden lg:block w-[100px] shrink-0">Date d'ajout</div>
          <div className="w-[40px] shrink-0"></div> {/* Actions spacing */}
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {filteredMembres.length > 0 ? (
            filteredMembres.map((membre) => (
              <MembreRow
                key={membre.id}
                membre={membre}
                onEditRole={onEditRole}
                onResendInvite={onResendInvite}
                onDeactivate={onDeactivate}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/50 font-medium mb-6">Aucun membre pour le moment.</p>
              <button
                onClick={onAddMembre}
                className="px-6 py-2.5 rounded-xl border border-dashed border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all font-medium flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Ajouter le premier membre
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

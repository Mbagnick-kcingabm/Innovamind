import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, RefreshCw, UserMinus, Trash2 } from 'lucide-react';
import { Membre } from './types';
import { RoleBadge } from './RoleBadge';
import { StatutBadge } from './StatutBadge';

interface MembreRowProps {
  membre: Membre;
  onEditRole: (membre: Membre) => void;
  onResendInvite: (membre: Membre) => void;
  onDeactivate: (membre: Membre) => void;
  onDelete: (membre: Membre) => void;
}

export const MembreRow = ({ membre, onEditRole, onResendInvite, onDeactivate, onDelete }: MembreRowProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors gap-4">
      {/* User Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm md:text-base border border-white/10 shrink-0">
          {membre.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm md:text-base truncate">
            {membre.firstName} {membre.lastName}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs md:text-sm text-white/50 mt-1">
            <span className="truncate">{membre.email}</span>
            <span className="hidden sm:inline">•</span>
            <span className="truncate">{membre.phone}</span>
          </div>
        </div>
      </div>

      {/* Badges & Date */}
      <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
        <div className="min-w-[100px]">
          <RoleBadge role={membre.role} />
        </div>
        <div className="min-w-[100px]">
          <StatutBadge status={membre.status} />
        </div>
        <div className="hidden lg:block min-w-[100px] text-xs text-white/40 whitespace-nowrap">
          {membre.createdAt}
        </div>

        {/* Actions Menu */}
        <div className="relative ml-auto md:ml-4 shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-20 py-2">
              <button
                onClick={() => { closeMenu(); onEditRole(membre); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" /> Modifier le rôle
              </button>
              
              {membre.status === 'en_attente' && (
                <button
                  onClick={() => { closeMenu(); onResendInvite(membre); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Renvoyer l'invitation
                </button>
              )}
              
              {membre.status !== 'inactif' && (
                <button
                  onClick={() => { closeMenu(); onDeactivate(membre); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-400 hover:bg-orange-500/10 transition-colors"
                >
                  <UserMinus className="w-4 h-4" /> Désactiver
                </button>
              )}

              <div className="h-px bg-white/10 my-1 mx-4" />
              
              <button
                onClick={() => { closeMenu(); onDelete(membre); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { RoleType, Membre } from './types';
import { RoleSelector } from './RoleSelector';
import { RoleBadge } from './RoleBadge';

interface ModifierRoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  membre: Membre | null;
  onSave: (memberId: string, newRole: RoleType) => void;
}

export const ModifierRoleDrawer = ({ isOpen, onClose, membre, onSave }: ModifierRoleDrawerProps) => {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  useEffect(() => {
    if (membre) {
      setSelectedRole(membre.role);
    }
  }, [membre]);

  const handleSave = () => {
    if (membre && selectedRole) {
      onSave(membre.id, selectedRole);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && membre && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-slate-900 border-l border-white/10 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white">Modifier le rôle</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Member Summary */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                  {membre.avatarInitials}
                </div>
                <div>
                  <h4 className="font-bold text-white">{membre.firstName} {membre.lastName}</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-white/50">Rôle actuel:</span>
                    <RoleBadge role={membre.role} />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-4">
                <h4 className="font-bold text-white">Nouveau rôle</h4>
                <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-slate-900 shrink-0 space-y-3">
              <button
                onClick={handleSave}
                disabled={!selectedRole || selectedRole === membre.role}
                className="w-full py-3.5 rounded-xl bg-[#F2B759] text-slate-950 hover:bg-[#F2B759]/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-5 h-5" />
                Enregistrer les modifications
              </button>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 font-bold transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

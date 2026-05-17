import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Membre, RoleType } from './types';
import { MembresStats } from './MembresStats';
import { MembresTable } from './MembresTable';
import { AjouterMembreModal } from './AjouterMembreModal';
import { ModifierRoleDrawer } from './ModifierRoleDrawer';
import ConfirmDialog from './ConfirmDialog';

const initialMockMembers: Membre[] = [
  {
    id: "1",
    firstName: "Fatou",
    lastName: "Diallo",
    phone: "+221 77 123 45 67",
    email: "fatou.diallo@email.com",
    role: "collecteur",
    status: "actif",
    createdAt: "15 Mar 2026",
    avatarInitials: "FD"
  },
  {
    id: "2",
    firstName: "Moussa",
    lastName: "Sow",
    phone: "+221 76 987 65 43",
    email: "moussa.sow@email.com",
    role: "controleur",
    status: "en_attente",
    createdAt: "28 Mar 2026",
    avatarInitials: "MS"
  },
  {
    id: "3",
    firstName: "Aminata",
    lastName: "Ndiaye",
    phone: "+221 70 456 78 90",
    email: "aminata.ndiaye@email.com",
    role: "agent_pda",
    status: "actif",
    createdAt: "01 Avr 2026",
    avatarInitials: "AN"
  },
  {
    id: "4",
    firstName: "Ibrahima",
    lastName: "Bâ",
    phone: "+221 78 321 09 87",
    email: "ibrahima.ba@email.com",
    role: "caissier",
    status: "inactif",
    createdAt: "20 Fév 2026",
    avatarInitials: "IB"
  }
];

export const MembresPage = () => {
  const [membres, setMembres] = useState<Membre[]>(() => {
    const saved = localStorage.getItem('innova_team_members');
    return saved ? JSON.parse(saved) : initialMockMembers;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoleMembre, setEditingRoleMembre] = useState<Membre | null>(null);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDestructive: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Toast state (simple implementation)
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('innova_team_members', JSON.stringify(membres));
  }, [membres]);

  const handleAddMembre = (newMembreData: Omit<Membre, 'id' | 'createdAt' | 'status' | 'avatarInitials'>) => {
    // TODO: replace with Supabase insert -> team_members table
    const newMembre: Membre = {
      ...newMembreData,
      id: Date.now().toString(),
      status: 'en_attente',
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatarInitials: `${newMembreData.firstName.charAt(0)}${newMembreData.lastName.charAt(0)}`.toUpperCase(),
    };
    
    setMembres([newMembre, ...membres]);
    // TODO: trigger invitation SMS/email via Supabase Edge Function or Resend/SensText API
    showToast(`Invitation envoyée à ${newMembre.firstName} ${newMembre.lastName}`);
  };

  const handleSaveRole = (memberId: string, newRole: RoleType) => {
    // TODO: replace with Supabase update -> set role = newRole
    setMembres(membres.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    showToast('Rôle modifié avec succès');
  };

  const handleResendInvite = (membre: Membre) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Renvoyer l\'invitation',
      message: `Voulez-vous renvoyer l'invitation à ${membre.firstName} ${membre.lastName} ?`,
      confirmText: 'Confirmer',
      isDestructive: false,
      onConfirm: () => {
        // TODO: trigger invitation SMS/email
        showToast(`Invitation renvoyée à ${membre.firstName}`);
      }
    });
  };

  const handleDeactivate = (membre: Membre) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Désactiver le membre',
      message: `Désactiver ${membre.firstName} ${membre.lastName} ? Cette personne ne pourra plus accéder aux événements de votre équipe.`,
      confirmText: 'Désactiver',
      isDestructive: true,
      onConfirm: () => {
        // TODO: replace with Supabase update -> set status = inactif
        setMembres(membres.map(m => m.id === membre.id ? { ...m, status: 'inactif' } : m));
        showToast(`${membre.firstName} a été désactivé(e)`);
      }
    });
  };

  const handleDelete = (membre: Membre) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer définitivement',
      message: `Supprimer définitivement ${membre.firstName} ${membre.lastName} ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      isDestructive: true,
      onConfirm: () => {
        // TODO: replace with Supabase delete
        setMembres(membres.filter(m => m.id !== membre.id));
        showToast(`${membre.firstName} supprimé(e) de l'équipe`);
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* Header handled by OrganizerDashboard.tsx, so we only put the page specific top button here or let the parent do it.
          The prompt specifies "Primary action button (top right): '+ Ajouter un membre'", we can place it here. 
          Actually, the parent has the title, so we will just position the button in the flow or let it float if needed. 
          Let's place it at the top of this component. */}
      
      <div className="flex justify-between items-end mb-6 -mt-2">
         {/* Subtitle since parent Title is rendered in OrganizerDashboard */}
         <p className="text-white/50 text-sm md:text-base hidden sm:block">
           Gérez les membres de votre équipe et leurs accès
         </p>
         <button
           onClick={() => setIsAddModalOpen(true)}
           className="px-5 py-2.5 rounded-xl bg-[#F2B759] text-slate-950 hover:bg-[#F2B759]/90 font-bold flex items-center gap-2 transition-all ml-auto"
         >
           <Plus className="w-5 h-5" /> Ajouter un membre
         </button>
      </div>

      <MembresStats membres={membres} />

      <MembresTable
        membres={membres}
        onAddMembre={() => setIsAddModalOpen(true)}
        onEditRole={(m) => setEditingRoleMembre(m)}
        onResendInvite={handleResendInvite}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />

      <AjouterMembreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMembre}
      />

      <ModifierRoleDrawer
        isOpen={!!editingRoleMembre}
        onClose={() => setEditingRoleMembre(null)}
        membre={editingRoleMembre}
        onSave={handleSaveRole}
      />

      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          isDestructive={confirmDialog.isDestructive}
          onConfirm={confirmDialog.onConfirm}
          onClose={() => setConfirmDialog(null)}
        />
      )}

      {/* Simple Toast */}
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default MembresPage;

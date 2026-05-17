import { RoleType } from './types';

const roleConfig: Record<RoleType, { label: string; bg: string; text: string; border: string }> = {
  collecteur: {
    label: 'Collecteur',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  controleur: {
    label: 'Contrôleur',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  },
  caissier: {
    label: 'Caissier',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  },
  agent_pda: {
    label: 'Agent PDA',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30'
  }
};

export const RoleBadge = ({ role }: { role: RoleType }) => {
  const config = roleConfig[role];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

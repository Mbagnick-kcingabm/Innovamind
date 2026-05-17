import { StatusType } from './types';

const statusConfig: Record<StatusType, { label: string; bg: string; text: string; border: string }> = {
  actif: {
    label: 'Actif',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30'
  },
  en_attente: {
    label: 'En attente',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30'
  },
  inactif: {
    label: 'Inactif',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30'
  }
};

export const StatutBadge = ({ status }: { status: StatusType }) => {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

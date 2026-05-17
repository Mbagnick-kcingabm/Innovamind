export type RoleType = 'collecteur' | 'controleur' | 'caissier' | 'agent_pda';
export type StatusType = 'actif' | 'en_attente' | 'inactif';

export interface Membre {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: RoleType;
  status: StatusType;
  createdAt: string;
  avatarInitials: string;
}

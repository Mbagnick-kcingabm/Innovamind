import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  customerName: string;
  event: string;
  amount: number;
  date: string;
  status: 'Confirmé' | 'En attente' | 'Annulé';
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  variant: 'success' | 'warning' | 'info';
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  saleStart: string;
  saleEnd: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  ticketsSold: number;
  maxCapacity: number;
  revenue: number;
  description: string;
  language: string;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  tickets: TicketType[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

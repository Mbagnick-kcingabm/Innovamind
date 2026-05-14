import { useState, useMemo } from 'react';
import { DollarSign, Filter, ChevronDown, Search, Calendar, User } from 'lucide-react';
import { Transaction, EventItem } from '../../types/dashboard';

interface TransactionsTabProps {
  transactions: Transaction[];
  events: EventItem[];
  totalRevenue: number;
  formatCurrency: (val: number) => string;
}

const TransactionsTab = ({ transactions, events, totalRevenue, formatCurrency }: TransactionsTabProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCashier, setSelectedCashier] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const cashiers = useMemo(() => {
    const uniqueCashiers = new Set(transactions.map(t => t.cashierName).filter(Boolean));
    return Array.from(uniqueCashiers) as string[];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchEvent = selectedEvent === 'all' || t.event === selectedEvent;
      const matchSearch = searchQuery === '' || 
        t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCashier = selectedCashier === 'all' || t.cashierName === selectedCashier;
      const matchDate = selectedDate === '' || t.date.includes(selectedDate);

      return matchEvent && matchSearch && matchCashier && matchDate;
    });
  }, [transactions, selectedEvent, searchQuery, selectedCashier, selectedDate]);

  const currentRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#F2B759]/70" />
          </div>
          <input
            type="text"
            placeholder="Rechercher (Client, ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#F2B759]/50 transition-all"
          />
        </div>

        {/* Event Filter */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-[#F2B759]/70" />
          </div>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="appearance-none w-full bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-10 py-3 outline-none focus:border-[#F2B759]/50 transition-all cursor-pointer"
          >
            <option value="all">Tous les événements</option>
            {events.map(event => (
              <option key={event.id} value={event.title}>{event.title}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-white/30" />
          </div>
        </div>

        {/* Cashier Filter */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <User className="w-4 h-4 text-[#F2B759]/70" />
          </div>
          <select
            value={selectedCashier}
            onChange={(e) => setSelectedCashier(e.target.value)}
            className="appearance-none w-full bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-10 py-3 outline-none focus:border-[#F2B759]/50 transition-all cursor-pointer"
          >
            <option value="all">Tous les caissiers</option>
            {cashiers.map(cashier => (
              <option key={cashier} value={cashier}>{cashier}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-white/30" />
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Calendar className="w-4 h-4 text-[#F2B759]" />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#F2B759]/50 transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl shadow-black/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B759]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#F2B759]/10 rounded-2xl">
              <DollarSign className="h-6 w-6 text-[#F2B759]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Historique des Versements</h2>
              <p className="text-sm text-white/50 mt-1">Dernières opérations financières enregistrées par vos collecteurs</p>
            </div>
          </div>

          <div className="bg-[#F2B759]/10 px-6 py-3.5 rounded-2xl border border-[#F2B759]/20 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F2B759]/60">Total Filtré :</span>
            <span className="text-lg font-black text-[#F2B759]">{formatCurrency(currentRevenue)}</span>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="grid gap-4 relative z-10 xl:grid-cols-2">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition-all hover:bg-slate-950/80 group/tx">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-[#F2B759] text-lg border border-white/5 shrink-0">
                      {transaction.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-base sm:text-lg truncate group-hover/tx:text-[#F2B759] transition-colors">{transaction.customerName}</p>
                      <p className="text-[10px] sm:text-xs text-white/40 truncate">{transaction.event}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                    <p className="font-black text-lg sm:text-xl text-[#F2B759]">{formatCurrency(transaction.amount)}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5 sm:mt-1">{transaction.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">ID: {transaction.id}</span>
                    {transaction.cashierName && (
                      <span className="text-[10px] text-[#F2B759]/70 font-bold uppercase tracking-widest flex items-center gap-1">
                        <User className="w-3 h-3" /> Caissier: {transaction.cashierName}
                      </span>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] border self-end ${
                      transaction.status === 'Confirmé'
                        ? 'bg-[#0A4A3C]/20 border-[#F2B759] text-[#F2B759]'
                        : transaction.status === 'En attente'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center relative z-10">
            <div className="inline-flex p-6 rounded-full bg-white/5 mb-4">
              <DollarSign className="w-12 h-12 text-white/10" />
            </div>
            <p className="text-white/50 font-medium">Aucun versement trouvé avec ces filtres.</p>
          </div>
        )}
        
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <button className="text-sm font-bold text-white/40 hover:text-[#F2B759] transition-colors uppercase tracking-widest">
            Voir tous les versements historiques →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTab;

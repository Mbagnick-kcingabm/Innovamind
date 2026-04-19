import { useState, useMemo } from 'react';
import { DollarSign, Filter, ChevronDown } from 'lucide-react';
import { Transaction, EventItem } from '../../types/dashboard';

interface TransactionsTabProps {
  transactions: Transaction[];
  events: EventItem[];
  totalRevenue: number;
  formatCurrency: (val: number) => string;
}

const TransactionsTab = ({ transactions, events, totalRevenue, formatCurrency }: TransactionsTabProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    if (selectedEvent === 'all') return transactions;
    return transactions.filter(t => t.event === selectedEvent);
  }, [transactions, selectedEvent]);

  const currentRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl shadow-black/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B759]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#F2B759]/10 rounded-2xl">
              <DollarSign className="h-6 w-6 text-[#F2B759]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Historique des Transactions</h2>
              <p className="text-sm text-white/50 mt-1">Dernières opérations financières enregistrées</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
            {/* Event Filter Dropdown */}
            <div className="relative group/filter w-full sm:w-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-[#F2B759]/70" />
              </div>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="appearance-none bg-slate-900 border border-white/10 text-white text-sm rounded-2xl pl-11 pr-10 py-3.5 outline-none focus:border-[#F2B759]/50 transition-all cursor-pointer w-full sm:min-w-[220px]"
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

            <div className="bg-[#F2B759]/10 px-6 py-3.5 rounded-2xl border border-[#F2B759]/20 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F2B759]/60">Total :</span>
              <span className="text-lg font-black text-[#F2B759]">{formatCurrency(selectedEvent === 'all' ? totalRevenue : currentRevenue)}</span>
            </div>
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
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">ID: {transaction.id}</span>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] border ${
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
            <p className="text-white/50 font-medium">Aucune transaction trouvée pour cet événement.</p>
          </div>
        )}
        
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <button className="text-sm font-bold text-white/40 hover:text-[#F2B759] transition-colors uppercase tracking-widest">
            Voir toutes les transactions historiques →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTab;


import { motion, AnimatePresence } from 'motion/react';
import { Bell } from 'lucide-react';
import { AlertItem } from '../../types/dashboard';

interface NotificationsPanelProps {
  alerts: AlertItem[];
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
}

const NotificationsPanel = ({ alerts, isNotificationsOpen, setIsNotificationsOpen }: NotificationsPanelProps) => {
  return (
    <div className="relative">
      <button 
        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        className="relative p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all group"
        aria-label="Alertes"
      >
        <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        {alerts.length > 0 && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-slate-950 rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 sm:w-96 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl z-40 overflow-hidden"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="font-bold text-lg text-white">Alertes & Notifications</h3>
                <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full font-bold text-white/70">{alerts.length} nouvelles</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl border p-4 transition-all hover:bg-white/5 ${
                      alert.variant === 'success'
                        ? 'border-[#F2B759]/20 bg-[#F2B759]/5'
                        : alert.variant === 'warning'
                        ? 'border-amber-400/20 bg-amber-500/5'
                        : 'border-sky-400/20 bg-sky-500/5'
                    }`}
                  >
                    <p className="font-bold text-sm text-white">{alert.title}</p>
                    <p className="mt-1 text-xs text-white/50 leading-relaxed">{alert.description}</p>
                  </div>
                ))}
              </div>
              <button className="w-full p-4 text-xs font-bold text-[#F2B759] bg-white/5 hover:bg-white/10 transition-all border-t border-white/10">
                Marquer tout comme lu
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPanel;

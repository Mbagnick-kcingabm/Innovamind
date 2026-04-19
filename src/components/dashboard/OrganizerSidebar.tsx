import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, Menu } from 'lucide-react';
import Logo from '../Logo';
import { MenuItem } from '../../types/dashboard';

interface OrganizerSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  organizerEmail: string;
  onLogout: () => void;
}

const OrganizerSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  menuItems,
  organizerEmail,
  onLogout,
}: OrganizerSidebarProps) => {
  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-white/10 relative z-10 backdrop-blur-md">
        <div className="p-8 pb-4">
          <div className="flex justify-center mb-6">
            <Logo className="h-12 w-auto" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#F2B759] text-center font-bold">Organisateur</p>
          <p className="text-xs font-medium text-white/50 mt-2 bg-black/20 px-3 py-1.5 rounded-full text-center truncate max-w-full">
            {organizerEmail}
          </p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-[#F2B759]/20 to-transparent text-[#F2B759] font-bold border-l-4 border-[#F2B759]' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#F2B759]' : 'text-white/50'}`} />
              <span className="text-[15px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden absolute top-0 left-0 w-full flex items-center justify-between p-5 bg-slate-950/90 backdrop-blur-md z-20 border-b border-white/10">
        <Logo className="h-8 w-auto" />
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/10 rounded-xl active:scale-95 transition">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-4/5 max-w-sm h-[100dvh] bg-slate-900 border-r border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <Logo className="h-8 w-auto" />
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-lg text-white/70">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      activeTab === item.id 
                        ? 'bg-[#F2B759]/20 text-[#F2B759] font-bold' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-6 border-t border-white/10 space-y-3">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 bg-red-500/10 transition"
                >
                  <LogOut className="w-5 h-5" /> Déconnexion
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrganizerSidebar;

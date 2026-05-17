import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { RoleType, Membre } from './types';
import { RoleSelector } from './RoleSelector';
import { RoleBadge } from './RoleBadge';

interface AjouterMembreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (membre: Omit<Membre, 'id' | 'createdAt' | 'status' | 'avatarInitials'>) => void;
}

export const AjouterMembreModal = ({ isOpen, onClose, onAdd }: AjouterMembreModalProps) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'sms' | 'email' | 'both'>('email');

  const resetForm = () => {
    setStep(1);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setRole(null);
    setInviteMethod('email');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!role) return;
    onAdd({
      firstName,
      lastName,
      phone: `+221 ${phone}`,
      email,
      role
    });
    handleClose();
  };

  const isStep1Valid = firstName.trim() !== '' && lastName.trim() !== '' && phone.trim() !== '' && email.trim() !== '' && role !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">Ajouter un membre</h3>
                <p className="text-sm text-white/50 mt-1">Étape {step} sur 3</p>
              </div>
              <button onClick={handleClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-900 w-full shrink-0">
              <div 
                className="h-full bg-[#F2B759] transition-all duration-300 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Content area with scrolling */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white">Informations personnelles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Prénom*</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#F2B759]/50 focus:outline-none transition-colors"
                          placeholder="Ex: Fatou"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Nom*</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#F2B759]/50 focus:outline-none transition-colors"
                          placeholder="Ex: Diallo"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Numéro de téléphone*</label>
                        <div className="flex">
                          <div className="bg-slate-800 border border-white/10 border-r-0 rounded-l-xl px-4 py-3 flex items-center justify-center text-white/70 font-medium">
                            +221
                          </div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-slate-900 border border-white/10 rounded-r-xl px-4 py-3 text-white focus:border-[#F2B759]/50 focus:outline-none transition-colors"
                            placeholder="77 123 45 67"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Adresse email*</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#F2B759]/50 focus:outline-none transition-colors"
                          placeholder="Ex: email@domaine.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white">Rôle attribué*</h4>
                    <RoleSelector selectedRole={role} onSelectRole={setRole} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white">Comment inviter ce membre ?</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div 
                        onClick={() => setInviteMethod('email')}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${inviteMethod === 'email' ? 'bg-[#F2B759]/10 border-[#F2B759]' : 'bg-slate-900 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`p-2.5 rounded-lg ${inviteMethod === 'email' ? 'bg-[#F2B759]/20 text-[#F2B759]' : 'bg-white/5 text-white/50'}`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${inviteMethod === 'email' ? 'text-white' : 'text-white/80'}`}>Par Email</p>
                          <p className="text-sm text-white/50">Envoyer le lien d'invitation à {email}</p>
                        </div>
                        {inviteMethod === 'email' && <CheckCircle className="w-5 h-5 text-[#F2B759] ml-auto" />}
                      </div>

                      <div 
                        onClick={() => setInviteMethod('sms')}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${inviteMethod === 'sms' ? 'bg-[#F2B759]/10 border-[#F2B759]' : 'bg-slate-900 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`p-2.5 rounded-lg ${inviteMethod === 'sms' ? 'bg-[#F2B759]/20 text-[#F2B759]' : 'bg-white/5 text-white/50'}`}>
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${inviteMethod === 'sms' ? 'text-white' : 'text-white/80'}`}>Par SMS</p>
                          <p className="text-sm text-white/50">Envoyer un texto au +221 {phone}</p>
                        </div>
                        {inviteMethod === 'sms' && <CheckCircle className="w-5 h-5 text-[#F2B759] ml-auto" />}
                      </div>

                      <div 
                        onClick={() => setInviteMethod('both')}
                        className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${inviteMethod === 'both' ? 'bg-[#F2B759]/10 border-[#F2B759]' : 'bg-slate-900 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`flex -space-x-2`}>
                           <div className={`p-2 rounded-full z-10 ${inviteMethod === 'both' ? 'bg-[#F2B759] text-slate-900' : 'bg-slate-700 text-white/70'}`}>
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className={`p-2 rounded-full ${inviteMethod === 'both' ? 'bg-[#F2B759]/80 text-slate-900' : 'bg-slate-600 text-white/70'}`}>
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="ml-2">
                          <p className={`font-bold ${inviteMethod === 'both' ? 'text-white' : 'text-white/80'}`}>Les deux</p>
                          <p className="text-sm text-white/50">Envoyer par Email et par SMS</p>
                        </div>
                        {inviteMethod === 'both' && <CheckCircle className="w-5 h-5 text-[#F2B759] ml-auto" />}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm font-medium text-blue-400 mb-2">Aperçu du message :</p>
                    <p className="text-sm text-white/80 italic">
                      "Bonjour {firstName}, vous avez été invité(e) à rejoindre l'équipe sur Innova Events en tant que {role}. Cliquez sur le lien pour confirmer votre accès : https://innova.events/invite/xyz"
                    </p>
                    <p className="text-xs text-white/40 mt-3 pt-3 border-t border-blue-500/20">
                      Le lien d'invitation expire dans 48 heures.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#F2B759] to-amber-300 rounded-full mx-auto flex items-center justify-center text-slate-900 font-bold text-3xl mb-4 shadow-lg shadow-[#F2B759]/20">
                      {firstName.charAt(0)}{lastName.charAt(0)}
                    </div>
                    <h4 className="text-2xl font-bold text-white">{firstName} {lastName}</h4>
                    <p className="text-white/50 mt-1">{email} • +221 {phone}</p>
                    <div className="mt-4 flex justify-center">
                       {role && <RoleBadge role={role} />}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/50 text-sm">Méthode d'invitation</span>
                      <span className="text-white font-medium capitalize text-sm">
                        {inviteMethod === 'both' ? 'Email + SMS' : inviteMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/50 text-sm">Statut initial</span>
                      <span className="text-amber-400 font-medium text-sm">En attente</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-xl text-white/70 hover:bg-white/5 transition flex items-center gap-2 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-white/70 hover:bg-white/5 transition font-medium"
                >
                  Annuler
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !isStep1Valid}
                  className="px-6 py-2.5 rounded-xl bg-[#F2B759] text-slate-950 hover:bg-[#F2B759]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-[#F2B759] text-slate-950 hover:bg-[#F2B759]/90 transition font-bold"
                >
                  Envoyer l'invitation
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

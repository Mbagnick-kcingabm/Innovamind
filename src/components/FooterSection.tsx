import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, Globe } from 'lucide-react';
import Logo from './Logo';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#0d1a11] pt-24 pb-12 px-6 md:px-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-g-bright/40 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Logo />
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            La plateforme de référence pour découvrir et réserver les meilleurs événements au Sénégal et en Afrique de l'Ouest.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { Icon: Facebook, name: 'Facebook' },
              { Icon: Instagram, name: 'Instagram' },
              { Icon: Youtube, name: 'Youtube' },
              { Icon: Twitter, name: 'Twitter' }
            ].map(({ Icon, name }, i) => (
              <a key={i} href="#" className="flex items-center gap-3 text-white/50 hover:text-g-bright transition-all group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-g-bright group-hover:text-dark group-hover:border-g-bright transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
            Liens Utiles
          </h4>
          <ul className="space-y-4">
            {['À propos de nous', 'Centre d\'aide', 'Blog', 'Lieux', 'Envoyez-nous un e-mail'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-white/40 hover:text-g-bright transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
            Catégories
          </h4>
          <ul className="space-y-4">
            {['Cinéma', 'Concert / Musique', 'Foire / Exposition', 'Parc de loisir'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-white/40 hover:text-g-bright transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-g-bright" />
                  {item}
                </a>
              </li>
            ))}
            <li>
              <a href="#" className="text-sm text-g-bright font-bold hover:underline">Toutes les catégories →</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest text-white mb-8 relative pb-4 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-g-bright">
            Contact
          </h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-g-bright/10 border border-g-bright/20 flex items-center justify-center text-g-bright">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-sm text-white/60">+221 33 859 96 33</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-g-bright/10 border border-g-bright/20 flex items-center justify-center text-g-bright">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm text-white/60">contact@cicesticket.com</span>
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-g-bright hover:border-g-bright/40 transition-all">
              <Globe className="w-4 h-4" />
              Français 🇫🇷
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-white/20">
          © Copyright 2026 – <span className="text-g-bright/50">Cices Events</span>
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {['Conditions d\'utilisation', 'Politique de confidentialité', 'Cookies', 'GDPR'].map(item => (
            <a key={item} href="#" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
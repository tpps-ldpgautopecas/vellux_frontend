import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, LogOut, LogIn, Plus } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

export type ViewState = 'landing' | 'admin' | 'client' | 'schedule' | 'register-vehicle';

interface NavbarProps {
  onLoginClick: () => void;
  setView: (v: ViewState) => void;
}

export function Navbar({ onLoginClick, setView }: NavbarProps) {
  const { profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMenuOpen ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/10' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => handleNavClick('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50">
          <img 
            src="https://lh3.googleusercontent.com/d/1sy5IQ85_37izUeKQrcqE1_z7YmCpc235" 
            alt="Vellux Motors" 
            className="h-10 md:h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12 text-[11px] uppercase tracking-[0.2em] text-white/60 font-black">
          <button onClick={() => setView('landing')} className="hover:text-[#F6911F] transition-colors">Vellux</button>
          <a href="#servicos" className="hover:text-[#F6911F] transition-colors">Serviços</a>
          <a href="#contato" className="hover:text-[#F6911F] transition-colors">Agendamento</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {profile ? (
            <div className="flex items-center gap-2 md:gap-4">
               <button className="relative text-white/60 hover:text-white transition-colors p-2">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
               </button>
               <div className="hidden md:block h-6 w-[1px] bg-white/10" />
               <div className="hidden md:flex items-center gap-3">
                 <button 
                  onClick={() => setView(profile.role === UserRole.ADMIN ? 'admin' : 'client')}
                  className="text-right hidden sm:block hover:opacity-80 transition-opacity"
                 >
                   <p className="text-[10px] font-bold text-white leading-none">{profile.displayName}</p>
                   <p className="text-[8px] text-[#F6911F] uppercase tracking-widest">{profile.role === UserRole.ADMIN ? 'Administrador' : 'Cliente'}</p>
                 </button>
                 <button onClick={signOut} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                   <LogOut className="w-5 h-5 text-white/40" />
                 </button>
               </div>
            </div>
          ) : (
            <div className="hidden sm:block">
              <Button variant="ghost" onClick={onLoginClick} className="!px-4 !py-2 text-[9px]">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </div>
          )}
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors z-50"
          >
            {isMenuOpen ? <Plus className="rotate-45 w-6 h-6" /> : <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
            </div>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 px-8 py-12 flex flex-col gap-8 text-center"
          >
            <button onClick={() => handleNavClick('landing')} className="text-xl font-display italic">Início</button>
            <a href="#servicos" onClick={() => setIsMenuOpen(false)} className="text-xl font-display italic">Serviços</a>
            <a href="#contato" onClick={() => setIsMenuOpen(false)} className="text-xl font-display italic">Agendamento</a>
            {profile ? (
              <>
                <button 
                  onClick={() => handleNavClick(profile.role === UserRole.ADMIN ? 'admin' : 'client')} 
                  className="text-xl font-display italic text-[#D4AF37]"
                >
                  Minha Área
                </button>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Logado como {profile.displayName}</p>
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-red-500/60 uppercase tracking-widest text-[10px] font-bold">Encerrar Sessão</button>
                </div>
              </>
            ) : (
              <Button onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>Acessar Conta</Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Plus, User, ShieldCheck } from 'lucide-react';
import { Card, Input, Button } from '../ui';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  const handleDemoAccess = (role: 'client' | 'admin' = 'client') => {
    window.dispatchEvent(new CustomEvent('auth:demo', { detail: { role } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="relative p-10 md:p-12">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
            <Plus className="rotate-45 w-6 h-6" />
          </button>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl mb-4 font-display font-black uppercase tracking-tighter">Conectar</h2>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black">Acesso Exclusivo</p>
          </div>

          <div className="space-y-6">
            <Input label="CPF" placeholder="000.000.000-00" />
            <Input label="Senha" type="password" placeholder="••••••••" />
            <Button className="w-full !py-5">Autenticar</Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[7px] uppercase tracking-[0.5em] font-bold text-white/20 bg-[#0A0A0A] px-4">Métodos de Teste</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleDemoAccess('client')}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all text-[8px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]"
              >
                <User className="w-5 h-5" />
                Demo Cliente
              </button>
              <button 
                onClick={() => handleDemoAccess('admin')}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[8px] uppercase tracking-widest font-bold text-white/60"
              >
                <ShieldCheck className="w-5 h-5" />
                Demo Admin
              </button>
            </div>
            
            <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.2em] mt-8">
              Acesso exclusivo para convidados da oficina.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

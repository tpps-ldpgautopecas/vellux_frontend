import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Card, Input, Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn({ email, password });
      } else {
        await signUp({ display_name: displayName, email, password });
      }
      onClose(); // Fecha o modal ao logar com sucesso
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao autenticar.');
    } finally {
      setLoading(false);
    }
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
          
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl mb-2 font-display font-black uppercase tracking-tighter">
              {isLogin ? 'Conectar' : 'Registrar'}
            </h2>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black">
              {isLogin ? 'Acesso Exclusivo' : 'Crie sua conta'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input 
                label="Nome Completo" 
                placeholder="Seu nome" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Senha" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" className="w-full !py-5" disabled={loading}>
              {loading ? 'Aguarde...' : (isLogin ? 'Autenticar' : 'Criar Conta')}
            </Button>
            
            <div className="text-center mt-6">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                }}
                className="text-[10px] text-white/50 hover:text-white transition-colors uppercase tracking-widest font-bold"
              >
                {isLogin ? 'Não possui conta? Registre-se' : 'Já tem uma conta? Conecte-se'}
              </button>
            </div>
            
            <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.2em] mt-8">
              Acesso protegido Vellux Motors.
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

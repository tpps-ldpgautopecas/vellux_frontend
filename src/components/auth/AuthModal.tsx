import React, { useState, useEffect } from 'react';
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
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(""); 
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!validateEmail(email)) {
      setErrorMsg("Digite um e-mail válido.");
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setErrorMsg("As senhas não coincidem.");
        setLoading(false);
        return;
      }

      const isPasswordValid = Object.values(passwordValidation).every(Boolean);
      if (!isPasswordValid) {
        setErrorMsg("A senha não atende aos requisitos.");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn({ email, password });
      } else {
        await signUp({ display_name: displayName, email, password, phoneNumber});
      }
      clearForm();
      onClose(); // Fecha o modal ao logar com sucesso

    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setErrorMsg("");
  };
  
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailBlur = (e: any) => {
    const value = e.target.value;
    if (!isLogin && value && !validateEmail(value)) {
      setEmailError("Digite um e-mail válido");
    } else {
      setEmailError("");
    }
  };

  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&.#_-]/.test(password),
    hasNoSpaces: !/\s/.test(password),
  };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;   

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validatePhone = (value) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.length === 10 || numbers.length === 11;
  };

  const handlePhoneBlur = () => {
    if (!validatePhone(phoneNumber)) {
      setPhoneError("Digite um telefone válido.");
    } else {
      setPhoneError("");
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
        <Card className="relative w-full p-8 md:p-12 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              onBlur={handleEmailBlur}
              required
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                {emailError}
              </p>
            )}

            <div className="relative">
            <Input 
              label="Senha" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-gray-500"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {!isLogin && password.length > 0 && (
              <ul className="mt-2 text-sm">
                <li className={passwordValidation.minLength ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.minLength ? "✓" : "✗"} Mínimo de 8 caracteres
                </li>

                <li className={passwordValidation.hasUppercase ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.hasUppercase ? "✓" : "✗"} Pelo menos uma letra maiúscula
                </li>

                <li className={passwordValidation.hasLowercase ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.hasLowercase ? "✓" : "✗"} Pelo menos uma letra minúscula
                </li>

                <li className={passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.hasNumber ? "✓" : "✗"} Pelo menos um número
                </li>

                <li className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.hasSpecialChar ? "✓" : "✗"} Pelo menos um caractere especial
                </li>

                <li className={passwordValidation.hasNoSpaces ? "text-green-600" : "text-red-500"}>
                  {passwordValidation.hasNoSpaces ? "✓" : "✗"} Não conter espaços
                </li>
              </ul>
            )}

           {!isLogin && (<div className="relative"><Input
              label="Confirmar Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-sm text-gray-500"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
           )}
            {!isLogin && confirmPassword.length > 0 && (
              <p
                className={`text-sm mt-1 ${
                  passwordsMatch ? "text-green-600" : "text-red-500"
                }`}
              >
                {passwordsMatch
                  ? "As senhas coincidem"
                  : "As senhas não coincidem"}
              </p>
            )}

            {!isLogin && (<Input
              label="Telefone"
              type="tel"
              placeholder="(61) 99999-9999"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              required
            />)}

            {!isLogin && phoneError && (
              <p className="text-red-500 text-sm mt-1">
                {phoneError}
              </p>
            )}
            
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

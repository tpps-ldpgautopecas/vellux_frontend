/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  Hash,
  Palette,
  CalendarDays
} from 'lucide-react';
import { Card, Button, Input } from './ui';
import { api } from '../lib/api';

export default function VehicleRegistration({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    plate: '',
    year: '',
    color: ''
  });

  const [makes, setMakes] = useState<{codigo: string, nome: string}[]>([]);
  const [models, setModels] = useState<{codigo: string, nome: string}[]>([]);

  useEffect(() => {
    fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMakes(data);
      })
      .catch(err => console.error("Erro ao carregar marcas", err));
  }, []);

  useEffect(() => {
    const selectedMake = makes.find(m => m.nome.toLowerCase() === formData.make.toLowerCase());
    if (selectedMake) {
      fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${selectedMake.codigo}/modelos`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.modelos)) setModels(data.modelos);
        })
        .catch(err => console.error("Erro ao carregar modelos", err));
    } else {
      setModels([]);
    }
  }, [formData.make, makes]);

  const handleRegister = async () => {
    if (!formData.make || !formData.model || !formData.plate) {
      setError("Por favor, preencha as informações obrigatórias.");
      return;
    }

    const plateRegex = /^[A-Za-z]{3}-?[0-9]([0-9]|[A-Za-z])[0-9]{2}$/;
    if (!plateRegex.test(formData.plate)) {
      setError("O formato da placa é inválido. Use o padrão antigo (ABC-1234) ou Mercosul (ABC1D23).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/vehicles', formData);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Erro ao cadastrar veículo:', err);
      setError(err.message || "Erro ao registrar veículo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-4">Bem-vindo à Garagem</h3>
        <p className="text-white/40 text-xs md:text-sm max-w-md mx-auto mb-12 font-light">
          Seu {formData.make} {formData.model} foi registrado com sucesso em nosso atelier. 
          Agora você pode agendar serviços e acompanhar o histórico exclusivo.
        </p>
        <Button onClick={onSuccess} className="!px-12">Ver minha Garagem</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">Novo Veículo</h3>
            <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-black">Adicionar à sua frota exclusiva</p>
          </div>
          <button onClick={onCancel} className="text-white/20 hover:text-white transition-colors">
            <Plus className="rotate-45 w-6 h-6" />
          </button>
        </div>

        <Card className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <Input 
                label="Marca" 
                placeholder="Ex: Porsche, Ferrari, BMW..." 
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                icon={<ShieldCheck className="w-4 h-4" />}
                list="makes-list"
              />
              <datalist id="makes-list">
                {makes.map(m => <option key={m.codigo} value={m.nome} />)}
              </datalist>
            </div>
            <div className="relative">
              <Input 
                label="Modelo" 
                placeholder="Ex: 911 Turbo S, M5..." 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                icon={<Car className="w-4 h-4" />}
                list="models-list"
              />
              <datalist id="models-list">
                {models.map(m => <option key={m.codigo} value={m.nome} />)}
              </datalist>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input 
              label="Placa" 
              placeholder="ABC-1234" 
              value={formData.plate}
              onChange={(e) => setFormData({...formData, plate: e.target.value})}
              icon={<Hash className="w-4 h-4" />}
            />
            <Input 
              label="Ano" 
              placeholder="2024" 
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              icon={<CalendarDays className="w-4 h-4" />}
            />
          </div>

          <Input 
            label="Cor / Acabamento" 
            placeholder="Ex: Grigio Telesto, Rosso Corsa..." 
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            icon={<Palette className="w-4 h-4" />}
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-500 text-xs">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="pt-6">
            <Button 
              className="w-full !py-6 group disabled:opacity-50" 
              onClick={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Registrando no Sistema...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Confirmar Registro
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <p className="text-[9px] text-white/20 text-center mt-4 uppercase tracking-[0.3em] font-black">
              Seu veículo passará por uma triagem digital automática.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

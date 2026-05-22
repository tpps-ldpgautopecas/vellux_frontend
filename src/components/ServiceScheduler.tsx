/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from './ui';

export default function ServiceScheduler({ onSuccess }: { onSuccess: () => void }) {
  const { profile: userProfile } = useAuth();
  const [loading] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock Vehicles
  const vehicles = [
    { id: 'CIVIC-123', make: 'Honda', model: 'Civic', plate: 'BRA-1234' },
    { id: '911-PRO', make: 'Porsche', model: '911 Carrera', plate: 'LUX-9110' }
  ];

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const handleScheduleMock = async () => {
    if (!selectedVehicle || !serviceType || !date || !time) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Success step
    }, 1500);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-b-2 border-[#F6911F] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter mb-2">Veículo</h3>
              <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Selecione para o atelier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.length > 0 ? vehicles.map(v => (
                <Card 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-6 cursor-pointer border ${selectedVehicle === v.id ? 'border-[#F6911F] bg-[#F6911F]/5' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center">
                      <Car className={`w-5 h-5 ${selectedVehicle === v.id ? 'text-[#F6911F]' : 'text-white/20'}`} />
                    </div>
                    <div>
                      <h4 className="font-display font-black uppercase tracking-tighter text-lg">{v.make} {v.model}</h4>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">{v.plate}</p>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="col-span-full p-8 border border-dashed border-white/10 rounded-sm text-center">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Nenhum veículo encontrado</p>
                  <Button variant="outline" className="!py-2 !px-4">Adicionar Primeiro Veículo</Button>
                </div>
              )}
            </div>

            {selectedVehicle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button className="w-full flex justify-between group" onClick={() => setStep(2)}>
                  Próximo Passo
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setStep(1)} className="text-white/20 hover:text-white transition-colors">
                <Plus className="rotate-45 w-6 h-6" />
              </button>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter mb-1">Agendamento</h3>
                <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Escolha sua janela de excelência</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar Visual */}
              <Card className="p-6 border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 italic">Maio 2026</h4>
                  <div className="flex gap-2">
                    <button className="w-6 h-6 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight className="w-3 h-3 rotate-180" /></button>
                    <button className="w-6 h-6 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRight className="w-3 h-3" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                    <span key={d} className="text-[8px] font-black text-white/20">{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const isBooked = [1, 2, 5, 12, 15, 20, 22].includes(day);
                    const isSelected = date === `2026-05-${day.toString().padStart(2, '0')}`;
                    
                    return (
                      <button
                        key={day}
                        disabled={isBooked}
                        onClick={() => setDate(`2026-05-${day.toString().padStart(2, '0')}`)}
                        className={`aspect-square flex items-center justify-center text-[10px] font-black transition-all border ${
                          isSelected 
                            ? 'bg-[#F6911F] border-[#F6911F] text-black scale-110 shadow-lg z-10' 
                            : isBooked 
                              ? 'text-white/5 border-transparent cursor-not-allowed line-through' 
                              : 'text-white/40 border-white/5 hover:border-[#F6911F]/40'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex items-center gap-6 justify-center">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#F6911F]" />
                      <span className="text-[8px] uppercase tracking-widest font-black text-white/20">Selecionado</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 border border-white/5" />
                      <span className="text-[8px] uppercase tracking-widest font-black text-white/20">Disponível</span>
                   </div>
                </div>
              </Card>

              {/* Details and Slots */}
              <div className="space-y-6">
                <Input 
                  label="Tipo de Serviço" 
                  placeholder="Ex: Revisão, Performance..." 
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  icon={<Wrench className="w-4 h-4" />}
                />

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block">Horários Disponíveis</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['08:00', '10:00', '13:30', '15:00', '17:30'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setTime(t)}
                        className={`py-3 border text-[10px] font-mono font-black transition-all ${
                          time === t 
                            ? 'bg-[#F6911F]/10 border-[#F6911F] text-[#F6911F]' 
                            : 'bg-white/1 border-white/5 text-white/30 hover:border-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    className="w-full !py-6 group disabled:opacity-50 relative overflow-hidden" 
                    onClick={handleScheduleMock}
                    disabled={isSubmitting || !date || !time || !serviceType}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 justify-center">
                        <ShieldCheck className="w-5 h-5 text-black/50" />
                        Confirmar Agendamento
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-4">Agendado</h3>
            <p className="text-white/40 text-xs md:text-sm max-w-md mx-auto mb-12 font-light">
              Sua solicitação foi enviada. Você receberá uma confirmação em breve.
              Confira seu Google Calendar para o lembrete.
            </p>
            <Button onClick={onSuccess} variant="outline" className="!px-12">Voltar à Garagem</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

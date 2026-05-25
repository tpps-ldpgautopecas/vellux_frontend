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
  ChevronLeft,
  Plus,
  StickyNote
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input } from './ui';
import { api } from '../lib/api';

const SERVICOS_DISPONIVEIS = [
  "Revisão & Mecânica",
  "Suspensão & Freios",
  "Diagnóstico Bosch",
  "Estética & Pintura",
  "Câmbio & Transmissão",
  "Climatização Ozônio"
];

// O "Hoje" Dinâmico
const dataAtual = new Date();
const HOJE_REAL = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());

export default function ServiceScheduler({ onSuccess }: { onSuccess: () => void }) {
  const { profile: userProfile } = useAuth();
  const [loading] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controle do calendário (Inicia no mês real do usuário)
  const [mesAtual, setMesAtual] = useState(new Date(HOJE_REAL.getFullYear(), HOJE_REAL.getMonth(), 1));

  // Mock Vehicles (Futuramente virá da API)
  const vehicles = [
    { id: '1', make: 'Toyota', model: 'Corolla', plate: 'ABC1D23' },
    { id: '2', make: 'Honda', model: 'Civic', plate: 'XYZ9K88' }, 
  ];

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>(SERVICOS_DISPONIVEIS[0]);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSchedule = async () => {
    if (!selectedVehicle || !serviceType || !date || !time) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/api/appointments', {
        vehicle_id: parseInt(selectedVehicle),
        service_type: serviceType,
        date: date,
        time: time,
        notes: notes
      });

      setStep(3); // Sucesso
    } catch (err: any) {
      console.error(err);
      // Alterado para capturar a mensagem do fetch nativo perfeitamente
      setError(err.message || "Erro ao confirmar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica de Renderização do Calendário
  const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const primeiroDiaSemana = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay();
  
  const nomeDoMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const diasVazios = Array.from({ length: primeiroDiaSemana }, (_, i) => i);
  const diasDoMes = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  const irParaMesAnterior = () => {
    if (mesAtual.getFullYear() > HOJE_REAL.getFullYear() || (mesAtual.getFullYear() === HOJE_REAL.getFullYear() && mesAtual.getMonth() > HOJE_REAL.getMonth())) {
        setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
    }
  };

  const irParaProximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-b-2 border-[#F6911F] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 max-w-3xl mx-auto" // <-- Adicionado max-w-3xl e mx-auto aqui!
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter mb-2">Veículo</h3>
              <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Selecione para o atelier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* <-- Voltou para grid-cols-2 */}
              {vehicles.length > 0 ? vehicles.map(v => (
                <Card 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-6 cursor-pointer border ${selectedVehicle === v.id ? 'border-[#F6911F] bg-[#F6911F]/5' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center shrink-0">
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end mt-8">
                <Button className="w-full md:w-auto flex justify-between gap-4 group px-12" onClick={() => setStep(2)}>
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

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Calendar Visual */}
              <Card className="p-6 border-white/5 bg-white/[0.01] lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs uppercase tracking-widest font-black text-white/60 italic">{nomeDoMes}</h4>
                  <div className="flex gap-2">
                    <button 
                        onClick={irParaMesAnterior}
                        disabled={mesAtual.getFullYear() <= HOJE_REAL.getFullYear() && mesAtual.getMonth() <= HOJE_REAL.getMonth()}
                        className="w-8 h-8 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={irParaProximoMes}
                        className="w-8 h-8 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-black text-white/30">{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {diasVazios.map(i => <div key={`empty-${i}`} />)}

                  {diasDoMes.map(day => {
                    const dataRenderizada = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), day);
                    const dateString = `${mesAtual.getFullYear()}-${(mesAtual.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    
                    const isPassado = dataRenderizada < HOJE_REAL;
                    // Lógica para bloquear apenas os dias passados (sem os chumbados que tínhamos no teste)
                    const isDisabled = isPassado;

                    const isSelected = date === dateString;
                    
                    return (
                      <button
                        key={day}
                        disabled={isDisabled}
                        onClick={() => setDate(dateString)}
                        className={`aspect-square flex items-center justify-center text-xs font-black transition-all border ${
                          isSelected 
                            ? 'bg-[#F6911F] border-[#F6911F] text-black scale-110 shadow-lg z-10 rounded-sm' 
                            : isDisabled 
                              ? 'text-white/10 border-transparent cursor-not-allowed' 
                              : 'text-white/60 border-white/5 hover:border-[#F6911F]/40 rounded-sm'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Details and Slots */}
              <div className="space-y-6 lg:col-span-3">
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block">Tipo de Serviço</label>
                    <div className="relative">
                        <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        <select 
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full bg-black border border-white/10 text-white p-4 pl-12 appearance-none focus:border-[#F6911F] outline-none transition-colors rounded-none"
                        >
                        {SERVICOS_DISPONIVEIS.map(servico => (
                            <option key={servico} value={servico}>{servico}</option>
                        ))}
                        </select>
                    </div>
                    </div>

                    <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 block">Horários Disponíveis</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['08:00', '10:00', '13:30', '15:00', '17:30'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTime(t)}
                            className={`py-3 border text-[10px] md:text-xs font-mono font-black transition-all ${
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
                </div>

                {/* Área de Notas */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 flex items-center gap-2">
                    <StickyNote className="w-3 h-3" />
                    Observações do Cliente (Opcional)
                  </label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Descreva detalhes como barulhos estranhos, preferência por peças, ou observações sobre o veículo..."
                    className="w-full bg-white/5 border border-white/10 text-white p-4 text-sm focus:border-[#F6911F] outline-none transition-colors min-h-[100px] resize-y rounded-sm font-light"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full !py-6 group disabled:opacity-50 relative overflow-hidden text-lg" 
                    onClick={handleSchedule}
                    disabled={isSubmitting || !date || !time || !serviceType}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        A Processar...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 justify-center">
                        <ShieldCheck className="w-6 h-6 text-black/50" />
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
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4">Agendado com Sucesso</h3>
            <p className="text-white/40 text-sm md:text-base max-w-md mx-auto mb-12 font-light">
              O seu serviço foi marcado e o evento foi criado na agenda oficial da Vellux Motors!
            </p>
            <Button onClick={onSuccess} variant="outline" className="!px-12 !py-4 text-sm">Voltar à Garagem</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
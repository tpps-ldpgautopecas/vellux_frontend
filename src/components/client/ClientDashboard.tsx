import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Plus, Bell, ArrowUpRight, Clock, ChevronRight, ShieldCheck, CheckCircle2, Activity, Zap, MapPin } from 'lucide-react';
import { Card, Button } from '../ui';
import { SectionHeading } from '../layout/SectionHeading';
import { ServiceHistory } from './ServiceHistory';
import { ServiceStatus } from '../../types';

interface ClientDashboardProps {
  setView: (view: any) => void;
}

export function ClientDashboard({ setView }: ClientDashboardProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Mock active service for transparency demonstration
  const hasActiveService = true;

  return (
    <div className="py-32 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
         <SectionHeading title={selectedVehicle ? (selectedService ? 'Serviço' : 'Histórico') : 'Garagem'} subtitle="Acesso Cliente" />
         {(selectedVehicle || selectedService) && (
           <Button variant="ghost" onClick={() => selectedService ? setSelectedService(null) : setSelectedVehicle(null)} className="!px-4">
             <ArrowUpRight className="rotate-[225deg] w-4 h-4 mr-2" />
             Voltar
           </Button>
         )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedVehicle && (
          <motion.div 
            key="garage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
                <Card 
                   onClick={() => setSelectedVehicle('CIVIC-123')}
                   className="border-[#F6911F]/20 bg-[#F6911F]/5 flex flex-col items-center justify-center py-10 md:py-16 group cursor-pointer hover:bg-[#F6911F]/10 transition-colors"
                 >
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm border border-[#F6911F]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <Car className="w-8 h-8 md:w-10 md:h-10 text-[#F6911F]" />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tighter mb-2 leading-none text-center px-4">Honda Civic</h3>
                   <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-[#F6911F] mb-6">BRA-1234</p>
                   <Button variant="outline" className="!px-6 !py-2">Ver Detalhes</Button>
                </Card>
               <Card 
                  onClick={() => setView('register-vehicle')}
                  className="flex flex-col items-center justify-center py-16 border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-sm border border-dashed border-white/10 flex items-center justify-center mb-4 group-hover:border-[#F6911F]/40 transition-colors">
                    <Plus className="w-8 h-8 text-white/20 group-hover:text-[#F6911F] transition-colors" />
                  </div>
                  <p className="text-xs uppercase tracking-widest font-black text-white/30 group-hover:text-white">Adicionar Veículo</p>
               </Card>
            </div>

            <div className="pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter">Acompanhamento</h3>
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">Serviços em tempo real</p>
                  </div>
                  <Button onClick={() => setView('schedule')} variant="outline" className="w-full md:w-auto !px-4 !py-2">Agendar Novo</Button>
                </div>
              <ServiceHistory />
            </div>

            <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/10 p-6 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <Bell className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Próxima Manutenção</h3>
              </div>
              <p className="text-sm md:text-base text-white/60 mb-8 font-light leading-relaxed">
                Sua próxima revisão está agendada para <strong className="text-white font-bold">15 de Junho de 2026</strong>. 
                Recomendamos agendar a vistoria prévia pelo menos 3 dias antes considerando a alta demanda sazonal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setView('schedule')} className="w-full sm:w-auto !px-8 !py-3">Agendar Agora</Button>
                <Button variant="ghost" className="w-full sm:w-auto !px-8 !py-3 text-[#D4AF37]">Mudar Data</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {selectedVehicle && !selectedService && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {[
              { id: '1', date: '15 Mai 2024', title: 'Revisão Sistemática', status: ServiceStatus.COMPLETED, type: 'Mecânica' },
              { id: '2', date: '22 Abr 2024', title: 'Troca de Óleo e Filtros', status: ServiceStatus.COMPLETED, type: 'Preventiva' },
              { id: '3', date: '10 Jan 2024', title: 'Alinhamento e Balanceamento', status: ServiceStatus.COMPLETED, type: 'Mecânica' },
            ].map(item => (
              <Card 
                key={item.id} 
                onClick={() => setSelectedService(item.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 cursor-pointer hover:border-[#D4AF37]/30 transition-all group gap-6"
              >
                <div className="flex gap-4 md:gap-6 items-center text-left">
                  <div className="w-12 h-12 shrink-0 rounded-sm bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                    <Clock className="w-5 h-5 text-white/20 group-hover:text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] text-white/30 mb-1 uppercase tracking-widest font-black leading-none">{item.date} — {item.type}</p>
                    <h4 className="text-lg md:text-xl font-display font-black uppercase tracking-tighter leading-tight">{item.title}</h4>
                  </div>
                </div>
                <div className="flex sm:block justify-start shrink-0">
                  <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-[#D4AF37] transition-all hidden sm:block" />
                  <span className="sm:hidden text-[9px] uppercase font-black text-[#D4AF37] border-t border-white/5 pt-4 w-full block">Ver Relatório →</span>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {selectedService && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 md:p-12">
               <div className="flex flex-col md:flex-row justify-between gap-10 mb-12 md:mb-16 pb-12 border-b border-white/5">
                  <div>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-black mb-4">Relatório Técnico</p>
                    <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-6 leading-none">Revisão Sistemática</h3>
                    <div className="flex flex-wrap gap-4">
                       <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 font-bold rounded-full">Concluído</span>
                       <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-white/5 text-white/40 font-bold rounded-full">ID: #SRV-1025</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                     <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/20 mb-2 font-black">Responsável</p>
                     <h4 className="text-lg md:text-xl font-display font-black uppercase tracking-tighter">Téc. Marcos Aurelio</h4>
                     <p className="text-[9px] text-[#F6911F] mt-1 uppercase font-bold tracking-widest">Especialista High-Performance</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-12 mb-16">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#95191C]" /> Procedimentos Realizados
                    </h4>
                    <ul className="space-y-4">
                      {['Análise computadorizada do motor', 'Troca de buchas da suspensão dianteira', 'Substituição de pastilhas de cerâmica', 'Ajuste de geometria 3D'].map(p => (
                        <li key={p} className="flex gap-4 text-sm text-white/50 items-start">
                           <CheckCircle2 className="w-4 h-4 text-[#F6911F] shrink-0 mt-0.5" />
                           {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                     <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-6 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#F6911F]" /> Observações do Especialista
                    </h4>
                    <p className="text-sm text-white/40 leading-relaxed italic border-l border-white/10 pl-6 py-2">
                      "Veículo apresenta excelente estado geral. Notamos um leve desgaste irregular no pneu traseiro direito, possivelmente devido a pressão inadequada. Recomendamos calibragem semanal a 32 PSI."
                    </p>
                  </div>
               </div>

               <div className="p-8 bg-[#F6911F]/5 border border-[#F6911F]/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Investimento de Manutenção</p>
                    <p className="text-3xl font-display italic tracking-tight">R$ 4.250,80</p>
                  </div>
                  <Button variant="outline" className="!px-6 !py-2">Download NF-e</Button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

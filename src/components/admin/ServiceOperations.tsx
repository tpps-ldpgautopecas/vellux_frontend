import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle,
  Car,
  ChevronRight,
  MoreVertical,
  UserPlus,
  Plus,
  Search,
  X,
  Edit,
  ClipboardList
} from 'lucide-react';
import { Card, Button } from '../ui';
import { ServiceStatus } from '../../types';
import { CheckInForm } from './CheckInForm';
import { TechnicalReportForm } from './TechnicalReportForm';
import { api } from '../../lib/api';

interface Mechanic {
  id: string;
  display_name: string;
}

interface OperationService {
  id: string;
  client: string;
  car: string;
  plate: string;
  type: string;
  status: ServiceStatus;
  mechanics: string[];
  startTime?: string;
  diagnostics?: string;
  parts?: string[];
}

export function ServiceOperations() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<OperationService[]>([]);
  const [specialists, setSpecialists] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/admin');
      setServices(res || []);
    } catch (err) {
      console.error('Erro ao buscar serviços', err);
    }
  };

  const fetchMechanics = async () => {
    try {
      const res = await api.get('/auth/mechanics');
      setSpecialists(res || []);
    } catch (err) {
      console.error('Erro ao buscar mecânicos', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchMechanics();
    setLoading(false);
  }, []);

  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<OperationService | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleAssignSpecialist = async (serviceId: string, mechanicId: string) => {
    try {
      await api.post(`/services/${serviceId}/assign`, { mechanicId });
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error(err);
    }
  };

  const startService = async (id: string) => {
    try {
      await api.post(`/services/${id}/start`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const completeService = (id: string) => {
    // handled by TechnicalReportForm for now
    fetchServices();
  };

  const handleNewCheckIn = async (data: any) => {
    try {
      await api.post('/services/checkin', {
        appointmentId: data.id,
        title: data.type,
        description: data.observations
      });
      setShowCheckIn(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredServices = services.filter(s => 
    s.car.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pending = filteredServices.filter(s => s.status === ServiceStatus.PENDING);
  const active = filteredServices.filter(s => s.status === ServiceStatus.IN_PROGRESS || s.status === ServiceStatus.AWAITING_PARTS);

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {showCheckIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-0 sm:p-12 overflow-y-auto"
          >
            <div className="w-full max-w-4xl min-h-screen sm:min-h-0 overflow-y-auto custom-scrollbar">
               <CheckInForm 
                 onCancel={() => setShowCheckIn(false)}
                 onSave={handleNewCheckIn}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Search and Add */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full max-w-xl">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
           <input 
             type="text"
             placeholder="Buscar serviço por carro, placa ou cliente..."
             className="w-full bg-white/2 border border-white/5 py-4 pl-12 pr-6 text-[10px] uppercase tracking-widest focus:border-yellow-500/40 outline-none transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <Button onClick={() => setShowCheckIn(true)} className="w-full md:w-auto !bg-yellow-500 !text-black !py-4 font-black text-[10px] uppercase tracking-[0.2em] shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Novo Check-in
        </Button>
      </div>

      {/* 1. Fila de Entrada (Check-in) */}
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-2 h-8 bg-yellow-500" />
           <h3 className="text-2xl font-display font-black uppercase tracking-tighter italic">Fila de Entrada <span className="text-white/20 ml-2">({pending.length})</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.length > 0 ? pending.map((s) => (
            <Card key={s.id} className="p-6 sm:p-8 bg-white/[0.01] hover:border-yellow-500/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/2 border border-white/5 flex items-center justify-center">
                    <Car className="w-6 h-6 text-white/20 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-black uppercase tracking-tighter italic">{s.car}</h4>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{s.plate} • {s.client}</p>
                  </div>
                </div>
                <button className="text-white/20 p-2"><MoreVertical className="w-4 h-4" /></button>
              </div>
              
              <div className="bg-black/40 border border-white/5 p-4 mb-6">
                <p className="text-[8px] uppercase tracking-widest font-black text-white/20 mb-2">Serviço Agendado</p>
                <p className="text-[10px] uppercase font-bold text-white/80">{s.type}</p>
              </div>

              <div className="flex gap-3 relative">
                 <Button onClick={() => startService(s.id)} className="flex-1 !bg-yellow-600 !text-black !py-4 font-black text-[10px] uppercase tracking-[0.2em] group/btn">
                   <Play className="w-3 h-3 mr-2 fill-current" /> Iniciar Serviço
                 </Button>
                 <div className="relative">
                   <Button 
                     variant="outline" 
                     onClick={() => setAssigningTo(assigningTo === s.id ? null : s.id)}
                     className={`shrink-0 !p-4 border-white/10 ${s.mechanics.length > 0 ? 'border-yellow-500/50 text-yellow-500' : ''}`}
                   >
                     <UserPlus className="w-4 h-4" />
                   </Button>
                   
                   <AnimatePresence>
                     {assigningTo === s.id && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute bottom-full right-0 mb-4 w-48 bg-[#0a0a0a] border border-white/10 p-2 z-20 shadow-2xl"
                       >
                         <div className="text-[7px] uppercase tracking-widest font-black text-white/20 mb-2 px-2 pb-2 border-b border-white/5">Atribuir Especialistas</div>
                         <div className="space-y-1">
                           {specialists.map(m => {
                             const isSelected = s.mechanics.includes(m.display_name);
                             return (
                               <button
                                 key={m.id}
                                 onClick={() => handleAssignSpecialist(s.id, m.id)}
                                 className={`w-full flex items-center justify-between px-3 py-2 text-[10px] uppercase font-bold transition-colors ${isSelected ? 'bg-yellow-500 text-black' : 'text-white/40 hover:bg-white/5'}`}
                               >
                                 {m.display_name}
                                 {isSelected && <CheckCircle2 className="w-3 h-3" />}
                               </button>
                             );
                           })}
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
              </div>
            </Card>
          )) : (
            <div className="md:col-span-2 py-16 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-20">
              <Car className="w-8 h-8 mb-4 border border-white/10 p-2" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black">Nenhum veículo aguardando entrada</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Operações Ativas */}
      <section>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-2 h-8 bg-[#F6911F]" />
           <h3 className="text-2xl font-display font-black uppercase tracking-tighter italic">Execução Técnica <span className="text-white/20 ml-2">({active.length})</span></h3>
        </div>
        
        <div className="space-y-4">
          {active.map((s) => (
            <Card 
              key={s.id} 
              onClick={() => setSelectedService(s)}
              className="p-6 flex flex-col md:flex-row items-center justify-between gap-8 hove:bg-white/[0.04] transition-all border-white/5 cursor-pointer group"
            >
               <div className="flex items-center gap-6 w-full md:w-auto">
                 <div className="relative">
                    <div className="w-14 h-14 bg-[#F6911F]/10 border border-[#F6911F]/20 flex items-center justify-center">
                      <Wrench className="w-7 h-7 text-[#F6911F] animate-pulse" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black" />
                 </div>
                 <div>
                    <h4 className="text-xl font-display font-black uppercase tracking-tighter italic leading-none mb-2">{s.car}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-black text-white/40">{s.plate}</span>
                      <span className="text-white/10">•</span>
                      <span className="text-[9px] uppercase font-black text-[#F6911F]">{s.type}</span>
                    </div>
                 </div>
               </div>

               <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-none border-white/5 pt-6 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Time</p>
                    <div className="flex -space-x-2 lg:justify-end">
                      {s.mechanics.length > 0 ? s.mechanics.map(m => (
                        <div key={m} className="w-7 h-7 rounded-full bg-white/5 border border-black flex items-center justify-center text-[8px] font-black uppercase text-white/40">
                          {m[0]}
                        </div>
                      )) : <span className="text-[8px] text-white/10 uppercase font-bold italic">Pendente</span>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Duração</p>
                    <div className="flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-tighter">
                       <Clock className="w-3 h-3 text-white/20" /> {s.startTime}
                    </div>
                  </div>

                  <Button variant="ghost" className="!p-2 sm:!p-3 text-white/20 hover:text-white">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
               </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Panorama / Detail Modal */}
      <AnimatePresence>
        {selectedService && !showReportForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#080808] border border-white/10 overflow-hidden z-10 shadow-2xl"
            >
              <div className="grid md:grid-cols-5 h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Side Panel: Identity */}
                <div className="md:col-span-2 p-8 border-b md:border-b-0 md:border-r border-white/5 space-y-8 bg-white/[0.01]">
                   <div className="flex items-center justify-between">
                      <span className="text-yellow-500 text-[10px] uppercase tracking-[0.4em] font-black">Panorama Operacional</span>
                      <Wrench className="w-4 h-4 text-white/10" />
                   </div>

                   <div className="space-y-6">
                      <div className="w-20 h-20 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                         <Car className="w-10 h-10 text-white/10" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-display font-black uppercase tracking-tighter italic text-white leading-tight">{selectedService.car}</h3>
                        <div className="flex gap-4 mt-2">
                          <p className="text-yellow-500 text-[10px] uppercase tracking-widest font-black">{selectedService.plate}</p>
                          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{selectedService.client}</p>
                        </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 space-y-6">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Início da Operação</p>
                        <p className="text-sm font-mono text-white/60">{selectedService.startTime || '--:--'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Status Atual</p>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                           <span className="text-[10px] uppercase font-black text-white">Em Execução Técnica</span>
                        </div>
                      </div>
                   </div>

                   <div className="pt-8">
                     <Button variant="ghost" onClick={() => setSelectedService(null)} className="w-full !py-4 text-[10px] border border-white/10 group-hover:border-white/20 transition-all">
                       Voltar ao Painel
                     </Button>
                   </div>
                </div>

                {/* Main Content: Execution Details */}
                <div className="md:col-span-3 p-8 md:p-12 space-y-10">
                   <div className="space-y-8">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-4">Escopo do Serviço</h4>
                        <div className="p-4 bg-white/2 border border-white/5 space-y-4">
                           <p className="text-base font-bold text-white uppercase italic">{selectedService.type}</p>
                           {selectedService.diagnostics && (
                             <div className="pt-4 border-t border-white/5">
                               <p className="text-[8px] uppercase tracking-widest text-[#F6911F] font-black mb-2">Diagnóstico Atual</p>
                               <p className="text-[10px] text-white/60 leading-relaxed italic">{selectedService.diagnostics}</p>
                             </div>
                           )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-4">Equipe Alocada</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedService.mechanics.map((m, i) => (
                            <div key={i} className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] uppercase font-black tracking-widest">
                              {m}
                            </div>
                          ))}
                          {selectedService.mechanics.length === 0 && (
                            <span className="text-[9px] uppercase font-bold text-white/20 italic">Sem especialistas atribuídos</span>
                          )}
                        </div>
                      </div>

                      {selectedService.parts && selectedService.parts.length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-4">Peças Alocadas</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedService.parts.map((p, i) => (
                              <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[8px] uppercase font-bold text-white/40">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-10 border-t border-white/5">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[9px] uppercase tracking-widest font-black text-white/40">Controles de Operação</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <Button 
                             onClick={() => setShowReportForm(true)}
                             className="!py-5 !bg-green-600 !text-black text-[10px] font-black uppercase tracking-[0.2em]"
                           >
                             <CheckCircle2 className="w-4 h-4 mr-2" /> Finalizar & Relatório
                           </Button>
                           <Button variant="ghost" className="!py-5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 cursor-not-allowed">
                             <Edit className="w-3 h-3 mr-2" /> Editar Escopo
                           </Button>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all group"
              >
                <X className="w-5 h-5 text-white/40 group-hover:text-black" />
              </button>
            </motion.div>
          </div>
        )}

        {selectedService && showReportForm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               onClick={() => setShowReportForm(false)}
               className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
             />
             <div className="relative w-full max-w-4xl z-10">
               <TechnicalReportForm 
                 serviceId={selectedService.id}
                 onCancel={() => setShowReportForm(false)}
                 onSave={(data) => {
                   console.log('Report saved:', data);
                   completeService(selectedService.id);
                   setShowReportForm(false);
                   setSelectedService(null);
                 }}
               />
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

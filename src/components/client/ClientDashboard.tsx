import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Plus, Bell, ArrowUpRight, Clock, ChevronRight, ShieldCheck, CheckCircle2, Activity, Zap, MapPin } from 'lucide-react';
import { Card, Button } from '../ui';
import { SectionHeading } from '../layout/SectionHeading';
import { ServiceHistory } from './ServiceHistory';
import { ServiceStatus, Vehicle, MaintenanceService } from '../../types';
import { api } from '../../lib/api';

interface ClientDashboardProps {
  setView: (view: any) => void;
}

export function ClientDashboard({ setView }: ClientDashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<MaintenanceService[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vehiclesData, servicesData, apptsData] = await Promise.all([
          api.get('/vehicles'),
          api.get('/services'),
          api.get('/appointments/client').catch(() => []) // Catch in case endpoint errors
        ]);
        setVehicles(vehiclesData);
        setServices(servicesData);
        setAppointments(apptsData);
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getServiceForDetail = (serviceId: string) => {
    return services.find(s => s.id === serviceId) || null;
  };
  
  const detailData = selectedService ? getServiceForDetail(selectedService) : null;

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
              {vehicles.map(vehicle => (
                <Card 
                   key={vehicle.id}
                   onClick={() => setSelectedVehicle(vehicle.id)}
                   className="border-[#F6911F]/20 bg-[#F6911F]/5 flex flex-col items-center justify-center py-10 md:py-16 group cursor-pointer hover:bg-[#F6911F]/10 transition-colors"
                 >
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm border border-[#F6911F]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <Car className="w-8 h-8 md:w-10 md:h-10 text-[#F6911F]" />
                   </div>
                   <h3 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tighter mb-2 leading-none text-center px-4">{vehicle.make} {vehicle.model}</h3>
                   <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-[#F6911F] mb-6">{vehicle.plate}</p>
                   <Button variant="outline" className="!px-6 !py-2">Ver Detalhes</Button>
                </Card>
              ))}
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
              <ServiceHistory services={services} />
            </div>

            {appointments.length > 0 && (
              <div className="pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter">Solicitações</h3>
                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">Status dos seus agendamentos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((app: any) => (
                    <Card key={app.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4" style={{ 
                      borderLeftColor: app.status === 'confirmed' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'
                    }}>
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-1">{app.service_type}</h4>
                        <p className="text-[10px] text-white/40 font-mono">{app.car} - {app.plate} | {new Date(app.date).toLocaleDateString('pt-BR')} {new Date(app.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-sm ${
                          app.status === 'confirmed' ? 'bg-[#10b981]/10 text-[#10b981]' : 
                          app.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 
                          'bg-[#f59e0b]/10 text-[#f59e0b]'
                        }`}>
                          {app.status === 'confirmed' ? 'Aceito' : app.status === 'rejected' ? 'Não Aceito' : 'Em Análise'}
                        </span>
                        {app.status === 'rejected' && app.rejection_reason && (
                          <p className="text-[10px] text-red-400/80 mt-2 font-mono max-w-[250px] truncate" title={app.rejection_reason}>
                            Motivo: {app.rejection_reason}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}


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
            {services.filter(s => s.vehicleId === selectedVehicle).map(item => (
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
                    <p className="text-[9px] md:text-[10px] text-white/30 mb-1 uppercase tracking-widest font-black leading-none">{new Date(item.scheduledDate).toLocaleDateString('pt-BR')} — {item.status}</p>
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
            {detailData && (
              <Card className="p-6 md:p-12">
                 <div className="flex flex-col md:flex-row justify-between gap-10 mb-12 md:mb-16 pb-12 border-b border-white/5">
                    <div>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-black mb-4">Relatório Técnico</p>
                      <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-6 leading-none">{detailData.title}</h3>
                      <div className="flex flex-wrap gap-4">
                         <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 font-bold rounded-full">{detailData.status}</span>
                         <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-white/5 text-white/40 font-bold rounded-full">ID: #SRV-{detailData.id}</span>
                      </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#95191C]" /> Histórico de Procedimentos
                      </h4>
                      <ul className="space-y-4">
                        {detailData.history && detailData.history.length > 0 ? detailData.history.map((h, i) => (
                          <li key={i} className="flex gap-4 text-sm text-white/50 items-start">
                             <CheckCircle2 className="w-4 h-4 text-[#F6911F] shrink-0 mt-0.5" />
                             <div>
                               <p className="text-[10px] uppercase font-bold text-white/30 mb-1">{new Date(h.timestamp).toLocaleString('pt-BR')} - {h.authorId || 'Sistema'}</p>
                               <p>{h.message}</p>
                             </div>
                          </li>
                        )) : <li className="text-sm text-white/30">Nenhum histórico registrado.</li>}
                      </ul>
                    </div>

                    {detailData.report ? (
                      <div className="space-y-8">
                         <div>
                           <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#F6911F]" /> Laudo Técnico Emitido
                           </h4>
                           <div className="p-4 bg-white/5 border border-white/10 space-y-4">
                             <div>
                               <p className="text-[8px] uppercase font-black tracking-widest text-[#F6911F] mb-1">Diagnóstico</p>
                               <p className="text-sm text-white/60 italic whitespace-pre-wrap">{detailData.report.diagnostics || 'Não informado.'}</p>
                             </div>
                             {detailData.report.procedures && detailData.report.procedures.length > 0 && (
                               <div className="pt-4 border-t border-white/5">
                                 <p className="text-[8px] uppercase font-black tracking-widest text-[#F6911F] mb-2">Procedimentos Adotados</p>
                                 <ul className="list-disc pl-4 text-sm text-white/60 space-y-1">
                                   {detailData.report.procedures.map((proc, idx) => (
                                      <li key={idx}>{proc}</li>
                                   ))}
                                 </ul>
                               </div>
                             )}
                             {detailData.report.parts && detailData.report.parts.length > 0 && (
                               <div className="pt-4 border-t border-white/5">
                                 <p className="text-[8px] uppercase font-black tracking-widest text-[#F6911F] mb-2">Peças Substituídas</p>
                                 <ul className="text-sm text-white/60 space-y-1">
                                   {detailData.report.parts.map((p, idx) => (
                                      <li key={idx} className="flex justify-between">
                                        <span>{p.name} <span className="text-white/30">({p.brand})</span></span>
                                        <span className="font-mono text-white/40">x{p.quantity || p.qty}</span>
                                      </li>
                                   ))}
                                 </ul>
                               </div>
                             )}
                             {detailData.report.observations && (
                               <div className="pt-4 border-t border-white/5">
                                 <p className="text-[8px] uppercase font-black tracking-widest text-[#F6911F] mb-1">Observações</p>
                                 <p className="text-sm text-white/60 whitespace-pre-wrap">{detailData.report.observations}</p>
                               </div>
                             )}
                          </div>
                         </div>
                      </div>
                    ) : (
                      <div>
                         <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-6 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#F6911F]" /> Detalhes do Serviço
                        </h4>
                        <p className="text-sm text-white/40 leading-relaxed italic border-l border-white/10 pl-6 py-2">
                          {detailData.description || 'Sem descrição adicional.'}
                        </p>
                      </div>
                    )}
                 </div>

                 <div className="p-8 bg-[#F6911F]/5 border border-[#F6911F]/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Investimento de Manutenção</p>
                      <p className="text-3xl font-display italic tracking-tight">R$ {detailData.budget ? Number(detailData.budget).toLocaleString('pt-BR') : '0,00'}</p>
                    </div>
                    <Button variant="outline" className="!px-6 !py-2">Download NF-e</Button>
                 </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

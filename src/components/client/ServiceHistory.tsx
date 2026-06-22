import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Wrench, User, ChevronRight, Activity, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui';
import { MaintenanceService, ServiceStatus } from '../../types';

interface ServiceHistoryProps {
  services: MaintenanceService[];
  setSelectedService?: (id: string) => void;
}

export function ServiceHistory({ services, setSelectedService }: ServiceHistoryProps) {
  const activeServices = services.filter(s => s.status === ServiceStatus.IN_PROGRESS || s.status === ServiceStatus.PENDING || s.status === ServiceStatus.AWAITING_PARTS);
  const displayServices = activeServices.length > 0 ? activeServices : services.slice(0, 3); // show active or recent

  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.IN_PROGRESS:
        return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Activity, label: 'Em Execução' };
      case ServiceStatus.COMPLETED:
        return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Concluído' };
      case ServiceStatus.AWAITING_PARTS:
        return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock, label: 'Aguardando Peças' };
      case ServiceStatus.PENDING:
        return { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: Clock, label: 'Agendado' };
      default:
        return { color: 'text-white/20', bg: 'bg-white/5', border: 'border-white/5', icon: Clock, label: 'Status' };
    }
  };

  return (
    <div className="space-y-8">
      {displayServices.length === 0 && (
        <div className="text-white/40 text-sm text-center py-8 border border-dashed border-white/10">Nenhum serviço recente.</div>
      )}
      {displayServices.map((service) => {
        const config = getStatusConfig(service.status);
        const isActive = service.status === ServiceStatus.IN_PROGRESS;

        return (
          <Card 
            key={service.id} 
            onClick={() => setSelectedService && setSelectedService(service.id)}
            className={`relative overflow-hidden group p-0 border-white/5 ${setSelectedService ? 'cursor-pointer hover:border-white/20' : ''} ${isActive ? 'ring-1 ring-blue-500/30' : ''}`}
          >
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${config.bg} ${config.color} border ${config.border}`}>
                          <config.icon className="w-3 h-3" /> {config.label}
                        </span>
                        {service.vehicleName && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10">
                            <Car className="w-3 h-3" /> {service.vehicleName}
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter italic leading-tight text-white">{service.title}</h4>
                      <p className="text-xs text-white/40 mt-2 font-medium">{service.description}</p>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[9px] text-white/20 uppercase tracking-widest font-black mb-1">Custo Estimado</p>
                       <p className="text-xl font-display font-black text-white italic">R$ {service.budget?.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 pt-4">
                     {service.mechanicIds && service.mechanicIds.length > 0 && (
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-2">Equipe Alocada</span>
                          <div className="flex -space-x-2">
                            {service.mechanicIds.map(m => (
                              <div key={m} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group/m relative" title={m}>
                                <User className="w-3.5 h-3.5 text-white/40" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[7px] font-black uppercase tracking-widest opacity-0 group-hover/m:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
                                  {m}
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     )}

                     {!isActive && service.evaluation && (
                       <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-2">Avaliação</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <div key={s} className={`w-3 h-1 ${s <= service.evaluation!.rating ? 'bg-[#F6911F]' : 'bg-white/5'}`} />
                            ))}
                          </div>
                       </div>
                     )}

                     {!isActive && !service.evaluation && service.status === ServiceStatus.COMPLETED && (
                       <div className="flex flex-col z-10" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[8px] uppercase tracking-widest text-[#F6911F] font-black mb-2">Avaliar Serviço</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <button
                                key={s}
                                onClick={async () => {
                                  if (window.confirm(`Confirma a avaliação de ${s} estrelas para este serviço?`)) {
                                    try {
                                      const { api } = await import('../../lib/api');
                                      await api.post(`/services/${service.id}/evaluate`, { rating: s, comment: '' });
                                      window.location.reload();
                                    } catch (err) {
                                      console.error(err);
                                      alert('Erro ao avaliar serviço.');
                                    }
                                  }
                                }}
                                className="w-3 h-3 group/star focus:outline-none transition-transform hover:scale-125"
                              >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full h-full text-white/20 hover:text-[#F6911F] hover:fill-current transition-colors`}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            ))}
                          </div>
                       </div>
                     )}
                  </div>
                </div>

                <div className="md:w-px bg-white/5" />

                <div className="md:w-48 shrink-0 space-y-4">
                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                      {service.status === ServiceStatus.COMPLETED ? (
                        <>
                          <p className="text-[8px] uppercase tracking-widest text-green-500/80 font-black mb-2">Data e Hora de Entrega</p>
                          <p className="text-sm font-black text-white italic">
                            {(service.endDate || (service.history && service.history.length > 0 ? service.history[service.history.length - 1].timestamp : null)) ? new Date(service.endDate || service.history[service.history.length - 1].timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-2">Previsão Entrega</p>
                          <p className="text-sm font-black text-white/80 italic">
                            {service.expectedDelivery ? new Date(service.expectedDelivery).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Sem data prevista'}
                          </p>
                        </>
                      )}
                   </div>
                   <button className="w-full py-4 text-[9px] uppercase tracking-[0.2em] font-black border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-white/40 hover:text-white flex items-center justify-center gap-2 group">
                     Solicitar Contato <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

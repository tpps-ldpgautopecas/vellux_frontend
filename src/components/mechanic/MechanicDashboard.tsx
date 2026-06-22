import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Wrench, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { TechnicalReportForm } from '../admin/TechnicalReportForm';
import { motion, AnimatePresence } from 'motion/react';

interface Service {
  id: string;
  client: string;
  car: string;
  plate: string;
  type: string;
  status: string;
  date: string;
  startTime: string;
  diagnostics: string;
}

export function MechanicDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/mechanic');
      setServices(response || []);
    } catch (error) {
      console.error('Erro ao carregar serviços do mecânico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async (data: any) => {
    if (!selectedService) return;
    try {
      await api.post(`/services/${selectedService.id}/complete`, {
        report: data
      });
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error('Erro ao finalizar serviço:', error);
      alert('Erro ao finalizar o serviço.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-[#F6911F]">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Wrench className="w-8 h-8 text-[#F6911F]" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Meus Serviços</h2>
      </div>

      {services.length === 0 ? (
        <Card className="p-8 text-center bg-white/5 border-white/10">
          <CheckCircle className="w-12 h-12 text-[#F6911F] mx-auto mb-4 opacity-50" />
          <p className="text-white/70">Você não tem serviços pendentes de finalização no momento.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card 
              key={service.id} 
              onClick={() => setSelectedService(service)}
              className="flex flex-col p-5 md:p-6 cursor-pointer hover:border-[#D4AF37]/30 transition-all group gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#F6911F]/30 group-hover:bg-[#F6911F]/10 transition-colors">
                    <Wrench className="w-6 h-6 shrink-0 text-white/40 group-hover:text-[#F6911F] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">{service.car}</h3>
                    <p className="text-[10px] text-[#F6911F] font-mono">{service.plate}</p>
                  </div>
                </div>
                <span className="shrink-0 px-3 py-1 bg-[#F6911F]/10 text-[#F6911F] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#F6911F]/20 whitespace-nowrap">
                  Em Execução
                </span>
              </div>

              <div className="mt-2 space-y-2 border-t border-white/5 pt-4">
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Cliente</span>
                  <p className="text-sm text-white/70 font-medium">{service.client}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Tipo de Serviço</span>
                  <p className="text-sm text-white/70 font-medium">{service.type}</p>
                </div>
                {service.diagnostics && (
                  <div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Diagnóstico Inicial</span>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{service.diagnostics}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/5 text-[10px] text-white/30 uppercase tracking-widest font-black">
                <Clock className="w-3 h-3 text-[#F6911F]" />
                <span>Início: {service.startTime}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedService(null)}
               className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-4xl z-10"
             >
               <TechnicalReportForm 
                 serviceId={selectedService.id}
                 initialServiceName={selectedService.type}
                 onCancel={() => setSelectedService(null)}
                 onSave={handleSaveReport}
               />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Wrench, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { TechnicalReportForm } from '../admin/TechnicalReportForm';

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
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/mechanic');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços do mecânico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setSelectedService(null);
    fetchServices(); // Refresh list after finishing
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
            <Card key={service.id} className="p-6 flex flex-col justify-between border-l-4 border-l-[#F6911F] bg-black/40">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase">{service.car}</h3>
                    <p className="text-sm text-[#F6911F]">{service.plate}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#F6911F]/20 text-[#F6911F] rounded-full text-xs font-bold uppercase">
                    Em Execução
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider">Cliente</span>
                    <p className="text-white">{service.client}</p>
                  </div>
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider">Tipo de Serviço</span>
                    <p className="text-white">{service.type}</p>
                  </div>
                  {service.diagnostics && (
                    <div>
                      <span className="text-xs text-white/50 uppercase tracking-wider">Diagnóstico Inicial</span>
                      <p className="text-white/80 text-sm mt-1 bg-black/50 p-2 rounded border border-white/5">{service.diagnostics}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[#F6911F]/70 mt-4 font-mono">
                    <Clock className="w-4 h-4" />
                    <span>Iniciado em: {service.startTime}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(service.id)}
                className="w-full py-3 bg-[#F6911F] hover:bg-[#ff9d2e] text-black font-bold uppercase tracking-wider rounded transition-colors mt-4"
              >
                Finalizar Serviço
              </button>
            </Card>
          ))}
        </div>
      )}

      {selectedService && (
        <TechnicalReportForm
          serviceId={selectedService}
          onClose={() => setSelectedService(null)}
          onSuccess={handleFinish}
        />
      )}
    </div>
  );
}

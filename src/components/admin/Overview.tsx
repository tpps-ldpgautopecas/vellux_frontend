import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Users, Car, TrendingUp, ChevronRight, Calendar, AlertCircle
} from 'lucide-react';
import { Card, Button } from '../ui';
import { ServiceStatus } from '../../types';
import { api } from '../../lib/api';

interface OverviewProps {
  setActiveTab: (tab: any) => void;
}

export function Overview({ setActiveTab }: OverviewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const response = await api.get('/dashboard/overview');
        if (mounted) {
          setData(response);
          setError(null);
        }
      } catch (err: any) {
        console.error('Erro ao buscar panorama:', err);
        if (mounted) {
          setError('Não foi possível carregar o painel geral.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <div className="w-8 h-8 border-2 border-[#F6911F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500/50" />
        <div>
          <p className="text-white font-bold">{error || 'Não foi possível carregar os dados.'}</p>
        </div>
      </div>
    );
  }

  const { stats, activeServices, activeServicesTotal, todaySchedule, pendingToday } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const statCards = [
    { label: 'Faturamento Mensal', value: formatCurrency(stats.faturamentoMensal), icon: TrendingUp },
    { label: 'Serviços Ativos', value: stats.servicosAtivos.toString(), icon: Car },
    { label: 'Novos Clientes', value: stats.novosClientes.toString(), icon: Users },
    { label: 'Taxa de Fidelidade', value: stats.taxaFidelidade, icon: TrendingUp }, // Can reuse TrendingUp or BarChart
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 sm:p-6 lg:p-8 border-white/5 hover:border-[#F6911F]/30 transition-all group h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/2 border border-white/5 opacity-50 group-hover:opacity-100 group-hover:border-[#F6911F]/40 transition-all">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-[#F6911F]" />
                </div>
              </div>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-black mb-1">{stat.label}</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tighter italic truncate" title={stat.value}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Services List Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tighter italic"><span className="text-[#F6911F]">Ops.</span> em Tempo Real</h3>
            <button onClick={() => setActiveTab('operations')} className="text-[9px] uppercase tracking-widest font-black text-white/30 hover:text-white flex items-center group">
              Gerenciar Fluxo <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-4">
            {activeServices.length > 0 ? activeServices.map((service: any) => (
              <Card key={service.id} className="p-4 sm:p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group cursor-pointer border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border ${
                      service.status === 'in_progress' ? 'border-blue-500/20 bg-blue-500/5' : 'border-yellow-500/20 bg-yellow-500/5'
                    }`}>
                      <Car className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        service.status === 'in_progress' ? 'text-blue-500' : 'text-yellow-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-display font-black uppercase tracking-tighter italic group-hover:text-[#F6911F] transition-colors">{service.car}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest">{service.plate}</p>
                        <span className="w-1 h-1 rounded-full bg-white/5" />
                        <p className="text-[9px] uppercase font-black text-[#F6911F]">{service.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right">
                       <p className="text-[8px] uppercase tracking-widest text-white/10 font-bold mb-1">Responsável</p>
                       <p className="text-[8px] uppercase font-black text-white/40">{service.tech || '-'}</p>
                    </div>
                    <div className={`px-4 py-2 border ${
                      service.status === 'in_progress' ? 'border-blue-500/20 text-blue-500' : 
                      service.status === 'awaiting_parts' ? 'border-red-500/20 text-red-500' :
                      'border-yellow-500/20 text-yellow-500'
                    } text-[8px] font-black uppercase tracking-widest shrink-0 bg-black/40`}>
                      {service.status === 'in_progress' ? 'Em Execução' : 
                       service.status === 'awaiting_parts' ? 'Aguardando Peças' : 'Em Alocação'}
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="p-8 text-center border border-dashed border-white/10 text-white/30 text-xs font-bold uppercase tracking-widest">
                Nenhum serviço em andamento no momento.
              </div>
            )}
            
            {activeServicesTotal > 10 && (
              <button onClick={() => setActiveTab('operations')} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 text-[9px] uppercase tracking-widest font-black text-white/20 transition-all">
                + {activeServicesTotal - 10} outros serviços em execução
              </button>
            )}
          </div>
        </div>

        {/* Sidebar: Activity & Metrics */}
        <div className="space-y-8">
           <Card className="p-8 space-y-8">
             <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 pb-4 border-b border-white/5 italic">Ações de Gestão</h3>
             <div className="space-y-3">
                <button onClick={() => setActiveTab('operations')} className="w-full flex items-center justify-between p-4 bg-white/2 border border-white/5 hover:border-[#F6911F]/20 transition-all group">
                   <div className="flex items-center gap-3">
                      <Plus className="w-4 h-4 text-[#F6911F]" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Realizar Check-in</span>
                   </div>
                   <ChevronRight className="w-3 h-3 text-white/10 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => setActiveTab('team')} className="w-full flex items-center justify-between p-4 bg-white/2 border border-white/5 hover:border-[#F6911F]/20 transition-all group">
                   <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#F6911F]" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Alocar Equipe</span>
                   </div>
                   <ChevronRight className="w-3 h-3 text-white/10 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
           </Card>

           <Card className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#F6911F]" />
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-white/80">Agenda de Hoje</h4>
                </div>
                {pendingToday > 0 && (
                  <span className="text-[8px] font-black text-[#F6911F] bg-[#F6911F]/10 px-2 py-0.5">{pendingToday} Pendentes</span>
                )}
              </div>
              
              <div className="space-y-4">
                {todaySchedule.length > 0 ? todaySchedule.map((apt: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono font-black text-white/40">{apt.time}</span>
                      <span className="text-[10px] font-bold text-white uppercase">{apt.car}</span>
                    </div>
                    <span className={`text-[7px] uppercase font-black tracking-widest ${
                      apt.status === 'Confirmado' ? 'text-green-500' : 
                      apt.status === 'Cancelado' ? 'text-red-500' : 
                      apt.status === 'Aguardando' ? 'text-yellow-500' : 'text-white/20'
                    }`}>{apt.status}</span>
                  </div>
                )) : (
                  <div className="text-center p-4 border border-dashed border-white/5 text-white/30 text-[9px] uppercase font-black tracking-widest">
                    Sem agendamentos
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setActiveTab('schedule')} className="w-full !p-3 text-[8px] border-white/5">
                Ver Agenda Completa
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

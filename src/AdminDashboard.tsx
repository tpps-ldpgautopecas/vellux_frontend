/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Users, 
  Car, 
  Wrench, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  MoreVertical,
  ChevronRight,
  Calendar,
  LayoutDashboard,
  FileText,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { Card, Button } from './components/ui';
import { useAuth } from './contexts/AuthContext';
import { ServiceStatus } from './types';
import { TeamManagement } from './components/admin/TeamManagement';
import { TechnicalReportForm } from './components/admin/TechnicalReportForm';
import { ScheduleCalendar } from './components/admin/ScheduleCalendar';
import { ServiceOperations } from './components/admin/ServiceOperations';
import { FinancialInsights } from './components/admin/FinancialInsights';

type AdminTab = 'overview' | 'team' | 'reports' | 'schedule' | 'operations' | 'finance';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const stats = [
    { label: 'Faturamento Mensal', value: 'R$ 142.500', trend: '+12.5%', icon: TrendingUp },
    { label: 'Serviços Ativos', value: '24', trend: '8 novos', icon: Wrench },
    { label: 'Novos Clientes', value: '12', trend: '+4', icon: Users },
    { label: 'Taxa de Fidelidade', value: '94%', trend: '+2%', icon: BarChart3 },
  ];

  const activeServices = [
    { id: '1', client: 'Carlos Silva', car: 'Porsche 911 Carrera', plate: 'PR-9110', type: 'Revisão Motor', status: ServiceStatus.IN_PROGRESS, tech: 'Marcos', progress: 65 },
    { id: '2', client: 'Beatriz Costa', car: 'BMW M3 Competition', plate: 'BMW-3333', type: 'Freios Cerâmica', status: ServiceStatus.AWAITING_PARTS, tech: 'Ricardo', progress: 30 },
    { id: '3', client: 'André Santos', car: 'Audi RS6 Avant', plate: 'RS6-0000', type: 'Stage 2 Remap', status: ServiceStatus.PENDING, tech: '-', progress: 10 },
  ];

  if (selectedServiceId) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <TechnicalReportForm 
          serviceId={selectedServiceId} 
          onCancel={() => setSelectedServiceId(null)}
          onSave={(data) => {
            console.log('Saving report:', data);
            setSelectedServiceId(null);
          }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Panorama', icon: LayoutDashboard },
    { id: 'operations', label: 'Operações', icon: Wrench },
    { id: 'schedule', label: 'Agenda', icon: Calendar },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <div className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-6 italic">Vellux <span className="text-[#F6911F]">Control.</span></h1>
          <p className="text-[#F6911F] uppercase tracking-[0.4em] text-[8px] md:text-[10px] font-black flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#95191C]" /> Gestão Centralizada Vellux
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white/2 border border-white/5 p-1 overflow-x-auto custom-scrollbar max-w-full">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-3 px-5 sm:px-6 py-3 text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-all shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-[#F6911F] text-black' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-4 sm:p-6 lg:p-8 border-white/5 hover:border-[#F6911F]/30 transition-all group">
                    <div className="flex items-center justify-between mb-4 sm:mb-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/2 border border-white/5 opacity-50 group-hover:opacity-100 group-hover:border-[#F6911F]/40 transition-all">
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-[#F6911F]" />
                      </div>
                    </div>
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-black mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tighter italic">{stat.value}</p>
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
                  {activeServices.map((service) => (
                    <Card key={service.id} className="p-4 sm:p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group cursor-pointer border-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border ${
                            service.status === ServiceStatus.IN_PROGRESS ? 'border-blue-500/20 bg-blue-500/5' : 'border-yellow-500/20 bg-yellow-500/5'
                          }`}>
                            <Car className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              service.status === ServiceStatus.IN_PROGRESS ? 'text-blue-500' : 'text-yellow-500'
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
                             <p className="text-[8px] uppercase font-black text-white/40">{service.tech}</p>
                          </div>
                          <div className={`px-4 py-2 border ${
                            service.status === ServiceStatus.IN_PROGRESS ? 'border-blue-500/20 text-blue-500' : 'border-yellow-500/20 text-yellow-500'
                          } text-[8px] font-black uppercase tracking-widest shrink-0 bg-black/40`}>
                            {service.status === ServiceStatus.IN_PROGRESS ? 'Em Alocação' : 'Aguardando Peças'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <button onClick={() => setActiveTab('operations')} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 text-[9px] uppercase tracking-widest font-black text-white/20 transition-all">
                    + {activeServices.length + 9} outros serviços em execução
                  </button>
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
                      <span className="text-[8px] font-black text-[#F6911F] bg-[#F6911F]/10 px-2 py-0.5">3 Pendentes</span>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { time: '09:00', car: 'Ferrari 488', status: 'Confirmado' },
                        { time: '11:30', car: 'Porsche GT3', status: 'Atrasado' },
                        { time: '15:45', car: 'McLaren 720S', status: 'Aguardando' },
                      ].map((apt, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] font-mono font-black text-white/40">{apt.time}</span>
                            <span className="text-[10px] font-bold text-white uppercase">{apt.car}</span>
                          </div>
                          <span className={`text-[7px] uppercase font-black tracking-widest ${
                            apt.status === 'Confirmado' ? 'text-green-500' : 
                            apt.status === 'Atrasado' ? 'text-red-500' : 'text-white/20'
                          }`}>{apt.status}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab('schedule')} className="w-full !p-3 text-[8px] border-white/5">
                      Ver Agenda Completa
                    </Button>
                 </Card>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'operations' && (
          <motion.div
            key="operations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ServiceOperations />
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ScheduleCalendar />
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TeamManagement />
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center py-32 bg-white/2 border border-dashed border-white/10"
          >
            <FileText className="w-16 h-16 text-white/5 mb-8" />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 text-white/40">Repositório de Relatórios</h3>
            <p className="text-xs text-white/20 uppercase tracking-widest mb-10">Acesse o histórico completo de intervenções técnicas</p>
            <div className="flex gap-4">
               <Button onClick={() => setSelectedServiceId('DEMO-01')}>Criar Novo Relatório</Button>
               <Button variant="outline">Exportar Banco de Dados</Button>
            </div>
          </motion.div>
        )}
        {activeTab === 'finance' && (
          <motion.div
            key="finance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FinancialInsights />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


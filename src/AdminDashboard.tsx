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
import { Overview } from './components/admin/Overview';

type AdminTab = 'overview' | 'team' | 'reports' | 'schedule' | 'operations' | 'finance';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);



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
            <Overview setActiveTab={setActiveTab} />
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


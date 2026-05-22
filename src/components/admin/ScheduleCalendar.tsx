import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  UserPlus, 
  Car,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, Button } from '../ui';
import { ServiceStatus } from '../../types';

interface ScheduleItem {
  id: string;
  client: string;
  car: string;
  time: string;
  type: string;
  status: ServiceStatus;
  mechanics: string[];
}

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weeklySchedule: Record<string, ScheduleItem[]> = {
    'Segunda': [
      { id: '1', client: 'Beto Oliveira', car: 'Porsche 911', time: '09:00', type: 'Revisão', status: ServiceStatus.IN_PROGRESS, mechanics: ['Marcos'] },
      { id: '2', client: 'Ana Clara', car: 'BMW M3', time: '14:00', type: 'PPF', status: ServiceStatus.PENDING, mechanics: [] },
    ],
    'Terça': [
      { id: '3', client: 'Roberto Silva', car: 'Ferrari F430', time: '10:30', type: 'Embreagem', status: ServiceStatus.AWAITING_PARTS, mechanics: ['Ricardo'] },
    ],
    'Quarta': [
      { id: '4', client: 'Marcos Viana', car: 'Mercedes C63', time: '08:30', type: 'Remap', status: ServiceStatus.PENDING, mechanics: [] },
      { id: '5', client: 'Sandra Lima', car: 'Audi R8', time: '16:00', type: 'Troca Óleo', status: ServiceStatus.PENDING, mechanics: [] },
    ],
    'Quinta': [],
    'Sexta': [
      { id: '6', client: 'Paulo G.', car: 'Mustang GT', time: '11:00', type: 'Suspensão', status: ServiceStatus.IN_PROGRESS, mechanics: ['André', 'Ricardo'] },
    ],
  };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white/2 border border-white/5 p-4 sm:p-6 gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="!p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-display font-black uppercase tracking-tighter">Abril 2026</h3>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Semana 17</p>
          </div>
          <Button variant="ghost" className="!p-2">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-4 border-t border-white/5 pt-4 sm:pt-0 sm:border-none w-full sm:w-auto justify-center">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Em Andamento</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-yellow-500" />
             <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Pendente</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="text-left sm:text-center py-2 sm:py-4 border-b border-white/10 sm:border-white/5 bg-white/[0.01] px-4 sm:px-0">
               <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#F6911F] sm:text-white/40">{day}</p>
            </div>
            
            <div className="space-y-3 lg:min-h-[400px] px-4 sm:px-0">
              {weeklySchedule[day]?.length > 0 ? (
                weeklySchedule[day].map((item) => (
                  <Card 
                    key={item.id} 
                    className={`p-5 lg:p-4 border-l-2 hover:border-[#F6911F]/40 transition-all group cursor-pointer ${
                      item.status === ServiceStatus.IN_PROGRESS ? 'border-l-blue-500' : 
                      item.status === ServiceStatus.AWAITING_PARTS ? 'border-l-red-500' : 'border-l-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] sm:text-[9px] font-mono text-white/40">{item.time}</span>
                       {item.mechanics.length > 0 ? (
                         <div className="flex -space-x-2">
                           {item.mechanics.map(m => (
                             <div key={m} title={m} className="w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-[#F6911F] text-black text-[8px] sm:text-[7px] flex items-center justify-center font-bold border border-black uppercase">
                               {m[0]}
                             </div>
                           ))}
                         </div>
                       ) : (
                         <UserPlus className="w-3 h-3 text-[#F6911F] animate-pulse" />
                       )}
                    </div>
                    
                    <h4 className="text-[12px] sm:text-[11px] font-display font-black uppercase tracking-tight text-white group-hover:text-[#F6911F] transition-colors">{item.car}</h4>
                    <p className="text-[9px] sm:text-[8px] text-white/30 uppercase tracking-widest mb-3">{item.client}</p>
                    
                    <div className="flex items-center gap-2 text-[8px] sm:text-[7px] uppercase tracking-widest font-black text-white/20">
                      <Clock className="w-3 h-3 sm:w-2.5 sm:h-2.5" /> {item.type}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="h-full border border-dashed border-white/5 flex items-center justify-center py-8">
                  <span className="text-[8px] uppercase tracking-widest text-white/10 font-bold">Sem Reservas</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-[#F6911F]/5 border-[#F6911F]/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#F6911F] shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-white/80">Otimização de Escala</p>
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-medium leading-relaxed">4 Serviços pendentes de atribuição técnica para esta semana.</p>
          </div>
        </div>
        <Button className="w-full md:w-auto !py-3 !px-8 !text-[8px]">Auto-Atribuir por Especialidade</Button>
      </Card>
    </div>
  );
}

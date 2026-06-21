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

import { api } from '../../lib/api';

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, ScheduleItem[]>>({
    'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': []
  });

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const previousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const [appointmentsData, servicesData] = await Promise.all([
        api.get('/appointments/admin/pendentes').catch(() => []),
        api.get('/services/admin').catch(() => [])
      ]);

      const schedule: Record<string, ScheduleItem[]> = {
        'Segunda': [], 'Terça': [], 'Quarta': [], 'Quinta': [], 'Sexta': []
      };

      const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return dayNames[date.getDay()];
      };

      const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      };

      const isDateInCurrentWeek = (dateString: string) => {
        const d = new Date(dateString);
        return d >= weekStart && d <= weekEnd;
      };

      // Process appointments (Pendentes)
      appointmentsData.forEach((app: any) => {
        if (!isDateInCurrentWeek(app.date)) return;
        const day = getDayName(app.date);
        if (schedule[day]) {
          schedule[day].push({
            id: `app-${app.id}`,
            client: app.client,
            car: app.car,
            time: formatTime(app.date),
            type: app.service_type || 'Serviço',
            status: ServiceStatus.PENDING,
            mechanics: []
          });
        }
      });

      // Process services
      servicesData.forEach((srv: any) => {
        if (!srv.date || !isDateInCurrentWeek(srv.date)) return;
        const day = getDayName(srv.date);
        if (schedule[day]) {
          schedule[day].push({
            id: `srv-${srv.id}`,
            client: srv.client,
            car: srv.car,
            time: formatTime(srv.date),
            type: srv.type,
            status: srv.status,
            mechanics: srv.mechanics || []
          });
        }
      });

      // Sort items by time
      Object.keys(schedule).forEach(day => {
        schedule[day].sort((a, b) => a.time.localeCompare(b.time));
      });

      setWeeklySchedule(schedule);
    } catch (error) {
      console.error("Erro ao buscar agenda:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSchedule();
  }, [currentDate]);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white/2 border border-white/5 p-4 sm:p-6 gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="!p-2" onClick={previousWeek}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center min-w-[120px]">
            <h3 className="text-lg font-display font-black uppercase tracking-tighter">{monthYear}</h3>
            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
              Semana de {weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </p>
          </div>
          <Button variant="ghost" className="!p-2" onClick={nextWeek}>
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
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Concluído</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-4 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0A0A0A]/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-[#F6911F] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
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
                    className={`p-5 lg:p-4 border-l-2 hover:border-[#F6911F]/40 transition-all group cursor-pointer ${item.status === ServiceStatus.IN_PROGRESS ? 'border-l-blue-500' :
                        item.status === ServiceStatus.AWAITING_PARTS ? 'border-l-red-500' :
                          item.status === ServiceStatus.COMPLETED ? 'border-l-green-500 opacity-60' : 'border-l-yellow-500'
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

    </div>
  );
}

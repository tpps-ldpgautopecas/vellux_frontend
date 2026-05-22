import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter,
  Download,
  Calendar,
  Users,
  Wrench,
  DollarSign
} from 'lucide-react';
import { Card, Button } from '../ui';

const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 61000 },
  { name: 'Abr', value: 58000 },
  { name: 'Mai', value: 72000 },
  { name: 'Jun', value: 85000 },
];

const serviceTypeData = [
  { name: 'Revisão', value: 45 },
  { name: 'Suspensão', value: 25 },
  { name: 'Elétrica', value: 15 },
  { name: 'Estética', value: 10 },
  { name: 'Outros', value: 5 },
];

const techPerformanceData = [
  { name: 'Marcos', services: 145, revenue: 85000 },
  { name: 'Ricardo', services: 89, revenue: 52000 },
  { name: 'Juliana', services: 210, revenue: 45000 },
  { name: 'André', services: 67, revenue: 38000 },
];

const COLORS = ['#F6911F', '#white', '#3b82f6', '#ef4444', '#10b981'];

export function FinancialInsights() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="space-y-8">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic text-white leading-none">Inteligência <span className="text-[#F6911F]">Financeira.</span></h2>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-2">Visão analítica de performance e rentabilidade</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest font-black text-white outline-none focus:border-[#F6911F]/50 transition-colors cursor-pointer"
          >
            <option value="week">Última Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Ano</option>
          </select>
          <Button variant="outline" className="text-[10px]">
            <Download className="w-3.5 h-3.5 mr-2" /> Exportar Dados
          </Button>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Lucro Operacional', value: 'R$ 82.400', trend: 12, icon: DollarSign },
          { label: 'Ticket Médio', value: 'R$ 2.450', trend: 5, icon: TrendingUp },
          { label: 'Crescimento', value: '18.4%', trend: 2, icon: ArrowUpRight },
          { label: 'Taxa de Retorno', value: '64%', trend: -1, icon: Users },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6 border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <kpi.icon className="w-4 h-4 text-[#F6911F]" />
              </div>
              <div className={`flex items-center text-[10px] font-black ${kpi.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(kpi.trend)}%
              </div>
            </div>
            <p className="text-[8px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">{kpi.label}</p>
            <p className="text-xl font-display font-black text-white italic tracking-tighter">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Fluxo de Faturamento Mensal</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F6911F]" />
              <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">Receita Bruta</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6911F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F6911F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                  tickFormatter={(value) => `R$ ${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', fontSize: '10px' }}
                  itemStyle={{ color: '#F6911F' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F6911F" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-white/5">
          <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-8">Mix de Serviços</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <p className="text-[8px] uppercase font-black text-white/20 tracking-tighter">Total</p>
              <p className="text-xl font-display font-black italic">456</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {serviceTypeData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-[10px] uppercase font-bold text-white/40">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Specialist Performance */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-8 border-white/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Faturamento por Especialista</h3>
              <Users className="w-4 h-4 text-white/10" />
           </div>
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff60', fontWeight: 'bold' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', fontSize: '10px' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#F6911F" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                >
                  {techPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#F6911F' : 'rgba(255,255,255,0.05)'} stroke={index === 0 ? 'none' : 'rgba(255,255,255,0.1)'} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-white/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Eficiência de Conversão</h3>
              <Calendar className="w-4 h-4 text-white/10" />
           </div>
           <div className="space-y-6">
              {[
                { label: 'Revisão Preventiva', rate: 92, count: 120 },
                { label: 'Reparos de Suspensão', rate: 78, count: 85 },
                { label: 'Diagnóstico Eletrônico', rate: 64, count: 56 },
                { label: 'Estética Automotiva', rate: 45, count: 42 },
              ].map((service) => (
                <div key={service.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-black text-white">{service.label}</p>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">{service.count} ordens abertas</p>
                    </div>
                    <span className="text-[10px] font-black text-[#F6911F]">{service.rate}%</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#F6911F]" style={{ width: `${service.rate}%` }} />
                  </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}

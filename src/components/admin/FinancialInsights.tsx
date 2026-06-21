import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Download,
  Calendar, Users, DollarSign, Activity, AlertCircle, Clock, Star, ChevronDown, Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, Button } from '../ui';
import { api } from '../../lib/api';

const COLORS = ['#F6911F', '#ffffff', '#3b82f6', '#ef4444', '#10b981'];

export function FinancialInsights() {
  const [timeRange, setTimeRange] = useState('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (timeRange === 'custom' && (!customStartDate || !customEndDate)) {
        return; // wait for valid dates
      }

      setLoading(true);
      setError(null);
      try {
        let url = `/finance/dashboard?range=${timeRange}`;
        if (timeRange === 'custom') {
          url += `&startDate=${customStartDate}&endDate=${customEndDate}`;
        }
        const result = await api.get(url);
        if (mounted) {
          setDashboardData(result);
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        if (mounted) {
          setError(err.message || 'Erro ao carregar dados do dashboard.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [timeRange, customStartDate, customEndDate]);

  const handleApplyCustom = () => {
    if (tempStartDate && tempEndDate) {
      setCustomStartDate(tempStartDate);
      setCustomEndDate(tempEndDate);
      setTimeRange('custom');
      setIsFilterOpen(false);
    }
  };

  const handlePresetSelect = (range: string) => {
    setTimeRange(range);
    setIsFilterOpen(false);
  };

  const getRangeLabel = () => {
    if (timeRange === 'week') return 'Última Semana';
    if (timeRange === 'month') return 'Este Mês';
    if (timeRange === 'quarter') return 'Trimestre';
    if (timeRange === 'year') return 'Este Ano';
    if (timeRange === 'custom') return `${new Date(customStartDate + 'T12:00:00').toLocaleDateString('pt-BR')} - ${new Date(customEndDate + 'T12:00:00').toLocaleDateString('pt-BR')}`;
    return 'Filtro';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#F6911F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500/50" />
        <div>
          <p className="text-white font-bold">{error || 'Não foi possível carregar os dados.'}</p>
          <p className="text-white/50 text-sm mt-2">Por favor, faça login novamente ou atualize a página.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Filters & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-50">
        <div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic text-white leading-none">Inteligência <span className="text-[#F6911F]">Financeira.</span></h2>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-2">Visão analítica de performance e rentabilidade em tempo real</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-2.5 text-[10px] uppercase tracking-widest font-black text-white outline-none focus:border-[#F6911F]/50 transition-all hover:bg-white/5 rounded-sm"
            >
              <Filter className="w-3.5 h-3.5 text-[#F6911F]" />
              {getRangeLabel()}
              <ChevronDown className="w-3.5 h-3.5 text-white/40 ml-2" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-md shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="space-y-1 mb-4">
                  {['week', 'month', 'quarter', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => handlePresetSelect(range)}
                      className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors ${timeRange === range && timeRange !== 'custom' ? 'bg-[#F6911F]/10 text-[#F6911F]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      {range === 'week' ? 'Última Semana' : range === 'month' ? 'Este Mês' : range === 'quarter' ? 'Trimestre' : 'Este Ano'}
                    </button>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <p className="text-[10px] uppercase tracking-widest font-black text-white/40">Personalizado</p>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="date" 
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="bg-black border border-white/10 text-white text-xs px-3 py-2 rounded-sm focus:border-[#F6911F] outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                    <input 
                      type="date" 
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      className="bg-black border border-white/10 text-white text-xs px-3 py-2 rounded-sm focus:border-[#F6911F] outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                    <Button 
                      variant="primary" 
                      onClick={handleApplyCustom}
                      className="w-full mt-2 text-[10px] py-2"
                      disabled={!tempStartDate || !tempEndDate}
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" className="text-[10px] bg-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20">
            <Download className="w-3.5 h-3.5 mr-2" /> Exportar Dados
          </Button>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Receita Total', value: formatCurrency(dashboardData.kpis.totalRevenue), icon: DollarSign, trend: '+12%' },
          { label: 'Serviços', value: dashboardData.kpis.totalServices, icon: Activity, trend: '+5%' },
          { label: 'Ticket Médio', value: formatCurrency(dashboardData.kpis.averageTicket), icon: TrendingUp, trend: '+2%' },
          { label: 'NPS', value: dashboardData.kpis.averageSatisfaction > 0 ? `${dashboardData.kpis.averageSatisfaction.toFixed(1)} / 5.0` : 'N/A', icon: Star, trend: '' },
          { label: 'Tempo Reparo', value: dashboardData.kpis.averageRepairTime > 0 ? `${Math.max(1, Math.round(dashboardData.kpis.averageRepairTime))} dias` : 'N/A', icon: Clock, trend: '' },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-6 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F6911F]/5 blur-[40px] -mr-10 -mt-10 rounded-full transition-opacity group-hover:bg-[#F6911F]/10" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-8 h-8 rounded bg-[#F6911F]/10 border border-[#F6911F]/20 flex items-center justify-center">
                <kpi.icon className="w-4 h-4 text-[#F6911F]" />
              </div>
              {kpi.trend && (
                <div className="flex items-center px-2 py-1 rounded bg-green-500/10 text-[9px] font-black text-green-500 border border-green-500/20">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {kpi.trend}
                </div>
              )}
            </div>
            <p className="text-[9px] uppercase tracking-widest font-black text-white/30 mb-1 relative z-10">{kpi.label}</p>
            <p className="text-xl font-display font-black text-white tracking-tighter relative z-10 truncate">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 md:p-8 border-white/5 bg-[#050505]/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#F6911F]/30 to-transparent" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Faturamento Real</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F6911F] shadow-[0_0_10px_rgba(246,145,31,0.5)]" />
              <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">Receita (R$)</span>
            </div>
          </div>
          <div className="h-[300px] w-full relative z-10">
            {dashboardData.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F6911F" stopOpacity={0.4}/>
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
                    dy={10}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#ffffff40', fontWeight: 'bold' }}
                    tickFormatter={(value) => `R$ ${value >= 1000 ? (value / 1000) + 'k' : value}`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#F6911F' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    cursor={{ stroke: 'rgba(246,145,31,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F6911F" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    activeDot={{ r: 6, fill: '#F6911F', stroke: '#000', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                  <Activity className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Sem dados no período</p>
               </div>
            )}
          </div>
        </Card>

        <Card className="p-6 md:p-8 border-white/5 bg-[#050505]/50 backdrop-blur-xl">
          <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-8">Mix de Serviços Realizados</h3>
          <div className="h-[200px] w-full relative">
            {dashboardData.serviceMixData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.serviceMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {dashboardData.serviceMixData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-black uppercase tracking-widest">Sem dados</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <p className="text-[8px] uppercase font-black text-white/20 tracking-tighter">Total</p>
              <p className="text-xl font-display font-black tracking-tighter text-[#F6911F]">
                {dashboardData.serviceMixData.length > 0 ? dashboardData.serviceMixData.reduce((acc: number, curr: any) => acc + curr.count, 0) : 0}
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {dashboardData.serviceMixData.map((item: any, index: number) => (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white/80 transition-colors truncate max-w-[120px]">{item.name}</span>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Specialist Performance and Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 md:p-8 border-white/5 bg-[#050505]/50 backdrop-blur-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Top Especialistas (Faturamento)</h3>
              <Users className="w-4 h-4 text-white/10" />
           </div>
           <div className="h-[250px] w-full">
            {dashboardData.techPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.techPerformanceData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
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
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#F6911F" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  >
                    {dashboardData.techPerformanceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#F6911F' : 'rgba(255,255,255,0.05)'} stroke={index === 0 ? 'none' : 'rgba(255,255,255,0.1)'} strokeWidth={1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-black uppercase tracking-widest">Sem dados</div>
            )}
          </div>
        </Card>

        <Card className="p-0 border-white/5 bg-[#050505]/50 backdrop-blur-xl overflow-hidden flex flex-col">
           <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">Últimas Transações Registradas</h3>
              <Clock className="w-4 h-4 text-white/10" />
           </div>
           <div className="flex-1 overflow-auto">
              {dashboardData.recentTransactions.length > 0 ? (
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr>
                          <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-white/20 border-b border-white/5">Cliente</th>
                          <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-white/20 border-b border-white/5">Serviço</th>
                          <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-white/20 border-b border-white/5">Data</th>
                          <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-white/20 border-b border-white/5 text-right">Valor</th>
                       </tr>
                    </thead>
                    <tbody>
                       {dashboardData.recentTransactions.map((tx: any) => (
                          <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="px-6 py-4 text-xs font-bold text-white/80">{tx.clientName}</td>
                             <td className="px-6 py-4 text-xs text-white/50 truncate max-w-[150px]">{tx.title}</td>
                             <td className="px-6 py-4 text-[10px] text-white/30 font-mono">{formatDate(tx.finishedAt)}</td>
                             <td className="px-6 py-4 text-xs font-mono font-bold text-[#F6911F] text-right">{formatCurrency(tx.value)}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="w-full h-full min-h-[200px] flex items-center justify-center text-white/20 text-xs font-black uppercase tracking-widest">Sem transações no período</div>
              )}
           </div>
        </Card>
      </div>

      {/* SLA / Repair Time per Service */}
      <div className="grid lg:grid-cols-1 gap-6">
        <Card className="p-6 md:p-8 border-white/5 bg-[#050505]/50 backdrop-blur-xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-white/40">SLA - Tempo Médio de Reparo por Tipo de Serviço</h3>
              <Clock className="w-4 h-4 text-white/10" />
           </div>
           <div className="h-[250px] w-full">
            {dashboardData.timePerServiceData && dashboardData.timePerServiceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.timePerServiceData} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
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
                    width={100}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${Math.max(1, Math.round(value))} dias`, 'Tempo Médio']}
                  />
                  <Bar 
                    dataKey="avgDays" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  >
                    {dashboardData.timePerServiceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : 'rgba(59,130,246,0.3)'} stroke={index === 0 ? 'none' : 'rgba(59,130,246,0.2)'} strokeWidth={1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-black uppercase tracking-widest">Sem dados</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

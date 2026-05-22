import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Wrench, 
  Star, 
  Clock, 
  ExternalLink,
  Search,
  MoreHorizontal,
  CheckCircle2,
  X,
  Edit,
  Save,
  Trash2,
  Mail,
  Phone,
  Car,
  FileText
} from 'lucide-react';
import { Card, Button, Input } from '../ui';
import { UserRole, ServiceStatus } from '../../types';
import { AnimatePresence } from 'motion/react';

interface Specialist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: 'available' | 'busy' | 'away';
  activeServices: number;
  completedServices: number;
  rating: number;
  photo?: string;
  email?: string;
  phone?: string;
}

export function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpecialist, setEditedSpecialist] = useState<Specialist | null>(null);

  const specialists: Specialist[] = [
    { 
      id: '1', 
      name: 'Marcos Aurelio', 
      role: 'Sênior Specialist', 
      specialty: 'Motores High-Performance',
      status: 'busy',
      activeServices: 2,
      completedServices: 145,
      rating: 4.9,
      email: 'marcos@vellux.com',
      phone: '(61) 99988-7766'
    },
    { 
      id: '2', 
      name: 'Ricardo Neves', 
      role: 'Master Technician', 
      specialty: 'Sistemas Elétricos & Híbridos',
      status: 'available',
      activeServices: 0,
      completedServices: 89,
      rating: 4.8,
      email: 'ricardo@vellux.com',
      phone: '(61) 98877-6655'
    },
    { 
      id: '3', 
      name: 'Juliana Portela', 
      role: 'Detailing Expert', 
      specialty: 'Estética & Proteção PPF',
      status: 'busy',
      activeServices: 1,
      completedServices: 210,
      rating: 5.0,
      email: 'juliana@vellux.com',
      phone: '(61) 97766-5544'
    },
    { 
      id: '4', 
      name: 'André Soares', 
      role: 'Precision Mechanic', 
      specialty: 'Suspensão & Frenagem Cerâmica',
      status: 'available',
      activeServices: 0,
      completedServices: 67,
      rating: 4.7,
      email: 'andre@vellux.com',
      phone: '(61) 96655-4433'
    },
  ];

  // Mock services for each tech
  const techServices = [
    { 
      id: '1', 
      client: 'Carlos Silva', 
      car: 'Porsche 911 Carrera', 
      type: 'Revisão Motor', 
      status: ServiceStatus.IN_PROGRESS, 
      tech: 'Marcos Aurelio',
      diagnostics: 'Ruído metálico em marcha lenta. Provável folga em tuchos hidráulicos ou corrente de comando.',
      parts: [
        { name: 'Kit Corrente Comando', brand: 'OEM Porsche', qty: 1 },
        { name: 'Tucho Hidráulico', brand: 'INA', qty: 24 }
      ]
    },
    { 
      id: '2', 
      client: 'Beatriz Costa', 
      car: 'BMW M3 Competition', 
      type: 'Freios Cerâmica', 
      status: ServiceStatus.AWAITING_PARTS, 
      tech: 'Ricardo Neves',
      diagnostics: 'Pastilhas em limite de desgaste. Sensores de desgaste ativados no painel.',
      parts: [
        { name: 'Jogo Patilha Cerâmica', brand: 'Brembo Pro', qty: 1 },
        { name: 'Sensores Desgaste', brand: 'BMW Genuine', qty: 2 }
      ]
    },
    { 
      id: '4', 
      client: 'André Santos', 
      car: 'Audi RS6 Avant', 
      type: 'Stage 2 Remap', 
      status: ServiceStatus.IN_PROGRESS, 
      tech: 'Marcos Aurelio',
      diagnostics: 'Upgrade de performance solicitado. Downpipes e calibração ECU/TCU.',
      parts: [
        { name: 'Downpipes Inox', brand: 'Akrapovic', qty: 2 },
        { name: 'Filtro de Ar Esportivo', brand: 'BMC', qty: 1 }
      ]
    },
    { 
      id: '5', 
      client: 'Juliana Portela', 
      car: 'Mercedes-AMG G63', 
      type: 'Detailing Pro', 
      status: ServiceStatus.IN_PROGRESS, 
      tech: 'Juliana Portela',
      diagnostics: 'Remoção de riscos superficiais e proteção cerâmica de longo prazo.',
      parts: [
        { name: 'Ceramic Coating 9H', brand: 'Gyeon', qty: 1 }
      ]
    },
  ];

  const serviceHistory = [
    { 
      date: '12/10/2023', 
      car: 'Ferrari 488 Pista', 
      type: 'Troca de Óleo e Filtros', 
      tech: 'Marcos Aurelio',
      diagnostics: 'Revisão periódica anual.',
      parts: ['Óleo Motul 300V', 'Filtro Óleo Original']
    },
    { 
      date: '08/10/2023', 
      car: 'Lamborghini Huracán', 
      type: 'Alinhamento 3D', 
      tech: 'André Soares',
      diagnostics: 'Desvio de convergência no eixo dianteiro.',
      parts: ['N/A']
    }
  ];

  const filteredTeam = specialists.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (specialist: Specialist) => {
    setEditedSpecialist({ ...specialist });
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would update Firebase
    if (editedSpecialist) {
      console.log('Saving specialist:', editedSpecialist);
      setSelectedSpecialist(editedSpecialist);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            placeholder="Buscar especialista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/2 border border-white/5 rounded-none py-4 pl-12 pr-6 text-[10px] uppercase tracking-widest focus:border-[#F6911F]/40 outline-none transition-colors"
          />
        </div>
        <Button className="w-full md:w-auto !py-4 md:!py-3 !px-6">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Especialista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeam.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 md:p-8 hover:border-[#F6911F]/20 transition-all group">
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-4 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-display font-black uppercase tracking-tighter leading-none mb-2">{member.name}</h4>
                    <p className="text-[9px] text-[#F6911F] font-bold uppercase tracking-widest mb-1">{member.role}</p>
                    <p className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-widest font-medium">{member.specialty}</p>
                  </div>
                </div>
                <button className="text-white/20 hover:text-white transition-colors p-2">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                <div className="bg-white/2 p-3 sm:p-4 border border-white/5">
                   <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Status</p>
                   <div className="flex items-center gap-1.5">
                     <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                     <span className="text-[8px] sm:text-[9px] uppercase font-bold text-white/60">{member.status === 'available' ? 'Livre' : 'Ocupado'}</span>
                   </div>
                </div>
                <div className="bg-white/2 p-3 sm:p-4 border border-white/5">
                   <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Score</p>
                   <div className="flex items-center gap-1.5">
                     <Star className="w-2.5 h-2.5 text-[#D4AF37]" />
                     <span className="text-[9px] font-mono text-white/80">{member.rating}</span>
                   </div>
                </div>
                <div className="bg-white/2 p-3 sm:p-4 border border-white/5">
                   <p className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Servs</p>
                   <p className="text-[9px] font-mono text-white/80">{member.completedServices}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 h-4 text-white/20" />
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-bold">{member.activeServices} ativos</span>
                 </div>
                 <button 
                   onClick={() => setSelectedSpecialist(member)}
                   className="text-[9px] uppercase tracking-widest font-black text-[#F6911F] hover:text-white flex items-center group/btn transition-colors"
                 >
                   Ver Perfil <ExternalLink className="w-3 h-3 ml-1.5 sm:ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                 </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assignment Module */}
      <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/10 p-6 sm:p-12 mt-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="max-w-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic">Alocação de Time</h3>
             </div>
             <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mb-8 italic">
               Otimize a produtividade alocando o especialista certo para cada desafio técnico.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button className="w-full sm:w-auto !px-8 !py-4 sm:!py-3">Alocar Pendentes (3)</Button>
                <Button variant="ghost" className="w-full sm:w-auto !px-8 !py-4 sm:!py-3 text-[#D4AF37] border border-[#D4AF37]/20 sm:border-none">Ver Escala Semanal</Button>
             </div>
          </div>
          <div className="w-full md:w-64 space-y-4 border-t border-white/5 md:border-none pt-8 md:pt-0">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-white/40 border-b border-white/10 pb-4">Filas Críticas</h4>
            {[
              { label: 'Motores', count: 12, color: 'text-red-500' },
              { label: 'PPF', count: 5, color: 'text-white' },
              { label: 'Elétrica', count: 8, color: 'text-yellow-500' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
                 <span className="text-white/30 uppercase tracking-widest">{f.label}</span>
                 <span className={f.color}>{f.count}h estimadas</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Specialist Details Modal */}
      <AnimatePresence>
        {selectedSpecialist && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedSpecialist(null);
                setIsEditing(false);
              }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-[#080808] border border-white/10 overflow-hidden z-10 flex flex-col md:block"
            >
              <div className="grid md:grid-cols-5 h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Left Panel: Profile Info */}
                <div className="md:col-span-2 p-6 sm:p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 space-y-6 md:space-y-8 bg-white/[0.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">Ficha Técnica</span>
                    {!isEditing && (
                      <button 
                        onClick={() => handleEdit(selectedSpecialist)}
                        className="p-2 text-white/20 hover:text-[#F6911F] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                       <Users className="w-8 h-8 md:w-10 md:h-10 text-white/10" />
                    </div>
                    
                    <div className="text-center">
                      {isEditing ? (
                        <div className="space-y-4 text-left">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Nome Completo</p>
                            <input 
                              type="text"
                              value={editedSpecialist?.name}
                              onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, name: e.target.value} : null)}
                              className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                            />
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Cargo</p>
                            <input 
                              type="text"
                              value={editedSpecialist?.role}
                              onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, role: e.target.value} : null)}
                              className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter italic text-white leading-none">{selectedSpecialist.name}</h3>
                          <p className="text-[#F6911F] text-[10px] uppercase tracking-widest font-black mt-2">{selectedSpecialist.role}</p>
                          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">{selectedSpecialist.specialty}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 md:pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-white/20" />
                      </div>
                      {isEditing ? (
                        <input 
                          type="email"
                          value={editedSpecialist?.email}
                          onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, email: e.target.value} : null)}
                          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white outline-none"
                        />
                      ) : (
                        <span className="text-[11px] md:text-xs text-white/60 truncate">{selectedSpecialist.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5 text-white/20" />
                      </div>
                      {isEditing ? (
                        <input 
                          type="text"
                          value={editedSpecialist?.phone}
                          onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, phone: e.target.value} : null)}
                          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white outline-none"
                        />
                      ) : (
                        <span className="text-[11px] md:text-xs text-white/60">{selectedSpecialist.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8">
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleSave} className="!py-3.5 text-[9px] md:text-[10px]">
                          <Save className="w-3 h-3 mr-2" /> Salvar
                        </Button>
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="!py-3.5 text-[9px] md:text-[10px] border border-white/10">
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" onClick={() => setSelectedSpecialist(null)} className="w-full !py-3.5 text-[9px] md:text-[10px] border border-white/10 block md:hidden">
                        Fechar Perfil
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Panel: Performance & Services */}
                <div className="md:col-span-3 p-6 sm:p-8 md:p-12 space-y-8 md:space-y-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg md:text-xl font-display font-black uppercase tracking-tighter italic">Status de <span className="text-[#F6911F]">Operação</span></h4>
                    <div className="text-right">
                      <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Taxa Mensal</p>
                      <p className="text-base md:text-lg font-display font-black text-white italic">98.4%</p>
                    </div>
                  </div>

                  {/* Active Services Grid */}
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-white/40">Serviços Ativos ({selectedSpecialist.activeServices})</p>
                      <Wrench className="w-3.5 h-3.5 text-[#F6911F] opacity-30" />
                    </div>
                    
                    <div className="grid gap-3 md:gap-4">
                      {techServices.filter(ts => ts.tech === selectedSpecialist.name).map(service => (
                        <div key={service.id} className="p-4 bg-white/[0.02] border border-white/5 space-y-4 hover:border-[#F6911F]/20 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/5 flex items-center justify-center shrink-0">
                                <Car className="w-4 h-4 md:w-5 md:h-5 text-white/20" />
                              </div>
                              <div>
                                 <p className="text-xs md:text-sm font-bold uppercase tracking-tight text-white mb-0.5">{service.car}</p>
                                 <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#F6911F] font-black">{service.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                               <div className="text-left sm:text-right">
                                  <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/10 font-bold mb-0.5">Cliente</p>
                                  <p className="text-[8px] md:text-[9px] uppercase font-black text-white/40">{service.client}</p>
                               </div>
                               <div className="px-2 py-1 bg-[#F6911F]/10 border border-[#F6911F]/20 text-[#F6911F] text-[7px] md:text-[8px] font-black uppercase tracking-widest">
                                 Em Curso
                               </div>
                            </div>
                          </div>
                          
                          {/* Expanded Details */}
                          <div className="pt-4 border-t border-white/5 grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[7px] uppercase tracking-widest text-white/20 font-black mb-2">Diagnóstico Preliminar</p>
                              <p className="text-[9px] text-white/60 leading-relaxed italic">{service.diagnostics}</p>
                            </div>
                            <div>
                              <p className="text-[7px] uppercase tracking-widest text-white/20 font-black mb-2">Peças Alocadas</p>
                              <div className="flex flex-wrap gap-2">
                                {service.parts.map((part, pi) => (
                                  <span key={pi} className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] uppercase font-bold text-white/40">
                                    {part.qty}x {part.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {selectedSpecialist.activeServices === 0 && (
                        <div className="py-10 md:py-12 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-30">
                          <Clock className="w-6 h-6 md:w-8 md:h-8 mb-3" />
                          <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black">Livre no momento</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activity Log / History */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-white/40">Histórico de Performance</p>
                      <FileText className="w-3.5 h-3.5 text-white/10" />
                    </div>
                    
                    <div className="grid gap-2">
                      {serviceHistory.filter(h => h.tech === selectedSpecialist.name).map((h, hi) => (
                        <div key={hi} className="p-3 bg-white/[0.01] border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="text-[7px] font-black text-white/20 uppercase tracking-tighter">{h.date}</div>
                             <div>
                                <p className="text-[10px] font-bold text-white/60 uppercase">{h.car}</p>
                                <p className="text-[8px] text-[#F6911F] font-black uppercase tracking-widest">{h.type}</p>
                             </div>
                           </div>
                           <button className="text-[8px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-colors">Detalhes</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedSpecialist(null);
                  setIsEditing(false);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 md:w-10 md:h-10 border border-white/10 flex items-center justify-center hover:bg-[#F6911F] hover:text-black transition-all group z-20 bg-black/50"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-black" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

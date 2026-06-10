import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Wrench, Star, Clock, ExternalLink,
  Search, MoreHorizontal, X, Edit, Save, Trash2, Mail, Phone, Car, FileText, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Card, Button } from '../ui';
import { ServiceStatus } from '../../types';
import { api } from '../../lib/api';

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
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [techServices, setTechServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedSpecialist, setEditedSpecialist] = useState<Partial<Specialist> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamData, servicesData] = await Promise.all([
        api.get('/team'),
        api.get('/services/admin')
      ]);
      setSpecialists(teamData);
      setTechServices(servicesData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTeam = specialists.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.specialty && s.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (specialist: Specialist) => {
    setEditedSpecialist({ ...specialist });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setEditedSpecialist({
      name: '', email: '', phone: '', specialty: '', role: 'mechanic', status: 'available'
    });
    setIsCreating(true);
    setSelectedSpecialist({} as Specialist); // Dummy to open modal
  };

  const handleSave = async () => {
    if (!editedSpecialist) return;
    try {
      if (isCreating) {
        await api.post('/team', {
          name: editedSpecialist.name,
          email: editedSpecialist.email,
          role: editedSpecialist.role,
          specialty: editedSpecialist.specialty,
          phone: editedSpecialist.phone
        });
      } else {
        await api.put(`/team/${editedSpecialist.id}`, {
          name: editedSpecialist.name,
          role: editedSpecialist.role,
          specialty: editedSpecialist.specialty,
          phone: editedSpecialist.phone,
          status: editedSpecialist.status
        });
      }
      await loadData();
      setIsEditing(false);
      setIsCreating(false);
      setSelectedSpecialist(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Tem certeza que deseja remover este membro da equipe?")) return;
    try {
      await api.delete(`/team/${id}`);
      await loadData();
      setSelectedSpecialist(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao remover');
    }
  };

  if (loading && specialists.length === 0) return <div className="text-white/50 animate-pulse">Carregando equipe...</div>;

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            placeholder="Buscar especialista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/2 border border-white/5 rounded-none py-4 pl-12 pr-6 text-[10px] uppercase tracking-widest focus:border-[#F6911F]/40 outline-none transition-colors text-white"
          />
        </div>
        <Button onClick={handleCreateNew} className="w-full md:w-auto !py-4 md:!py-3 !px-6">
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
                setIsCreating(false);
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
                
                <div className="md:col-span-2 p-6 sm:p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 space-y-6 md:space-y-8 bg-white/[0.01]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">
                      {isCreating ? 'Novo Membro' : 'Ficha Técnica'}
                    </span>
                    {!isEditing && !isCreating && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(selectedSpecialist as Specialist)}
                          className="p-2 text-white/20 hover:text-[#F6911F] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(selectedSpecialist.id)}
                          className="p-2 text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                       <Users className="w-8 h-8 md:w-10 md:h-10 text-white/10" />
                    </div>
                    
                    <div className="text-center">
                      {isEditing || isCreating ? (
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
                          {isCreating && (
                            <div>
                              <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Email</p>
                              <input 
                                type="email"
                                value={editedSpecialist?.email}
                                onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, email: e.target.value} : null)}
                                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Cargo (Role)</p>
                            <select 
                              value={editedSpecialist?.role}
                              onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, role: e.target.value} : null)}
                              className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                            >
                              <option value="mechanic">Mecânico</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Especialidade</p>
                            <input 
                              type="text"
                              value={editedSpecialist?.specialty}
                              onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, specialty: e.target.value} : null)}
                              className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                            />
                          </div>
                          {!isCreating && (
                            <div>
                              <p className="text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Status</p>
                              <select 
                                value={editedSpecialist?.status}
                                onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, status: e.target.value as any} : null)}
                                className="w-full bg-[#111] border border-white/10 px-4 py-2 text-sm text-white focus:border-[#F6911F]/50 outline-none"
                              >
                                <option value="available">Disponível</option>
                                <option value="busy">Ocupado</option>
                                <option value="away">Ausente</option>
                              </select>
                            </div>
                          )}
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
                    {(!isCreating || isEditing) && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-white/20" />
                        </div>
                        {isEditing ? (
                          <input 
                            type="email"
                            value={editedSpecialist?.email || ''}
                            disabled
                            className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white/50 outline-none"
                          />
                        ) : (
                          <span className="text-[11px] md:text-xs text-white/60 truncate">{selectedSpecialist.email}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5 text-white/20" />
                      </div>
                      {isEditing || isCreating ? (
                        <input 
                          type="text"
                          value={editedSpecialist?.phone || ''}
                          onChange={(e) => setEditedSpecialist(prev => prev ? {...prev, phone: e.target.value} : null)}
                          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white outline-none"
                        />
                      ) : (
                        <span className="text-[11px] md:text-xs text-white/60">{selectedSpecialist.phone || 'Não informado'}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8">
                    {isEditing || isCreating ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleSave} className="!py-3.5 text-[9px] md:text-[10px]">
                          <Save className="w-3 h-3 mr-2" /> Salvar
                        </Button>
                        <Button variant="ghost" onClick={() => { setIsEditing(false); setIsCreating(false); setSelectedSpecialist(null); }} className="!py-3.5 text-[9px] md:text-[10px] border border-white/10">
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

                {!isCreating && (
                  <div className="md:col-span-3 p-6 sm:p-8 md:p-12 space-y-8 md:space-y-10">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg md:text-xl font-display font-black uppercase tracking-tighter italic">Status de <span className="text-[#F6911F]">Operação</span></h4>
                      <div className="text-right">
                        <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-white/20 font-black mb-1">Nota Avaliação</p>
                        <p className="text-base md:text-lg font-display font-black text-white italic">{selectedSpecialist.rating} / 5.0</p>
                      </div>
                    </div>

                    <div className="space-y-5 md:space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-white/40">Serviços Ativos ({selectedSpecialist.activeServices})</p>
                        <Wrench className="w-3.5 h-3.5 text-[#F6911F] opacity-30" />
                      </div>
                      
                      <div className="grid gap-3 md:gap-4">
                        {techServices
                          .filter(s => s.status === ServiceStatus.IN_PROGRESS || s.status === ServiceStatus.AWAITING_PARTS)
                          .filter(s => s.mechanics && s.mechanics.includes(selectedSpecialist.name))
                          .map(service => (
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
                            
                            <div className="pt-4 border-t border-white/5">
                              <p className="text-[7px] uppercase tracking-widest text-white/20 font-black mb-2">Diagnóstico Preliminar</p>
                              <p className="text-[9px] text-white/60 leading-relaxed italic">{service.diagnostics}</p>
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

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-black text-white/40">Histórico de Performance</p>
                        <FileText className="w-3.5 h-3.5 text-white/10" />
                      </div>
                      
                      <div className="grid gap-2">
                        {techServices
                          .filter(s => s.status === ServiceStatus.COMPLETED)
                          .filter(s => s.mechanics && s.mechanics.includes(selectedSpecialist.name))
                          .map((h) => (
                          <div key={h.id} className="p-3 bg-white/[0.01] border border-white/5 flex items-center justify-between hover:border-[#F6911F]/20 transition-all group">
                             <div className="flex items-center gap-4">
                               <div className="w-8 h-8 bg-white/5 flex items-center justify-center">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold text-white/60 uppercase">{h.car}</p>
                                  <p className="text-[8px] text-[#F6911F] font-black uppercase tracking-widest">{h.type}</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className="text-[7px] uppercase tracking-widest font-black text-white/20 mb-1">Cliente</p>
                               <p className="text-[9px] text-white/40 font-bold uppercase">{h.client}</p>
                             </div>
                          </div>
                        ))}
                        {selectedSpecialist.completedServices === 0 && (
                          <p className="text-[9px] text-white/30 text-center italic py-4">Nenhum serviço finalizado ainda.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  setSelectedSpecialist(null);
                  setIsEditing(false);
                  setIsCreating(false);
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

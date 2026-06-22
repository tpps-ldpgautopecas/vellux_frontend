import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Card, Button, Input } from '../ui';
import { api } from '../../lib/api';

interface RequestData {
  id: number;
  client: string;
  car: string;
  plate: string;
  date: string;
  service_type: string;
  notes: string;
}

const REJECTION_REASONS = [
  "Oficina lotada para esta data",
  "Peças indisponíveis no estoque",
  "Serviço requer avaliação prévia",
  "Fora do horário de expediente",
];

export function AppointmentRequests() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get('/appointments/admin/requests');
      setRequests(data);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/appointments/${id}/approve`, {});
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Ocorreu um erro ao aprovar a solicitação.');
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    const reason = customReason || rejectionReason;
    if (!reason) {
      alert('Por favor, informe o motivo da recusa.');
      return;
    }
    
    try {
      await api.put(`/appointments/${rejectingId}/reject`, { reason });
      setRequests(reqs => reqs.filter(r => r.id !== rejectingId));
      setRejectingId(null);
      setRejectionReason('');
      setCustomReason('');
    } catch (error) {
      console.error('Erro ao recusar:', error);
      alert('Ocorreu um erro ao recusar a solicitação.');
    }
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    const date = d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const time = d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${date} às ${time}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black uppercase tracking-tighter italic text-white leading-none">Solicitações de <span className="text-[#F6911F]">Agendamento</span></h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-2">Aprove ou recuse pedidos de novos clientes</p>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F6911F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-12 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F6911F]/10 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-[#F6911F]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Nenhuma solicitação pendente</h3>
          <p className="text-sm text-white/40">Todas as solicitações de agendamento foram analisadas.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F6911F]/10 rounded flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#F6911F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">{req.service_type}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Requisitado por: {req.client}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="px-3 py-1 bg-white/5 border border-white/10 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#F6911F]" />
                    {formatDateTime(req.date)}
                  </div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10">
                    {req.car} - <span className="text-[#F6911F]">{req.plate}</span>
                  </div>
                </div>

                {req.notes && (
                  <div className="text-xs text-white/60 bg-white/2 p-3 border-l-2 border-white/10">
                    "{req.notes}"
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 min-w-[140px]">
                <Button 
                  onClick={() => handleApprove(req.id)}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white border-transparent"
                >
                  <Check className="w-4 h-4 mr-2" /> Aprovar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setRejectingId(req.id)}
                  className="w-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                >
                  <X className="w-4 h-4 mr-2" /> Recusar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectingId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-white/10 w-full max-w-md shadow-2xl"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Motivo da Recusa</h3>
                <p className="text-xs text-white/40 mt-1">O cliente será notificado com este motivo.</p>
              </div>

              <div className="p-6 space-y-4">
                {REJECTION_REASONS.map(reason => (
                  <label key={reason} className="flex items-center gap-3 cursor-pointer group" onClick={() => { setRejectionReason(reason); setCustomReason(''); }}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${rejectionReason === reason && !customReason ? 'border-red-500' : 'border-white/20 group-hover:border-white/40'}`}>
                      {rejectionReason === reason && !customReason && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold">{reason}</span>
                  </label>
                ))}

                <div className="pt-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-2 block">Ou digite outro motivo:</label>
                  <Input 
                    label="Motivo Personalizado"
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                      setRejectionReason('');
                    }}
                    placeholder="Motivo personalizado..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-white/10">
                <Button variant="outline" onClick={() => {
                  setRejectingId(null);
                  setRejectionReason('');
                  setCustomReason('');
                }}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleReject}
                  className="bg-red-500 text-white hover:bg-red-600 border-transparent"
                >
                  Confirmar Recusa
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

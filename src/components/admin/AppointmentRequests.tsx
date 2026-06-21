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
      await api.put(`/appointments/${id}/approve`);
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
      alert("Selecione ou digite um motivo para a recusa.");
      return;
    }

    try {
      await api.put(`/appointments/${rejectingId}/reject`, { reason });
      setRequests(reqs => reqs.filter(r => r.id !== rejectingId));
      setRejectingId(null);
      setRejectionReason('');
      setCustomReason('');
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      alert('Ocorreu um erro ao rejeitar a solicitação.');
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-black uppercase tracking-tighter">Solicitações de Agendamento</h2>
        <div className="text-[10px] uppercase tracking-widest font-black text-white/40">
          {requests.length} pendentes
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F6911F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/2 border border-dashed border-white/10">
          <Check className="w-16 h-16 text-white/5 mb-8" />
          <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 text-white/40">Tudo limpo!</h3>
          <p className="text-xs text-white/20 uppercase tracking-widest text-center">Não há nenhuma solicitação de agendamento<br/>pendente de aprovação no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <Card key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
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
                    {formatDate(req.date)}
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A0A0A] border border-white/10 p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-display font-black uppercase tracking-tighter">Motivo da Recusa</h3>
              </div>

              <div className="space-y-4 mb-8">
                {REJECTION_REASONS.map(reason => (
                  <label key={reason} className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${rejectionReason === reason && !customReason ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="reason" 
                      className="hidden"
                      checked={rejectionReason === reason && !customReason}
                      onChange={() => {
                        setRejectionReason(reason);
                        setCustomReason('');
                      }}
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${rejectionReason === reason && !customReason ? 'border-red-500' : 'border-white/20'}`}>
                      {rejectionReason === reason && !customReason && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold">{reason}</span>
                  </label>
                ))}

                <div className="pt-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-2 block">Ou digite outro motivo:</label>
                  <Input 
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                      setRejectionReason('');
                    }}
                    placeholder="Motivo personalizado..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
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

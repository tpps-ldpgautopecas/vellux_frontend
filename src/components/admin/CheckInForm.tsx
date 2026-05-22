import React, { useState } from 'react';
import { 
  X, 
  Car, 
  User, 
  ClipboardCheck, 
  Camera,
  Save,
  AlertCircle
} from 'lucide-react';
import { Card, Button } from '../ui';

interface CheckInFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

interface ScheduledVehicle {
  id: string;
  client: string;
  car: string;
  plate: string;
  date: string;
}

export function CheckInForm({ onCancel, onSave }: CheckInFormProps) {
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<ScheduledVehicle | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'Revisão Geral',
    observations: ''
  });

  const recentAppointments: ScheduledVehicle[] = [
    { id: 'V1', client: 'Beto Oliveira', car: 'Porsche 911', plate: 'PR-9110', date: 'Hoje' },
    { id: 'V2', client: 'Ana Clara', car: 'BMW M3', plate: 'BMW-3333', date: 'Ontem' },
    { id: 'V3', client: 'Roberto Silva', car: 'Ferrari F430', plate: 'FER-4300', date: 'Há 2 dias' },
  ];

  const filteredVehicles = recentAppointments.filter(v => 
    v.car.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (v: ScheduledVehicle) => {
    setSelectedVehicle(v);
    setStep('details');
  };

  return (
    <Card className="p-0 border-none bg-black/95 backdrop-blur-xl max-h-[90vh] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-black" />
          </div>
          <h3 className="text-xl font-display font-black uppercase tracking-tighter italic">
            {step === 'select' ? 'Selecionar Veículo' : 'Designar Serviço'}
          </h3>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/5 transition-colors">
          <X className="w-5 h-5 text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-10">
        {step === 'select' ? (
          <div className="space-y-8">
            <div className="relative">
              <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Buscar por placa, modelo ou cliente..."
                className="w-full bg-white/2 border border-white/10 p-5 pl-12 text-xs text-white focus:border-yellow-500/40 outline-none uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Agendamentos Recentes (3 dias)</h4>
              <div className="grid gap-3">
                {filteredVehicles.map(v => (
                  <button 
                    key={v.id}
                    onClick={() => handleSelect(v)}
                    className="w-full p-6 bg-white/2 border border-white/5 hover:border-yellow-500/40 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/2 flex items-center justify-center border border-white/5">
                         <Car className="w-6 h-6 text-white/10 group-hover:text-yellow-500 transition-colors" />
                       </div>
                       <div>
                         <h5 className="text-base font-display font-black uppercase tracking-tighter italic">{v.car}</h5>
                         <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{v.plate} • {v.client}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[8px] uppercase font-black text-yellow-500/60">{v.date}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="py-8 border-t border-white/5 text-center">
               <p className="text-[10px] text-white/20 uppercase tracking-widest">Não encontrou o veículo? <button className="text-yellow-500 font-black">Cadastrar Manualmente</button></p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Selected Vehicle Header */}
            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-500 flex items-center justify-center">
                    <Car className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-black uppercase tracking-tighter italic">{selectedVehicle?.car}</h4>
                    <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest">{selectedVehicle?.plate}</p>
                  </div>
               </div>
               <button onClick={() => setStep('select')} className="text-[9px] font-black uppercase text-white/20 hover:text-white transition-colors">Alterar</button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Serviço a ser realizado</label>
                <div className="grid grid-cols-2 gap-3">
                   {['Revisão Geral', 'PPF / Estética', 'Mecânica Performance', 'Elétrica'].map(t => (
                     <button 
                        key={t}
                        onClick={() => setFormData({...formData, type: t})}
                        className={`p-4 border text-[9px] uppercase font-black tracking-widest transition-all ${
                          formData.type === t ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/2 border-white/5 text-white/40 hover:border-white/20'
                        }`}
                     >
                       {t}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Observações de Entrada
                </label>
                <textarea 
                  placeholder="Ex: Nível de óleo baixo, arranhão porta esquerda..."
                  className="w-full bg-white/2 border border-white/5 p-6 text-xs text-white/60 focus:border-yellow-500/40 outline-none h-32 italic"
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <Button 
                onClick={() => onSave({ ...selectedVehicle, ...formData })} 
                className="flex-1 !bg-yellow-500 !text-black !py-4 font-black text-[10px] uppercase tracking-[0.2em]"
              >
                <Save className="w-4 h-4 mr-2" /> Confirmar Entrada
              </Button>
              <Button variant="ghost" onClick={onCancel} className="!py-4 !px-10 text-[10px] uppercase tracking-widest text-white/40">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

import React, { useState } from 'react';
import { 
  Send,
  Plus,
  Trash2,
  ArrowLeft,
  DollarSign,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { Card, Button } from '../ui';

interface TechnicalReportFormProps {
  serviceId: string;
  initialServiceName?: string;
  onCancel: () => void;
  onSave: (data: any) => void;
}

export function TechnicalReportForm({ serviceId, initialServiceName = '', onCancel, onSave }: TechnicalReportFormProps) {
  const [serviceName, setServiceName] = useState(initialServiceName);
  const [procedures, setProcedures] = useState<string[]>(['']);
  const [diagnostics, setDiagnostics] = useState('');
  const [parts, setParts] = useState<{name: string, brand: string, qty: string}[]>([{name: '', brand: '', qty: '1'}]);
  const [observations, setObservations] = useState('');
  const [finalValue, setFinalValue] = useState('');

  const addProcedure = () => setProcedures([...procedures, '']);
  const updateProcedure = (index: number, val: string) => {
    const newProcs = [...procedures];
    newProcs[index] = val;
    setProcedures(newProcs);
  };
  const removeProcedure = (index: number) => setProcedures(procedures.filter((_, i) => i !== index));

  const addPart = () => setParts([...parts, {name: '', brand: '', qty: '1'}]);
  const updatePart = (index: number, field: string, val: string) => {
    const newParts = [...parts];
    newParts[index] = { ...newParts[index], [field]: val };
    setParts(newParts);
  };
  const removePart = (index: number) => setParts(parts.filter((_, i) => i !== index));

  const presets = [
    'Troca de Óleo e Filtros',
    'Revisão Sistemática 50k',
    'Alinhamento e Balanceamento 3D',
    'Diagnóstico via Scanner OBD-II',
    'Check-up de Suspensão'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 bg-white/[0.02]">
        <div>
           <button onClick={onCancel} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-2 group">
             <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Voltar
           </button>
           <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tighter italic whitespace-nowrap">Finalizar <span className="text-[#F6911F]">Serviço.</span></h2>
           <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">REGISTRO #{serviceId}</p>
        </div>
        <Button 
          onClick={() => onSave({ serviceName, procedures, diagnostics, parts, observations, finalValue })}
          disabled={!serviceName || !finalValue}
          className="!px-6 !py-4 md:!py-3 text-[10px]"
        >
          <Send className="w-4 h-4 mr-2" /> Emitir Laudo Técnico
        </Button>
      </div>

      <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* 1. Nome do Serviço */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-[#F6911F] flex items-center gap-2">
                 <Briefcase className="w-3 h-3" /> Natureza da Operação
               </label>
               <div className="p-4 bg-[#F6911F]/10 border border-[#F6911F]/20 text-xs uppercase font-black tracking-widest text-[#F6911F]">
                 {serviceName || 'Serviço Padrão'}
               </div>
            </div>

            {/* 1.5. Diagnóstico */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-2">
                 Diagnóstico de Entrada
               </label>
               <textarea 
                 value={diagnostics}
                 onChange={(e) => setDiagnostics(e.target.value)}
                 className="w-full bg-white/1 border border-white/5 p-4 text-xs text-white/60 focus:border-[#F6911F]/40 outline-none h-24"
                 placeholder="Descreva a condição técnica inicial..."
               />
            </div>

            {/* 4. Valor Final */}
            <div className="pt-6 border-t border-white/5">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 block mb-4">Investimento Total</label>
               <div className="relative">
                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F6911F]" />
                 <input 
                   type="number"
                   value={finalValue}
                   onChange={(e) => setFinalValue(e.target.value)}
                   placeholder="0.00"
                   className="w-full bg-white/2 border border-white/5 py-4 pl-12 pr-6 text-xl font-display font-black tracking-tighter"
                 />
               </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* 2. Procedimentos */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-2">
                 <CheckCircle2 className="w-3 h-3" /> Metodologia Aplicada
               </label>
               <div className="space-y-2">
                 {procedures.map((proc, idx) => (
                   <div key={idx} className="flex gap-2">
                     <input 
                       type="text"
                       value={proc}
                       onChange={(e) => updateProcedure(idx, e.target.value)}
                       placeholder={`Item ${idx + 1}`}
                       className="flex-1 bg-white/1 border border-white/5 p-3 text-[10px] text-white/80 focus:border-[#F6911F]/40 outline-none"
                     />
                     {procedures.length > 1 && (
                       <button onClick={() => removeProcedure(idx)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                     )}
                   </div>
                 ))}
                 <button onClick={addProcedure} className="text-[8px] uppercase tracking-widest font-black text-[#F6911F] flex items-center gap-2 py-1">
                   <Plus className="w-3.5 h-3.5" /> Adicionar Procedimento
                 </button>
               </div>
            </div>

            {/* 2.5. Peças Utilizadas */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-2">
                 Peças & Insumos OEM
               </label>
               <div className="space-y-2">
                 {parts.map((part, idx) => (
                   <div key={idx} className="grid grid-cols-7 gap-2">
                     <input 
                       type="text"
                       value={part.name}
                       onChange={(e) => updatePart(idx, 'name', e.target.value)}
                       placeholder="Peça"
                       className="col-span-3 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none"
                     />
                     <input 
                       type="text"
                       value={part.brand}
                       onChange={(e) => updatePart(idx, 'brand', e.target.value)}
                       placeholder="Marca"
                       className="col-span-2 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none"
                     />
                     <div className="col-span-2 flex gap-2">
                       <input 
                         type="number"
                         value={part.qty}
                         onChange={(e) => updatePart(idx, 'qty', e.target.value)}
                         className="w-10 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none"
                       />
                       {parts.length > 1 && (
                         <button onClick={() => removePart(idx)} className="text-white/10 hover:text-red-500">
                           <Trash2 className="w-3 h-3" />
                         </button>
                       )}
                     </div>
                   </div>
                 ))}
                 <button onClick={addPart} className="text-[8px] uppercase tracking-widest font-black text-[#F6911F] flex items-center gap-2 py-1">
                   <Plus className="w-3.5 h-3.5" /> Adicionar Peça
                 </button>
               </div>
            </div>

            {/* 3. Observações */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Notas Adicionais</label>
               <textarea 
                 value={observations}
                 onChange={(e) => setObservations(e.target.value)}
                 className="w-full bg-white/1 border border-white/5 p-4 text-xs text-white/60 focus:border-[#F6911F]/40 outline-none h-20"
                 placeholder="..."
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

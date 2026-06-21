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

  const DIAGNOSTIC_PRESETS = [
    'Desgaste Natural Identificado',
    'Vazamento de Fluido Constatado',
    'Ruído Metálico Suspeito',
    'Falha Eletrônica / Luz de Injeção',
    'Revisão Preventiva Padrão',
    'Sistema de Arrefecimento Comprometido',
    'Trepidação no Volante/Suspensão',
    'Perda de Potência / Falha na Aceleração',
    'Problema no Sistema de Frenagem'
  ];

  const PROCEDURE_PRESETS = [
    'Troca de Óleo e Filtro',
    'Substituição de Pastilhas',
    'Alinhamento 3D e Balanceamento',
    'Limpeza de TBI / Bicos',
    'Passagem de Scanner OBD-II',
    'Inspeção de Suspensão',
    'Troca de Fluido de Arrefecimento',
    'Higienização de AC + Ozônio',
    'Substituição de Amortecedores',
    'Reprogramação de Módulo Eletrônico'
  ];

  const PART_PRESETS = [
    { name: 'Kit Óleo 5W30 + Filtros', brand: 'OEM/Bosch', qty: '1' },
    { name: 'Pastilhas de Freio (Jogo)', brand: 'Fras-le', qty: '1' },
    { name: 'Filtro de Ar / Cabine', brand: 'Tecfil', qty: '1' },
    { name: 'Fluido de Freio DOT4', brand: 'Varga', qty: '1' },
    { name: 'Aditivo de Arrefecimento', brand: 'Paraflu', qty: '2' }
  ];

  const OBSERVATION_PRESETS = [
    'Veículo entregue em perfeitas condições.',
    'Recomendado retorno em 10.000km.',
    'Pneus próximos do limite TWI.',
    'Garantia de 90 dias nos serviços.',
    'Cliente orientado sobre vazamento leve.'
  ];

  const appendToText = (current: string, val: string, setter: any) => {
    if (!current) {
      setter(val);
    } else if (!current.includes(val)) {
      setter(current + (current.endsWith('\n') ? '' : '\n') + val);
    }
  };

  const addPresetProcedure = (val: string) => {
    if (procedures.includes(val)) return;
    const cleanProcs = procedures.filter(p => p.trim() !== '');
    setProcedures([...cleanProcs, val]);
  };

  const addPresetPart = (preset: {name: string, brand: string, qty: string}) => {
    const cleanParts = parts.filter(p => p.name.trim() !== '' || p.brand.trim() !== '');
    setParts([...cleanParts, preset]);
  };

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
               <div className="flex flex-wrap gap-2 mb-2">
                 {DIAGNOSTIC_PRESETS.map(d => (
                   <button 
                     key={d} 
                     onClick={() => appendToText(diagnostics, d, setDiagnostics)}
                     className="text-[8px] uppercase tracking-widest px-3 py-1.5 bg-white/5 hover:bg-[#F6911F]/20 hover:text-[#F6911F] text-white/50 transition-colors rounded-sm font-bold text-left"
                   >
                     + {d}
                   </button>
                 ))}
               </div>
               <textarea 
                 value={diagnostics}
                 onChange={(e) => setDiagnostics(e.target.value)}
                 className="w-full bg-white/1 border border-white/5 p-4 text-xs text-white/80 focus:border-[#F6911F]/40 outline-none h-24 font-light"
                 placeholder="Descreva a condição técnica inicial ou clique nos atalhos acima..."
               />
            </div>

            {/* 4. Valor Final */}
            <div className="pt-6 border-t border-white/5">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 block mb-4">Investimento Total</label>
               <div className="flex flex-wrap gap-2 mb-4">
                 {[50, 100, 200, 500, 1000].map(v => (
                   <button 
                     key={v}
                     onClick={() => setFinalValue((Number(finalValue) || 0) + v + '')}
                     className="text-[9px] font-black tracking-widest px-3 py-1.5 bg-[#F6911F]/10 text-[#F6911F] hover:bg-[#F6911F] hover:text-black transition-colors rounded-sm"
                   >
                     + R$ {v}
                   </button>
                 ))}
                 <button onClick={() => setFinalValue('')} className="text-[9px] font-black tracking-widest px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm">
                   Zerar
                 </button>
               </div>
               <div className="relative">
                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F6911F]" />
                 <input 
                   type="number"
                   value={finalValue}
                   onChange={(e) => setFinalValue(e.target.value)}
                   placeholder="0.00"
                   className="w-full bg-white/2 border border-white/5 py-4 pl-12 pr-6 text-xl font-display font-black tracking-tighter outline-none focus:border-[#F6911F]/40"
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
               <div className="flex flex-wrap gap-2 mb-4">
                 {PROCEDURE_PRESETS.map(p => (
                   <button 
                     key={p} 
                     onClick={() => addPresetProcedure(p)}
                     className="text-[8px] uppercase tracking-widest px-3 py-1.5 bg-white/5 hover:bg-[#F6911F]/20 hover:text-[#F6911F] text-white/50 transition-colors rounded-sm font-bold text-left"
                   >
                     + {p}
                   </button>
                 ))}
               </div>
               <div className="space-y-2">
                 {procedures.map((proc, idx) => (
                   <div key={idx} className="flex gap-2">
                     <input 
                       type="text"
                       value={proc}
                       onChange={(e) => updateProcedure(idx, e.target.value)}
                       placeholder={`Item ${idx + 1}`}
                       className="flex-1 bg-white/1 border border-white/5 p-3 text-[10px] uppercase font-bold tracking-widest text-white/80 focus:border-[#F6911F]/40 outline-none"
                     />
                     <button onClick={() => removeProcedure(idx)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 ))}
                 <button onClick={addProcedure} className="text-[8px] uppercase tracking-widest font-black text-[#F6911F] flex items-center gap-2 py-1">
                   <Plus className="w-3.5 h-3.5" /> Digitar Procedimento Manual
                 </button>
               </div>
            </div>

            {/* 2.5. Peças Utilizadas */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-2">
                 Peças & Insumos OEM
               </label>
               <div className="flex flex-wrap gap-2 mb-4">
                 {PART_PRESETS.map(p => (
                   <button 
                     key={p.name} 
                     onClick={() => addPresetPart(p)}
                     className="text-[8px] uppercase tracking-widest px-3 py-1.5 bg-white/5 hover:bg-[#F6911F]/20 hover:text-[#F6911F] text-white/50 transition-colors rounded-sm font-bold text-left"
                   >
                     + {p.name}
                   </button>
                 ))}
               </div>
               <div className="space-y-2">
                 {parts.map((part, idx) => (
                   <div key={idx} className="grid grid-cols-7 gap-2">
                     <input 
                       type="text"
                       value={part.name}
                       onChange={(e) => updatePart(idx, 'name', e.target.value)}
                       placeholder="Peça"
                       className="col-span-3 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none focus:border-[#F6911F]/40"
                     />
                     <input 
                       type="text"
                       value={part.brand}
                       onChange={(e) => updatePart(idx, 'brand', e.target.value)}
                       placeholder="Marca"
                       className="col-span-2 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none focus:border-[#F6911F]/40"
                     />
                     <div className="col-span-2 flex gap-2">
                       <input 
                         type="number"
                         value={part.qty}
                         onChange={(e) => updatePart(idx, 'qty', e.target.value)}
                         className="w-10 bg-white/1 border border-white/5 p-2 text-[9px] text-white/80 outline-none text-center focus:border-[#F6911F]/40"
                       />
                       <button onClick={() => removePart(idx)} className="text-white/10 hover:text-red-500">
                         <Trash2 className="w-3 h-3" />
                       </button>
                     </div>
                   </div>
                 ))}
                 <button onClick={addPart} className="text-[8px] uppercase tracking-widest font-black text-[#F6911F] flex items-center gap-2 py-1">
                   <Plus className="w-3.5 h-3.5" /> Adicionar Peça Manual
                 </button>
               </div>
            </div>

            {/* 3. Observações */}
            <div className="space-y-4">
               <label className="text-[9px] uppercase tracking-[0.3em] font-black text-white/30">Notas Adicionais</label>
               <div className="flex flex-wrap gap-2 mb-2">
                 {OBSERVATION_PRESETS.map(o => (
                   <button 
                     key={o} 
                     onClick={() => appendToText(observations, o, setObservations)}
                     className="text-[8px] uppercase tracking-widest px-3 py-1.5 bg-white/5 hover:bg-[#F6911F]/20 hover:text-[#F6911F] text-white/50 transition-colors rounded-sm font-bold text-left"
                   >
                     + {o}
                   </button>
                 ))}
               </div>
               <textarea 
                 value={observations}
                 onChange={(e) => setObservations(e.target.value)}
                 className="w-full bg-white/1 border border-white/5 p-4 text-xs text-white/80 focus:border-[#F6911F]/40 outline-none h-20 font-light"
                 placeholder="Digite aqui ou clique nos atalhos acima..."
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

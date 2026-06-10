import React from 'react';
import { MapPin, Phone, MessageCircle, MonitorSmartphone, ArrowRight } from 'lucide-react';
import { Card, Button } from '../ui';
import { SectionHeading } from '../layout/SectionHeading';

interface ContactProps {
  onAuthClick?: () => void;
}

export function Contact({ onAuthClick }: ContactProps) {
  return (
    <section id="contato" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <SectionHeading title="Onde estamos" subtitle="Contato" />
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#F27D26]" />
                </div>
                <div>
                  <h4 className="text-xl font-display italic mb-2">Localização</h4>
                  <p className="text-white/60 font-light">SOF/Norte Quadra 04 conjunto H loja 56<br />Asa Norte, Brasília - DF</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#F27D26]" />
                </div>
                <div>
                  <h4 className="text-xl font-display italic mb-2">Atendimento</h4>
                  <p className="text-white/60 font-light">(61) 98453-8000</p>
                  <p className="text-white/60 font-light">(61) 3233-8003</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <Card className="p-8 md:p-10 border-[#F6911F]/30 bg-[#F6911F]/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F6911F]/10 blur-[50px] -mr-10 -mt-10 rounded-full" />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <div className="w-12 h-12 border border-[#F6911F]/30 bg-black flex items-center justify-center">
                     <MonitorSmartphone className="w-6 h-6 text-[#F6911F]" />
                   </div>
                   <div>
                     <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter text-[#F6911F] leading-none">Agendamento Digital</h3>
                     <p className="text-[9px] uppercase tracking-widest font-black text-white/40 mt-1">Recomendado</p>
                   </div>
                </div>

                <p className="text-white/60 text-sm font-light mb-8 leading-relaxed relative z-10">
                  Crie sua conta na Vellux Motors para agendar serviços em tempo real, acompanhar o histórico completo do seu veículo e acessar laudos técnicos detalhados diretamente pela plataforma.
                </p>

                <Button onClick={onAuthClick} className="w-full !py-4 group/btn relative z-10">
                   <span className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-black">
                     Criar Conta / Acessar <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                   </span>
                </Button>
             </Card>

             <Card className="p-8 md:p-10 bg-white/[0.01]">
                <h3 className="text-lg md:text-xl font-display font-black uppercase tracking-tighter mb-6 text-white/80">Outros Canais de Atendimento</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 border border-white/10 flex items-center justify-center">
                            <Phone className="w-3.5 h-3.5 text-white/40" />
                         </div>
                         <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/40 font-black mb-0.5">Telefone</p>
                            <p className="text-sm font-display font-black tracking-tighter">(61) 3233-8003</p>
                         </div>
                      </div>
                      <Button variant="outline" className="w-full !py-2.5 !text-[9px] uppercase tracking-[0.2em] font-black border-white/10 text-white/40 hover:text-white">Ligar Agora</Button>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 border border-[#25D366]/20 flex items-center justify-center bg-[#25D366]/5">
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                         </div>
                         <div>
                            <p className="text-[8px] uppercase tracking-widest text-[#25D366] font-black mb-0.5">WhatsApp</p>
                            <p className="text-sm font-display font-black tracking-tighter">(61) 98453-8000</p>
                         </div>
                      </div>
                      <Button variant="outline" className="w-full !py-2.5 !text-[9px] uppercase tracking-[0.2em] font-black border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10">Iniciar Conversa</Button>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

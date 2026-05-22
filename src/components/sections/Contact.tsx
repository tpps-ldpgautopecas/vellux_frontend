import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Card, Button } from '../ui';
import { SectionHeading } from '../layout/SectionHeading';

export function Contact() {
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

          <div>
             <Card className="p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter mb-4 text-[#F6911F]">Canais de Atendimento</h3>
                <p className="text-white/40 text-[11px] md:text-xs uppercase tracking-widest font-bold mb-8 leading-relaxed">
                  Entre em contato via WhatsApp ou telefone para agendamentos e orçamentos:
                </p>

                <div className="space-y-6 border border-white/5 p-6 bg-white/[0.01]">
                   {/* Telefone */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 border border-[#F6911F]/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-[#F6911F]" />
                         </div>
                         <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#F6911F] font-black mb-0.5">Telefone</p>
                            <p className="text-lg font-display font-black tracking-tighter">(61) 3233-8003</p>
                         </div>
                      </div>
                      <Button variant="outline" className="w-full !py-3 !text-[10px] uppercase tracking-[0.2em] font-black">Ligar Agora</Button>
                   </div>

                   <div className="w-full h-[1px] bg-white/5" />

                   {/* WhatsApp */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 border border-[#25D366]/20 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-[#25D366]" />
                         </div>
                         <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#25D366] font-black mb-0.5">WhatsApp</p>
                            <p className="text-lg font-display font-black tracking-tighter">(61) 98453-8000</p>
                         </div>
                      </div>
                      <Button className="w-full !py-3 !text-[10px] uppercase tracking-[0.2em] font-black bg-white/2 hover:bg-white/5 border border-white/10">Iniciar Conversa</Button>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

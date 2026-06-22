import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Cpu, Settings, Palette, ChevronRight, Gauge, Thermometer, Droplets, X, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '../ui';
import { SectionHeading } from '../layout/SectionHeading';

export function Services() {
  const [selectedService, setSelectedService] = useState<null | typeof items[0]>(null);

  const items = [
    { 
      title: 'Revisão & Mecânica', 
      icon: Wrench, 
      desc: 'Revisão geral, troca de óleo, filtros e manutenção preventiva completa.',
      details: 'Nossa revisão contempla mais de 150 pontos de inspeção. Utilizamos exclusivamente lubrificantes sintéticos de alta performance e filtros originais para garantir a longevidade do seu motor, seguindo rigorosamente os manuais técnicos de fabricantes nacionais e importados.',
      features: ['Troca de Óleo e Filtros', 'Limpeza de Sistema de Arrefecimento', 'Revisão de Correias e Esticadores', 'Check-up de Suspensão'],
      img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Suspensão & Freios', 
      icon: Settings, 
      desc: 'Alinhamento, balanceamento, reparo em suspensão, rolamentos e sistemas de freios.',
      details: 'O sistema de rodagem é vital para a segurança e o handling do veículo. Realizamos o alinhamento 3D e balanceamento computadorizado com equipamentos de precisão absoluta, garantindo o desgaste uniforme dos pneus e estabilidade total.',
      features: ['Alinhamento 3D de Precisão', 'Reparo em Sistemas de Freio', 'Troca de Rolamentos e Buchas', 'Ajuste de Camber e Caster'],
      img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Diagnóstico Bosch', 
      icon: Gauge, 
      desc: 'Eletrônica embarcada e diagnóstico computadorizado Bosch/Sun de alta precisão.',
      details: 'Utilizamos scanners de última geração homologados pela Bosch e Sun para acessar a telemetria completa do veículo. Identificamos falhas intermitentes, realizamos recalibração de sensores e atualizamos softwares de módulos de controle.',
      features: ['Varredura de Erros (DTC)', 'Análise de Emissão de Gases', 'Recalibração de Sensores ABS/Airbag', 'Teste de Bateria e Alternador'],
      img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Estética & Pintura', 
      icon: Palette, 
      desc: 'Lanternagem, pintura, polimento técnico, vitrificação e detalhamento de interiores.',
      details: 'Elevamos a estética do seu automóvel ao nível de concurso. Nosso processo de polimento em múltiplos estágios remove imperfeições, seguido de vitrificação cerâmica 9H para proteção extrema. Na lanternagem, utilizamos cabine de pintura italiana e tintas de alta fidelidade cromática.',
      features: ['Polimento Técnico Triple Stage', 'Vitrificação Cerâmica Pro', 'Pintura em Estufa Certificada', 'Higiene Interna com Ozônio'],
      img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Câmbio & Transmissão', 
      icon: Cpu, 
      desc: 'Manutenção em câmbios automáticos, manuais e diferenciais de alta performance.',
      details: 'Especialistas em transmissão de dupla embreagem (PDK, DSG) e câmbios automáticos sequenciais. Realizamos a troca de fluido por diálise e calibração de mecatrônica para trocas de marcha imperceptíveis e máxima durabilidade.',
      features: ['Troca de Fluido por Diálise', 'Calibração de Mecatrônica', 'Reparo em Diferenciais', 'Manutenção PDK / DSG'],
      img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Climatização Ozônio', 
      icon: Thermometer, 
      desc: 'Higienização completa do ar-condicionado com tecnologia de ozônio avançada.',
      details: 'Muito além de um simples filtro de cabine. Utilizamos a ozonização para eliminar 99.9% de fungos e bactérias nos dutos de ventilação, garantindo um ambiente puro e livre de odores, além de carga de gás refrigerante de precisão.',
      features: ['Ozonização de Cabine', 'Limpeza Profunda de Dutos', 'Carga de Gás Ecológico', 'Troca de Filtro de Partículas'],
      img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=1000'
    },
  ];

  return (
    <section className="py-32 bg-white/2 border-y border-white/5" id="servicos">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          title="Engenharia de Serviços" 
          subtitle="Nossos Serviços" 
          description="Do diagnóstico digital à reconstrução estética, entregamos excelência técnica em cada detalhe."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card 
                onClick={() => setSelectedService(item)}
                className="group h-[450px] relative overflow-hidden bg-white/2 border-white/5 cursor-pointer hover:border-[#F6911F]/50 transition-all duration-500"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 bg-[#F6911F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-white mb-4 italic italic leading-none">{item.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed uppercase tracking-widest font-black mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[#F6911F]">
                    Saber Mais <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-[#080808] border border-white/10 overflow-hidden z-10"
            >
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto relative">
                   <img 
                    src={selectedService.img} 
                    alt={selectedService.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#080808] via-[#080808]/40 to-transparent" />
                </div>
                
                <div className="p-8 sm:p-12 space-y-8 flex flex-col justify-center">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">Especialidade</span>
                      <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tighter italic text-white mt-1 leading-none">{selectedService.title}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedService(null)}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#F6911F] hover:text-black transition-all group"
                    >
                      <X className="w-5 h-5 text-white/40 group-hover:text-black" />
                    </button>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed italic font-light">
                    {selectedService.details}
                  </p>

                  <div className="space-y-4 pt-4">
                    <p className="text-[10px] uppercase tracking-widest font-black text-white/20">Destaques do Serviço</p>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedService.features.map(f => (
                        <div key={f} className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#F6911F]" />
                          <span className="text-[10px] uppercase font-black text-white/60 tracking-widest">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                     <Button className="!px-10 !py-4 text-[10px] uppercase tracking-widest font-black">Agendar Agora</Button>
                     <Button variant="ghost" className="!px-8 !py-4 text-[10px] uppercase tracking-widest text-white/30 hover:text-white" onClick={() => setSelectedService(null)}>Voltar</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

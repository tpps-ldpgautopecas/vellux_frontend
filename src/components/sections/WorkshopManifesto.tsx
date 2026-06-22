import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Cpu, Award } from 'lucide-react';
import { Card } from '../ui';

export function WorkshopManifesto() {
  const pillars = [
    {
      icon: Cpu,
      title: "Tecnologia de Ponta",
      desc: "Diagnósticos via telemetria avançada e ferramentas homologadas pelas maiores montadoras do mundo."
    },
    {
      icon: ShieldCheck,
      title: "Garantia Blindada",
      desc: "Cada parafuso apertado é registrado. Oferecemos rastreabilidade total de cada intervenção realizada."
    },
    {
      icon: Zap,
      title: "Alta Performance",
      desc: "Especialistas em extrair o máximo potencial de motores aspirados e biturbo com precisão alemã."
    },
    {
      icon: Award,
      title: "Excelência Certificada",
      desc: "Nossa equipe passa por treinamentos constantes nos centros técnicos."
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F6911F]/5 skew-x-12 translate-x-24" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">Nosso DNA</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter italic leading-none">
                Mais que uma oficina, <br />
                um <span className="text-[#F6911F]">Vellux de Engenharia.</span>
              </h2>
            </div>

            <p className="text-white/40 text-lg leading-relaxed font-light italic">
              Nascemos da paixão pela perfeição mecânica. Na Vellux Motors, não apenas consertamos carros; restauramos a alma de máquinas que foram feitas para desafiar os limites. Nossa infraestrutura foi desenhada para atender aos padrões mais rigorosos de colecionadores e entusiastas de performance.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-4xl font-display font-black text-white italic tracking-tighter">10+</p>
                <p className="text-[10px] uppercase tracking-widest text-[#F6911F] font-black mt-2">Anos de Pista</p>
              </div>
              <div>
                <p className="text-4xl font-display font-black text-white italic tracking-tighter">5k+</p>
                <p className="text-[10px] uppercase tracking-widest text-[#F6911F] font-black mt-2">Projetos Entregues</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 border-white/5 bg-white/[0.02] hover:border-[#F6911F]/30 hover:bg-white/[0.05] transition-all group h-full">
                  <div className="w-12 h-12 bg-[#F6911F]/10 border border-[#F6911F]/20 flex items-center justify-center mb-6 group-hover:bg-[#F6911F] transition-all">
                    <pillar.icon className="w-6 h-6 text-[#F6911F] group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 italic">{pillar.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed uppercase tracking-tighter">{pillar.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

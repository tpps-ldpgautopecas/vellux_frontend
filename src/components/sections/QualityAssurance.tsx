import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star, Quote, Award } from 'lucide-react';
import { Card } from '../ui';

export function QualityAssurance() {
  const testimonials = [
    {
      name: "Henrique G. Santos",
      car: "Porsche 911 GT3",
      comment: "A única oficina no Brasil em que confio para mexer na eletrônica da minha Porsche. Precisão cirúrgica.",
      rating: 5
    },
    {
      name: "Marcus Vitruvius",
      car: "Ferrari 488 Pista",
      comment: "O atendimento via dashboard é um diferencial absurdo. Consigo acompanhar cada etapa da revisão em tempo real.",
      rating: 5
    },
    {
      name: "Ricardo Albuquerque",
      car: "Audi RS6 Avant",
      comment: "Serviço de suspensão e freios impecável. O carro voltou com um handling muito superior ao original.",
      rating: 5
    },
    {
      name: "Fabiana Mendes",
      car: "Range Rover Velar",
      comment: "A vitrificação cerâmica ficou espetacular. O brilho é profundo e a facilidade de limpeza no dia a dia é incrível.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#080808] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-2">
          <div className="space-y-4">
             <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">Selo de Confiança</span>
             <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter italic">Qualidade que <br /> <span className="text-white/20">Atesta Resultados.</span></h2>
          </div>
          <div className="flex bg-white/2 border border-white/5 p-4 items-center gap-6 divide-x divide-white/5">
             <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F6911F] fill-[#F6911F]" />
                <span className="text-lg font-display font-black italic">4.9/5</span>
                <span className="text-[10px] text-white/20 uppercase tracking-widest ml-2">Google Reviews</span>
             </div>
             <div className="pl-6 flex items-center gap-3">
                <Award className="w-5 h-5 text-[#F6911F]" />
                <span className="text-[10px] uppercase tracking-widest font-black text-white/60">Workshop of the Year 2025</span>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          {/* Testimonials */}
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="h-full"
            >
              <Card className="p-10 border-white/5 bg-white/[0.01] h-full flex flex-col justify-between group hover:border-[#F6911F]/20 transition-all">
                <div className="space-y-6">
                  <Quote className="w-10 h-10 text-white/5 group-hover:text-[#F6911F]/20 transition-colors" />
                  <p className="text-lg italic font-light text-white/60 leading-relaxed tracking-tight group-hover:text-white transition-colors">
                    "{t.comment}"
                  </p>
                </div>
                
                <div className="pt-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center italic font-display font-black text-[#F6911F]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest font-black text-white">{t.name}</h4>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#F6911F] font-bold">{t.car}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

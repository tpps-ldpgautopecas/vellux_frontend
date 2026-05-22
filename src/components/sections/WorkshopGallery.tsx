import React from 'react';
import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

export function WorkshopGallery() {
  const images = [
    { url: 'https://lh3.googleusercontent.com/d/100KXuvNsA1I9jnMvD6BwIzLlPcRAKTr7', title: 'Equipe Técnica' },
    { url: 'https://lh3.googleusercontent.com/d/1b418NVWB0gCeKkqc1wNFlpqHCQOqD1qe', title: 'Equipamentos de Ponta' },
    { url: 'https://lh3.googleusercontent.com/d/13pd2it9XTgZ195N7a_Ra7EH30je_ZLVB', title: 'Precisão em Alinhamento' },
    { url: 'https://lh3.googleusercontent.com/d/1kPJ1zrsucrOcHuI59iK_KJCA6opNq7py', title: 'Nossa Unidade' },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-[#F6911F]/10 border border-[#F6911F]/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#F6911F]" />
          </div>
          <div>
            <span className="text-[#F6911F] text-[10px] uppercase tracking-[0.4em] font-black">Nossa Estrutura</span>
            <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic text-white leading-none">Tour pela <span className="text-white/20">Vellux Motors.</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square overflow-hidden group border border-white/5"
            >
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-[10px] uppercase tracking-widest font-black text-white">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

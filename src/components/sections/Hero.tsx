import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui';

export function Hero() {
  return (
    <section id="inicio" className="relative h-screen flex border-b border-white/10 overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60 z-10" />
        <img 
          src="https://lh3.googleusercontent.com/d/1JrgLGpswMp5OOiC8OzinSSOT1LvFdyWZ" 
          alt="Oficina Vellux Motors" 
          className="w-full h-full object-cover grayscale opacity-30"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Decorative Text */}
      
      <div className="w-full md:w-3/5 p-6 md:p-12 lg:p-24 flex flex-col justify-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 1 }}
        >
          <p className="text-[#F6911F] text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-black flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#95191C]" />
            Oficina de Alta Engenharia
          </p>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] mb-8 md:mb-12 text-white tracking-tighter uppercase whitespace-normal break-words">
            Vellux <span className="text-[#F6911F]">Motors.</span>
          </h1>
          <p className="text-white/50 max-w-2xl text-base md:text-lg lg:text-xl leading-relaxed font-light mb-8 md:mb-12">
            Oficina especializada em carros importados e nacionais, prestando serviço de <span className="text-white font-bold">EXCELÊNCIA</span> para clientes que fazem o melhor por seus automóveis.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8">
            <Button className="!py-5 px-10">Reservar Diagnóstico</Button>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Disponibilidade Hoje</span>
              <span className="text-sm text-white/80 font-medium italic">Atendimento até 19:00</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden md:flex w-2/5 bg-white/[0.02] border-l border-white/10 flex-col justify-end p-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-12"
        >
          <div className="border-l-[1px] border-[#D4AF37] pl-8">
             <p className="text-2xl font-light italic mb-2 tracking-tight">"A precisão não é apenas uma métrica, é o nosso compromisso."</p>
             <p className="text-[10px] uppercase tracking-widest text-white/30">— Equipe Vellux</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

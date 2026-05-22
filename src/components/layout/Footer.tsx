import React from 'react';

export function Footer() {
  return (
    <footer className="py-24 border-t border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-[3px] bg-[#95191C] rounded-none" />
                  <span className="w-6 h-[3px] bg-[#95191C] rounded-none" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-[#F6911F] leading-none mt-1">Vellux</span>
              </div>
            </div>
            <p className="text-[11px] text-white/20 leading-relaxed max-w-xs font-light uppercase tracking-widest">
              Excellence in Motion. O atelier mecânico de elite em Brasília.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Vellux</h4>
            <ul className="space-y-4 text-xs text-white/30 font-light">
              <li><a href="#" className="hover:text-[#F6911F] transition-colors">Revisão Especializada</a></li>
              <li><a href="#" className="hover:text-[#F6911F] transition-colors">Performance Tuning</a></li>
              <li><a href="#" className="hover:text-[#F6911F] transition-colors">Blindados Premium</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Empresa</h4>
            <ul className="space-y-4 text-xs text-white/30 font-light">
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">Nossa História</a></li>
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">Trabalhe Conosco</a></li>
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">Blog Mecânico</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Social</h4>
            <ul className="space-y-4 text-xs text-white/30 font-light">
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">Instagram</a></li>
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">Facebook</a></li>
               <li><a href="#" className="hover:text-[#F6911F] transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] text-white/10 uppercase tracking-widest font-black">© 2026 Vellux Motors. All Rights Reserved.</p>
           <div className="flex gap-8 text-[10px] text-white/10 uppercase tracking-widest font-black">
              <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

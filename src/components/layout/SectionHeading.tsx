import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#F6911F] font-black mb-3 md:mb-4 block flex items-center gap-2">
        <span className="w-4 h-[2px] bg-[#95191C]" /> {subtitle}
      </span>
      <h2 className="text-4xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter uppercase leading-tight md:leading-none">{title}</h2>
      {description && <p className="text-white/40 text-sm md:text-base mt-6 max-w-2xl leading-relaxed italic">{description}</p>}
    </div>
  );
}

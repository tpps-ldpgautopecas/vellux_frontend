import React, { ReactNode } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

export function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/[0.03] border border-white/10 py-4 ${icon ? 'pl-12' : 'px-6'} pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-[#F6911F]/40 transition-colors duration-300 font-sans text-sm tracking-wide`}
          {...props}
        />
      </div>
    </div>
  );
}

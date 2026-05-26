import { motion } from "motion/react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  onClick?: any;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props
}: ButtonProps) {
  const baseStyles = "px-10 py-4 font-bold transition-all duration-300 text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#F6911F] text-black hover:bg-[#ff9d3d] shadow-[0_4px_20px_rgba(246,145,31,0.15)]",
    outline: "border border-[#F6911F]/40 text-[#F6911F] hover:bg-[#F6911F] hover:text-black",
    ghost: "text-white/40 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

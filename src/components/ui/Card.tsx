import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: any;
  key?: React.Key;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white/[0.02] border border-white/10 p-8 ${className}`} {...props}>
      {children}
    </div>
  );
}

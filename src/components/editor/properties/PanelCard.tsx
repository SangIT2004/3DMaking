"use client"

import { ReactNode } from "react";

type PanelCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function PanelCard({ title, children, className = '' }: PanelCardProps) {
  return (
    <div className={className ? `rounded-xl border border-white/5 bg-white/[0.02] p-3 ${className}` : 'rounded-xl border border-white/5 bg-white/[0.02] p-3'}>
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

import React from 'react';
import { Network, Brain, Cpu } from 'lucide-react';

interface LogoProps {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export function Logo({ theme = 'light', size = 'md' }: LogoProps) {
  const isDark = theme === 'dark';
  const iconBoxClass =
    size === 'sm'
      ? 'h-10 w-10 rounded-xl'
      : 'h-11 w-11 rounded-2xl';
  const iconClass = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const badgeClass = size === 'sm' ? 'h-4 w-4 rounded-md' : 'h-5 w-5 rounded-lg';
  const badgeIconClass = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  const titleClass = size === 'sm' ? 'text-base' : 'text-lg';
  const subtitleClass =
    size === 'sm'
      ? 'text-[9px] tracking-[0.22em]'
      : 'text-[10px] tracking-[0.28em]';

  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#395886] via-[#4A6FA8] to-[#628ECB] shadow-lg shadow-[#628ECB]/20 ${iconBoxClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_70%)] rounded-2xl" />
        <Network className={`${iconClass} text-white`} />
        <div className={`absolute -bottom-1 -right-1 flex items-center justify-center bg-[#FCD34D] shadow-sm border-2 ${isDark ? 'border-[#395886]' : 'border-white'} ${badgeClass}`}>
          <Brain className={`${badgeIconClass} text-[#395886]`} />
        </div>
      </div>
      <div className="min-w-0 flex flex-col justify-center">
        <h1 className={`${titleClass} font-black leading-none tracking-tight ${isDark ? 'text-white' : 'text-[#395886]'}`}>
          CONNETIC Module
        </h1>
        <p className={`${subtitleClass} font-semibold leading-tight mt-0.5 ${isDark ? 'text-white/72' : 'text-[#628ECB]'}`}>
          Contextual Network Logic
        </p>
      </div>
    </div>
  );
}

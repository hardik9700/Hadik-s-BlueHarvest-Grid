import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'indigo';
  decimals?: 3 | 4;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color,
  decimals = 3
}) => {
  const styles = {
    blue: {
      icon: 'text-cyan-400',
      bg: 'group-hover:bg-cyan-500/5 group-hover:border-cyan-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
    },
    yellow: {
      icon: 'text-amber-400',
      bg: 'group-hover:bg-amber-500/5 group-hover:border-amber-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]'
    },
    green: {
      icon: 'text-emerald-400',
      bg: 'group-hover:bg-emerald-500/5 group-hover:border-emerald-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'
    },
    red: {
      icon: 'text-rose-400',
      bg: 'group-hover:bg-rose-500/5 group-hover:border-rose-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]'
    },
    purple: {
      icon: 'text-violet-400',
      bg: 'group-hover:bg-violet-500/5 group-hover:border-violet-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]'
    },
    indigo: {
      icon: 'text-indigo-400',
      bg: 'group-hover:bg-indigo-500/5 group-hover:border-indigo-500/20',
      shadow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]'
    }
  };

  const selectedStyle = styles[color];

  return (
    <div className={`group glass-panel rounded-xl p-5 transition-all duration-300 border-white/5 hover:-translate-y-1 ${selectedStyle.bg} ${selectedStyle.shadow}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <div className={`p-2 rounded-lg bg-white/5 ${selectedStyle.icon}`}>
           <Icon size={18} />
        </div>
      </div>
      <div className="flex items-baseline space-x-1.5">
        <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums drop-shadow-lg">
          {value.toFixed(decimals)}
        </span>
        <span className="text-xs font-semibold text-slate-500">{unit}</span>
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string, subtitle?: string, action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="mb-8 flex justify-between items-end border-b border-white/5 pb-4">
    <div>
      <h2 className="text-3xl font-light text-white mb-1 tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm font-light tracking-wide">{subtitle}</p>}
    </div>
    {action && (
      <div className="mb-1">
        {action}
      </div>
    )}
  </div>
);

export const DataRow: React.FC<{ label: string, value: string | number, subtext?: string, color?: string }> = ({ label, value, subtext, color = 'text-white' }) => (
  <div className="flex justify-between items-center py-3 border-b border-dashed border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded transition-colors">
    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
    <div className="text-right">
      <div className={`font-mono font-medium ${color}`}>{value}</div>
      {subtext && <div className="text-[10px] text-slate-500 mt-0.5">{subtext}</div>}
    </div>
  </div>
);

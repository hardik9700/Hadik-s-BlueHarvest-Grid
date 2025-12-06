import React from 'react';
import { SystemState } from '../types';
import { formatPrecision, formatDecimal } from '../utils';
import { Navigation } from 'lucide-react';

interface MapTrackerProps {
  data: SystemState;
}

export const MapTracker: React.FC<MapTrackerProps> = ({ data }) => {
  // SVG ViewBox dimensions
  const width = 800;
  const height = 500;

  return (
    <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Navigation className="text-indigo-400" size={18} />
          <span className="font-semibold text-white tracking-wide text-sm">Live Grid</span>
        </div>
        <div className="flex space-x-6">
          <LegendItem color="bg-amber-400" label="Solar Raft" />
          <LegendItem color="bg-cyan-400" label="Aqua Zone" />
          <LegendItem color="bg-emerald-400" label="Agri Plot" />
        </div>
      </div>
      
      <div className="relative flex-1 bg-[#050b1d] overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>

        {/* Schematic Map Representation */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d relative z-10">
          <defs>
             <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" style={{stroke:'rgba(6,182,212,0.1)', strokeWidth:1}} />
             </pattern>
          </defs>

          {/* Water Body */}
          <path d="M 0 150 Q 400 100 800 150 L 800 500 L 0 500 Z" fill="url(#diagonalHatch)" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
          
          {/* Land Mass */}
          <path d="M 0 0 L 800 0 L 800 150 Q 400 100 0 150 Z" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />

          {/* Solar Rafts */}
          {data.solar.map((item, idx) => {
            const x = 100 + (idx * 150) + (item.coordinates.lng % 0.01) * 5000; 
            const y = 200 + (item.coordinates.lat % 0.01) * 5000;
            const isDrifting = item.driftOffsetMeters > 2.000;

            return (
              <g key={`solar-${idx}`} transform={`translate(${x}, ${y})`}>
                {isDrifting && (
                   <circle r="30" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.5">
                     <animate attributeName="r" from="20" to="50" dur="1.5s" repeatCount="indefinite" />
                     <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                   </circle>
                )}
                {/* Connection Line to center */}
                <line x1="0" y1="0" x2="0" y2="25" stroke="rgba(255,255,255,0.2)" />
                
                <rect x="-16" y="-16" width="32" height="32" rx="2" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
                <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
                
                <text y="-25" textAnchor="middle" fill="#fbbf24" fontSize="10" className="font-mono font-bold tracking-wider">
                   S-{idx+1}
                </text>
              </g>
            );
          })}

          {/* Aqua Cages */}
          {data.aqua.map((item, idx) => {
             const x = 180 + (idx * 140);
             const y = 350 + (idx * 20);
             return (
               <g key={`aqua-${idx}`} transform={`translate(${x}, ${y})`}>
                 <circle r="14" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                 <circle r="4" fill="#22d3ee" />
                 <text y="-25" textAnchor="middle" fill="#22d3ee" fontSize="10" className="font-mono font-bold tracking-wider">
                    A-{idx+1}
                 </text>
               </g>
             );
          })}

          {/* Agri Plots (On Land) */}
          {data.agri.map((item, idx) => {
            const x = 150 + (idx * 180);
            const y = 80;
            return (
              <g key={`agri-${idx}`} transform={`translate(${x}, ${y})`}>
                <polygon points="0,-12 12,6 -12,6" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
                 <text y="-20" textAnchor="middle" fill="#34d399" fontSize="10" className="font-mono font-bold tracking-wider">
                    G-{idx+1}
                 </text>
              </g>
            );
          })}
        </svg>

        {/* Overlay Details Panel */}
        <div className="absolute bottom-6 right-6 glass-panel border border-white/10 p-4 rounded-xl shadow-2xl w-72 max-h-[220px] overflow-y-auto">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Telemetry Feed</h4>
          <div className="space-y-3">
            {data.solar.map((s, i) => (
              <div key={`s-list-${i}`} className="flex justify-between items-center text-xs pb-1">
                <span className="text-amber-400 font-mono font-bold">S-{i+1}</span>
                <div className="text-right">
                  <div className="text-slate-400 font-mono text-[10px]">{formatPrecision(s.coordinates.lat)}, {formatPrecision(s.coordinates.lng)}</div>
                  {s.driftOffsetMeters > 0.5 && (
                    <div className={`font-mono text-[10px] mt-0.5 ${s.driftOffsetMeters > 2 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                      Drift: {formatDecimal(s.driftOffsetMeters)}m
                    </div>
                  )}
                </div>
              </div>
            ))}
             {data.aqua.map((s, i) => (
              <div key={`a-list-${i}`} className="flex justify-between items-center text-xs pb-1">
                <span className="text-cyan-400 font-mono font-bold">A-{i+1}</span>
                <div className="text-right">
                   <div className="text-slate-400 font-mono text-[10px]">{formatPrecision(s.coordinates.lat)}, {formatPrecision(s.coordinates.lng)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

import React from 'react';
import { 
  LayoutDashboard, 
  Sun, 
  Fish, 
  Sprout, 
  Map as MapIcon, 
  Menu,
  X,
  Activity,
  Hexagon
} from 'lucide-react';
import { Sector } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeSector: Sector;
  onSectorChange: (sector: Sector) => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`group relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 overflow-hidden ${
      isActive 
        ? 'text-white bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
    )}
    <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:scale-110'}`} />
    <span className={`font-medium tracking-wide ${isActive ? 'text-indigo-50' : ''}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeSector, onSectorChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed z-20 glass-panel border-r-0 border-r-white/5 shadow-2xl">
        <div className="flex items-center space-x-3 px-6 py-8">
          <div className="relative">
            <Hexagon className="text-indigo-500 fill-indigo-500/20" size={32} strokeWidth={1.5} />
            <Activity className="absolute inset-0 m-auto text-white" size={16} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              EcoVoltaic
            </h1>
            <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono">Nexus OS v2.1</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={LayoutDashboard} 
            label={Sector.DASHBOARD} 
            isActive={activeSector === Sector.DASHBOARD} 
            onClick={() => onSectorChange(Sector.DASHBOARD)} 
          />
          <NavItem 
            icon={Sun} 
            label={Sector.SOLAR} 
            isActive={activeSector === Sector.SOLAR} 
            onClick={() => onSectorChange(Sector.SOLAR)} 
          />
          <NavItem 
            icon={Fish} 
            label={Sector.AQUACULTURE} 
            isActive={activeSector === Sector.AQUACULTURE} 
            onClick={() => onSectorChange(Sector.AQUACULTURE)} 
          />
          <NavItem 
            icon={Sprout} 
            label={Sector.AGRICULTURE} 
            isActive={activeSector === Sector.AGRICULTURE} 
            onClick={() => onSectorChange(Sector.AGRICULTURE)} 
          />
          <NavItem 
            icon={MapIcon} 
            label={Sector.MAP} 
            isActive={activeSector === Sector.MAP} 
            onClick={() => onSectorChange(Sector.MAP)} 
          />
        </nav>

        <div className="p-6">
          <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">System Optimal</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Latency: 12ms<br/>
              Uptime: 99.99%
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full glass-panel z-30 px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Hexagon className="text-indigo-500" size={24} />
          <span className="font-bold text-lg text-white">EcoVoltaic</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#020617]/95 backdrop-blur-xl z-20 pt-24 px-4 space-y-2">
           <NavItem 
            icon={LayoutDashboard} 
            label={Sector.DASHBOARD} 
            isActive={activeSector === Sector.DASHBOARD} 
            onClick={() => { onSectorChange(Sector.DASHBOARD); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={Sun} 
            label={Sector.SOLAR} 
            isActive={activeSector === Sector.SOLAR} 
            onClick={() => { onSectorChange(Sector.SOLAR); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={Fish} 
            label={Sector.AQUACULTURE} 
            isActive={activeSector === Sector.AQUACULTURE} 
            onClick={() => { onSectorChange(Sector.AQUACULTURE); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={Sprout} 
            label={Sector.AGRICULTURE} 
            isActive={activeSector === Sector.AGRICULTURE} 
            onClick={() => { onSectorChange(Sector.AGRICULTURE); setIsMobileMenuOpen(false); }} 
          />
          <NavItem 
            icon={MapIcon} 
            label={Sector.MAP} 
            isActive={activeSector === Sector.MAP} 
            onClick={() => { onSectorChange(Sector.MAP); setIsMobileMenuOpen(false); }} 
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StatCard, SectionHeader, DataRow } from './components/Widgets';
import { MapTracker } from './components/MapTracker';
import { analyzeSystem } from './services/geminiService';
import { formatDecimal, formatPrecision } from './utils';
import { 
  Sector, 
  SystemState, 
  SolarData, 
  AquaData, 
  AgriData,
  Alert 
} from './types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Zap, 
  Battery, 
  Thermometer, 
  Droplets, 
  Leaf, 
  AlertTriangle,
  BrainCircuit,
  Loader2,
  Fish,
  Sun,
  Wind,
  Activity,
  CheckCircle2
} from 'lucide-react';

// --- MOCK DATA GENERATORS ---
const generateSolarData = (id: number): SolarData => ({
  currentOutputKw: 45.120 + Math.random() * 5,
  dailyForecastKwh: 320.500 + Math.random() * 20,
  batteryLevelPercent: 85.000 - Math.random() * 2,
  panelEfficiency: 21.450 + Math.random() * 0.5,
  isShaded: Math.random() > 0.9,
  status: Math.random() > 0.95 ? 'Warning' : 'Normal',
  coordinates: {
    lat: 13.756 + (id * 0.001) + (Math.random() * 0.0001),
    lng: 100.501 + (id * 0.001) + (Math.random() * 0.0001)
  },
  driftOffsetMeters: Math.random() * 2.5
});

const generateAquaData = (id: number): AquaData => ({
  waterTempC: 24.500 + Math.random(),
  dissolvedOxygenMgL: 6.800 + Math.random() * 0.5,
  phLevel: 7.200 + (Math.random() * 0.2 - 0.1),
  turbidityNtu: 4.500 + Math.random(),
  fishBiomassKg: 1200.000 + (id * 50) + Math.random(),
  growthRatePercent: 1.200 + Math.random() * 0.1,
  coordinates: {
    lat: 13.754 + (id * 0.001),
    lng: 100.503 + (id * 0.001)
  },
  status: Math.random() > 0.9 ? 'Warning' : 'Normal'
});

const generateAgriData = (id: number): AgriData => ({
  soilMoisturePercent: 45.000 + Math.random() * 10,
  nutrientLevelPpm: 150.000 + Math.random() * 20,
  growthStage: 'Vegetative',
  irrigationActive: Math.random() > 0.7,
  coordinates: {
    lat: 13.758 + (id * 0.001),
    lng: 100.505 + (id * 0.001)
  }
});

// --- MAIN COMPONENT ---
export default function App() {
  const [activeSector, setActiveSector] = useState<Sector>(Sector.DASHBOARD);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulation Loop
  useEffect(() => {
    const updateSystem = () => {
      const newState: SystemState = {
        timestamp: Date.now(),
        solar: [1, 2, 3].map(generateSolarData),
        aqua: [1, 2].map(generateAquaData),
        agri: [1, 2].map(generateAgriData),
      };

      setSystemState(newState);

      // Simple Alert Logic
      const newAlerts: Alert[] = [];
      newState.solar.forEach((s, i) => {
        if (s.driftOffsetMeters > 2.000) {
          newAlerts.push({
            id: `solar-drift-${i}-${Date.now()}`,
            severity: 'medium',
            message: `Solar Raft ${i+1} drift: ${formatDecimal(s.driftOffsetMeters)}m`,
            timestamp: Date.now(),
            sector: 'Solar'
          });
        }
      });
      newState.aqua.forEach((a, i) => {
        if (a.dissolvedOxygenMgL < 6.500) {
          newAlerts.push({
            id: `aqua-do-${i}-${Date.now()}`,
            severity: 'high',
            message: `Low Oxygen Zone ${i+1}: ${formatDecimal(a.dissolvedOxygenMgL)} mg/L`,
            timestamp: Date.now(),
            sector: 'Aqua'
          });
        }
      });

      setAlerts(prev => [...newAlerts, ...prev].slice(0, 5)); // Keep last 5
    };

    updateSystem();
    const interval = setInterval(updateSystem, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAiAnalysis = async () => {
    if (!systemState) return;
    setIsAnalyzing(true);
    const result = await analyzeSystem(systemState, alerts);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  if (!systemState) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-indigo-500"><Loader2 className="animate-spin" size={48}/></div>;

  // Aggregates for Dashboard
  const totalPower = systemState.solar.reduce((acc, curr) => acc + curr.currentOutputKw, 0);
  const avgTemp = systemState.aqua.reduce((acc, curr) => acc + curr.waterTempC, 0) / systemState.aqua.length;
  const avgMoisture = systemState.agri.reduce((acc, curr) => acc + curr.soilMoisturePercent, 0) / systemState.agri.length;

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader 
        title="Command Center" 
        subtitle="Live Integrated Telemetry" 
        action={
          <button 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="group relative overflow-hidden flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400/30"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
            <span className="font-medium tracking-wide">{isAnalyzing ? 'Processing...' : 'Generate AI Insight'}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
          </button>
        }
      />

      {/* AI Insight Panel */}
      {aiAnalysis && (
        <div className="glass-panel border-l-4 border-l-violet-500 p-6 rounded-r-xl animate-fade-in relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-violet-500/10">
            <BrainCircuit size={150} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center space-x-3 mb-4 text-violet-400">
               <div className="p-1.5 bg-violet-500/10 rounded-md">
                 <BrainCircuit size={20} />
               </div>
               <h3 className="font-bold tracking-wide uppercase text-sm">System Analysis</h3>
             </div>
             <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-mono leading-relaxed">
               <pre className="whitespace-pre-wrap font-mono text-sm bg-transparent border-none p-0">{aiAnalysis}</pre>
             </div>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Solar Output" value={totalPower} unit="kW" icon={Zap} color="yellow" decimals={3} />
        <StatCard title="Mean Water Temp" value={avgTemp} unit="°C" icon={Thermometer} color="blue" decimals={3} />
        <StatCard title="Soil Hydration" value={avgMoisture} unit="%" icon={Droplets} color="green" decimals={3} />
        <StatCard title="System Alerts" value={alerts.length} unit="ACT" icon={AlertTriangle} color="red" decimals={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
               <Activity size={16} className="text-indigo-400"/> Power Generation Forecast
             </h3>
             <span className="text-xs text-slate-500 font-mono">24H Window</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { time: '06:00', forecast: 10.000, actual: 8.500 },
                { time: '09:00', forecast: 45.000, actual: 42.120 },
                { time: '12:00', forecast: 80.000, actual: 78.330 },
                { time: '15:00', forecast: 65.000, actual: 66.120 },
                { time: '18:00', forecast: 20.000, actual: 18.900 },
              ]}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 12, fontFamily: 'JetBrains Mono'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                  formatter={(value: number) => [value.toFixed(3), 'kW']}
                />
                <Area type="monotone" dataKey="actual" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Output" />
                <Line type="monotone" dataKey="forecast" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="glass-panel rounded-xl p-6 flex flex-col h-full border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400" /> Live Events
            </h3>
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                <CheckCircle2 size={32} className="mb-2 opacity-50" />
                <span className="text-sm">All systems nominal</span>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={alert.id} className={`group p-3 rounded-lg border backdrop-blur-sm transition-all hover:translate-x-1 ${
                  alert.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' : 
                  alert.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${
                      alert.severity === 'high' ? 'text-rose-400' : 
                      alert.severity === 'medium' ? 'text-amber-400' : 'text-cyan-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'high' ? 'text-rose-400' : 
                          alert.severity === 'medium' ? 'text-amber-400' : 'text-cyan-400'
                        }`}>{alert.sector}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString([], {hour12: false})}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSolar = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Solar Array" subtitle="Photovoltaic Performance Metrics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemState!.solar.map((unit, idx) => (
          <div key={idx} className="glass-panel rounded-xl p-6 border-l-2 border-l-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all group">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <Sun size={20} />
                </div>
                <h3 className="font-bold text-white text-lg tracking-tight">Raft S-{idx + 1}</h3>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                unit.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {unit.status}
              </div>
            </div>
            
            <div className="space-y-1">
              <DataRow label="Current Output" value={`${formatDecimal(unit.currentOutputKw)} kW`} color="text-amber-400" />
              <DataRow label="Efficiency" value={`${formatDecimal(unit.panelEfficiency)}%`} />
              <DataRow label="Battery Storage" value={`${formatDecimal(unit.batteryLevelPercent)}%`} 
                subtext={unit.batteryLevelPercent < 20 ? 'Low Charge' : 'Optimal'} 
              />
              <DataRow label="Positional Drift" value={`${formatDecimal(unit.driftOffsetMeters)} m`} 
                color={unit.driftOffsetMeters > 2 ? 'text-rose-400' : 'text-slate-400'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAqua = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Aquaculture Zones" subtitle="Hydroponic & Biological Telemetry" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systemState!.aqua.map((zone, idx) => (
          <div key={idx} className="glass-panel rounded-xl p-0 overflow-hidden border-t-2 border-t-cyan-500 relative group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 text-cyan-500 transform group-hover:scale-110 transition-transform duration-500">
              <Fish size={120} />
            </div>

            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="font-bold text-white text-xl tracking-tight flex items-center gap-2">
                     <Fish size={20} className="text-cyan-400"/> Zone A-{idx + 1}
                   </h3>
                   <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                     <MapTrackerIcon /> {formatPrecision(zone.coordinates.lat)}, {formatPrecision(zone.coordinates.lng)}
                   </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Status</span>
                    <span className={`w-3 h-3 rounded-full ${zone.status === 'Normal' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-pulse'}`}></span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f172a]/60 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Dissolved O₂</div>
                  <div className={`text-2xl font-mono font-bold ${zone.dissolvedOxygenMgL < 6 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {formatDecimal(zone.dissolvedOxygenMgL)} <span className="text-xs font-sans text-slate-500 font-normal">mg/L</span>
                  </div>
                </div>
                <div className="bg-[#0f172a]/60 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Water Temp</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {formatDecimal(zone.waterTempC)} <span className="text-xs font-sans text-slate-500 font-normal">°C</span>
                  </div>
                </div>
                <div className="bg-[#0f172a]/60 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">pH Level</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {formatDecimal(zone.phLevel)}
                  </div>
                </div>
                <div className="bg-[#0f172a]/60 p-4 rounded-lg border border-white/5 backdrop-blur-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Est. Biomass</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {formatDecimal(zone.fishBiomassKg)} <span className="text-xs font-sans text-slate-500 font-normal">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgri = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Agriculture Plots" subtitle="Soil Chemistry & Irrigation Control" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemState!.agri.map((plot, idx) => (
          <div key={idx} className="glass-panel rounded-xl p-6 border-b-2 border-b-emerald-500 hover:bg-white/[0.02] transition-colors group">
             <div className="flex items-center space-x-3 mb-6">
               <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 <Leaf size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-white tracking-tight">Plot G-{idx + 1}</h3>
                 <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">{plot.growthStage}</p>
               </div>
             </div>
             
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Soil Moisture</span>
                    <span className="text-white font-mono">{formatDecimal(plot.soilMoisturePercent)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                      style={{ width: `${Math.min(plot.soilMoisturePercent, 100)}%`}}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Nutrients (PPM)</span>
                    <span className="text-white font-mono">{formatDecimal(plot.nutrientLevelPpm)}</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                      style={{ width: `${Math.min(plot.nutrientLevelPpm / 3, 100)}%`}}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Irrigation Pump</span>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    plot.irrigationActive 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                      : 'bg-slate-800/50 text-slate-500 border-slate-700'
                  }`}>
                    {plot.irrigationActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>}
                    <span>{plot.irrigationActive ? 'Active' : 'Standby'}</span>
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout activeSector={activeSector} onSectorChange={setActiveSector}>
      {activeSector === Sector.DASHBOARD && renderDashboard()}
      {activeSector === Sector.SOLAR && renderSolar()}
      {activeSector === Sector.AQUACULTURE && renderAqua()}
      {activeSector === Sector.AGRICULTURE && renderAgri()}
      {activeSector === Sector.MAP && (
        <div className="h-full animate-fade-in">
           <SectionHeader title="Geospatial Tracker" subtitle="Real-time Asset Localization System" />
           <MapTracker data={systemState!} />
        </div>
      )}
    </Layout>
  );
}

// Helper icon component
const MapTrackerIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

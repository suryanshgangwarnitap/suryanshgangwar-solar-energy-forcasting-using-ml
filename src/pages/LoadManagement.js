import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Brain, LayoutGrid, Sun, Sigma, Binary, Gauge, Cpu, Zap, AlertTriangle } from 'lucide-react';

const NIT_AP_PowerGrid = () => {
  // --- 1. RESEARCH CONSTANTS (RECALIBRATED) ---
  const MAX_SYSTEM_CAPACITY = 50000; // Increased to accommodate high-capacity 3159W cells
  const PEAK_WATT_PER_CELL = 3159;  // User defined: 3159W per individual cell
  const SYSTEM_EFFICIENCY = 0.82;   
  const CELLS_PER_PANEL = 10;       // Adjusted for high-capacity cells

  // --- 2. INTERACTIVE LOAD STATE ---
  const [loads, setLoads] = useState([
    { id: 1, name: 'Critical Systems', power: 1200, status: 'on', category: 'Base' },
    { id: 2, name: 'Main HVAC Units', power: 8500, status: 'off', category: 'Thermal' },
    { id: 3, name: 'Industrial Water Pumps', power: 4200, status: 'off', category: 'Infra' },
    { id: 4, name: 'Campus Lighting', power: 1500, status: 'on', category: 'Utility' },
    { id: 5, name: 'Advanced Lab Gear', power: 6800, status: 'off', category: 'Research' },
    { id: 6, name: 'Data Center Node', power: 12000, status: 'on', category: 'Data' },
    { id: 7, name: 'EV Fast Charger', power: 7200, status: 'off', category: 'Transport' },
    { id: 8, name: 'Surveillance Grid', power: 800, status: 'on', category: 'Safety' },
    { id: 9, name: 'Pneumatic Systems', power: 3100, status: 'on', category: 'Utility' },
    { id: 10, name: 'Backup Storage', power: 2500, status: 'off', category: 'Base' }
  ]);

  // --- 3. DYNAMIC CALCULATIONS ---
  const activeLoad = useMemo(() => 
    loads.filter(l => l.status === 'on').reduce((sum, l) => sum + l.power, 0)
  , [loads]);

  // Formula: Load / (3159W * Efficiency)
  // Because the cell capacity is so high, we use fractional display or Math.ceil for unit counts
  const cellsNeeded = (activeLoad / (PEAK_WATT_PER_CELL * SYSTEM_EFFICIENCY)).toFixed(2);
  const unitsToInstall = Math.ceil(parseFloat(cellsNeeded));
  
  const capacityUsage = ((activeLoad / MAX_SYSTEM_CAPACITY) * 100).toFixed(1);
  const isOverloaded = activeLoad > MAX_SYSTEM_CAPACITY;

  const toggleLoad = (id) => {
    setLoads(prev => prev.map(load => 
      load.id === id ? { ...load, status: load.status === 'on' ? 'off' : 'on' } : load
    ));
  };

  const mlMetrics = [
    { name: 'Baseline', r2: 0.750 },
    { name: 'Linear', r2: 0.775 },
    { name: 'D-Tree', r2: 0.782 },
    { name: 'R-Forest', r2: 0.824 },
    { name: 'G-Boost', r2: 0.831 },
    { name: 'XGBoost', r2: 0.849 }
  ];

  return (
    <div className="p-8 space-y-8 bg-[#020408] min-h-screen text-slate-200 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_30px_rgba(37,99,235,0.2)]">
              <Zap className="text-white" size={22} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Load Management <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8"></span> 
            </h1>
          </div>
          <p className="text-slate-500 text-[9px] tracking-[0.6em] uppercase font-bold pl-1">
            NIT AP • Custom Cell Profile: 3159W
          </p>
        </div>

        <div className="flex items-center gap-8 border-l border-slate-800/80 pl-8">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Array Threshold</p>
            <p className="text-3xl font-mono font-bold text-white tracking-tighter">{MAX_SYSTEM_CAPACITY}W</p>
          </div>
          {isOverloaded && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-2xl animate-pulse">
               <AlertTriangle className="text-red-500" size={16} />
               <span className="text-[10px] text-red-500 font-black uppercase">Overload</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: HIGH-CAPACITY SIZING */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 bg-gradient-to-br from-slate-800 via-blue-900 to-black rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-blue-400/10">
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200/50">PV Configuration</p>
                <Sun size={20} className="text-blue-400" />
              </div>
              <div className="space-y-0">
                <p className="text-8xl font-mono font-black text-white tracking-tighter leading-none">{cellsNeeded}</p>
                <p className="text-xs font-bold uppercase text-blue-300 tracking-[0.3em] mt-3 italic">Calculated Cell Units</p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-3xl font-mono font-black text-white">{unitsToInstall}</p>
                  <p className="text-[9px] font-bold uppercase text-blue-400">Physical Units</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-3xl font-mono font-black text-white leading-none">{activeLoad}W</p>
                  <p className="text-[9px] font-bold uppercase text-blue-400">Current Draw</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-[2rem] border border-slate-800/60 overflow-hidden backdrop-blur-md">
            <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic font-serif">Load Inventory Control</h3>
              <span className="text-[9px] font-mono text-blue-500">{capacityUsage}% Load</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {loads.map((load) => (
                <div key={load.id} className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${load.status === 'on' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-700'}`} />
                    <div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase block">{load.name}</span>
                        <span className="text-[9px] font-mono text-slate-600 uppercase italic">{load.power}W</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleLoad(load.id)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                        load.status === 'on' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {load.status === 'on' ? 'On' : 'Off'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#05070a] rounded-[2.5rem] p-8 border border-slate-800/80 shadow-2xl relative">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg"><Activity className="text-blue-500" size={18} /></div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic font-serif">Model Forecast Precision</h2>
              </div>
              <div className="text-[10px] font-mono text-blue-500 font-black px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20">
                XGBOOST R²: 0.849
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mlMetrics}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0.7, 0.9]} />
                  <Tooltip contentStyle={{ backgroundColor: "#020408", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="r2" stroke="#3b82f6" strokeWidth={4} fill="url(#areaGradient)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SIZING SUMMARY */}
          <div className="p-10 bg-slate-900/30 border border-slate-800 rounded-[3rem] relative overflow-hidden backdrop-blur-sm shadow-inner">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-1">
                  <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500 border border-blue-500/20">
                    <Sigma size={24} />
                  </div>
                </div>
                <div className="md:col-span-11 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-[0.4em] italic underline decoration-blue-500/50 underline-offset-8">Result</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    Using the custom high-capacity cell profile of <span className="text-white font-bold">3159W</span>, the infrastructure density is exceptionally high. 
                    For the active load of <span className="text-blue-400 font-bold">{activeLoad}W</span>, the system calculates: 
                    <span className="block my-3 font-mono text-blue-400 bg-black/60 p-5 rounded-2xl border border-slate-800/80 italic shadow-lg">
                      Requirement = {activeLoad}W / ({PEAK_WATT_PER_CELL}W × 0.82 Efficiency)
                    </span>
                    This results in a requirement of <span className="text-white font-bold">{cellsNeeded} cell units</span>. 
                    Even with high demand, the 3159W cell architecture ensures a minimal physical footprint compared to standard 4.65W cells.
                  </p>
                </div>
             </div>
             <div className="absolute top-[-20px] right-[-20px] opacity-[0.02] rotate-12">
               <Gauge size={300} className="text-white" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NIT_AP_PowerGrid;
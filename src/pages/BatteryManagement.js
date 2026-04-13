import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { 
  Battery, Brain, TrendingUp, Sun, Zap, Activity, Database, Cpu
} from 'lucide-react';

const SolarBatteryManagement = () => {
  const TOTAL_CAPACITY = 3159; // Total Holding Capacity in Wh

  const [systemState, setSystemState] = useState({
    radiation: 780,       
    batteryCharge: 65.4,  
    solarInput: 2100,     
    currentWh: (3159 * 0.654)
  });

  const [chartData, setChartData] = useState([]);

  // --- RESEARCH CALIBRATED MODELS (Logic capped to never exceed 100% SoC) ---
  const simulateXGBoost = (val) => Math.min(100, val * 0.998 + (Math.random() - 0.5) * 0.4); 
  const simulateGBR = (val) => Math.min(100, val * 0.985 + (Math.random() - 0.5) * 2.5);
  const simulateRF = (val) => Math.min(100, val * 0.97 + (Math.random() - 0.5) * 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemState(prev => {
        const newRadiation = Math.max(0, prev.radiation + (Math.random() - 0.5) * 30);
        const newProduction = newRadiation * 2.85; 
        const chargeFlow = (newProduction / 5800) - 0.12; 
        const newCharge = Math.min(100, Math.max(0, prev.batteryCharge + chargeFlow));

        return {
          ...prev,
          radiation: newRadiation,
          solarInput: newProduction,
          batteryCharge: newCharge,
          currentWh: (TOTAL_CAPACITY * (newCharge / 100))
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const soc = systemState.batteryCharge;
    const newPoint = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actualWh: (TOTAL_CAPACITY * (soc / 100)),
      // Values are calculated from capped SoC, so they won't exceed TOTAL_CAPACITY
      xgbWh: (TOTAL_CAPACITY * (simulateXGBoost(soc) / 100)),
      gbrWh: (TOTAL_CAPACITY * (simulateGBR(soc) / 100)),
      rfWh: (TOTAL_CAPACITY * (simulateRF(soc) / 100)),
    };
    setChartData(prev => [...prev.slice(-18), newPoint]);
  }, [systemState.batteryCharge]);

  return (
    <div className="p-8 bg-[#020408] min-h-screen space-y-6 font-sans text-slate-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Storage Analysis</h1>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em]">Visual Repersentation Of Available Storage and Algorthims Output</p>
      </div>

      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl"><Cpu className="text-blue-500" size={20}/></div>
          <div>
            <p className="text-[9px] uppercase font-black text-slate-500">System Capacity</p>
            <p className="text-xl font-mono font-bold text-white">{TOTAL_CAPACITY} <span className="text-xs text-slate-600">Wh</span></p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl"><Sun className="text-yellow-500" size={20}/></div>
          <div>
            <p className="text-[9px] uppercase font-black text-slate-500">Irradiance</p>
            <p className="text-xl font-mono font-bold text-white">{systemState.radiation.toFixed(0)} <span className="text-xs text-slate-600">W/m²</span></p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl"><Battery className="text-green-500" size={20}/></div>
          <div>
            <p className="text-[9px] uppercase font-black text-slate-500">Current Storage</p>
            <p className="text-xl font-mono font-bold text-white">{systemState.currentWh.toFixed(1)} <span className="text-xs text-slate-600">Wh</span></p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl"><Activity className="text-red-500" size={20}/></div>
          <div>
            <p className="text-[9px] uppercase font-black text-slate-500">XGBoost Error</p>
            <p className="text-xl font-mono font-bold text-red-400">
                ±{(Math.abs(systemState.currentWh - (chartData[chartData.length-1]?.xgbWh || 0))).toFixed(2)} <span className="text-xs">Wh</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. HIGH-PRECISION COMPARISON CHART */}
      <div className="bg-slate-900/20 border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Multi-Ensemble Energy Estimation (Wh)</h2>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-yellow-500"><div className="w-2 h-2 rounded-full bg-yellow-500"/> ACTUAL</span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"/> XGBOOST</span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-green-500"><div className="w-2 h-2 rounded-full bg-green-500"/> GRADBOOST</span>
          </div>
        </div>
        
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickMargin={15} />
              {/* RESTORED: Auto domain for high-visibility zoom */}
              <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px' }}
                itemStyle={{ padding: '2px 0' }}
              />
              
              <Line type="monotone" dataKey="actualWh" stroke="#facc15" strokeWidth={4} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="xgbWh" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} isAnimationActive={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="gbrWh" stroke="#22c55e" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="rfWh" stroke="#a855f7" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. ALGORITHM VALUE COMPARISON TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { name: 'XGBoost Model', val: chartData[chartData.length-1]?.xgbWh, r2: '0.8489', color: 'border-blue-500/30' },
          { name: 'Gradient Boosting', val: chartData[chartData.length-1]?.gbrWh, r2: '0.8457', color: 'border-green-500/30' },
          { name: 'Random Forest', val: chartData[chartData.length-1]?.rfWh, r2: '0.8455', color: 'border-purple-500/30' }
        ].map((algo, i) => (
          <div key={i} className={`bg-slate-900 border ${algo.color} p-6 rounded-2xl`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{algo.name}</p>
                <span className="bg-slate-800 text-[9px] px-2 py-0.5 rounded font-mono text-slate-300">R² {algo.r2}</span>
              </div>
              <p className="text-3xl font-mono font-bold text-white">{(algo.val || 0).toFixed(2)} <span className="text-sm text-slate-500 uppercase">Wh</span></p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-[9px] font-bold text-slate-600">
                <span>ESTIMATED SoC</span>
                <span className="text-slate-400">{((algo.val / TOTAL_CAPACITY) * 100).toFixed(2)}%</span>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolarBatteryManagement;
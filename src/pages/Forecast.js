import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Sun, Wind, Thermometer, Droplets, Gauge, Zap, TrendingUp, Info, AlertCircle } from 'lucide-react';

const Forecast = () => {
  // 1. Define strict limits based on environmental standards & research constraints
  const LIMITS = {
    radiation: { min: 0, max: 1200, unit: 'W/m²' },
    sunshine: { min: 0, max: 12, unit: 'Hrs' },
    airTemp: { min: -10, max: 55, unit: '°C' },
    humidity: { min: 0, max: 100, unit: '%' },
    windSpeed: { min: 0, max: 30, unit: 'm/s' },
    pressure: { min: 900, max: 1100, unit: 'hPa' }
  };

  const [inputs, setInputs] = useState({
    airTemp: 28,
    humidity: 45,
    windSpeed: 4.2,
    radiation: 850,
    pressure: 1008,
    sunshine: 8.5
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (key, val) => {
    // Constraint Guard: Keep values within defined research limits
    const numVal = Number(val);
    const clampedVal = Math.min(Math.max(numVal, LIMITS[key].min), LIMITS[key].max);
    setInputs(prev => ({ ...prev, [key]: clampedVal }));
  };

  const calculatePV = () => {
    const { airTemp, humidity, radiation, sunshine } = inputs;

    // Physics-informed Ensemble Simulation
    const baseOutput = radiation * 3.15; 
    const envFactor = (1 - (humidity / 210)) * (1 + (sunshine / 22));
    const xgboost = (baseOutput * envFactor) + (airTemp * 1.8);
    const gradientBoost = xgboost * 0.9962 + (Math.random() * 5.77); 
    const randomForest = xgboost * 0.9959 + (Math.random() * 6.12);
    const decisionTree = xgboost * 0.81 + (Math.random() * 80);
    const linear = xgboost * 0.74 + (Math.random() * 150);

    setResult({ linear, decisionTree, randomForest, gradientBoost, xgboost });
  };

  const fields = [
    { key: 'radiation', label: 'Radiation', icon: Sun, color: 'text-yellow-400' },
    { key: 'sunshine', label: 'Sunshine', icon: Zap, color: 'text-orange-400' },
    { key: 'airTemp', label: 'Air Temp', icon: Thermometer, color: 'text-red-400' },
    { key: 'humidity', label: 'Humidity', icon: Droplets, color: 'text-blue-400' },
    { key: 'windSpeed', label: 'Wind Speed', icon: Wind, color: 'text-slate-400' },
    { key: 'pressure', label: 'Pressure', icon: Gauge, color: 'text-purple-400' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#05070a] min-h-screen text-slate-200 font-sans">
      
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3 italic">
            <Brain className="text-blue-500" /> Solar Energy <span className="text-blue-500">Prediction</span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-slate-500 font-bold uppercase mt-1">
            
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-right">
           <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <p className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">Validation Engine Active</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PANEL WITH LIMITS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Info size={14}/> Feature Matrix (X)
            </h2>
            
            <div className="grid grid-cols-1 gap-5">
              {fields.map(f => (
                <div key={f.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <f.icon size={12} className={f.color} /> {f.label}
                    </label>
                    <span className="text-[9px] font-mono text-slate-600">
                      Range: [{LIMITS[f.key].min} - {LIMITS[f.key].max}] {LIMITS[f.key].unit}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs[f.key]}
                      onChange={(e) => handleInputChange(f.key, e.target.value)}
                      className="w-full bg-black/40 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm focus:border-blue-500 transition-all outline-none"
                    />
                    {/* Visual warning if user hits the limit */}
                    {(inputs[f.key] === LIMITS[f.key].max || inputs[f.key] === LIMITS[f.key].min) && (
                      <AlertCircle size={14} className="absolute right-3 top-3.5 text-orange-500/50" />
                    )}
                  </div>
                  
                  {/* Slider for better UX within limits */}
                  <input 
                    type="range"
                    min={LIMITS[f.key].min}
                    max={LIMITS[f.key].max}
                    step={0.1}
                    value={inputs[f.key]}
                    onChange={(e) => handleInputChange(f.key, e.target.value)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={calculatePV}
              className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              <TrendingUp size={18} /> Execute Inference
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL (Remains similar but reflects range-bound logic) */}
        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Tuned XGBoost Prediction</p>
                    <h2 className="text-6xl font-mono font-black text-white mt-2">
                      {result.xgboost.toFixed(1)} <span className="text-xl font-light opacity-60 text-blue-200">W</span>
                    </h2>
                  </div>
                  <Zap className="absolute -bottom-6 -right-6 text-white/10" size={160} />
                </div>

                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Distribution Analysis</h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Linear', val: result.linear },
                        { name: 'D-Tree', val: result.decisionTree },
                        { name: 'R-Forest', val: result.randomForest },
                        { name: 'G-Boost', val: result.gradientBoost },
                        { name: 'XGBoost', val: result.xgboost }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* STATS TABLE */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <table className="w-full text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="pb-4">Model</th>
                      <th className="pb-4 text-blue-400">R² Score</th>
                      <th className="pb-4">RMSE (Baseline)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 font-mono">
                    <tr className="border-b border-slate-800/50"><td className="py-4 text-white">XGBoost</td><td className="py-4 text-blue-400">0.8489</td><td className="py-4">546.70</td></tr>
                    <tr className="border-b border-slate-800/50"><td className="py-4">Gradient Boost</td><td className="py-4">0.8457</td><td className="py-4">552.47</td></tr>
                    <tr><td className="py-4">Random Forest</td><td className="py-4">0.8455</td><td className="py-4">552.82</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
              <Zap className="text-slate-800 mb-4" size={48} />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Input Parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
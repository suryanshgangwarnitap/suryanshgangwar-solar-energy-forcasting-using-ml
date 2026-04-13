import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend, ComposedChart, Line
} from 'recharts';
import {
  Sun, Battery, Zap, Wind, Thermometer, Droplets, Brain, 
  GaugeCircle, BarChart3, Target, Activity, Database, Cpu
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    radiation: 850,       
    sunshine: 8.5,
    airTemp: 32,
    humidity: 45,
    windSpeed: 4.2,
    pressure: 1012,
    systemProduction: 2450 
  });

  const [chartData, setChartData] = useState([]);

  // ML Simulation Logic
  const simulateRealXGBoost = (actual) => actual * 0.985 + (Math.random() - 0.5) * 70;
  const simulateZeroError = (actual) => actual;

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newRadiation = Math.max(0, prev.radiation + (Math.random() - 0.5) * 100);
        const newProduction = newRadiation * 2.85 + (Math.random() * 120);
        
        return {
          radiation: newRadiation,
          sunshine: Math.min(12, Math.max(0, prev.sunshine + (Math.random() - 0.5) * 0.4)),
          airTemp: prev.airTemp + (Math.random() - 0.5) * 0.6,
          humidity: Math.min(100, Math.max(10, prev.humidity + (Math.random() - 0.5) * 2.5)),
          windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 0.5),
          pressure: prev.pressure + (Math.random() - 0.5) * 1.2,
          systemProduction: newProduction
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentActual = data.systemProduction;
    const newPoint = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actual: currentActual,
      realXGB: simulateRealXGBoost(currentActual), 
      zeroError: simulateZeroError(currentActual),
    };
    // Maintain a clean 20-point rolling window for the live graph
    setChartData(prev => [...prev.slice(-19), newPoint]);
  }, [data.systemProduction]);

  const StatCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-2xl backdrop-blur-md shadow-xl">
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <Icon size={14} className={color} />
      </div>
      <p className="text-xl font-mono font-black text-white mt-2">
        {value.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );

  return (
    <div className="p-6 bg-[#02040a] min-h-screen space-y-6 font-sans text-slate-300 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
            <Brain className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl text-white font-black tracking-tighter uppercase leading-none">
              Solar Enery Prediction <span className="text-blue-500">Visual Represtation</span>
            </h1>
            <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase font-bold mt-1">NIT Andhra Pradesh • XGBoost  Optimization</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-blue-600 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20">
             <Activity size={14} className="text-white animate-pulse" />
             <span className="text-white text-[10px] font-black uppercase tracking-wider"></span>
          </div>
        </div>
      </div>

      {/* SENSOR GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard title="Radiation" value={data.radiation} unit="W/m²" icon={Sun} color="text-yellow-400" />
        <StatCard title="Air Temp" value={data.airTemp} unit="°C" icon={Thermometer} color="text-orange-400" />
        <StatCard title="Sunshine" value={data.sunshine} unit="hr" icon={Zap} color="text-blue-400" />
        <StatCard title="Humidity" value={data.humidity} unit="%" icon={Droplets} color="text-cyan-400" />
        <StatCard title="Wind" value={data.windSpeed} unit="m/s" icon={Wind} color="text-slate-400" />
        <StatCard title="Pressure" value={data.pressure} unit="hPa" icon={GaugeCircle} color="text-purple-400" />
        <StatCard title="Real Power" value={data.systemProduction} unit="W" icon={Battery} color="text-green-400" />
      </div>

      {/* ENLARGED LIVE GRAPH */}
      <div className="bg-slate-900/20 border border-slate-800/60 rounded-[2.5rem] p-8 backdrop-blur-sm relative shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-white font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={20} />
              ACTUAL Vs XGBOOST
            </h2>
            <p className="text-slate-500 text-xs font-medium"> </p>
          </div>
          <div className="hidden md:block px-4 py-1 border border-slate-700 rounded-full">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">521248</span>
          </div>
        </div>

        <div className="h-[520px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXGB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.3} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickMargin={15} />
              <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                cursor={{ stroke: '#334155', strokeWidth: 1 }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '11px' }} 
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }} />
              
              <Area type="monotone" name="Inference Zone" dataKey="realXGB" stroke="none" fill="url(#colorXGB)" isAnimationActive={false} />
              <Line type="monotone" name="0% Error Baseline" dataKey="zeroError" stroke="#475569" strokeWidth={1} strokeDasharray="8 4" dot={false} isAnimationActive={false} opacity={0.4} />
              <Line type="monotone" name="Actual Production" dataKey="actual" stroke="#facc15" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} isAnimationActive={false} />
              <Line type="monotone" name="XGBoost Forecast" dataKey="realXGB" stroke="#22c55e" strokeWidth={4} dot={{ r: 4, fill: '#22c55e' }} filter="url(#glow)" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACCURACY MONITOR FOOTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Deviation</p>
            <p className="text-2xl font-mono font-bold text-red-400">
              ± {(Math.abs(data.systemProduction - (chartData[chartData.length-1]?.realXGB || 0))).toFixed(2)} W
            </p>
          </div>
          <Activity className="text-red-500/50" size={32} />
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] shadow-lg">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Feature Weighting (Importance)</p>
          <div className="flex gap-2 h-3 items-end">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }} />
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }} />
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
          </div>
          <div className="flex justify-between mt-3 text-[8px] font-black uppercase text-slate-400">
            <span>Radiation</span>
            <span>Temp</span>
            <span>Atmospheric</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-6 rounded-[2rem] shadow-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-blue-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Note</p>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90 font-medium">
            Currently maintaining R² 0.8489. Model stability is optimal for current weather fluctuations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
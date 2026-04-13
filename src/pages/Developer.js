import React, { useState, useEffect, useCallback } from 'react';
import { Code, Play, Database, Bug, Settings, Terminal, Cpu, Activity, Zap } from 'lucide-react';

const Developer = () => {
  const [apiResponse, setApiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(true); // Toggle for the 3s loop
  const [logs, setLogs] = useState([
    { id: 1, level: 'info', message: 'ML System initialized: XGBoost Engine Online', timestamp: new Date().toLocaleTimeString() },
  ]);

  const [mlInputs, setMlInputs] = useState({
    solarRadiation: 800,
    temp: 25,
    humidity: 45,
    pressure: 1013,
    windSpeed: 4.5,
    sunshine: 10,
    cloudCover: 20
  });

  // 1. Logic for Inference Simulation (Memoized to prevent effect re-runs)
  const runInferenceSimulation = useCallback(async (currentInputs) => {
    setIsLoading(true);
    
    try {
      const startTime = performance.now();
      await new Promise(resolve => setTimeout(resolve, 500)); // Shortened for "live" feel
      const duration = (performance.now() - startTime).toFixed(2);
      
      // Simulation formula
      const prediction = (currentInputs.solarRadiation * 2.1 + (Math.random() * 50)).toFixed(2);

      const mockResponse = {
        model: "XGBoost_Ensemble_v1.2",
        status: "success",
        r2_score_baseline: 0.8489,
        prediction_watts: `${prediction} W`,
        latency_ms: duration,
        timestamp: new Date().toISOString()
      };

      setApiResponse(JSON.stringify(mockResponse, null, 2));
      
      setLogs(prev => [{
        id: Date.now(),
        level: 'info',
        message: `Inference success: Predicted ${prediction}W`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 10)); // Keep only last 10 logs

    } catch (err) {
      setLogs(prev => [{
        id: Date.now(),
        level: 'error',
        message: `Inference Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Effect for the 3-second cycle
  useEffect(() => {
    let interval;
    if (isAutoPilot) {
      interval = setInterval(() => {
        // Randomize inputs slightly for realism
        const newInputs = {
          solarRadiation: Math.max(0, mlInputs.solarRadiation + (Math.random() * 40 - 20)),
          temp: Math.max(10, mlInputs.temp + (Math.random() * 2 - 1)),
          humidity: Math.min(100, Math.max(0, mlInputs.humidity + (Math.random() * 4 - 2))),
          pressure: 1013 + (Math.random() * 10 - 5),
          windSpeed: Math.max(0, mlInputs.windSpeed + (Math.random() * 1 - 0.5)),
          sunshine: Math.min(12, Math.max(0, mlInputs.sunshine + (Math.random() * 0.5 - 0.25))),
          cloudCover: Math.min(100, Math.max(0, mlInputs.cloudCover + (Math.random() * 5 - 2)))
        };

        setMlInputs(newInputs);
        runInferenceSimulation(newInputs);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, mlInputs, runInferenceSimulation]);

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 bg-[#05070a] min-h-screen text-slate-300">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Researcher <span className="text-blue-500">Terminal</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
            NIT Andhra Pradesh • Live Monitoring Mode
          </p>
        </div>
        <button 
          onClick={() => setIsAutoPilot(!isAutoPilot)}
          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            isAutoPilot ? 'bg-green-500/10 text-green-500 border border-green-500/50' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Zap size={12} fill={isAutoPilot ? "currentColor" : "none"} />
          {isAutoPilot ? 'Live Feed: ON' : 'Live Feed: PAUSED'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Feature Simulator */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm text-white">Feature Input Matrix</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {Object.entries(mlInputs).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                  <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-blue-400 font-mono text-sm">{value.toFixed(2)}</span>
                </div>
                <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${(value / (key === 'pressure' ? 1100 : 1000)) * 100}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Response JSON */}
        <div className="bg-black/50 border border-slate-800 rounded-3xl p-6 font-mono relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity size={80} className={`${isLoading ? 'text-blue-500 animate-pulse' : 'text-slate-500'}`} />
            </div>
            <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">
              <Terminal size={14} /> {isLoading ? 'Processing...' : 'Model Output'}
            </div>
            <pre className="text-[11px] text-green-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {apiResponse || "// Initializing stream..."}
            </pre>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bug size={18} className="text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">System Debug Stream</h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between text-[11px] py-2 border-b border-slate-800/50 animate-in fade-in slide-in-from-left-2">
              <span className={`font-bold uppercase tracking-widest ${getLogLevelColor(log.level)}`}>
                [{log.level}] {log.message}
              </span>
              <span className="text-slate-600 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developer;
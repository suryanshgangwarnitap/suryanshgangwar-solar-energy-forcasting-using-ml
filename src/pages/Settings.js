import React, { useState } from 'react';
import { Settings2, Cpu, Activity, Save, Database, Zap } from 'lucide-react';

const Settings = () => {
  const [prefs, setPrefs] = useState({
    alertThreshold: 546.70, // Your specific RMSE
    modelType: 'tuned',
    featureSet: 'all'
  });

  const handleChange = (key, value) => setPrefs(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 bg-black min-h-screen text-slate-200 font-sans">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter uppercase text-white">
          <Settings2 className="text-blue-500" /> Research <span className="text-blue-500">Parameters</span>
        </h1>
        <p className="text-slate-500 text-[10px] tracking-widest uppercase mt-1">
          Solar Forecasting Engine | NIT Andhra Pradesh
        </p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MODEL OPTIMIZATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-blue-500" size={20} />
            <h3 className="font-bold text-xs uppercase tracking-widest text-white">Engine Config</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['base', 'tuned'].map((type) => (
                <button 
                  key={type}
                  onClick={() => handleChange('modelType', type)}
                  className={`p-3 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                    prefs.modelType === type 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {type === 'base' ? 'Standard' : 'Tuned (R² 0.84)'}
                </button>
              ))}
            </div>
            
            <select 
              value={prefs.featureSet}
              onChange={(e) => handleChange('featureSet', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-bold uppercase outline-none text-blue-400"
            >
              <option value="all">Full Feature Set (7 Factors)</option>
              <option value="radiation_only">Radiation (0.79 Corr)</option>
              <option value="thermo">Thermo-Dynamic Focus</option>
            </select>
          </div>
        </div>

        {/* ERROR THRESHOLDS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-green-500" size={20} />
            <h3 className="font-bold text-xs uppercase tracking-widest text-white">Alert Thresholds</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <label>RMSE Margin</label>
              <span className="text-blue-500 font-mono">{prefs.alertThreshold} W</span>
            </div>
            <input 
              type="range" min="100" max="1000" step="10"
              value={prefs.alertThreshold}
              onChange={(e) => handleChange('alertThreshold', e.target.value)}
              className="w-full accent-blue-600 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
            <p className="text-[9px] text-slate-600 italic">Target RMSE: 546.70 (XGBoost)</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between items-center">
        <div className="flex gap-4 text-[9px] font-bold text-slate-600 uppercase">
          <span className="flex items-center gap-1"><Database size={12}/> DB: Online</span>
          <span className="flex items-center gap-1 text-green-900"><Zap size={12}/> API: 14ms</span>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black uppercase text-[10px] tracking-widest transition-all">
          <Save size={14} /> Save Config
        </button>
      </div>
    </div>
  );
};

export default Settings;
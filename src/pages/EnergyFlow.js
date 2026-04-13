import React from 'react';
import { 
  ArrowDown, BarChart3, PieChart, Activity, Zap, 
  Layers, Database, Sliders, Target, Cpu 
} from 'lucide-react';

const Box = ({ title, items, children, icon: Icon, color = "text-blue-500" }) => (
  <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl px-5 py-4 text-[12px] leading-snug shadow-xl hover:border-slate-700 transition-all w-full">
    <h3 className="font-bold text-[14px] mb-3 text-white flex items-center gap-2 uppercase tracking-tighter">
      {Icon && <Icon size={16} className={color} />}
      {title}
    </h3>
    {items && (
      <ul className="space-y-2 mb-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-400">
            <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    )}
    {children}
  </div>
);

const Arrow = () => (
  <div className="flex justify-center">
    <ArrowDown size={18} className="text-slate-700 my-1 animate-bounce" />
  </div>
);

const EnergyFlow = () => {
  return (
    <div className="p-8 space-y-4 bg-black min-h-screen flex flex-col items-center font-sans text-slate-300">
      
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center justify-center gap-3 uppercase">
          <Zap className="text-yellow-400" fill="currentColor" /> Project Flow Chart 
        </h1>
        <p className="text-[10px] tracking-[0.4em] uppercase text-blue-500 font-bold mt-2 italic">
          Suryansh Gangwar | Rollno-521248 EEE
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-2">
        <Box 
          title="1. Intelligent Data Acquisition" 
          icon={Database}
          items={[
            "Target Variable: SystemProduction (Solar Output in Watts)",
            "Input Features: Radiation (W/m²), Sunshine (Hrs), AirTemp (°C), Humidity (%), Wind Speed, Pressure"
          ]} 
        />
        <Arrow />

        <Box 
          title="2. Preprocessing & Feature Engineering" 
          icon={Layers}
          color="text-purple-400"
          items={[
            "Outlier Mitigation: IQR (Interquartile Range) Method",
            "Time Synthesis: Cyclical Encoding (DaySin/Cos & YearSin/Cos)",
            "Statistical EDA: Pearson Correlation Matrix Analysis"
          ]} 
        />
        <Arrow />

        <Box 
          title="3. Normalization & Data Split" 
          icon={Sliders}
          color="text-orange-400"
          items={[
            "Data Partition: 80% Training / 20% Testing sets",
            "Scaling: StandardScaler (Zero mean, unit variance transformation)",
            "Stationarity check and multicollinearity filtering"
          ]} 
        />
        <Arrow />

        <Box 
          title="4. Ensemble Training & Evaluation" 
          icon={Cpu}
          color="text-green-400"
          items={[
            "Algorithms: SVR, Linear, D-Tree, Random Forest, GBR, XGBoost",
            "Standardized Metrics: R², MAE, MSE, RMSE, MAPE"
          ]}>
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">RMSE Performance (Lower is Better)</p>
            {[
              { label: 'Random Forest', val: 100, color: 'bg-red-900', rmse: 552.829 },
              { label: 'Gradient Boost', val: 62, color: 'bg-slate-700', rmse: 552.47 },
              { label: 'XGBoost', val: 38, color: 'bg-green-500', rmse: 546.7 }
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="w-16 text-[10px] font-mono text-slate-400">{m.label}</span>
                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`${m.color} h-full transition-all duration-1000`} style={{ width: `${m.val}%` }} />
                </div>
                <span className="text-[10px] font-mono text-white">{m.rmse}</span>
              </div>
            ))}
          </div>
        </Box>
        <Arrow />

        <Box 
          title="5. Hyperparameter Optimization" 
          icon={Target}
          color="text-yellow-400"
          items={[
            "RandomizedSearchCV: 10-Fold Cross-Validation",
            "Optimized: n_estimators (200), max_depth (5), learning_rate (0.1)",
            "Verification: Validation of 0.8489 R² on unseen data"
          ]} 
        />
      </div>

      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-6">
        
        <Box title="Variable Influence" icon={BarChart3}>
          <div className="space-y-4 mt-2">
             {[
               { f: 'Radiation', p: 79, color: 'bg-yellow-500' },
               { f: 'Sunshine', p: 43, color: 'bg-orange-500' },
               { f: 'Humidity', p: 51, color: 'bg-blue-500', desc: 'Inverse' },
               { f: 'Temp', p: 28, color: 'bg-red-500' }
             ].map(item => (
               <div key={item.f}>
                 <div className="flex justify-between text-[10px] mb-1">
                   <span className="text-slate-400">{item.f} {item.desc && `(${item.desc})`}</span>
                   <span className="font-bold text-white">0.{item.p} Corr.</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1 rounded-full">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.p}%` }} />
                 </div>
               </div>
             ))}
          </div>
        </Box>

        <Box title="Final Model Accuracy" icon={Activity} color="text-green-500">
          <div className="h-28 w-full bg-slate-950 rounded-xl border border-slate-800 relative flex items-end p-3 gap-1 overflow-hidden">
            {/* Simulation of Regression Scatter Plot */}
            {[15, 25, 20, 35, 45, 40, 60, 75, 70, 95].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-blue-500/20 rounded-t-sm border-t border-blue-500/40" 
                style={{ height: `${h}%` }}
              />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                <p className="text-[14px] font-black text-white">R² = 0.8489</p>
                <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Strong Correlation</p>
            </div>
          </div>
          <div className="mt-3 text-[9px] text-slate-500 italic text-center">
            Linear relationship verified via Predicted vs Actual analysis
          </div>
        </Box>
      </div>

      {/* CONCLUSION FOOTER */}
      <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-slate-800 rounded-2xl px-6 py-4 text-[12px] max-w-3xl mt-6 shadow-2xl w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <CheckCircleIcon size={16} className="text-black" />
          </div>
          <div>
            <h3 className="font-bold text-[13px] text-white uppercase tracking-tight">Final Thesis Summary</h3>
            <p className="text-slate-400 leading-relaxed mt-1">
              The <strong>Tuned XGBoost</strong> model demonstrated superior predictive capability by capturing the non-linear dependencies between solar irradiance and production. 
              The inclusion of <strong>IQR outlier detection</strong> and <strong>cyclical time features</strong> was instrumental in achieving the 0.8489 R-Squared coefficient.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

// Internal icon for the footer
const CheckCircleIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default EnergyFlow;
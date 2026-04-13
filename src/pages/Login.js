import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Lock, Mail, Eye, EyeOff, User, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isRegistering) {
        result = await register(email, password, name);
      } else {
        result = await login(email, password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* BACKGROUND DECOR (Solar Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-blue-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sun className="h-10 w-10 text-white" fill="currentColor" />
          </div>
          
          {/* UPDATED PROJECT NAME */}
          <h2 className="mt-8 text-3xl font-black text-white tracking-tighter uppercase italic">
            Solar Energy <span className="text-blue-500">Forecasting</span>
          </h2>
          
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-slate-800"></span>
            <p className="text-[10px] tracking-[0.3em] font-bold text-slate-500 uppercase">
              NIT Andhra Pradesh • Research Hub
            </p>
            <span className="h-px w-8 bg-slate-800"></span>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-xs font-medium text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Research Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      required={isRegistering}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="admin@solar.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                <>
                  {isRegistering ? 'Register System' : 'Authenticate'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isRegistering ? 'Back to Authentication' : "Initialize New Researcher"}
            </button>
          </div>
        </div>

        {/* SECURITY FOOTER */}
        {!isRegistering && (
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
              <ShieldCheck size={14} className="text-green-500" /> Protected by NIT AP Security
            </div>
            <div className="text-center px-6 py-3 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <p className="text-[10px] text-blue-400/60 uppercase font-bold mb-1 italic flex items-center justify-center gap-1">
                <Zap size={10} /> Test Credentials
              </p>
              <p className="text-[10px] text-blue-300 font-mono">admin@solar.com / password</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
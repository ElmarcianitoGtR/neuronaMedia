import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'andon' | 'dashboard'>('andon');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-primary/30">
      {/* Navbar - Dark Glassmorphism */}
      <header className="bg-slate-900/50 backdrop-blur-md shadow-lg border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          NeuronaMedia <span className="text-slate-400 text-sm font-normal tracking-widest uppercase ml-2 border border-white/10 px-2 py-1 rounded-full bg-white/5">v1.0 MVP</span>
        </h1>
        <nav className="flex gap-3">
          <button 
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'andon' ? 'bg-primary/20 text-blue-400 border border-primary/30 shadow-[0_0_15px_rgba(29,78,216,0.3)]' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'}`}
            onClick={() => setActiveTab('andon')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Tablero Andon
          </button>
          <button 
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-primary/20 text-blue-400 border border-primary/30 shadow-[0_0_15px_rgba(29,78,216,0.3)]' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Telemetría
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'andon' ? <AndonBoard /> : <Dashboard />}
      </main>
    </div>
  );
}

function AndonBoard() {
  // Skeleton data
  const lines = [
    { id: 1, name: 'Línea de Ensamblaje A', status: 'success', message: 'Operando a capacidad óptima', speed: '1,940 u/h' },
    { id: 2, name: 'Estación de Soldadura', status: 'danger', message: 'Falla de temperatura en horno 3', speed: '0 u/h' },
    { id: 3, name: 'Inspección Óptica', status: 'warning', message: 'Variación en tolerancia detectada', speed: '1,200 u/h' },
    { id: 4, name: 'Empaquetado Final', status: 'success', message: 'Sin anomalías registradas', speed: '1,850 u/h' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <span className="w-2 h-8 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
        Estado en Planta (Tiempo Real)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {lines.map((line) => (
          <div key={line.id} className={`relative rounded-2xl overflow-hidden border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            line.status === 'success' ? 'bg-green-950/20 border-green-500/20 hover:border-green-500/50 hover:shadow-green-900/20' :
            line.status === 'danger' ? 'bg-red-950/30 border-red-500/30 hover:border-red-500/60 hover:shadow-red-900/30' :
            'bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-yellow-900/20'
          }`}>
            {/* Status Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
              line.status === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-600 shadow-[0_0_15px_rgba(52,211,153,0.8)]' :
              line.status === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-700 shadow-[0_0_15px_rgba(248,113,113,0.8)]' :
              'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
            }`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{line.name}</h3>
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    line.status === 'success' ? 'bg-green-400' : line.status === 'danger' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    line.status === 'success' ? 'bg-green-500' : line.status === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></span>
                </span>
              </div>
              <p className="text-slate-300 mb-6 text-sm">{line.message}</p>
              
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Velocidad Actual</span>
                <span className="font-mono text-lg font-medium text-white">{line.speed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  // Mock data for production over time
  const data = [
    { time: '08:00', produccion: 120, scrap: 5, meta: 150 },
    { time: '09:00', produccion: 250, scrap: 12, meta: 300 },
    { time: '10:00', produccion: 410, scrap: 18, meta: 450 },
    { time: '11:00', produccion: 580, scrap: 22, meta: 600 },
    { time: '12:00', produccion: 720, scrap: 30, meta: 750 },
    { time: '13:00', produccion: 850, scrap: 35, meta: 900 },
    { time: '14:00', produccion: 1020, scrap: 40, meta: 1050 },
    { time: '15:00', produccion: 1240, scrap: 45, meta: 1200 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/5 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="bg-blue-500/20 p-2.5 rounded-xl border border-blue-500/30">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </span>
          Resumen de Métricas (Turno Actual)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all duration-300 group">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              Producción Total
              <svg className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </h3>
            <p className="text-5xl font-bold text-white tracking-tight">1,240 <span className="text-lg font-normal text-slate-500 ml-1">pz</span></p>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-red-500/10 hover:border-red-500/30 hover:bg-red-900/10 transition-all duration-300 group">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              Scrap Registrado
              <svg className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
            </h3>
            <p className="text-5xl font-bold text-red-400 tracking-tight">45 <span className="text-lg font-normal text-red-400/50 ml-1">pz (3.5%)</span></p>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-green-500/10 hover:border-green-500/30 hover:bg-green-900/10 transition-all duration-300 group">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              OEE Estimado
              <svg className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </h3>
            <p className="text-5xl font-bold text-green-400 tracking-tight">82.1<span className="text-3xl">%</span></p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl h-[28rem] relative">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
          Avance de Producción vs Meta
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" dataKey="meta" stroke="#64748b" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorMeta)" name="Meta Planeada" />
            <Area type="monotone" dataKey="produccion" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" name="Piezas Producidas" activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="scrap" stroke="#ef4444" name="Scrap" strokeWidth={2} dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;

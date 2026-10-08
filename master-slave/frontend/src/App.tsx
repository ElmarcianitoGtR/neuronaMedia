import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'andon' | 'dashboard'>('andon');

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      {/* Navbar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">NeuronaMedia <span className="text-slate-400 text-sm font-normal">v1.0 (MVP)</span></h1>
        <nav className="flex gap-4">
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'andon' ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('andon')}
          >
            Tablero Andon
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {activeTab === 'andon' ? <AndonBoard /> : <Dashboard />}
      </main>
    </div>
  );
}

function AndonBoard() {
  // Skeleton data
  const lines = [
    { id: 1, name: 'Línea 1', status: 'success', message: 'Operando normalmente' },
    { id: 2, name: 'Línea 2', status: 'danger', message: 'Falla Mecánica Detectada' },
    { id: 3, name: 'Línea 3', status: 'warning', message: 'Alerta de Calidad' },
    { id: 4, name: 'Línea 4', status: 'success', message: 'Operando normalmente' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Estado en Planta (Tiempo Real)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lines.map((line) => (
          <div key={line.id} className={`rounded-xl shadow-md overflow-hidden border-t-8 ${
            line.status === 'success' ? 'border-success bg-green-50' :
            line.status === 'danger' ? 'border-danger bg-red-50' :
            'border-warning bg-yellow-50'
          }`}>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{line.name}</h3>
              <p className="text-lg text-slate-700">{line.message}</p>
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
    <div>
      <h2 className="text-xl font-bold mb-4">Métricas de Producción</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-1">Producción Total (Turno)</h3>
          <p className="text-4xl font-bold">1,240 <span className="text-sm font-normal text-slate-400">pz</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-1">Scrap Registrado</h3>
          <p className="text-4xl font-bold text-danger">45 <span className="text-sm font-normal text-slate-400">pz (3.5%)</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-500 mb-1">OEE Estimado</h3>
          <p className="text-4xl font-bold text-success">82%</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Avance de Producción vs Meta</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="5 5" name="Meta Planeada" />
            <Area type="monotone" dataKey="produccion" stroke="#1d4ed8" fillOpacity={1} fill="url(#colorProd)" name="Piezas Producidas" />
            <Line type="monotone" dataKey="scrap" stroke="#dc2626" name="Scrap" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;

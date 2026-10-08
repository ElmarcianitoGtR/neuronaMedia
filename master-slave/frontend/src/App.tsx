import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './App.css';

// Create a single socket instance
const socket = io('http://localhost:3000');

function App() {
  const [activeTab, setActiveTab] = useState<'andon' | 'dashboard'>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-slate-200 font-sans">
      {/* Navbar - Solid Matte */}
      <header className="bg-[#1f2937] border-b border-slate-700 p-4 flex justify-between items-center shadow-md z-50">
        <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-3">
          {import.meta.env.VITE_TENANT_LOGO && (
            <img src={import.meta.env.VITE_TENANT_LOGO} alt="Tenant Logo" className="h-8 w-auto object-contain" />
          )}
          {import.meta.env.VITE_TENANT_NAME || 'MANUFACTURING KPI DASHBOARD'}
        </h1>
        <nav className="flex gap-2">
          <button 
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-none rounded-sm ${activeTab === 'andon' ? 'bg-teal-600 text-white' : 'bg-[#374151] text-slate-300 hover:bg-[#4b5563]'}`}
            onClick={() => setActiveTab('andon')}
          >
            Andon
          </button>
          <button 
            className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-none rounded-sm ${activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'bg-[#374151] text-slate-300 hover:bg-[#4b5563]'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 w-full">
        {activeTab === 'andon' ? <AndonBoard /> : <Dashboard />}
      </main>
    </div>
  );
}

function AndonBoard() {
  const [lines, setLines] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const load = () => fetch('http://localhost:3000/api/dashboard/stats').then(r => r.json()).then(d => setLines(d.lines));
    load();
    const int = setInterval(load, 5000);
    return () => clearInterval(int);
  }, []);

  const generarDescargarPDF = async (lineName: string) => {
    setIsGenerating(true);
    try {
      // 1. Obtener datos estructurados desde NestJS (alerta real)
      const reportRes = await fetch(`http://localhost:3000/api/dashboard/report/${lineName}`);
      if (!reportRes.ok) throw new Error('Error obteniendo datos del backend');
      const rawData = await reportRes.json();

      // 2. Autogenerar 8D con IA (Gemini) vía Quality Hub
      const iaRes = await fetch('http://localhost:4321/api/incidentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rawData.id,
          descripcion: rawData.descripcion,
          area: rawData.area,
          severidad: rawData.severidad,
          evidencia: "Lectura anómala de telemetría IoT detectada"
        })
      });
      if (!iaRes.ok) throw new Error('Error generando análisis con IA');
      const aiResponse = await iaRes.json();

      // Mezclar datos originales con el análisis IA
      const incidenteData = {
        ...rawData,
        analisis: aiResponse.analisis
      };

      // 3. Mandar datos finales a Astro/Gotenberg para armar el PDF
      const response = await fetch('http://localhost:4321/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidenteData)
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gotenberg API Error');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte-${lineName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error al generar PDF. Verifica que quality-hub esté corriendo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      {isGenerating && (
        <div className="absolute inset-0 bg-slate-900/80 z-50 flex items-center justify-center backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-white font-bold text-lg mb-2">Generando Reporte Carta</h3>
            <p className="text-slate-400 text-sm">La Inteligencia Artificial está diagnosticando la falla...</p>
          </div>
        </div>
      )}
      {lines.map((line) => (
        <div key={line.id} className="bg-[#1f2937] border border-slate-700 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-100 uppercase">{line.name}</h3>
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-sm ${
              line.status === 'success' ? 'bg-teal-900 text-teal-400' :
              line.status === 'danger' ? 'bg-red-900 text-red-400' :
              'bg-yellow-900 text-yellow-400'
            }`}>{line.status}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">{line.message}</p>
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => generarDescargarPDF(line.name)}
              className="px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold uppercase rounded-sm"
            >
              Generar PDF Carta
            </button>
          </div>
          <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between">
            <span className="text-xs text-slate-500 uppercase">Velocidad</span>
            <span className="font-mono text-slate-200">{line.speed}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const [liveData, setLiveData] = useState<any>({
    oee: 0,
    productivity: 0,
    targetUnits: 0,
    actualUnits: 0
  });

  const [dbData, setDbData] = useState<any>({
    trendData: [],
    defectsData: [],
    downtimeData: []
  });

  const [isDbLoaded, setIsDbLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('telemetry_update', (data) => {
      setLiveData(data);
      setIsConnected(true);
    });
    
    const loadDb = () => {
      fetch('http://localhost:3000/api/dashboard/stats')
        .then(r => r.json())
        .then(data => {
          setDbData({
            trendData: data.trendData,
            defectsData: data.defectsData,
            downtimeData: data.downtimeData
          });
          setIsDbLoaded(true);
        })
        .catch(err => console.error("Error loading dashboard stats", err));
    };
    
    loadDb();
    const interval = setInterval(loadDb, 5000);

    return () => {
      socket.off('telemetry_update');
      clearInterval(interval);
    };
  }, []);

  const { trendData, defectsData, downtimeData } = dbData;

  const displayTrendData = [...trendData];
  if (displayTrendData.length > 0) {
    displayTrendData[displayTrendData.length - 1] = { 
      ...displayTrendData[displayTrendData.length - 1], 
      produccion: liveData.actualUnits || 0 
    };
  }

  const SocketOverlay = () => !isConnected && (
    <div className="absolute inset-0 bg-slate-900/80 z-40 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <span className="text-xs font-bold text-slate-300 uppercase animate-pulse text-center px-4">Esperando<br/>Stream UDP...</span>
    </div>
  );

  const DbOverlay = () => !isDbLoaded && (
    <div className="absolute inset-0 bg-slate-900/80 z-40 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <span className="text-xs font-bold text-slate-400 uppercase animate-pulse text-center px-4">Consultando<br/>PostgreSQL...</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      
      {/* Left Column: KPIs & Trend */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
        {/* KPI Panel */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 relative overflow-hidden">
          <SocketOverlay />
          <div className="bg-[#064e3b] border border-[#047857] p-3 mb-3 flex justify-between items-center transition-colors duration-500">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">OEE</span>
              <div className="text-3xl font-bold text-teal-400 transition-all duration-300">{liveData.oee}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">En Vivo</div>
              <div className="text-sm font-bold text-teal-400">WebSocket</div>
            </div>
          </div>
          
          <div className="bg-[#064e3b] border border-[#047857] p-3 mb-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">Eficiencia</span>
              <div className="text-3xl font-bold text-teal-400">74.5%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">↑ Incremento</div>
              <div className="text-sm font-bold text-teal-400">+2.66%</div>
            </div>
          </div>

          <div className="bg-[#064e3b] border border-[#047857] p-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">Disponibilidad</span>
              <div className="text-3xl font-bold text-teal-400">92.1%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">↑ Incremento</div>
              <div className="text-sm font-bold text-teal-400">+1.33%</div>
            </div>
          </div>
        </div>

        {/* Trend Panel */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow relative overflow-hidden">
          <DbOverlay />
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">PRODUCCIÓN ÚLTIMOS 7 DÍAS</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="time" stroke="#6b7280" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Area type="monotone" dataKey="produccion" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorOutput)" activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Column: Main Gauge & Output By Line */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-4">
        {/* Main Gauge Panel */}
        <div className="bg-[#1f2937] border border-slate-700 p-6 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden">
          <SocketOverlay />
          <h3 className="absolute top-4 left-4 text-xs font-bold uppercase text-slate-400 tracking-wider">PRODUCTIVIDAD DEL TURNO</h3>
          
          {/* Radial SVG Gauge */}
          <div className="relative w-64 h-32 mt-8 flex flex-col items-center justify-end">
            <svg viewBox="0 0 200 100" className="absolute top-0 left-0 w-full h-full overflow-visible">
              {/* Background Red (85% - 100%) */}
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="butt" />
              
              {/* Yellow Zone (Prod% - 85%) */}
              <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="#eab308" 
                strokeWidth="20" 
                strokeLinecap="butt"
                strokeDasharray={251.2} 
                strokeDashoffset={251.2 - 0.85 * 251.2}
              />

              {/* Teal Productivity Fill (0% - Prod%) */}
              <path 
                d="M 20 100 A 80 80 0 0 1 180 100" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="20" 
                strokeLinecap="butt"
                strokeDasharray={251.2} 
                strokeDashoffset={251.2 - (Math.min(liveData.productivity || 0, 100) / 100) * 251.2}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="text-5xl font-bold text-white z-10 mb-[-10px]">{liveData.productivity || 0}<span className="text-2xl text-slate-400">%</span></div>
          </div>
          <div className="flex justify-center gap-4 mt-8 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#14b8a6]"></span> Real
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#eab308]"></span> Gap (85%)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Margen
            </div>
          </div>
          <div className="flex justify-between w-full mt-12 px-8">
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase">Objetivo</div>
              <div className="text-xl font-mono text-slate-200">{liveData.targetUnits}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase">Unidades</div>
              <div className="text-xl font-mono text-slate-200 transition-all duration-300">{liveData.actualUnits}</div>
            </div>
          </div>
        </div>

        {/* Output By Line Horizontal Bars */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow relative overflow-hidden">
          <SocketOverlay />
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">PRODUCCIÓN POR LÍNEA - TURNO ACTUAL</h3>
          <div className="flex flex-col gap-3">
            {[ 
              {name: 'Línea 1', val: Math.round(liveData.productivity || 0), col: (liveData.productivity || 0) >= 85 ? 'bg-teal-500' : ((liveData.productivity || 0) < 60 ? 'bg-red-500' : 'bg-slate-500')}, 
              {name: 'Línea 2', val: 85, col: 'bg-slate-500'}, 
              {name: 'Línea 3', val: 56, col: 'bg-red-500'},
              {name: 'Línea 4', val: 91, col: 'bg-slate-500'} 
            ].map(l => (
              <div key={l.name} className="flex items-center gap-4 text-sm">
                <div className="w-16 text-slate-300 bg-[#374151] px-2 py-1 text-xs text-center">{l.name}</div>
                <div className="flex-grow bg-[#111827] h-5 relative">
                  <div className={`absolute top-0 left-0 h-full ${l.col}`} style={{ width: `${l.val}%` }}></div>
                  <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-white font-bold drop-shadow-md">{l.val}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Downtime & Defects */}
      <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
        {/* Downtime Bar Chart */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 relative overflow-hidden">
          <DbOverlay />
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">RESUMEN DE PAROS</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtimeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} cursor={{fill: '#374151', opacity: 0.4}} />
                <Bar dataKey="mech" stackId="a" fill="#475569" />
                <Bar dataKey="elec" stackId="a" fill="#64748b" />
                <Bar dataKey="ops" stackId="a" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defects Pie Chart */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow flex flex-col relative overflow-hidden">
          <DbOverlay />
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">TOP DEFECTOS</h3>
          <div className="flex-grow flex items-center">
            <div className="w-1/2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={defectsData} innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                    {defectsData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-2 justify-center pl-2">
              {defectsData.map((d: any) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }}></div>
                    <span className="text-slate-300">{d.name}</span>
                  </div>
                  <span className="text-slate-400">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;

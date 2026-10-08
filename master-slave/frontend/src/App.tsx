import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'andon' | 'dashboard'>('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-slate-200 font-sans">
      {/* Navbar - Solid Matte */}
      <header className="bg-[#1f2937] border-b border-slate-700 p-4 flex justify-between items-center shadow-md z-50">
        <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-3">
          MANUFACTURING KPI DASHBOARD
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
  const lines = [
    { id: 1, name: 'Línea 1', status: 'success', message: 'Operando', speed: '1,940 u/h' },
    { id: 2, name: 'Línea 2', status: 'danger', message: 'Falla Mecánica', speed: '0 u/h' },
    { id: 3, name: 'Línea 3', status: 'warning', message: 'Alerta Calidad', speed: '1,200 u/h' },
    { id: 4, name: 'Línea 4', status: 'success', message: 'Operando', speed: '1,850 u/h' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  // Recharts Data matching the dense industrial look
  const trendData = [
    { time: 'Lun', produccion: 5200 }, { time: 'Mar', produccion: 6100 },
    { time: 'Mie', produccion: 5800 }, { time: 'Jue', produccion: 7400 },
    { time: 'Vie', produccion: 7100 }, { time: 'Sab', produccion: 8500 },
    { time: 'Dom', produccion: 8200 },
  ];
  
  const defectsData = [
    { name: 'Labeling', value: 30.7, fill: '#64748b' }, // slate-500
    { name: 'Sealing', value: 21.2, fill: '#475569' }, // slate-600
    { name: 'Alignment', value: 13.9, fill: '#334155' }, // slate-700
    { name: 'Weight', value: 12.6, fill: '#ef4444' }, // red-500 (ALERT)
  ];

  const downtimeData = [
    { name: 'L1', mech: 20, elec: 10, ops: 5 },
    { name: 'L2', mech: 15, elec: 25, ops: 10 },
    { name: 'L3', mech: 30, elec: 5, ops: 15 },
    { name: 'L4', mech: 10, elec: 15, ops: 20 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      
      {/* Left Column: KPIs & Trend */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
        {/* KPI Panel */}
        <div className="bg-[#1f2937] border border-slate-700 p-4">
          <div className="bg-[#064e3b] border border-[#047857] p-3 mb-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">OEE</span>
              <div className="text-3xl font-bold text-teal-400">69.2%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">↑ Increase</div>
              <div className="text-sm font-bold text-teal-400">+3.22%</div>
            </div>
          </div>
          
          <div className="bg-[#064e3b] border border-[#047857] p-3 mb-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">Efficiency</span>
              <div className="text-3xl font-bold text-teal-400">74.5%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">↑ Increase</div>
              <div className="text-sm font-bold text-teal-400">+2.66%</div>
            </div>
          </div>

          <div className="bg-[#064e3b] border border-[#047857] p-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-300 uppercase">Availability</span>
              <div className="text-3xl font-bold text-teal-400">92.1%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-teal-500">↑ Increase</div>
              <div className="text-sm font-bold text-teal-400">+1.33%</div>
            </div>
          </div>
        </div>

        {/* Trend Panel */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">OUTPUT LAST 7 DAYS</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
        <div className="bg-[#1f2937] border border-slate-700 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
          <h3 className="absolute top-4 left-4 text-xs font-bold uppercase text-slate-400 tracking-wider">PRODUCTIVITY SHIFT</h3>
          
          {/* Simulated Gauge with SVG */}
          <div className="relative w-48 h-24 overflow-hidden mt-8">
            <div className="absolute inset-0 border-[16px] border-[#374151] rounded-t-full border-b-0"></div>
            <div className="absolute inset-0 border-[16px] border-teal-500 rounded-t-full border-b-0" style={{ clipPath: 'polygon(0 0, 73% 0, 73% 100%, 0 100%)' }}></div>
            <div className="absolute inset-0 border-[16px] border-yellow-500 rounded-t-full border-b-0" style={{ clipPath: 'polygon(73% 0, 85% 0, 85% 100%, 73% 100%)' }}></div>
            <div className="absolute inset-0 border-[16px] border-red-500 rounded-t-full border-b-0" style={{ clipPath: 'polygon(85% 0, 100% 0, 100% 100%, 85% 100%)' }}></div>
          </div>
          <div className="text-5xl font-bold text-white mt-2">73<span className="text-2xl text-slate-400">%</span></div>
          
          <div className="flex justify-between w-full mt-12 px-8">
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase">Target</div>
              <div className="text-xl font-mono text-slate-200">1,284</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase">Units</div>
              <div className="text-xl font-mono text-slate-200">937</div>
            </div>
          </div>
        </div>

        {/* Output By Line Horizontal Bars */}
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">OUTPUT BY LINE - CURRENT SHIFT</h3>
          <div className="flex flex-col gap-3">
            {[ 
              {name: 'Line 1', val: 72, col: 'bg-slate-500'}, 
              {name: 'Line 2', val: 85, col: 'bg-slate-500'}, 
              {name: 'Line 3', val: 56, col: 'bg-red-500'}, // ALERT
              {name: 'Line 4', val: 91, col: 'bg-slate-500'} 
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
        <div className="bg-[#1f2937] border border-slate-700 p-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">DOWNTIME SUMMARY</h3>
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
        <div className="bg-[#1f2937] border border-slate-700 p-4 flex-grow flex flex-col">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">TOP DEFECTS</h3>
          <div className="flex-grow flex items-center">
            <div className="w-1/2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={defectsData} innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                    {defectsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-2 justify-center pl-2">
              {defectsData.map(d => (
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

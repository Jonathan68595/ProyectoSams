import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, BarChart3, Activity, Table, 
  Plus, Trash2, X, ChevronRight, Save, FileSpreadsheet,
  Dumbbell, Timer, TrendingUp, Menu, ChevronLeft, Settings,
  LogOut, User, PieChart, Target, Zap, Clock
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// --- COMPONENTES UI (Botones, Modales, Cards) ---

const Modal = ({ isOpen, onClose, title, children, icon: Icon }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {Icon && <Icon size={24} />}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {children}
        </div>
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancelar</button>
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

const CycleCard = ({ title, desc, icon: Icon, color, onClick, stats, isActive }) => (
  <div 
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl p-8 border shadow-sm transition-all duration-300 cursor-pointer text-left h-full ${
      isActive 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md' 
        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-200 hover:shadow-xl'
    }`}
  >
    <div className={`absolute top-0 right-0 p-32 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110 ${color}`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
        isActive 
          ? 'bg-blue-500 text-white' 
          : color.replace('bg-', 'bg-opacity-10 text-').replace('100', '600')
      }`}>
        <Icon size={32} />
      </div>
      <h3 className={`text-2xl font-bold mb-2 transition-colors ${
        isActive ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-700'
      }`}>{title}</h3>
      <p className="text-slate-500 mb-6 leading-relaxed text-sm">{desc}</p>
      
      {stats && (
        <div className="flex gap-4 pt-4 border-t border-slate-100">
           {stats.map((s, i) => (
             <div key={i}>
                <div className={`text-lg font-bold ${
                  isActive ? 'text-blue-600' : 'text-slate-700'
                }`}>{s.val}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</div>
             </div>
           ))}
        </div>
      )}
    </div>
    <div className={`absolute bottom-6 right-6 transition-all ${
      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
    } transform ${isActive ? 'translate-x-0' : 'translate-x-2 group-hover:translate-x-0'}`}>
        <div className={`p-2 rounded-full shadow-md border ${
          isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-slate-100 text-blue-600'
        }`}>
            <ChevronRight size={20} />
        </div>
    </div>
  </div>
);

const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    {change && (
      <div className={`text-sm font-medium ${
        change > 0 ? 'text-emerald-600' : 'text-rose-600'
      }`}>
        {change > 0 ? '+' : ''}{change}% vs período anterior
      </div>
    )}
  </div>
);

// --- ESTADO INICIAL ---

const initialMacroData = {
  startDate: "2024-04-01",
  periods: [
    { name: "P. PREPARATORIO", percent: 60, weeks: 13, color: "bg-blue-500" },
    { name: "P. COMPETITIVO", percent: 40, weeks: 13, color: "bg-emerald-500" }
  ],
  stages: [
    { name: "E. GENERAL", weeks: 8 },
    { name: "E. ESPECIAL", weeks: 5 },
    { name: "PRE-COMPETITIVO", weeks: 6 },
    { name: "COMPETITIVO", weeks: 7 }
  ]
};

const initialMesoData = [
  { id: 1, name: "Coordinación General", unit: "Rep/Tiempo", exercises: 5, reps: 15, series: 2, freq: 5 },
  { id: 2, name: "Rapidez Especial", unit: "Repeticiones", exercises: 2, reps: 6, series: 3, freq: 3 },
  { id: 3, name: "Técnica General", unit: "Repeticiones", exercises: 13, reps: 7, series: 3, freq: 5 },
  { id: 4, name: "Velocidad Traslación", unit: "Rep/Tiempo", exercises: 5, reps: 11, series: 4, freq: 3 },
  { id: 5, name: "Técnico-Táctico", unit: "Rep/Goles", exercises: 6, reps: 12, series: 3, freq: 5 },
];

const initialMicroData = Array.from({ length: 26 }, (_, i) => ({
  week: `S${i + 1}`,
  coord: Math.floor(Math.random() * 200) + 100,
  rapid: Math.floor(Math.random() * 50) + 10,
  tec: Math.floor(Math.random() * 150) + 50,
  vol: Math.floor(Math.random() * 500) + 300,
  intensity: Math.floor(Math.random() * 100),
  fatigue: Math.floor(Math.random() * 100),
  performance: Math.floor(Math.random() * 100)
}));

// Datos para gráficos de distribución
const distributionData = [
  { name: 'Coordinación', value: 25, color: '#3b82f6' },
  { name: 'Rapidez', value: 15, color: '#10b981' },
  { name: 'Técnica', value: 30, color: '#8b5cf6' },
  { name: 'Velocidad', value: 10, color: '#f59e0b' },
  { name: 'Táctico', value: 20, color: '#ef4444' },
];

// Datos para gráfico radar
const radarData = [
  { subject: 'Fuerza', A: 80, B: 65, fullMark: 100 },
  { subject: 'Velocidad', A: 70, B: 85, fullMark: 100 },
  { subject: 'Resistencia', A: 85, B: 75, fullMark: 100 },
  { subject: 'Técnica', A: 75, B: 90, fullMark: 100 },
  { subject: 'Táctica', A: 90, B: 70, fullMark: 100 },
  { subject: 'Mental', A: 65, B: 80, fullMark: 100 },
];

const HomeScreen = ({ user }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeCycle, setActiveCycle] = useState('macro'); // 'macro', 'meso', 'micro'
  const [macro, setMacro] = useState(initialMacroData);
  const [meso, setMeso] = useState(initialMesoData);
  const [micro, setMicro] = useState(initialMicroData);

  // Cálculos derivados
  const totalWeeks = macro.periods.reduce((acc, p) => acc + p.weeks, 0);
  const totalVolume = meso.reduce((acc, m) => acc + (m.exercises * m.reps * m.series * m.freq * totalWeeks), 0);
  const avgWeeklyVolume = totalVolume / totalWeeks;
  
  // Calcular distribución de volumen por capacidad
  const volumeByCapacity = meso.map(m => ({
    name: m.name,
    value: Math.round((m.exercises * m.reps * m.series * m.freq * totalWeeks) / totalVolume * 100),
    volume: m.exercises * m.reps * m.series * m.freq * totalWeeks
  }));

  // --- FORMULARIOS ---

  const MacroForm = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> Configuración General</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de Inicio</label>
                    <input type="date" value={macro.startDate} onChange={(e) => setMacro({...macro, startDate: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <strong>Duración Total:</strong> {totalWeeks} Semanas
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Periodos (Distribución %)</h3>
            {macro.periods.map((p, i) => (
                <div key={i} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                        <span>{p.name}</span>
                        <span className="font-bold">{p.weeks} sem ({p.percent}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.percent}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <h3 className="font-semibold text-slate-800 mb-4">Etapas del Macrociclo</h3>
         <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
            {macro.stages.map((stage, idx) => (
                <div key={idx} className="flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-3 w-40">
                    <input 
                        value={stage.name} 
                        onChange={(e) => {
                             const newStages = [...macro.stages];
                             newStages[idx].name = e.target.value;
                             setMacro({...macro, stages: newStages});
                        }}
                        className="w-full bg-transparent font-semibold text-slate-700 mb-2 border-b border-transparent focus:border-blue-400 outline-none"
                    />
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            value={stage.weeks}
                            onChange={(e) => {
                                const newStages = [...macro.stages];
                                newStages[idx].weeks = parseInt(e.target.value) || 0;
                                setMacro({...macro, stages: newStages});
                            }}
                            className="w-16 p-1 text-sm border rounded text-center"
                        />
                        <span className="text-xs text-slate-500">semanas</span>
                    </div>
                </div>
            ))}
            <button className="flex-shrink-0 w-12 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                <Plus size={24} />
            </button>
         </div>
      </div>
    </div>
  );

  const MesoForm = () => (
    <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm flex items-center gap-3">
            <Activity className="w-5 h-5 flex-shrink-0" />
            <p>Define aquí las <strong>Capacidades Físicas</strong> y sus volúmenes base.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                        <th className="p-4">Capacidad / Dirección</th>
                        <th className="p-4 w-24 text-center">Ejercicios</th>
                        <th className="p-4 w-24 text-center">Reps</th>
                        <th className="p-4 w-24 text-center">Series</th>
                        <th className="p-4 w-24 text-center">Frec/Sem</th>
                        <th className="p-4 w-32 text-center bg-slate-100/50">Vol. Semanal</th>
                        <th className="p-4 w-12"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {meso.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-2 pl-4">
                                <input value={row.name} onChange={(e) => {
                                    const newMeso = [...meso]; newMeso[idx].name = e.target.value; setMeso(newMeso);
                                }} className="w-full font-medium text-slate-800 bg-transparent outline-none border-b border-transparent focus:border-blue-400" />
                                <div className="text-xs text-slate-400 mt-1">{row.unit}</div>
                            </td>
                            <td className="p-2"><input type="number" value={row.exercises} onChange={(e) => {
                                const newMeso = [...meso]; newMeso[idx].exercises = Number(e.target.value); setMeso(newMeso);
                            }} className="w-full text-center p-1 border rounded bg-slate-50 focus:bg-white" /></td>
                            <td className="p-2"><input type="number" value={row.reps} onChange={(e) => {
                                const newMeso = [...meso]; newMeso[idx].reps = Number(e.target.value); setMeso(newMeso);
                            }} className="w-full text-center p-1 border rounded bg-slate-50 focus:bg-white" /></td>
                            <td className="p-2"><input type="number" value={row.series} onChange={(e) => {
                                const newMeso = [...meso]; newMeso[idx].series = Number(e.target.value); setMeso(newMeso);
                            }} className="w-full text-center p-1 border rounded bg-slate-50 focus:bg-white" /></td>
                            <td className="p-2"><input type="number" value={row.freq} onChange={(e) => {
                                const newMeso = [...meso]; newMeso[idx].freq = Number(e.target.value); setMeso(newMeso);
                            }} className="w-full text-center p-1 border rounded bg-slate-50 focus:bg-white" /></td>
                            <td className="p-4 text-center font-bold text-blue-600 bg-slate-50/30">
                                {(row.exercises * row.reps * row.series * row.freq).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => setMeso(meso.filter(m => m.id !== row.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button onClick={() => setMeso([...meso, { id: Date.now(), name: "Nueva Capacidad", unit: "Rep", exercises: 0, reps: 0, series: 0, freq: 0 }])} className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">
            <Plus size={18} /> Añadir Fila
        </button>
    </div>
  );

  const MicroForm = () => (
    <div className="space-y-6 h-full flex flex-col">
        <div className="bg-indigo-50 p-4 rounded-lg text-indigo-800 text-sm mb-2">
            <p>Distribución de la <strong>Dinámica de Cargas</strong> semana a semana.</p>
        </div>
        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl shadow-sm bg-white">
            <table className="w-full text-sm text-center relative border-collapse">
                <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                    <tr>
                        <th className="p-3 text-left sticky left-0 bg-slate-100 border-r border-slate-200 z-20">Semana</th>
                        {meso.map(m => (
                            <th key={m.id} className="p-3 min-w-[120px] font-semibold text-slate-700 border-r border-slate-200/50">{m.name}</th>
                        ))}
                        <th className="p-3 bg-slate-200/50">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {micro.slice(0, totalWeeks).map((week, wIdx) => (
                        <tr key={wIdx} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-slate-600 sticky left-0 bg-white border-r border-slate-200">S{wIdx + 1}</td>
                            {meso.map((m, mIdx) => (
                                <td key={m.id} className="p-1 border-r border-slate-100">
                                    <input 
                                        type="number" 
                                        className="w-full text-center p-1 rounded hover:bg-slate-100 focus:bg-blue-50 focus:text-blue-600 outline-none transition-colors text-slate-500"
                                        placeholder="0"
                                        defaultValue={Math.floor(Math.random() * 200)}
                                    />
                                </td>
                            ))}
                            <td className="p-2 font-bold text-indigo-600 bg-indigo-50/30">
                                {Math.floor(Math.random() * 500) + 300}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  // Renderizado condicional de gráficos según el ciclo activo
  const renderCycleCharts = () => {
    switch(activeCycle) {
      case 'macro':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Distribución Temporal</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={macro.periods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percent"
                      label={({ name, percent }) => `${name}: ${percent}%`}
                    >
                      {macro.periods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Evolución de Etapas</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={macro.stages}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="weeks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'meso':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Distribución de Volumen por Capacidad</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={volumeByCapacity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {volumeByCapacity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={distributionData[index % distributionData.length].color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Perfil de Capacidades</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Actual" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Objetivo" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'micro':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Volumen de Carga Semanal</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={micro.slice(0, totalWeeks)}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="vol" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" name="Volumen Total" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6 text-sm uppercase tracking-wide">Intensidad vs Fatiga</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={micro.slice(0, totalWeeks)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Legend />
                    <Line type="monotone" dataKey="intensity" stroke="#ef4444" strokeWidth={2} name="Intensidad" />
                    <Line type="monotone" dataKey="fatigue" stroke="#8b5cf6" strokeWidth={2} name="Fatiga" />
                    <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} name="Rendimiento" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeModal === 'macro' ? 'Configuración Macrociclo' : 
             activeModal === 'meso' ? 'Definición de Cargas' : 
             activeModal === 'micro' ? 'Dinámica Semanal' : 'Vista General'}
          </h2>
        </div>
      </header>

      {/* Area Scrollable */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Resumen Rápido (Solo visible en Dashboard) */}
          {activeModal === null && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
                <span className="text-sm text-slate-500">Última actualización: Hoy, 14:30</span>
              </div>

              {/* Cartas de Acceso Rápido */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CycleCard 
                  title="Macrociclo" 
                  desc="Estructura temporal general." 
                  icon={Calendar} 
                  color="bg-blue-100" 
                  onClick={() => setActiveCycle('macro')}
                  isActive={activeCycle === 'macro'}
                  stats={[{val: `${totalWeeks} Sem`, label: 'Duración'}, {val: macro.periods.length, label: 'Periodos'}]}
                />
                <CycleCard 
                  title="Mesociclo" 
                  desc="Volúmenes y ejercicios." 
                  icon={Dumbbell} 
                  color="bg-emerald-100"
                  onClick={() => setActiveCycle('meso')}
                  isActive={activeCycle === 'meso'}
                  stats={[{val: meso.length, label: 'Capacidades'}, {val: (totalVolume/1000).toFixed(1)+'k', label: 'Vol. Total'}]}
                />
                <CycleCard 
                  title="Microciclo" 
                  desc="Dinámica semanal." 
                  icon={TrendingUp} 
                  color="bg-indigo-100"
                  onClick={() => setActiveCycle('micro')}
                  isActive={activeCycle === 'micro'}
                  stats={[{val: 'Ondulatoria', label: 'Dinámica'}, {val: 'S1-S26', label: 'Rango'}]}
                />
              </div>

              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                  title="Volumen Total" 
                  value={totalVolume.toLocaleString()} 
                  change={5.2}
                  icon={Dumbbell}
                  color="bg-blue-100"
                  subtitle="Unidades de carga"
                />
                <MetricCard 
                  title="Duración Total" 
                  value={`${totalWeeks} semanas`} 
                  change={0}
                  icon={Clock}
                  color="bg-emerald-100"
                  subtitle={`${Math.round(totalWeeks/4.345)} meses`}
                />
                <MetricCard 
                  title="Volumen Promedio Semanal" 
                  value={Math.round(avgWeeklyVolume).toLocaleString()} 
                  change={2.8}
                  icon={BarChart3}
                  color="bg-indigo-100"
                  subtitle="Carga semanal media"
                />
                <MetricCard 
                  title="Capacidades Trabajadas" 
                  value={meso.length} 
                  change={10.5}
                  icon={Target}
                  color="bg-amber-100"
                  subtitle="Direcciones de entrenamiento"
                />
              </div>

              {/* Dashboard Charts */}
              <section className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">
                    {activeCycle === 'macro' && 'Análisis del Macrociclo'}
                    {activeCycle === 'meso' && 'Distribución de Cargas'}
                    {activeCycle === 'micro' && 'Dinámica Semanal'}
                  </h3>
                </div>

                {renderCycleCharts()}
              </section>
            </>
          )}

          {/* Contenido cuando se selecciona una opción del menú lateral */}
          {activeModal === 'macro' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl"><Calendar /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Macrociclo</h2>
                  <p className="text-slate-500">Configuración estructural de la temporada</p>
                </div>
              </div>
              <MacroForm />
            </div>
          )}

          {activeModal === 'meso' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl"><Dumbbell /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Mesociclo</h2>
                  <p className="text-slate-500">Definición de medios y métodos</p>
                </div>
              </div>
              <MesoForm />
            </div>
          )}

          {activeModal === 'micro' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-200px)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl"><TrendingUp /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Microciclo</h2>
                  <p className="text-slate-500">Distribución de cargas semanales</p>
                </div>
              </div>
              <MicroForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
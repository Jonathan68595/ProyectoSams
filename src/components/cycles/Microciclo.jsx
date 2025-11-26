// components/cycles/Microciclo.jsx
import React, { useState, useRef } from 'react';
import { 
  TrendingUp, BarChart3, Activity, Filter, Download,
  Plus, Save, Trash2, Edit, Calendar, Target,
  Users, Clock, Zap, Printer
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Datos iniciales para microciclos
const initialMicrocicloData = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  semana: `S${i + 1}`,
  volumen: Math.floor(Math.random() * 500) + 300,
  intensidad: Math.floor(Math.random() * 100),
  fatiga: Math.floor(Math.random() * 100),
  rendimiento: Math.floor(Math.random() * 100),
  coordinacion: Math.floor(Math.random() * 200) + 100,
  rapidez: Math.floor(Math.random() * 50) + 10,
  tecnica: Math.floor(Math.random() * 150) + 50,
  periodo: i < 13 ? 'P. PREPARATORIO' : 'P. COMPETITIVO',
  etapa: i < 8 ? 'E. GENERAL' : 
         i < 13 ? 'E. ESPECIAL' : 
         i < 19 ? 'PRE-COMPETITIVO' : 'COMPETITIVO',
  fecha: new Date(2024, 3, 1 + (i * 7)).toISOString().split('T')[0]
}));

const periodos = ['P. PREPARATORIO', 'P. COMPETITIVO', 'P. TRANSICIÓN'];
const etapas = ['E. GENERAL', 'E. ESPECIAL', 'PRE-COMPETITIVO', 'COMPETITIVO'];

const Microciclo = () => {
  const [microciclos, setMicrociclos] = useState(initialMicrocicloData);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [viewType, setViewType] = useState('volume');
  const [showNewMicroForm, setShowNewMicroForm] = useState(false);
  const [newMicroData, setNewMicroData] = useState({
    semana: '',
    volumen: 0,
    intensidad: 0,
    fatiga: 0,
    rendimiento: 0,
    coordinacion: 0,
    rapidez: 0,
    tecnica: 0,
    periodo: 'P. PREPARATORIO',
    etapa: 'E. GENERAL',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [editingMicro, setEditingMicro] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const pdfRef = useRef();

  // Configuración del macrociclo
  const totalWeeks = 26;

  // Toggle selección de semanas
  const toggleWeekSelection = (weekIndex) => {
    setSelectedWeeks(prev => 
      prev.includes(weekIndex)
        ? prev.filter(w => w !== weekIndex)
        : [...prev, weekIndex]
    );
  };

  // Datos para gráficos
  const chartData = microciclos.slice(0, totalWeeks).map((week, index) => ({
    ...week,
    weekNumber: index + 1
  }));

  // Calcular promedios por periodo
  const periodAverages = periodos.map(period => {
    const periodWeeks = chartData.filter(w => w.periodo === period);
    const avgVolume = periodWeeks.reduce((acc, w) => acc + w.volumen, 0) / periodWeeks.length;
    const avgIntensity = periodWeeks.reduce((acc, w) => acc + w.intensidad, 0) / periodWeeks.length;
    
    return {
      periodo: period,
      avgVolume: Math.round(avgVolume),
      avgIntensity: Math.round(avgIntensity),
      semanas: periodWeeks.length
    };
  });

  // Estadísticas generales
  const stats = {
    totalSemanas: microciclos.length,
    volumenPromedio: Math.round(chartData.reduce((acc, w) => acc + w.volumen, 0) / totalWeeks),
    intensidadPromedio: Math.round(chartData.reduce((acc, w) => acc + w.intensidad, 0) / totalWeeks),
    rendimientoPromedio: Math.round(chartData.reduce((acc, w) => acc + w.rendimiento, 0) / totalWeeks)
  };

  // Función para generar PDF
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add header with metadata
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generado el: ${date}`, 15, 10);
      pdf.text(`Total de semanas: ${stats.totalSemanas}`, 15, 15);
      pdf.text(`Volumen promedio: ${stats.volumenPromedio}`, 15, 20);

      pdf.save(`microciclo-${date}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Funciones CRUD
  const handleCreateMicro = () => {
    const microWithId = {
      ...newMicroData,
      id: Date.now(),
      semana: `S${microciclos.length + 1}`
    };
    setMicrociclos([...microciclos, microWithId]);
    setShowNewMicroForm(false);
    setNewMicroData({
      semana: '',
      volumen: 0,
      intensidad: 0,
      fatiga: 0,
      rendimiento: 0,
      coordinacion: 0,
      rapidez: 0,
      tecnica: 0,
      periodo: 'P. PREPARATORIO',
      etapa: 'E. GENERAL',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleUpdateMicro = () => {
    const updatedMicrociclos = microciclos.map(micro => 
      micro.id === editingMicro.id ? editingMicro : micro
    );
    setMicrociclos(updatedMicrociclos);
    setEditingMicro(null);
    setShowNewMicroForm(false);
  };

  const handleDeleteMicro = (id) => {
    setMicrociclos(microciclos.filter(micro => micro.id !== id));
  };

  const handleEditMicro = (micro) => {
    setEditingMicro(micro);
    setShowNewMicroForm(true);
  };

  const handleMicroChange = (field, value) => {
    if (editingMicro) {
      setEditingMicro({
        ...editingMicro,
        [field]: value
      });
    } else {
      setNewMicroData({
        ...newMicroData,
        [field]: value
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Microciclo</h2>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewMicroForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Nueva Semana
          </button>
          <button 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Generando...
              </>
            ) : (
              <>
                <Printer size={16} />
                Imprimir PDF
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
        {/* Contenedor para PDF con estilos específicos */}
        <div 
          ref={pdfRef}
          className="max-w-7xl mx-auto space-y-8 bg-white p-8 pdf-container"
          style={{
            boxShadow: 'none',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Encabezado del PDF */}
          <div className="text-center mb-8 pdf-header">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Planificación del Microciclo</h1>
            <p className="text-slate-600">Seguimiento semanal de cargas, intensidad y rendimiento</p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
              <span>Generado: {new Date().toLocaleDateString()}</span>
              <span>Semanas: {stats.totalSemanas}</span>
              <span>Volumen Promedio: {stats.volumenPromedio}</span>
            </div>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pdf-metrics">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Semanas Activas</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalSemanas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Activity className="text-emerald-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vol. Promedio</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.volumenPromedio}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="text-amber-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Intens. Promedio</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.intensidadPromedio}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Zap className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Rend. Promedio</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.rendimientoPromedio}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gráficos Principales */}
            <div className="lg:col-span-2 space-y-6 pdf-charts">
              {/* Gráfico de Volumen */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">
                  Evolución del Volumen de Carga
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="semana" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="volumen" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorVol)" 
                        name="Volumen Total" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Intensidad vs Fatiga */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">
                  Intensidad vs Fatiga vs Rendimiento
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="semana" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="intensidad" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        name="Intensidad" 
                        dot={{ fill: '#ef4444' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="fatiga" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        name="Fatiga" 
                        dot={{ fill: '#8b5cf6' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rendimiento" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        name="Rendimiento" 
                        dot={{ fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar con información y controles */}
            <div className="space-y-6 pdf-sidebar">
              {/* Promedios por Periodo */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">
                  Promedios por Periodo
                </h3>
                <div className="space-y-4">
                  {periodAverages.map((period, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <div className="font-medium text-slate-800 mb-2 text-center">
                        {period.periodo}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Volumen:</span>
                          <span className="font-medium">{period.avgVolume}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Intensidad:</span>
                          <span className="font-medium">{period.avgIntensity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Semanas:</span>
                          <span className="font-medium">{period.semanas}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4 text-center">
                  Estadísticas Rápidas
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volumen Máximo:</span>
                    <span className="font-medium">
                      {Math.max(...chartData.map(w => w.volumen)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volumen Mínimo:</span>
                    <span className="font-medium">
                      {Math.min(...chartData.map(w => w.volumen)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Intensidad Máxima:</span>
                    <span className="font-medium">
                      {Math.max(...chartData.map(w => w.intensidad))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tendencia:</span>
                    <span className={`font-medium ${
                      (chartData[chartData.length - 1].volumen - chartData[0].volumen) > 0 
                        ? 'text-emerald-600' 
                        : 'text-rose-600'
                    }`}>
                      {Math.round((chartData[chartData.length - 1].volumen - chartData[0].volumen) / chartData[0].volumen * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Datos Detallados */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden pdf-table">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 text-center">
                Datos Semanales Detallados
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-slate-700">Semana</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Fecha</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Periodo</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Etapa</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Volumen</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Intensidad</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Fatiga</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Rendimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartData.map((week, index) => (
                    <tr 
                      key={week.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        selectedWeeks.includes(index) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="p-4 font-medium text-slate-800">
                        {week.semana}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {new Date(week.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {week.periodo}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {week.etapa}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {week.volumen}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <div 
                            className="w-16 bg-slate-200 rounded-full h-2 mr-2"
                            title={`${week.intensidad}%`}
                          >
                            <div 
                              className="h-2 rounded-full bg-red-500"
                              style={{ width: `${week.intensidad}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{week.intensidad}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {week.fatiga}%
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-medium ${
                          week.rendimiento >= 80 ? 'text-emerald-600' :
                          week.rendimiento >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {week.rendimiento}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie de página del PDF */}
          <div className="text-center mt-8 pt-4 border-t border-slate-200 pdf-footer">
            <p className="text-sm text-slate-500">
              Sistema de Planificación Deportiva - Microciclo {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Controles de interfaz (no se incluyen en el PDF) */}
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Vista
                  </label>
                  <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="volume">Volumen</option>
                    <option value="intensity">Intensidad</option>
                    <option value="performance">Rendimiento</option>
                    <option value="fatigue">Fatiga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filtros
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedWeeks([])}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setSelectedWeeks(Array.from({ length: totalWeeks }, (_, i) => i))}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Seleccionar Todas
                    </button>
                  </div>
                </div>
              </div>

              {/* Selección de Semanas */}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-3 text-sm">
                  Selección de Semanas
                </h4>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {chartData.map((week, index) => (
                    <button
                      key={index}
                      onClick={() => toggleWeekSelection(index)}
                      className={`p-2 text-xs text-center rounded border transition-colors ${
                        selectedWeeks.includes(index)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {week.semana}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Filter size={16} />
                  Filtros Avanzados
                </button>
              </div>
            </div>
          </div>

          {/* Tabla con controles de edición (no incluida en PDF) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">
                Gestión de Semanas - Controles de Edición
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-slate-700">Semana</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Fecha</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Periodo</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Volumen</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Intensidad</th>
                    <th className="p-4 text-center font-semibold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartData.slice(0, 10).map((week, index) => (
                    <tr key={week.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">
                        {week.semana}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {new Date(week.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {week.periodo}
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {week.volumen}
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-sm">{week.intensidad}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => handleEditMicro(week)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMicro(week.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para Nueva/Editar Semana */}
      {showNewMicroForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingMicro ? 'Editar Semana' : 'Nueva Semana de Entrenamiento'}
                </h3>
                <button 
                  onClick={() => {
                    setShowNewMicroForm(false);
                    setEditingMicro(null);
                    setNewMicroData({
                      semana: '',
                      volumen: 0,
                      intensidad: 0,
                      fatiga: 0,
                      rendimiento: 0,
                      coordinacion: 0,
                      rapidez: 0,
                      tecnica: 0,
                      periodo: 'P. PREPARATORIO',
                      etapa: 'E. GENERAL',
                      fecha: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Semana *
                  </label>
                  <input
                    type="text"
                    value={editingMicro ? editingMicro.semana : newMicroData.semana}
                    onChange={(e) => handleMicroChange('semana', e.target.value)}
                    placeholder="Ej: S1, S2, etc."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={editingMicro ? editingMicro.fecha : newMicroData.fecha}
                    onChange={(e) => handleMicroChange('fecha', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Periodo *
                  </label>
                  <select
                    value={editingMicro ? editingMicro.periodo : newMicroData.periodo}
                    onChange={(e) => handleMicroChange('periodo', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {periodos.map(periodo => (
                      <option key={periodo} value={periodo}>{periodo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Etapa *
                  </label>
                  <select
                    value={editingMicro ? editingMicro.etapa : newMicroData.etapa}
                    onChange={(e) => handleMicroChange('etapa', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {etapas.map(etapa => (
                      <option key={etapa} value={etapa}>{etapa}</option>
                    ))}
                  </select>
                </div>

                {['volumen', 'intensidad', 'fatiga', 'rendimiento', 'coordinacion', 'rapidez', 'tecnica'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field === 'volumen' ? 'Volumen Total' :
                       field === 'intensidad' ? 'Intensidad (%)' :
                       field === 'fatiga' ? 'Fatiga (%)' :
                       field === 'rendimiento' ? 'Rendimiento (%)' :
                       field === 'coordinacion' ? 'Coordinación' :
                       field === 'rapidez' ? 'Rapidez' : 'Técnica'} *
                    </label>
                    <input
                      type="number"
                      value={editingMicro ? editingMicro[field] : newMicroData[field]}
                      onChange={(e) => handleMicroChange(field, parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max={field.includes('intensidad') || field.includes('fatiga') || field.includes('rendimiento') ? "100" : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowNewMicroForm(false);
                  setEditingMicro(null);
                  setNewMicroData({
                    semana: '',
                    volumen: 0,
                    intensidad: 0,
                    fatiga: 0,
                    rendimiento: 0,
                    coordinacion: 0,
                    rapidez: 0,
                    tecnica: 0,
                    periodo: 'P. PREPARATORIO',
                    etapa: 'E. GENERAL',
                    fecha: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={editingMicro ? handleUpdateMicro : handleCreateMicro}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                {editingMicro ? 'Actualizar' : 'Crear'} Semana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Microciclo;
// components/cycles/Mesociclo.jsx
import React, { useState, useRef } from 'react';
import { 
  Dumbbell, Activity, Plus, Trash2, PieChart, Target,
  Save, Download, Filter, Search, BarChart3, TrendingUp,
  Users, Clock, Printer
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Datos iniciales para el mesociclo
const initialMesocicloData = [
  {
    id: 1,
    name: "Coordinación General",
    unit: "Rep/Tiempo",
    exercises: 5,
    reps: 15,
    series: 2,
    freq: 5,
    tipo: "Física",
    color: "#3b82f6"
  },
  {
    id: 2,
    name: "Rapidez Especial",
    unit: "Repeticiones",
    exercises: 2,
    reps: 6,
    series: 3,
    freq: 3,
    tipo: "Física",
    color: "#10b981"
  },
  {
    id: 3,
    name: "Técnica General",
    unit: "Repeticiones",
    exercises: 13,
    reps: 7,
    series: 3,
    freq: 5,
    tipo: "Técnica",
    color: "#8b5cf6"
  },
  {
    id: 4,
    name: "Velocidad de Traslación",
    unit: "Rep/Tiempo",
    exercises: 5,
    reps: 11,
    series: 4,
    freq: 3,
    tipo: "Física",
    color: "#f59e0b"
  },
  {
    id: 5,
    name: "Técnico-Táctico",
    unit: "Rep/Goles",
    exercises: 6,
    reps: 12,
    series: 3,
    freq: 5,
    tipo: "Táctica",
    color: "#ef4444"
  }
];

const tiposCapacidad = ["Física", "Técnica", "Táctica", "Mental", "Estratégica"];
const unidades = ["Repeticiones", "Rep/Tiempo", "Rep/Goles", "Minutos", "Series", "Kilogramos"];

const Mesociclo = () => {
  const [capacidades, setCapacidades] = useState(initialMesocicloData);
  const [showNewCapacityForm, setShowNewCapacityForm] = useState(false);
  const [newCapacity, setNewCapacity] = useState({
    name: "",
    unit: "Repeticiones",
    exercises: 0,
    reps: 0,
    series: 0,
    freq: 0,
    tipo: "Física",
    color: "#3b82f6"
  });
  const [editingCapacity, setEditingCapacity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const pdfRef = useRef();

  // Configuración del macrociclo (duración en semanas)
  const totalWeeks = 26;

  // Calcular volúmenes
  const dataWithVolumes = capacidades.map(item => ({
    ...item,
    weeklyVolume: item.exercises * item.reps * item.series * item.freq,
    totalVolume: item.exercises * item.reps * item.series * item.freq * totalWeeks
  }));

  const totalOverallVolume = dataWithVolumes.reduce((acc, item) => acc + item.totalVolume, 0);

  // Filtrar capacidades
  const filteredCapacidades = dataWithVolumes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo ? item.tipo === selectedTipo : true;
    return matchesSearch && matchesTipo;
  });

  // Datos para gráficos
  const distributionData = dataWithVolumes.map((item, index) => ({
    name: item.name,
    value: Math.round((item.totalVolume / totalOverallVolume) * 100),
    volume: item.totalVolume,
    color: item.color
  }));

  const tipoDistribution = tiposCapacidad.map(tipo => ({
    name: tipo,
    value: dataWithVolumes.filter(item => item.tipo === tipo).length,
    color: tipo === "Física" ? "#3b82f6" : 
           tipo === "Técnica" ? "#10b981" : 
           tipo === "Táctica" ? "#8b5cf6" : 
           tipo === "Mental" ? "#f59e0b" : "#ef4444"
  }));

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
      pdf.text(`Total de capacidades: ${capacidades.length}`, 15, 15);
      pdf.text(`Volumen total: ${(totalOverallVolume / 1000).toFixed(1)}k`, 15, 20);

      pdf.save(`mesociclo-${date}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Funciones CRUD
  const handleCreateCapacity = () => {
    const capacityWithId = {
      ...newCapacity,
      id: Date.now()
    };
    setCapacidades([...capacidades, capacityWithId]);
    setShowNewCapacityForm(false);
    setNewCapacity({
      name: "",
      unit: "Repeticiones",
      exercises: 0,
      reps: 0,
      series: 0,
      freq: 0,
      tipo: "Física",
      color: "#3b82f6"
    });
  };

  const handleUpdateCapacity = () => {
    const updatedCapacidades = capacidades.map(item => 
      item.id === editingCapacity.id ? editingCapacity : item
    );
    setCapacidades(updatedCapacidades);
    setEditingCapacity(null);
    setShowNewCapacityForm(false);
  };

  const handleDeleteCapacity = (id) => {
    setCapacidades(capacidades.filter(item => item.id !== id));
  };

  const handleEditCapacity = (capacity) => {
    setEditingCapacity(capacity);
    setShowNewCapacityForm(true);
  };

  const handleCapacityChange = (field, value) => {
    if (editingCapacity) {
      setEditingCapacity({
        ...editingCapacity,
        [field]: value
      });
    } else {
      setNewCapacity({
        ...newCapacity,
        [field]: value
      });
    }
  };

  // Estadísticas
  const stats = {
    total: capacidades.length,
    volumenTotal: totalOverallVolume,
    volumenSemanal: Math.round(totalOverallVolume / totalWeeks),
    tipos: [...new Set(capacidades.map(item => item.tipo))].length
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Mesociclo</h2>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewCapacityForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Nueva Capacidad
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Planificación del Mesociclo</h1>
            <p className="text-slate-600">Resumen completo de capacidades y volúmenes de entrenamiento</p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
              <span>Generado: {new Date().toLocaleDateString()}</span>
              <span>Capacidades: {stats.total}</span>
              <span>Volumen Total: {(stats.volumenTotal / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pdf-metrics">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Dumbbell className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Capacidades</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Activity className="text-emerald-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Volumen Total</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {(stats.volumenTotal / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <PieChart className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vol. Semanal</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.volumenSemanal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Target className="text-amber-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tipos</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.tipos}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 pdf-charts">
            <h3 className="font-semibold text-slate-800 mb-6 text-center text-xl">
              Distribución de Volúmenes
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4 text-center">
                  Distribución por Capacidad
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}% (${props.payload.volume.toLocaleString()} rep)`,
                          name
                        ]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4 text-center">
                  Distribución por Tipo
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tipoDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {tipoDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tabla de Capacidades */}
            <div className="mt-8">
              <h3 className="font-semibold text-slate-800 mb-4 text-center text-xl">
                Detalle de Capacidades
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-slate-700">Capacidad / Dirección</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Tipo</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Ejercicios</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Reps</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Series</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Frec/Sem</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Vol. Semanal</th>
                      <th className="p-4 text-center font-semibold text-slate-700">Vol. Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCapacidades.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.unit}</div>
                          </div>
                        </td>
                        
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.tipo === "Física" ? "bg-blue-100 text-blue-800" :
                            item.tipo === "Técnica" ? "bg-green-100 text-green-800" :
                            item.tipo === "Táctica" ? "bg-purple-100 text-purple-800" :
                            "bg-orange-100 text-orange-800"
                          }`}>
                            {item.tipo}
                          </span>
                        </td>
                        
                        {['exercises', 'reps', 'series', 'freq'].map((field) => (
                          <td key={field} className="p-4 text-center text-slate-600">
                            {item[field]}
                          </td>
                        ))}
                        
                        <td className="p-4 text-center font-bold text-blue-600">
                          {item.weeklyVolume.toLocaleString()}
                        </td>
                        
                        <td className="p-4 text-center font-bold text-emerald-600">
                          {item.totalVolume.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resumen de Volúmenes */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm pdf-summary">
            <h3 className="font-semibold text-slate-800 mb-4 text-center text-xl">
              Resumen de Volúmenes por Capacidad
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataWithVolumes.map((item, index) => (
                <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-800 mb-2 truncate">
                    {item.name}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vol. Semanal:</span>
                      <span className="font-medium text-blue-600">
                        {item.weeklyVolume.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vol. Total:</span>
                      <span className="font-medium text-emerald-600">
                        {item.totalVolume.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distribución:</span>
                      <span className="font-medium text-slate-700">
                        {Math.round((item.totalVolume / totalOverallVolume) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(item.totalVolume / totalOverallVolume) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie de página del PDF */}
          <div className="text-center mt-8 pt-4 border-t border-slate-200 pdf-footer">
            <p className="text-sm text-slate-500">
              Sistema de Planificación Deportiva - Mesociclo {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>

      {/* Modal para Nueva/Editar Capacidad */}
      {showNewCapacityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingCapacity ? 'Editar Capacidad' : 'Nueva Capacidad'}
                </h3>
                <button 
                  onClick={() => {
                    setShowNewCapacityForm(false);
                    setEditingCapacity(null);
                    setNewCapacity({
                      name: "",
                      unit: "Repeticiones",
                      exercises: 0,
                      reps: 0,
                      series: 0,
                      freq: 0,
                      tipo: "Física",
                      color: "#3b82f6"
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
                    Nombre de la Capacidad *
                  </label>
                  <input
                    type="text"
                    value={editingCapacity ? editingCapacity.name : newCapacity.name}
                    onChange={(e) => handleCapacityChange('name', e.target.value)}
                    placeholder="Ej: Coordinación General"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={editingCapacity ? editingCapacity.tipo : newCapacity.tipo}
                    onChange={(e) => handleCapacityChange('tipo', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {tiposCapacidad.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unidad de Medida *
                  </label>
                  <select
                    value={editingCapacity ? editingCapacity.unit : newCapacity.unit}
                    onChange={(e) => handleCapacityChange('unit', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {unidades.map(unidad => (
                      <option key={unidad} value={unidad}>{unidad}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <select
                    value={editingCapacity ? editingCapacity.color : newCapacity.color}
                    onChange={(e) => handleCapacityChange('color', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="#3b82f6">Azul</option>
                    <option value="#10b981">Verde</option>
                    <option value="#8b5cf6">Púrpura</option>
                    <option value="#f59e0b">Ámbar</option>
                    <option value="#ef4444">Rojo</option>
                  </select>
                </div>

                {['exercises', 'reps', 'series', 'freq'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field === 'exercises' ? 'Ejercicios' :
                       field === 'reps' ? 'Repeticiones' :
                       field === 'series' ? 'Series' : 'Frecuencia Semanal'} *
                    </label>
                    <input
                      type="number"
                      value={editingCapacity ? editingCapacity[field] : newCapacity[field]}
                      onChange={(e) => handleCapacityChange(field, parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowNewCapacityForm(false);
                  setEditingCapacity(null);
                  setNewCapacity({
                    name: "",
                    unit: "Repeticiones",
                    exercises: 0,
                    reps: 0,
                    series: 0,
                    freq: 0,
                    tipo: "Física",
                    color: "#3b82f6"
                  });
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={editingCapacity ? handleUpdateCapacity : handleCreateCapacity}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                {editingCapacity ? 'Actualizar' : 'Crear'} Capacidad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mesociclo;
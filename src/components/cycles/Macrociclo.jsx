// components/cycles/Macrociclo.jsx
import React, { useState, useRef } from 'react';
import { 
  Calendar, PieChart, TrendingUp, Plus, 
  Save, Trash2, Edit, Download, Upload, Layers,
  Target, Users, Clock, BarChart as LucideBarChart,
  FileText
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Hook de exportación PDF integrado directamente
const usePdfExport = () => {
  const contentRef = useRef(null);

  const exportToPdf = async (filename = 'reporte.pdf', options = {}) => {
    if (!contentRef.current) {
      console.error('No se encontró el contenido para exportar');
      return;
    }

    try {
      // Importación dinámica de las librerías
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ...options
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Asegúrate de que todas las librerías estén instaladas.');
    }
  };

  return { contentRef, exportToPdf };
};

// Datos iniciales para un nuevo macrociclo
const initialMacroData = {
  id: 1,
  nombre: 'Macrociclo I Temporada 2024',
  deporte: 'Fútbol Soccer',
  nivel: 'Nivel Inicial',
  fechaInicio: new Date().toISOString().split('T')[0],
  duracionTotal: 26,
  volumenTotalK: 2296,
  periodos: [
    { id: 1, nombre: 'P. PREPARATORIO', porcentaje: 60, semanas: 13, color: 'bg-blue-500', semanasRange: '1-13' },
    { id: 2, nombre: 'P. COMPETITIVO', porcentaje: 40, semanas: 13, color: 'bg-emerald-500', semanasRange: '14-26' }
  ],
  etapas: [
    { id: 1, nombre: 'E. GENERAL', semanas: 8, semanasRange: '1-8' },
    { id: 2, nombre: 'E. ESPECIAL', semanas: 5, semanasRange: '9-13' },
    { id: 3, nombre: 'PRE-COMPETITIVO', semanas: 6, semanasRange: '14-19' },
    { id: 4, nombre: 'COMPETITIVO', semanas: 7, semanasRange: '20-26' }
  ],
  direccionesEntrenamiento: [
    { id: 1, tipo: 'Física', nombre: 'Coordinación General', unidad: 'rep', color: '#3b82f6' },
    { id: 2, tipo: 'Física', nombre: 'Rapidez Especial', unidad: 'rep', color: '#10b981' },
    { id: 3, tipo: 'Técnica', nombre: 'Técnica General', unidad: 'rep', color: '#8b5cf6' },
    { id: 4, tipo: 'Física', nombre: 'Velocidad de Traslación', unidad: 'rep/tiempo', color: '#f59e0b' },
    { id: 5, tipo: 'Táctica', nombre: 'Técnico-Táctico', unidad: 'rep/goles', color: '#ef4444' }
  ],
  createdAt: new Date().toISOString()
};

const deportes = ['Fútbol Soccer', 'Baloncesto', 'Voleibol', 'Atletismo', 'Natación', 'Tenis'];
const niveles = ['Nivel Inicial', 'Sub-15', 'Sub-17', 'Sub-20', 'Senior', 'Élite'];

const Macrociclo = () => {
  const [macrociclos, setMacrociclos] = useState([initialMacroData]);
  const [activeMacro, setActiveMacro] = useState(initialMacroData);
  const [showNewMacroForm, setShowNewMacroForm] = useState(false);
  const [newMacroData, setNewMacroData] = useState({
    ...initialMacroData,
    id: null,
    nombre: ''
  });
  const [editingMacro, setEditingMacro] = useState(null);

  // Hook para exportación PDF
  const { contentRef, exportToPdf } = usePdfExport();

  // Calcular semanas totales
  const totalWeeks = activeMacro.periodos.reduce((acc, p) => acc + p.semanas, 0);

  // Datos para gráficos
  const periodData = activeMacro.periodos.map(p => ({
    name: p.nombre,
    value: p.porcentaje,
    semanas: p.semanas,
    color: p.color === 'bg-blue-500' ? '#3b82f6' : 
           p.color === 'bg-emerald-500' ? '#10b981' : '#8b5cf6'
  }));

  const stageData = activeMacro.etapas.map((s, i) => ({
    name: s.nombre,
    semanas: s.semanas,
    color: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][i]
  }));

  // Función para exportar a PDF
  const handleExportPdf = () => {
    const filename = `Macrociclo_${activeMacro.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    exportToPdf(filename, {
      onclone: (clonedDoc) => {
        // Mejorar estilos para PDF
        const elements = clonedDoc.querySelectorAll('.bg-slate-50, .bg-white, .bg-blue-50');
        elements.forEach(el => {
          el.style.backgroundColor = '#ffffff';
          el.style.border = '1px solid #e2e8f0';
        });

        // Ocultar botones en el PDF
        const buttons = clonedDoc.querySelectorAll('button');
        buttons.forEach(button => {
          button.style.display = 'none';
        });

        // Mejorar contraste de texto
        const textElements = clonedDoc.querySelectorAll('.text-slate-400, .text-slate-500');
        textElements.forEach(el => {
          el.style.color = '#64748b';
        });
      }
    });
  };

  // Funciones para gestionar macrociclos
  const handleCreateNewMacro = () => {
    const macroWithId = {
      ...newMacroData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const updatedMacros = [...macrociclos, macroWithId];
    setMacrociclos(updatedMacros);
    setActiveMacro(macroWithId);
    setShowNewMacroForm(false);
    setNewMacroData({
      ...initialMacroData,
      id: null,
      nombre: ''
    });
  };

  const handleUpdateMacro = () => {
    const updatedMacros = macrociclos.map(macro => 
      macro.id === editingMacro.id ? editingMacro : macro
    );
    setMacrociclos(updatedMacros);
    setActiveMacro(editingMacro);
    setEditingMacro(null);
    setShowNewMacroForm(false);
  };

  const handleDeleteMacro = (id) => {
    const filteredMacros = macrociclos.filter(macro => macro.id !== id);
    setMacrociclos(filteredMacros);
    if (filteredMacros.length > 0) {
      setActiveMacro(filteredMacros[0]);
    } else {
      const emptyMacro = {
        ...initialMacroData,
        id: Date.now(),
        nombre: 'Nuevo Macrociclo'
      };
      setMacrociclos([emptyMacro]);
      setActiveMacro(emptyMacro);
    }
  };

  const handleAddPeriodo = () => {
    const newPeriodo = {
      id: Date.now(),
      nombre: 'Nuevo Periodo',
      porcentaje: 0,
      semanas: 0,
      color: 'bg-blue-500',
      semanasRange: ''
    };
    
    if (editingMacro) {
      setEditingMacro({
        ...editingMacro,
        periodos: [...editingMacro.periodos, newPeriodo]
      });
    } else {
      setNewMacroData({
        ...newMacroData,
        periodos: [...newMacroData.periodos, newPeriodo]
      });
    }
  };

  const handleAddDireccion = () => {
    const newDireccion = {
      id: Date.now(),
      tipo: 'Física',
      nombre: 'Nueva Dirección',
      unidad: 'rep',
      color: '#3b82f6'
    };
    
    if (editingMacro) {
      setEditingMacro({
        ...editingMacro,
        direccionesEntrenamiento: [...editingMacro.direccionesEntrenamiento, newDireccion]
      });
    } else {
      setNewMacroData({
        ...newMacroData,
        direccionesEntrenamiento: [...newMacroData.direccionesEntrenamiento, newDireccion]
      });
    }
  };

  // Función para manejar cambios en periodos
  const handlePeriodoChange = (index, field, value) => {
    if (editingMacro) {
      const updatedPeriodos = [...editingMacro.periodos];
      updatedPeriodos[index][field] = value;
      setEditingMacro({
        ...editingMacro,
        periodos: updatedPeriodos
      });
    } else {
      const updatedPeriodos = [...newMacroData.periodos];
      updatedPeriodos[index][field] = value;
      setNewMacroData({
        ...newMacroData,
        periodos: updatedPeriodos
      });
    }
  };

  // Función para manejar cambios en direcciones
  const handleDireccionChange = (index, field, value) => {
    if (editingMacro) {
      const updatedDirecciones = [...editingMacro.direccionesEntrenamiento];
      updatedDirecciones[index][field] = value;
      setEditingMacro({
        ...editingMacro,
        direccionesEntrenamiento: updatedDirecciones
      });
    } else {
      const updatedDirecciones = [...newMacroData.direccionesEntrenamiento];
      updatedDirecciones[index][field] = value;
      setNewMacroData({
        ...newMacroData,
        direccionesEntrenamiento: updatedDirecciones
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Macrociclo</h2>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewMacroForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Nuevo Macrociclo
          </button>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FileText size={16} />
            Exportar PDF
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
        {/* Contenido para exportar PDF */}
        <div ref={contentRef} className="bg-white p-8 rounded-lg shadow-sm">
          {/* Header del Reporte PDF */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {activeMacro.nombre}
            </h1>
            <p className="text-lg text-slate-600 mb-2">
              {activeMacro.deporte} • {activeMacro.nivel}
            </p>
            <p className="text-sm text-slate-500">
              Fecha de inicio: {new Date(activeMacro.fechaInicio).toLocaleDateString('es-ES')} • 
              Duración: {totalWeeks} semanas • 
              Volumen K: {activeMacro.volumenTotalK}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Generado el: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Selector de Macrociclos - Ocultar en PDF */}
            <div className="print:hidden">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-blue-500" />
                  Macrociclos Activos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {macrociclos.map((macro) => (
                    <div 
                      key={macro.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        activeMacro.id === macro.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setActiveMacro(macro)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{macro.nombre}</h4>
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMacro(macro);
                              setShowNewMacroForm(true);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMacro(macro.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{macro.deporte} • {macro.nivel}</p>
                      <p className="text-xs text-slate-500">
                        {macro.duracionTotal} semanas • {new Date(macro.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Duración Total</p>
                    <p className="text-2xl font-bold text-slate-800">{totalWeeks} semanas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Periodos</p>
                    <p className="text-2xl font-bold text-slate-800">{activeMacro.periodos.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <LucideBarChart className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Direcciones</p>
                    <p className="text-2xl font-bold text-slate-800">{activeMacro.direccionesEntrenamiento.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Target className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Volumen K</p>
                    <p className="text-2xl font-bold text-slate-800">{activeMacro.volumenTotalK}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos y Estadísticas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Distribución de Periodos */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Distribución de Periodos</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={periodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {periodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Duración de Etapas */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-4">Duración de Etapas</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="semanas" 
                        radius={[4, 4, 0, 0]}
                      >
                        {stageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Información Adicional para PDF */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Resumen de Periodos</h3>
                <div className="space-y-3">
                  {activeMacro.periodos.map((periodo, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="font-medium text-slate-700">{periodo.nombre}</span>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">{periodo.semanas} semanas</div>
                        <div className="text-xs text-slate-500">{periodo.porcentaje}% del total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Direcciones de Entrenamiento</h3>
                <div className="space-y-2">
                  {activeMacro.direccionesEntrenamiento.map((direccion, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm text-slate-700">{direccion.nombre}</span>
                      <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                        {direccion.tipo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal para Nuevo/Editar Macrociclo */}
      {showNewMacroForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingMacro ? 'Editar Macrociclo' : 'Crear Nuevo Macrociclo'}
                </h3>
                <button 
                  onClick={() => {
                    setShowNewMacroForm(false);
                    setEditingMacro(null);
                    setNewMacroData({
                      ...initialMacroData,
                      id: null,
                      nombre: ''
                    });
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Configuración General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Plan *
                  </label>
                  <input
                    type="text"
                    value={editingMacro ? editingMacro.nombre : newMacroData.nombre}
                    onChange={(e) => editingMacro 
                      ? setEditingMacro({...editingMacro, nombre: e.target.value})
                      : setNewMacroData({...newMacroData, nombre: e.target.value})
                    }
                    placeholder="Macrociclo I Temporada 2024"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deporte *
                  </label>
                  <select
                    value={editingMacro ? editingMacro.deporte : newMacroData.deporte}
                    onChange={(e) => editingMacro
                      ? setEditingMacro({...editingMacro, deporte: e.target.value})
                      : setNewMacroData({...newMacroData, deporte: e.target.value})
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {deportes.map(deporte => (
                      <option key={deporte} value={deporte}>{deporte}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nivel/Categoría *
                  </label>
                  <select
                    value={editingMacro ? editingMacro.nivel : newMacroData.nivel}
                    onChange={(e) => editingMacro
                      ? setEditingMacro({...editingMacro, nivel: e.target.value})
                      : setNewMacroData({...newMacroData, nivel: e.target.value})
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {niveles.map(nivel => (
                      <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={editingMacro ? editingMacro.fechaInicio : newMacroData.fechaInicio}
                    onChange={(e) => editingMacro
                      ? setEditingMacro({...editingMacro, fechaInicio: e.target.value})
                      : setNewMacroData({...newMacroData, fechaInicio: e.target.value})
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duración Total (semanas) *
                  </label>
                  <input
                    type="number"
                    value={editingMacro ? editingMacro.duracionTotal : newMacroData.duracionTotal}
                    onChange={(e) => editingMacro
                      ? setEditingMacro({...editingMacro, duracionTotal: parseInt(e.target.value)})
                      : setNewMacroData({...newMacroData, duracionTotal: parseInt(e.target.value)})
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Volumen Total (K) *
                  </label>
                  <input
                    type="number"
                    value={editingMacro ? editingMacro.volumenTotalK : newMacroData.volumenTotalK}
                    onChange={(e) => editingMacro
                      ? setEditingMacro({...editingMacro, volumenTotalK: parseInt(e.target.value)})
                      : setNewMacroData({...newMacroData, volumenTotalK: parseInt(e.target.value)})
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Configuración de Periodos */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-800">Periodos</h4>
                  <button 
                    onClick={handleAddPeriodo}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Plus size={16} />
                    Agregar Periodo
                  </button>
                </div>
                <div className="space-y-4">
                  {(editingMacro ? editingMacro.periodos : newMacroData.periodos).map((periodo, index) => (
                    <div key={periodo.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Nombre</label>
                          <input
                            type="text"
                            value={periodo.nombre}
                            onChange={(e) => handlePeriodoChange(index, 'nombre', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Semanas</label>
                          <input
                            type="number"
                            value={periodo.semanas}
                            onChange={(e) => handlePeriodoChange(index, 'semanas', parseInt(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Porcentaje (%)</label>
                          <input
                            type="number"
                            value={periodo.porcentaje}
                            onChange={(e) => handlePeriodoChange(index, 'porcentaje', parseInt(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-600 mb-1">Color</label>
                          <select
                            value={periodo.color}
                            onChange={(e) => handlePeriodoChange(index, 'color', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded"
                          >
                            <option value="bg-blue-500">Azul</option>
                            <option value="bg-emerald-500">Verde</option>
                            <option value="bg-amber-500">Ámbar</option>
                            <option value="bg-rose-500">Rosa</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuración de Direcciones de Entrenamiento */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-800">Direcciones de Entrenamiento</h4>
                  <button 
                    onClick={handleAddDireccion}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Plus size={16} />
                    Agregar Dirección
                  </button>
                </div>
                <div className="space-y-3">
                  {(editingMacro ? editingMacro.direccionesEntrenamiento : newMacroData.direccionesEntrenamiento).map((direccion, index) => (
                    <div key={direccion.id} className="flex gap-3 items-center">
                      <select
                        value={direccion.tipo}
                        onChange={(e) => handleDireccionChange(index, 'tipo', e.target.value)}
                        className="p-2 border border-slate-300 rounded"
                      >
                        <option value="Física">Física</option>
                        <option value="Técnica">Técnica</option>
                        <option value="Táctica">Táctica</option>
                      </select>
                      <input
                        type="text"
                        value={direccion.nombre}
                        onChange={(e) => handleDireccionChange(index, 'nombre', e.target.value)}
                        placeholder="Nombre de la dirección"
                        className="flex-1 p-2 border border-slate-300 rounded"
                      />
                      <input
                        type="text"
                        value={direccion.unidad}
                        onChange={(e) => handleDireccionChange(index, 'unidad', e.target.value)}
                        placeholder="Unidad (rep, min, etc.)"
                        className="w-24 p-2 border border-slate-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowNewMacroForm(false);
                  setEditingMacro(null);
                  setNewMacroData({
                    ...initialMacroData,
                    id: null,
                    nombre: ''
                  });
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={editingMacro ? handleUpdateMacro : handleCreateNewMacro}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                {editingMacro ? 'Actualizar' : 'Crear'} Macrociclo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Macrociclo;
import React, { useState } from 'react';
import { 
  BarChart3, Users, Target, Activity, Plus, Filter, 
  Download, Eye, Edit, Trash2, Search, Calendar,
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  X // Agregar X para el modal
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Datos de ejemplo para evaluaciones
const initialEvaluations = [
  {
    id: 1,
    athleteName: 'Carlos Rodríguez',
    category: 'Sub-17',
    date: '2024-01-15',
    type: 'Física Completa',
    status: 'completada',
    results: {
      velocidad: 85,
      resistencia: 78,
      fuerza: 92,
      tecnica: 88,
      flexibilidad: 76
    },
    notes: 'Excelente progreso en fuerza, mantener trabajo de flexibilidad'
  },
  {
    id: 2,
    athleteName: 'Ana Martínez',
    category: 'Sub-19',
    date: '2024-01-14',
    type: 'Técnica Específica',
    status: 'completada',
    results: {
      velocidad: 92,
      resistencia: 85,
      fuerza: 79,
      tecnica: 95,
      flexibilidad: 88
    },
    notes: 'Destacada en técnica, mejorar resistencia aeróbica'
  },
  {
    id: 3,
    athleteName: 'Miguel Torres',
    category: 'Sub-15',
    date: '2024-01-12',
    type: 'Física Básica',
    status: 'pendiente',
    results: {
      velocidad: 72,
      resistencia: 68,
      fuerza: 65,
      tecnica: 75,
      flexibilidad: 70
    },
    notes: 'Evaluación inicial, establecer línea base'
  },
  {
    id: 4,
    athleteName: 'Laura García',
    category: 'Senior',
    date: '2024-01-10',
    type: 'Rendimiento Integral',
    status: 'completada',
    results: {
      velocidad: 88,
      resistencia: 91,
      fuerza: 86,
      tecnica: 89,
      flexibilidad: 82
    },
    notes: 'Rendimiento consistente, enfocar en velocidad de reacción'
  }
];

const evaluationTypes = [
  'Física Completa',
  'Técnica Específica',
  'Física Básica',
  'Rendimiento Integral',
  'Psicológica',
  'Biomecánica'
];

const categories = ['Sub-15', 'Sub-17', 'Sub-19', 'Senior', 'Élite'];

const EvaluationsScreen = ({ user }) => {
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showNewEvaluation, setShowNewEvaluation] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Filtros - CORREGIDO: cambiar 'eval' por 'evaluation'
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.athleteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? evaluation.category === selectedCategory : true;
    const matchesType = selectedType ? evaluation.type === selectedType : true;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Estadísticas - CORREGIDO: cambiar 'eval' por 'evaluation'
  const stats = {
    total: evaluations.length,
    completed: evaluations.filter(e => e.status === 'completada').length,
    pending: evaluations.filter(e => e.status === 'pendiente').length,
    averageScore: Math.round(
      evaluations
        .filter(e => e.status === 'completada')
        .reduce((acc, evaluation) => {
          const scores = Object.values(evaluation.results);
          return acc + (scores.reduce((a, b) => a + b, 0) / scores.length);
        }, 0) / evaluations.filter(e => e.status === 'completada').length
    ) || 0
  };

  // Datos para gráficos - CORREGIDO: cambiar 'eval' por 'evaluation'
  const performanceData = evaluations
    .filter(e => e.status === 'completada')
    .map(evaluation => ({
      name: evaluation.athleteName.split(' ')[0],
      ...evaluation.results
    }));

  const categoryDistribution = categories.map(category => ({
    name: category,
    value: evaluations.filter(e => e.category === category).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Funciones CRUD
  const handleDeleteEvaluation = (id) => {
    setEvaluations(evaluations.filter(e => e.id !== id));
  };

  const handleViewDetails = (evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const StatusBadge = ({ status }) => {
    const config = {
      completada: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      cancelada: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const { color, icon: Icon } = config[status] || config.pendiente;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Evaluaciones</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNewEvaluation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Nueva Evaluación
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-blue-500" size={24} />
                <h3 className="font-semibold text-slate-800">Total Evaluaciones</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
              <p className="text-sm text-slate-500 mt-1">Este mes</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-green-500" size={24} />
                <h3 className="font-semibold text-slate-800">Completadas</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stats.completed}</div>
              <p className="text-sm text-slate-500 mt-1">
                {Math.round((stats.completed / stats.total) * 100)}% del total
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-purple-500" size={24} />
                <h3 className="font-semibold text-slate-800">Puntuación Promedio</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stats.averageScore}%</div>
              <p className="text-sm text-slate-500 mt-1">Rendimiento general</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-orange-500" size={24} />
                <h3 className="font-semibold text-slate-800">Pendientes</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stats.pending}</div>
              <p className="text-sm text-slate-500 mt-1">Por realizar</p>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar atleta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  {evaluationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Filter size={16} />
                  Filtros
                </button>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4">Rendimiento por Atleta</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="velocidad" fill="#3b82f6" name="Velocidad" />
                      <Bar dataKey="resistencia" fill="#10b981" name="Resistencia" />
                      <Bar dataKey="fuerza" fill="#f59e0b" name="Fuerza" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4">Distribución por Categoría</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lista de Evaluaciones */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Atleta</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Categoría</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Puntuación</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEvaluations.map((evaluation) => {
                    const scores = Object.values(evaluation.results);
                    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                    
                    return (
                      <tr key={evaluation.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{evaluation.athleteName}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{evaluation.category}</td>
                        <td className="px-4 py-3 text-slate-600">{evaluation.type}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(evaluation.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={evaluation.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${averageScore}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{averageScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewDetails(evaluation)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Ver detalles"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="p-1 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEvaluation(evaluation.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredEvaluations.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No se encontraron evaluaciones</p>
                  <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalles de Evaluación */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedEvaluation.athleteName}</h3>
                  <p className="text-slate-600">{selectedEvaluation.type} • {selectedEvaluation.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvaluation(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                  <p className="text-slate-900">{new Date(selectedEvaluation.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <StatusBadge status={selectedEvaluation.status} />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Resultados</h4>
                <div className="space-y-2">
                  {Object.entries(selectedEvaluation.results).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize text-slate-700">{key}:</span>
                      <div className="flex items-center gap-2 w-48">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Observaciones</h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {selectedEvaluation.notes}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedEvaluation(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationsScreen;
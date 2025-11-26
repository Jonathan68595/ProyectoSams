import React, { useState } from 'react';
import { 
  User, Mail, Phone, Award, Calendar, Edit2, Save, X, 
  Camera, Star, TrendingUp, Users, Target, BookOpen
} from 'lucide-react';

const ProfileScreen = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Roberto Coach',
    email: user?.email || 'roberto@coach.com',
    phone: '+1 234 567 890',
    specialty: 'Preparación Física',
    experience: '3',
    bio: 'Coach especializado en desarrollo deportivo con enfoque en técnicas modernas de entrenamiento y análisis de rendimiento.',
    certifications: [
      { id: 1, name: 'Licenciatura en Educación Física', year: '2018' },
      { id: 2, name: 'Certificación en Entrenamiento Deportivo', year: '2020' },
      { id: 3, name: 'Especialización en Nutrición Deportiva', year: '2022' }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aquí podrías agregar lógica para guardar en una API
    console.log('Datos guardados:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar datos originales si es necesario
  };

  const updateCertification = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: 'Nueva certificación', year: '2024' }
      ]
    }));
  };

  const removeCertification = (id) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header Simplificado */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Mi Perfil</h2>
        </div>
        
        {/* Solo el botón de editar en la esquina derecha */}
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Edit2 size={16} />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-slate-500 text-white px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm shadow-lg shadow-green-200"
              >
                <Save size={16} />
                Guardar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido del Perfil */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header del Perfil Mejorado */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white/30 backdrop-blur-sm">
                  {profileData.name.charAt(0)}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-400 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-4xl font-bold bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 backdrop-blur-sm w-full mb-2"
                    placeholder="Tu nombre"
                  />
                ) : (
                  <h1 className="text-4xl font-bold mb-2">{profileData.name}</h1>
                )}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Award size={16} />
                    <span>Coach Deportivo</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Star size={16} />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Columna Izquierda - Información Personal */}
            <div className="xl:col-span-2 space-y-8">
              {/* Tarjeta de Información Personal */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <User className="text-blue-500" size={24} />
                    Información Personal
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp size={16} />
                    <span>Perfil completo al 95%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-transparent">
                          <Mail className="text-slate-400" size={20} />
                          <span className="text-slate-800 font-medium">{profileData.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Teléfono</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-transparent">
                          <Phone className="text-slate-400" size={20} />
                          <span className="text-slate-800 font-medium">{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Especialidad Principal</label>
                      {isEditing ? (
                        <select
                          value={profileData.specialty}
                          onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        >
                          <option value="Preparación Física">Preparación Física</option>
                          <option value="Análisis Táctico">Análisis Táctico</option>
                          <option value="Nutrición Deportiva">Nutrición Deportiva</option>
                          <option value="Psicología Deportiva">Psicología Deportiva</option>
                        </select>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-xl border-2 border-transparent">
                          <span className="text-slate-800 font-medium">{profileData.specialty}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Años de Experiencia</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={profileData.experience}
                          onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-transparent">
                          <Calendar className="text-slate-400" size={20} />
                          <span className="text-slate-800 font-medium">{profileData.experience} años</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Biografía</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows="4"
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                      placeholder="Describe tu experiencia y especialidades..."
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border-2 border-transparent">
                      <p className="text-slate-700 leading-relaxed">{profileData.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificaciones Editables */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <BookOpen className="text-green-500" size={24} />
                    Certificaciones
                  </h2>
                  {isEditing && (
                    <button
                      onClick={addCertification}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <span>+ Agregar</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-colors">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                            className="flex-1 p-2 border border-slate-300 rounded-lg focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                            className="w-24 p-2 border border-slate-300 rounded-lg focus:border-blue-500 text-center"
                          />
                          <button
                            onClick={() => removeCertification(cert.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800">{cert.name}</h3>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {cert.year}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Estadísticas y Logros */}
            <div className="space-y-8">
              {/* Tarjeta de Estadísticas */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <TrendingUp className="text-purple-500" size={24} />
                  Estadísticas
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="text-purple-600" size={20} />
                      <span className="font-semibold text-purple-800">Atletas Activos</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-purple-500 mt-1">+3 este mes</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="text-green-600" size={20} />
                      <span className="font-semibold text-green-800">Programas Activos</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">24</div>
                    <div className="text-sm text-green-500 mt-1">+5 este trimestre</div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-800">Satisfacción</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">98%</div>
                    <div className="text-sm text-blue-500 mt-1">Basado en 47 evaluaciones</div>
                  </div>
                </div>
              </div>

              {/* Logros Destacados */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Award className="text-orange-500" size={24} />
                  Logros Destacados
                </h2>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                    <h3 className="font-semibold text-orange-800 mb-2">🏆 Campeonato Regional 2023</h3>
                    <p className="text-sm text-orange-600">Equipo juvenil - Primer lugar</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2">⭐ Mejor Coach del Año</h3>
                    <p className="text-sm text-green-600">Reconocimiento institucional 2023</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">📈 Mayor Progreso</h3>
                    <p className="text-sm text-blue-600">Atleta con mejora del 45% en rendimiento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
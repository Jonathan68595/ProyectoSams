import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Shield, Palette, 
  Download, Upload, Globe, Moon, Sun, Save, RotateCcw,
  UserCheck, Calendar, BarChart3, Languages
} from 'lucide-react';

const SettingsScreen = ({ user }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General
    language: 'es',
    theme: 'light',
    timezone: 'America/Mexico_City',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    performanceAlerts: true,
    
    // Privacidad
    profileVisibility: 'public',
    dataSharing: false,
    analyticsTracking: true,
    
    // Personalización
    defaultView: 'dashboard',
    compactMode: false,
    animations: true,
    
    // Datos
    autoBackup: true,
    backupFrequency: 'weekly'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar en localStorage o API
    localStorage.setItem('coachAppSettings', JSON.stringify(settings));
    console.log('Configuraciones guardadas:', settings);
  };

  const handleReset = () => {
    const defaultSettings = {
      language: 'es',
      theme: 'light',
      timezone: 'America/Mexico_City',
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      performanceAlerts: true,
      profileVisibility: 'public',
      dataSharing: false,
      analyticsTracking: true,
      defaultView: 'dashboard',
      compactMode: false,
      animations: true,
      autoBackup: true,
      backupFrequency: 'weekly'
    };
    setSettings(defaultSettings);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette }
  ];

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>
      {children}
    </div>
  );

  const ToggleSetting = ({ label, description, value, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-slate-400" />}
        <div>
          <p className="font-medium text-slate-800">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const SelectSetting = ({ label, description, value, options, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        {Icon && <Icon size={20} className="text-slate-400" />}
        <div className="flex-1">
          <p className="font-medium text-slate-800">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Configuración</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar de Navegación */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-6">
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <tab.icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenido Principal */}
            <div className="lg:col-span-3">
              {/* General */}
              {activeTab === 'general' && (
                <div>
                  <SettingSection
                    title="Preferencias Generales"
                    description="Configura los aspectos básicos de tu aplicación"
                  >
                    <SelectSetting
                      label="Idioma"
                      description="Selecciona el idioma de la interfaz"
                      value={settings.language}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' },
                        { value: 'pt', label: 'Português' }
                      ]}
                      onChange={(value) => handleSettingChange('language', value)}
                      icon={Languages}
                    />
                    <SelectSetting
                      label="Zona Horaria"
                      description="Configura tu zona horaria para las programaciones"
                      value={settings.timezone}
                      options={[
                        { value: 'America/Mexico_City', label: 'Centro de México' },
                        { value: 'America/New_York', label: 'Este de EE. UU.' },
                        { value: 'America/Los_Angeles', label: 'Pacífico de EE. UU.' },
                        { value: 'Europe/Madrid', label: 'España' }
                      ]}
                      onChange={(value) => handleSettingChange('timezone', value)}
                      icon={Globe}
                    />
                    <SelectSetting
                      label="Vista por Defecto"
                      description="Qué página ver al iniciar la aplicación"
                      value={settings.defaultView}
                      options={[
                        { value: 'dashboard', label: 'Dashboard' },
                        { value: 'calendar', label: 'Calendario' },
                        { value: 'athletes', label: 'Atletas' }
                      ]}
                      onChange={(value) => handleSettingChange('defaultView', value)}
                      icon={BarChart3}
                    />
                  </SettingSection>
                </div>
              )}

              {/* Notificaciones */}
              {activeTab === 'notifications' && (
                <div>
                  <SettingSection
                    title="Preferencias de Notificación"
                    description="Controla cómo y cuándo recibir notificaciones"
                  >
                    <ToggleSetting
                      label="Notificaciones por Email"
                      description="Recibe resúmenes y reportes por correo electrónico"
                      value={settings.emailNotifications}
                      onChange={(value) => handleSettingChange('emailNotifications', value)}
                      icon={Bell}
                    />
                    <ToggleSetting
                      label="Notificaciones Push"
                      description="Alertas en tiempo real en la aplicación"
                      value={settings.pushNotifications}
                      onChange={(value) => handleSettingChange('pushNotifications', value)}
                      icon={Bell}
                    />
                    <ToggleSetting
                      label="Reportes Semanales"
                      description="Resumen semanal del progreso de atletas"
                      value={settings.weeklyReports}
                      onChange={(value) => handleSettingChange('weeklyReports', value)}
                      icon={Calendar}
                    />
                    <ToggleSetting
                      label="Alertas de Rendimiento"
                      description="Notificaciones cuando un atleta alcanza metas importantes"
                      value={settings.performanceAlerts}
                      onChange={(value) => handleSettingChange('performanceAlerts', value)}
                      icon={UserCheck}
                    />
                  </SettingSection>
                </div>
              )}

              {/* Privacidad */}
              {activeTab === 'privacy' && (
                <div>
                  <SettingSection
                    title="Configuración de Privacidad"
                    description="Controla tu privacidad y datos personales"
                  >
                    <SelectSetting
                      label="Visibilidad del Perfil"
                      description="Quién puede ver tu perfil de coach"
                      value={settings.profileVisibility}
                      options={[
                        { value: 'public', label: 'Público' },
                        { value: 'athletes', label: 'Solo mis atletas' },
                        { value: 'private', label: 'Privado' }
                      ]}
                      onChange={(value) => handleSettingChange('profileVisibility', value)}
                      icon={Shield}
                    />
                    <ToggleSetting
                      label="Compartir Datos Anónimos"
                      description="Ayúdanos a mejorar compartiendo datos de uso anónimos"
                      value={settings.dataSharing}
                      onChange={(value) => handleSettingChange('dataSharing', value)}
                      icon={BarChart3}
                    />
                    <ToggleSetting
                      label="Seguimiento de Analytics"
                      description="Permitir análisis de uso para mejorar funciones"
                      value={settings.analyticsTracking}
                      onChange={(value) => handleSettingChange('analyticsTracking', value)}
                      icon={BarChart3}
                    />
                  </SettingSection>
                </div>
              )}

              {/* Apariencia */}
              {activeTab === 'appearance' && (
                <div>
                  <SettingSection
                    title="Personalización de la Interfaz"
                    description="Ajusta el aspecto visual de la aplicación"
                  >
                    <SelectSetting
                      label="Tema de Color"
                      description="Elige entre tema claro u oscuro"
                      value={settings.theme}
                      options={[
                        { value: 'light', label: 'Claro' },
                        { value: 'dark', label: 'Oscuro' },
                        { value: 'auto', label: 'Automático' }
                      ]}
                      onChange={(value) => handleSettingChange('theme', value)}
                      icon={settings.theme === 'dark' ? Moon : Sun}
                    />
                    <ToggleSetting
                      label="Modo Compacto"
                      description="Interfaz más densa para pantallas pequeñas"
                      value={settings.compactMode}
                      onChange={(value) => handleSettingChange('compactMode', value)}
                      icon={Palette}
                    />
                    <ToggleSetting
                      label="Animaciones"
                      description="Habilita transiciones y efectos visuales"
                      value={settings.animations}
                      onChange={(value) => handleSettingChange('animations', value)}
                      icon={Palette}
                    />
                  </SettingSection>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
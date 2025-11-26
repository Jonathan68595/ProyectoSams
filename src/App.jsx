import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Background from './components/layout/Background';
import Navbar from './components/layout/Navbar';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import HomeScreen from './components/dashboard/HomeScreen';
import ProfileScreen from './components/Profile/ProfileScreen';
import EvaluationsScreen from './components/evaluations/EvaluationsScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import Macrociclo from './components/cycles/Macrociclo';
import Mesociclo from './components/cycles/Mesociclo';
import Microciclo from './components/cycles/Microciclo';
import { mockAuth } from './utils/auth';

// Datos iniciales para los ciclos
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

// Componente principal que maneja la navegación
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para los datos de los ciclos
  const [macroData, setMacroData] = useState(initialMacroData);
  const [mesoData, setMesoData] = useState(initialMesoData);
  const [microData, setMicroData] = useState(initialMicroData);

  const handleLogin = (username, password) => {
    setError('');
    const result = mockAuth(username, password);

    if (result.success) {
      setUser({
        name: 'Roberto Coach',
        email: username
      });
      navigate('/home');
    } else {
      setError(result.message);
    }
  };

  const handleSignUp = (userData) => {
    setUser({
      name: userData.name,
      email: userData.email
    });
    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  // Layout para pantallas con navbar
  const LayoutWithNavbar = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
        <Navbar 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Routes>
      {/* Rutas públicas sin navbar */}
      <Route path="/login" element={
        user ? (
          <Navigate to="/home" replace />
        ) : (
          <Background>
            <LoginScreen handleLogin={handleLogin} error={error} />
          </Background>
        )
      } />
      
      <Route path="/signup" element={
        user ? (
          <Navigate to="/home" replace />
        ) : (
          <Background>
            <SignUpScreen handleSignUp={handleSignUp} />
          </Background>
        )
      } />
      
      {/* Rutas protegidas con navbar */}
      <Route path="/home" element={
        user ? (
          <LayoutWithNavbar>
            <HomeScreen 
              user={user} 
              macroData={macroData}
              mesoData={mesoData}
              microData={microData}
              onUpdateMacro={setMacroData}
              onUpdateMeso={setMesoData}
              onUpdateMicro={setMicroData}
            />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      {/* Rutas para los ciclos de entrenamiento */}
      <Route path="/macrociclo" element={
        user ? (
          <LayoutWithNavbar>
            <Macrociclo 
              data={macroData} 
              onUpdate={setMacroData}
              user={user}
            />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/mesociclo" element={
        user ? (
          <LayoutWithNavbar>
            <Mesociclo 
              data={mesoData} 
              onUpdate={setMesoData}
              macroData={macroData}
              user={user}
            />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/microciclo" element={
        user ? (
          <LayoutWithNavbar>
            <Microciclo 
              data={microData} 
              onUpdate={setMicroData}
              mesoData={mesoData}
              macroData={macroData}
              user={user}
            />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/profile" element={
        user ? (
          <LayoutWithNavbar>
            <ProfileScreen user={user} />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/evaluations" element={
        user ? (
          <LayoutWithNavbar>
            <EvaluationsScreen user={user} />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      <Route path="/settings" element={
        user ? (
          <LayoutWithNavbar>
            <SettingsScreen user={user} />
          </LayoutWithNavbar>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      {/* Ruta por defecto */}
      <Route path="/" element={
        user ? (
          <Navigate to="/home" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

// Componente App principal
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
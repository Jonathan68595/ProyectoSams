import React, { useState } from 'react';
import { Mail, Lock, ClipboardList, ArrowRight } from 'lucide-react';
import { VALID_USERNAME, VALID_PASSWORD } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const LoginScreen = ({ handleLogin, error }) => {
  const [username, setUsername] = useState(VALID_USERNAME); 
  const [password, setPassword] = useState(VALID_PASSWORD); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    handleLogin(username, password);
    setIsLoading(false);
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Navegar a la página de registro
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl shadow-cyan-500/10 border border-white/20 transition-all duration-300 hover:shadow-cyan-500/20">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-6 pt-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-cyan-600 bg-clip-text text-transparent mb-2">
              Acceso de Entrenador
            </h1>
            <p className="text-gray-500 text-sm">Ingresa para ver el rendimiento del equipo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Usuario (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input 
                  type="text" 
                  id="username" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input 
                  type="password" 
                  id="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-base sm:text-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-cyan-500/25 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando...
                </div>
              ) : (
                <>
                  Iniciar Sesión <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <button 
                type="button"
                onClick={handleSignUpRedirect}
                className="font-semibold ml-1 text-cyan-600 hover:text-cyan-800 transition-colors duration-200 hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
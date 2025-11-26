import React, { useState } from 'react';
import { User, Mail, Lock, Dumbbell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Agregar este import

const SignUpScreen = ({ handleSignUp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    handleSignUp({ name, email, password });
    setIsLoading(false);
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Navegar a la página de login
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <div className="relative bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-lg shadow-cyan-500/5 border border-white/20">
          {/* Icono más pequeño */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg shadow-sm">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Header más compacto */}
          <div className="text-center mb-4 pt-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-cyan-600 bg-clip-text text-transparent mb-1">
              Únete al Equipo
            </h1>
            <p className="text-gray-500 text-xs">Crea tu cuenta de entrenador</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input 
                    type="password" 
                    id="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 mb-1">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded text-xs font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-sm transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              ¿Ya tienes una cuenta?
              <button 
                type="button"
                onClick={handleLoginRedirect}
                className="font-semibold ml-1 text-cyan-600 hover:text-cyan-800 transition-colors duration-200 hover:underline"
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
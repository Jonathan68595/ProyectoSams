// components/layout/Navbar.jsx (actualizado)
import React from 'react';
import { 
  LayoutDashboard, Calendar, Dumbbell, TrendingUp, 
  Settings, LogOut, User, Activity, ChevronLeft, ChevronRight,
  BarChart3, Target
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, onClick, active, isSidebarOpen }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center rounded-xl transition-all duration-200 group relative
    ${isSidebarOpen ? 'gap-3 p-3' : 'justify-center p-3'}
    ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <div className={`relative ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
      <Icon size={20} className={`${!active && 'group-hover:text-blue-400'} ${!isSidebarOpen ? 'mx-auto' : ''}`} />
      {active && <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>}
    </div>
    
    <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
      {label}
    </span>
    
    {/* Tooltip on collapse */}
    {!isSidebarOpen && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}
      </div>
    )}
  </button>
);

const Navbar = ({ 
  isSidebarOpen, 
  setSidebarOpen, 
  user,
  handleLogout 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 h-full flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-50 relative`}
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 flex-shrink-0">
        {isSidebarOpen ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
              <Activity className="text-blue-500" size={24}/>
              <h1 className="text-xl font-bold text-white tracking-tight">SportApp</h1>
          </div>
        ) : (
           <div className="flex justify-center">
             <Activity className="text-blue-500 animate-in zoom-in duration-300" size={24}/>
           </div>
        )}
      </div>

      {/* Sidebar Toggle Button */}
      <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-50 border border-slate-900"
      >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Menu Items */}
      <div className={`flex-1 py-6 space-y-2 ${
        isSidebarOpen 
          ? 'overflow-y-auto custom-scrollbar px-3' 
          : 'overflow-hidden px-2'
      }`}>
          
          <div className={`text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider ${
            isSidebarOpen ? 'px-3' : 'px-0 text-center'
          }`}>
             {isSidebarOpen ? 'Dashboard' : '•••'}
          </div>
          
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard General" 
            active={isActive('/home')}
            onClick={() => handleNavigation('/home')}
            isSidebarOpen={isSidebarOpen}
          />
          
          <div className={`text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider ${
            isSidebarOpen ? 'px-3' : 'px-0 text-center'
          }`}>
             {isSidebarOpen ? 'Planificación' : '•••'}
          </div>
          
          <SidebarItem 
            icon={Calendar} 
            label="Macrociclo" 
            active={isActive('/macrociclo')} 
            onClick={() => handleNavigation('/macrociclo')}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={Dumbbell} 
            label="Mesociclo" 
            active={isActive('/mesociclo')} 
            onClick={() => handleNavigation('/mesociclo')}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={TrendingUp} 
            label="Microciclo" 
            active={isActive('/microciclo')} 
            onClick={() => handleNavigation('/microciclo')}
            isSidebarOpen={isSidebarOpen}
          />
          
          <div className={`text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider ${
            isSidebarOpen ? 'px-3' : 'px-0 text-center'
          }`}>
             {isSidebarOpen ? 'Evaluación' : '•••'}
          </div>
          
          <SidebarItem 
            icon={BarChart3} 
            label="Evaluaciones" 
            active={isActive('/evaluations')}
            onClick={() => handleNavigation('/evaluations')}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="my-4 border-t border-slate-800"></div>
          
          <div className={`text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider ${
            isSidebarOpen ? 'px-3' : 'px-0 text-center'
          }`}>
             {isSidebarOpen ? 'Cuenta' : '•••'}
          </div>
          
          <SidebarItem 
            icon={User} 
            label="Perfil" 
            active={isActive('/profile')}
            onClick={() => handleNavigation('/profile')}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={Settings} 
            label="Configuración" 
            active={isActive('/settings')}
            onClick={() => handleNavigation('/settings')}
            isSidebarOpen={isSidebarOpen}
          />
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <div className={`flex items-center ${isSidebarOpen ? 'gap-3 mb-4' : 'justify-center mb-2'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user?.name || 'Usuario'}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email || 'usuario@email.com'}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 ${
            isSidebarOpen ? 'gap-3 p-2' : 'justify-center p-2'
          }`}
        >
          <LogOut size={20} className={!isSidebarOpen ? 'mx-auto' : ''} />
          <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>

      {/* Estilos CSS para el scroll personalizado */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </aside>
  );
};

export default Navbar;
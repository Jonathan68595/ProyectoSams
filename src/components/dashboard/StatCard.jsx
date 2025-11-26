import React from 'react';

const StatCard = ({ icon, title, value, color, subtitle }) => (
  <div className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-${color}-50 to-white border border-${color}-200 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    
    <div className={`relative z-10 text-${color}-600 mb-2 sm:mb-3 p-2 sm:p-3 bg-white rounded-full shadow-md`}>
      {React.cloneElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
    </div>
    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 text-center">{title}</p>
    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1 sm:mt-2 text-center">{subtitle}</p>}
  </div>
);

export default StatCard;
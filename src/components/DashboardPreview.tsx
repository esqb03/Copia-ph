import React, { useMemo } from 'react';
import { Hammer, HardHat, Construction } from 'lucide-react';

export default function Dashboard() {
  const employeeName = localStorage.getItem('employee_name') || 'Usuario';

  // Saludo dinámico según la hora
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] p-6">
      
      {/* Saludo Personalizado */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
          {greeting}, <span className="text-[#a89076]">{employeeName}</span>
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Qué bueno verte de nuevo.
        </p>
      </div>

      {/* Tarjeta de "En Construcción" */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[32px] border border-[#eaddcf] shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-[#faf6f1] rounded-3xl flex items-center justify-center text-[#a89076] mb-6 border border-[#eaddcf] animate-pulse">
          <Construction size={40} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">
          Dashboard en Construcción
        </h2>
        
        <p className="text-gray-500 max-w-[280px] leading-relaxed font-medium">
          Estamos preparando las mejores métricas y análisis para tu gestión. 
          <span className="block mt-2 font-bold text-[#a89076]">¡Próximamente disponible!</span>
        </p>

        {/* Decoración Minimalista */}
        <div className="mt-10 flex gap-2">
           <div className="w-2 h-2 rounded-full bg-[#eaddcf]"></div>
           <div className="w-8 h-2 rounded-full bg-[#a89076]"></div>
           <div className="w-2 h-2 rounded-full bg-[#eaddcf]"></div>
        </div>
      </div>

    </div>
  );
}
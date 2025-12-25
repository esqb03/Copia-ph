import React from 'react';

export default function AverageSales() {
  const categories = [
    { name: 'Skincare', color: '#d4c4b0', percentage: 95 },
    { name: 'Haircare', color: '#c9b89d', percentage: 24 },
    { name: 'Bodycare', color: '#a89076', percentage: 65 },
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Puntuacion de Ventas</p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#a89076]">
          <option>Mes</option>
          <option>Semana</option>
          <option>Año</option>
        </select>
      </div>

      <h2 className="mb-6">$975,993</h2>

      <div className="flex items-center gap-8 mb-6">
        {/* Large Donut Chart */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="none" 
              stroke="#f5f1e8" 
              strokeWidth="20"
            />
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="none" 
              stroke="#c9b89d" 
              strokeWidth="20" 
              strokeDasharray="40 377" 
              strokeLinecap="round"
            />
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="none" 
              stroke="#d4c4b0" 
              strokeWidth="20" 
              strokeDasharray="150 377" 
              strokeDashoffset="-40"
              strokeLinecap="round"
            />
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="none" 
              stroke="#a89076" 
              strokeWidth="20" 
              strokeDasharray="187 377" 
              strokeDashoffset="-190"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl">95%</p>
            <p className="text-xs text-gray-500">On process</p>
          </div>
        </div>

        {/* Small Donut Chart */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="48" 
              cy="48" 
              r="36" 
              fill="none" 
              stroke="#f5f1e8" 
              strokeWidth="14"
            />
            <circle 
              cx="48" 
              cy="48" 
              r="36" 
              fill="none" 
              stroke="#a89076" 
              strokeWidth="14" 
              strokeDasharray="180 226" 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm">
            95%
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </div>
            <span className="text-sm">{category.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <span className="text-gray-600">Average sales</span>
        <span>$875,993</span>
      </div>
    </div>
  );
}

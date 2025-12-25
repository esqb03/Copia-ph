import React from 'react';

export default function SalesMap() {
  const countries = [
    { name: 'Bucaramanga', sales: 2150, percentage: 100 },
    { name: 'Bogota', sales: 1890, percentage: 88 },
    { name: 'Cartagena', sales: 1650, percentage: 77 },
    { name: 'Barranquilla', sales: 1420, percentage: 66 },
    { name: 'Santa Marta', sales: 980, percentage: 45 },
  ];

  return (
    <div className="bg-white rounded-xl p-6">
      <p className="text-sm text-gray-600 mb-6">Mapa de ventas por Ciudad</p>

      {/* Map Visualization */}
      <div className="relative h-48 bg-gradient-to-br from-[#f5f1e8] to-[#e8dfd0] rounded-lg mb-6 overflow-hidden">
        {/* Simplified world map with markers */}
        <svg className="w-full h-full opacity-20" viewBox="0 0 400 200">
          {/* Simplified continents */}
          <path d="M 50 80 Q 80 70 110 80 L 120 100 Q 110 110 90 100 Z" fill="#a89076" />
          <path d="M 180 50 Q 220 45 260 55 L 280 80 Q 270 95 240 90 L 200 95 Z" fill="#a89076" />
          <path d="M 140 120 Q 160 115 180 125 L 185 145 Q 170 150 150 140 Z" fill="#a89076" />
          <path d="M 280 130 Q 310 125 340 135 L 350 155 Q 330 165 300 155 Z" fill="#a89076" />
        </svg>

        {/* Location markers */}
        <div className="absolute top-[35%] left-[30%] group">
          <div className="w-3 h-3 bg-[#a89076] rounded-full animate-pulse"></div>
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Santa Marta<br />$2150 Ventas
          </div>
        </div>
        
        <div className="absolute top-[65%] left-[70%]">
          <div className="w-3 h-3 bg-[#a89076] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="absolute top-[45%] left-[48%]">
          <div className="w-3 h-3 bg-[#a89076] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <div className="absolute top-[35%] left-[55%]">
          <div className="w-3 h-3 bg-[#a89076] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>

        <div className="absolute top-[38%] left-[75%]">
          <div className="w-3 h-3 bg-[#a89076] rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        </div>
      </div>

      {/* Top Countries */}
      <div>
        <p className="text-sm mb-4">Top Ciudades</p>
        <div className="space-y-3">
          {countries.map((country) => (
            <div key={country.name} className="group">
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="text-gray-700">{country.name}</span>
                <span className="text-gray-500">${country.sales} Sales</span>
              </div>
              <div className="h-7 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#a89076] to-[#c9b89d] rounded-full transition-all duration-300 group-hover:brightness-110"
                  style={{ width: `${country.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

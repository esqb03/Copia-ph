import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Lun', current: 480000, lastMonth: 420000 },
  { name: 'Mar', current: 520000, lastMonth: 450000 },
  { name: 'Mie', current: 530000, lastMonth: 480000 },
  { name: 'Jue', current: 590000, lastMonth: 520000 },
  { name: 'Vie', current: 640000, lastMonth: 580000 },
  { name: 'Sab', current: 560000, lastMonth: 510000 },
];

export default function AverageVisitor() {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Visitas</p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#a89076]">
          <option>Semanales</option>
          <option>Mensuales</option>
          <option>Anuales</option>
        </select>
      </div>

      <div className="flex items-baseline gap-3 mb-6">
        <h2>560,395</h2>
        <span className="text-sm text-gray-500">/ Usuario</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#999', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fill: '#999', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => `${value.toLocaleString()} users`}
          />
          <Bar dataKey="current" fill="#a89076" radius={[4, 4, 0, 0]} />
          <Bar dataKey="lastMonth" fill="#e8d4bf" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#a89076] rounded-full"></div>
            <span className="text-gray-600">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#e8d4bf] rounded-full"></div>
            <span className="text-gray-600">Mes Pasado</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <span>20%</span>
          <TrendingUp size={14} />
        </div>
      </div>
    </div>
  );
}

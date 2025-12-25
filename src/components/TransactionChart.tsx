import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TransactionChartProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const data = [
  { name: 'Ene', value: 65000 },
  { name: 'Feb', value: 72000 },
  { name: 'Mar', value: 68000 },
  { name: 'Abr', value: 80000 },
  { name: 'May', value: 75000 },
  { name: 'Jun', value: 88000 },
  { name: 'Jul', value: 82000 },
  { name: 'Ago', value: 90984 },
  { name: 'Sep', value: 85000 },
  { name: 'Oct', value: 78000 },
  { name: 'Nov', value: 82000 },
  { name: 'Dic', value: 76000 },
];

export default function TransactionChart({ activeTab, setActiveTab }: TransactionChartProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#faf8f4] rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a89076" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transacciones de Ventas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['Dia', 'Semana', 'Mes', 'Año'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'bg-[#a89076] text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-6">
        <h2>$90,984</h2>
        <div className="flex items-center gap-1 text-green-600">
          <span className="text-sm">15.90%</span>
          <TrendingUp size={16} />
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-4 right-4 bg-[#a89076] text-white px-4 py-2 rounded-lg text-sm">
          $2,714
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '8px 12px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#a89076" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: '#a89076' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

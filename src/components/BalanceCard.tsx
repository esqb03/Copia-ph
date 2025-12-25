import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function BalanceCard() {
  return (
    <div className="bg-white rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-4">Balance</p>
      <h1 className="mb-6">$ 2,345.90</h1>

      <div className="mb-6">
        <label className="text-sm text-gray-500 mb-2 block">Pague con</label>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
            <span className="text-sm">Pasarela de pagos Wompi Bancolombia</span>
          </div>
          <ChevronDown size={20} className="text-gray-400" />
        </div>
      </div>

      <button className="w-full bg-[#a89076] hover:bg-[#967d63] text-white py-3 rounded-lg transition-colors">
        Pagos
      </button>
    </div>
  );
}

import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="relative">
      {/* Laptop Frame */}
      <div className="relative bg-black rounded-t-2xl p-3 shadow-2xl">
        {/* Camera notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
        
        {/* Screen */}
        <div className="bg-white rounded-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <span className="text-sm">Dashboard</span>
              </div>
              <div className="text-xs text-gray-400">Username ••••</div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Left side - Stats */}
              <div className="space-y-4">
                <div className="bg-[#faf8f4] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Transaction activity</span>
                    <select className="text-xs border-none bg-transparent">
                      <option>Month</option>
                    </select>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">$90,984</span>
                    <span className="text-xs text-green-600">15.90%</span>
                  </div>
                  {/* Mini chart */}
                  <div className="mt-3 h-16 flex items-end gap-1">
                    <div className="flex-1 bg-[#a89076] opacity-20 h-1/2 rounded-t"></div>
                    <div className="flex-1 bg-[#a89076] opacity-40 h-3/4 rounded-t"></div>
                    <div className="flex-1 bg-[#a89076] opacity-60 h-2/3 rounded-t"></div>
                    <div className="flex-1 bg-[#a89076] h-full rounded-t"></div>
                    <div className="flex-1 bg-[#a89076] opacity-70 h-4/5 rounded-t"></div>
                    <div className="flex-1 bg-[#a89076] opacity-50 h-3/5 rounded-t"></div>
                  </div>
                </div>

                <div className="bg-[#faf8f4] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Average sales</p>
                  <p className="text-xl mb-3">$975,993</p>
                  
                  {/* Donut charts */}
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e5e5" strokeWidth="12"/>
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#a89076" strokeWidth="12" strokeDasharray="180 188" strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs">95%</div>
                    </div>
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e5e5" strokeWidth="12"/>
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#ff9f43" strokeWidth="12" strokeDasharray="150 188" strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs">80%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div>
                      <p className="text-gray-500">Received Order</p>
                      <p>1400</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ordering Process</p>
                      <p>1202</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#a89076] text-white p-3 rounded-lg text-center text-sm">
                  Go To Shop
                </div>
              </div>

              {/* Right side - Balance & Map */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-2xl mb-3">$ 2,345.90</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="w-3 h-3 bg-[#ff9f43] rounded-full"></span>
                    <span>Card 907636 •••••••</span>
                  </div>
                  <button className="w-full bg-[#a89076] text-white py-2 rounded text-sm">
                    Withdraw Money
                  </button>
                </div>

                <div className="bg-[#faf8f4] p-4 rounded-lg">
                  <p className="text-xs mb-3">Sales Mapping by country</p>
                  {/* Simplified world map visualization */}
                  <div className="h-32 bg-[#e8e4db] rounded-lg mb-3 relative">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#a89076] rounded-full"></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#a89076] rounded-full"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#a89076] rounded-full"></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#a89076] rounded-full"></div>
                  </div>
                  
                  <p className="text-xs mb-2">Top Country</p>
                  <div className="space-y-1">
                    {['Indonesia', 'Australia', 'Malaysia', 'Thailand', 'Jepang'].map((country, i) => (
                      <div key={country} className="flex items-center gap-2">
                        <div className="flex-1 h-6 bg-[#a89076] rounded" style={{ width: `${100 - i * 15}%` }}></div>
                        <span className="text-xs">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div className="h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl"></div>
      </div>
    </div>
  );
}

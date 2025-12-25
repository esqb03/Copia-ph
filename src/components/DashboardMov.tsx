// src/components/DashboardMov.tsx
import React, { useState } from 'react';
import TransactionChart from './TransactionChart';
import StatsCard from './StatsCard';
import AverageSales from './AverageSales';
import AverageVisitor from './AverageVisitor';
import SalesMap from './SalesMap';
import BalanceCard from './BalanceCard';
import NotificationPanel from './NotificationPanel';
import { Bell, Search, X } from 'lucide-react';

export default function DashboardMov() {
  const [activeTab, setActiveTab] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex-1 relative bg-gray-50 min-h-screen">
      
     <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden sticky top-0 z-30">
                <h1 className="text-xl font-semibold text-gray-800">Principal</h1>
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="relative p-1 hover:bg-gray-50 rounded-lg"
                >
                    <Bell size={20} className="text-gray-600" />
                </button>
            </header>

      {/* Notification Panel (reutilizado) */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </>
      )}

      <main className="p-4 pb-32">
        <div className="space-y-4"> 
          
          {/* A. BALANCE CARD (Alta Prioridad) */}
          <BalanceCard /> 
          
          {/* B. TRANSACTION CHART (Ancho completo) */}
          <TransactionChart activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* C. STATS CARDS (En dos columnas) */}
          <div className="grid grid-cols-2 gap-4"> 
            <StatsCard
              icon="📦"
              title="Received Order"
              value="1400"
              subtitle="Pack"
            />
            <StatsCard
              icon="📋"
              title="Ordering Process"
              value="1202"
              subtitle="Pack"
            />
          </div>

          {/* D. AVERAGE SALES & VISITOR */}
          <AverageSales />
          <AverageVisitor />

          {/* E. SALES MAP (Baja Prioridad) */}
          <SalesMap />

          {/* Espacio extra final para asegurar scroll limpio */}
          <div className="h-4" />
        </div>
      </main>
    </div>
  );
}
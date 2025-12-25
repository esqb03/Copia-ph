import React, { useState } from 'react';
import TransactionChart from './TransactionChart';
import StatsCard from './StatsCard';
import AverageSales from './AverageSales';
import AverageVisitor from './AverageVisitor';
import SalesMap from './SalesMap';
import BalanceCard from './BalanceCard';
import NotificationPanel from './NotificationPanel';
import { Bell, Search, X } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex-1 relative">
      {/* Header */}
   <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
                <h1 className="text-xl font-semibold text-gray-800">Principal</h1>
                {/* Puedes dejar el botón de notificaciones o quitarlo para mayor simpleza */}
                <button className="relative p-1 hover:bg-gray-50 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                </button>
            </header>

      {/* Notification Panel */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </>
      )}

      {/* Main Content */}
      <main className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Transaction Chart */}
          <div className="col-span-2 space-y-6">
            <TransactionChart activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
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

            {/* Average Sales and Visitor */}
            <div className="grid grid-cols-2 gap-6">
              <AverageSales />
              <AverageVisitor />
            </div>
          </div>

          {/* Right Column - Balance & Map */}
          <div className="space-y-6">
            <BalanceCard />
            <SalesMap />
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import StatsCard from "./StatsCard";
import NotificationPanel from "./NotificationPanel";
import { Bell } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"month" | "today">("month");
  const [showNotifications, setShowNotifications] = useState(false);

  const metrics =
    activeTab === "month"
      ? {
          orders: "42",
          todayOrders: "7",
          commission: "$ 2.450.000,00",
        }
      : {
          orders: "7",
          todayOrders: "7",
          commission: "$ 210.000,00",
        };

  return (
    <div className="flex-1 relative bg-[#f5f1e8]/40">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
        <h1 className="text-xl font-semibold text-gray-800">Principal</h1>
        <button
          className="relative p-1 hover:bg-gray-50 rounded-lg"
          onClick={() => setShowNotifications(true)}
        >
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </>
      )}

      <main className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Resumen de ventas
                </h2>
                <p className="text-xs text-gray-500">
                  Órdenes y comisiones {activeTab === "month" ? "del mes" : "de hoy"}
                </p>
              </div>

              <div className="inline-flex items-center bg-white rounded-full border border-gray-100 p-1 text-xs font-semibold text-gray-500">
                <button
                  onClick={() => setActiveTab("today")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === "today"
                      ? "bg-[#a89076] text-white shadow-sm"
                      : "hover:text-gray-800"
                  }`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setActiveTab("month")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeTab === "month"
                      ? "bg-[#a89076] text-white shadow-sm"
                      : "hover:text-gray-800"
                  }`}
                >
                  Este mes
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatsCard
                icon="📦"
                title="Órdenes del período"
                value={metrics.orders}
                subtitle="Total registradas"
              />
              <StatsCard
                icon="✅"
                title="Órdenes de hoy"
                value={metrics.todayOrders}
                subtitle="Creadas hoy"
              />
              <StatsCard
                icon="💰"
                title="Comisión del período"
                value={metrics.commission}
                subtitle="Estimado en COP"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

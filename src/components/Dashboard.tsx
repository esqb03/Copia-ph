import React, { useState } from "react";
import StatsCard from "./StatsCard";
import NotificationPanel from "./NotificationPanel";
import { Bell } from "lucide-react";

type OrderStatus = "borrador" | "confirmado" | "entregado" | "cancelado";

interface OrderRow {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: OrderStatus;
}

const mockOrders: OrderRow[] = [
  {
    id: "SO0021",
    customer: "Emanuel Quevedo",
    date: "10 Ene 2025",
    total: "$ 1.250.000",
    status: "confirmado",
  },
  {
    id: "SO0020",
    customer: "Cliente Demo 1",
    date: "10 Ene 2025",
    total: "$ 430.000",
    status: "borrador",
  },
  {
    id: "SO0019",
    customer: "Cliente Demo 2",
    date: "09 Ene 2025",
    total: "$ 980.000",
    status: "entregado",
  },
  {
    id: "SO0018",
    customer: "Cliente Demo 3",
    date: "09 Ene 2025",
    total: "$ 350.000",
    status: "cancelado",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  borrador: "bg-gray-50 text-gray-700 border-gray-100",
  confirmado: "bg-emerald-50 text-emerald-700 border-emerald-100",
  entregado: "bg-blue-50 text-blue-700 border-blue-100",
  cancelado: "bg-red-50 text-red-600 border-red-100",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"month" | "today">("month");
  const [showNotifications, setShowNotifications] = useState(false);

  const metrics =
    activeTab === "month"
      ? {
          orders: "42",
          todayOrders: "7",
          commission: "$ 2.450.000",
        }
      : {
          orders: "7",
          todayOrders: "7",
          commission: "$ 210.000",
        };

  return (
    <div className="flex-1 relative bg-[#f5f1e8]/40">
      {/* Header móvil */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
        <h1 className="text-xl font-semibold text-gray-800">Principal</h1>
        <button
          className="relative p-1 hover:bg-gray-50 rounded-lg"
          onClick={() => setShowNotifications(true)}
        >
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        </>
      )}

      {/* Contenido principal */}
      <main className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Tabs período + métricas */}
          <div className="flex flex-col gap-4">
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
          </div>

          {/* Pedidos recientes */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Pedidos recientes
                </h3>
                <p className="text-xs text-gray-500">
                  Últimos movimientos y su estado
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-3 flex items-center gap-3 text-sm"
                >
                  <div className="w-20 font-semibold text-gray-900">
                    {order.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 truncate">
                      {order.customer}
                    </div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                  <div className="hidden md:block text-right text-gray-900 font-semibold w-28">
                    {order.total}
                  </div>
                  <div className="w-28 flex justify-end">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}

              {mockOrders.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No hay pedidos recientes.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

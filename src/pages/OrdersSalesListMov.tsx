// src/pages/OrdersSalesListMov.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Search,
  Download,
  RefreshCw,
  User,
  DollarSign,
  Clock,
  MoreVertical,
  XCircle,
  CheckCircle,
} from "lucide-react";
import MinimalModal from "../components/MinimalModal";
import { openWompiUniversal } from "../lib/wompiLoader";

const API_URL = import.meta.env.VITE_API_URL;

interface Order {
  id: string;
  customer: string;
  total: string;
  commission: string;
  status: string;
  date: string;
  raw_state: string;
  amount_total_raw?: number;
}

const mapOdooOrderToView = (order: any): Order => {
  let statusText = "Pendiente";
  const formattedDate = new Date(order.date_order).toLocaleDateString(
    "es-ES",
    { month: "short", day: "numeric" },
  );

  switch (order.state) {
    case "draft":
    case "sent":
      statusText = "Borrador/Enviado";
      break;
    case "sale":
      statusText = "En tránsito";
      break;
    case "done":
      statusText = "Entregado";
      break;
    case "cancel":
      statusText = "Cancelado";
      break;
    default:
      statusText = "Pendiente";
  }

  return {
    id: order.name,
    status: statusText,
    date: formattedDate,
    customer: order.partner_id?.[1] || "Sin cliente",
    total: (order.amount_total || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    }),
    commission: (order.x_commission_amount_sale || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
      },
    ),
    raw_state: order.state,
    amount_total_raw: order.amount_total || 0,
  };
};

const statusStyles: Record<string, string> = {
  "Borrador/Enviado": "bg-yellow-50 text-yellow-800 border-yellow-100",
  "En tránsito": "bg-blue-50 text-blue-700 border-blue-100",
  Entregado: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cancelado: "bg-red-50 text-red-700 border-red-100",
  Pendiente: "bg-gray-50 text-gray-700 border-gray-100",
};

const STATUS_FILTERS = [
  { value: "Todos", label: "Todos" },
  { value: "Borrador/Enviado", label: "Borr./Env." },
  { value: "Pendiente", label: "Pend." },
  { value: "En tránsito", label: "Tránsito" },
  { value: "Entregado", label: "Entregado" },
  { value: "Cancelado", label: "Cancel." },
];

const statusShortLabel: Record<string, string> = {
  "Borrador/Enviado": "Borr./Env.",
  Pendiente: "Pend.",
  "En tránsito": "Tránsito",
  Entregado: "Entregado",
  Cancelado: "Cancel.",
};

const OrderCard: React.FC<{ order: Order; onRefresh: () => void }> = ({
  order,
  onRefresh,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "pay" | "cancel" | null;
  }>({ isOpen: false, type: null });
  const [loading, setLoading] = useState(false);

  const handlePayWithWompi = async () => {
    setModalConfig({ isOpen: false, type: null });
    setLoading(true);
    try {
      const employeeIdStr = window.localStorage.getItem("employee_id");
      const amountInCents = Math.round((order.amount_total_raw || 0) * 100);

      const payload = {
        order_id: order.id,
        amount_in_cents: amountInCents,
        currency: "COP",
        employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined,
      };

      const res = await fetch(`${API_URL}/wompicol/widget-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Error al iniciar pago");
      }

      const p = data.widgetParams || data.params || data;
      await openWompiUniversal({
        currency: p.currency,
        amount_in_cents: p.amount_in_cents ?? p.amountInCents,
        reference: p.reference,
        public_key: p.public_key ?? p.publicKey,
        redirect_url: p.redirect_url ?? p.redirectUrl,
        signature: p.signature,
        customerData: p.customerData,
      });
    } catch (err: any) {
      alert(`Error de pago: ${err.message}`);
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const handleConfirmCancel = async () => {
    setModalConfig({ isOpen: false, type: null });
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cancel-sale-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id }),
      });
      const result = await res.json();
      if (result.ok) {
        alert(`Orden ${order.id} cancelada.`);
        onRefresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const canCancel =
    order.status === "Borrador/Enviado" || order.status === "Pendiente";

  return (
    <div
      className="bg-white shadow-sm border border-gray-100 px-4 py-3 space-y-2 relative"
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        clipPath: "inset(0px round 24px)",
      }}
    >
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#faf6f1] flex items-center justify-center flex-shrink-0">
            <DollarSign size={16} className="text-[#a89076]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              Pedido {order.id}
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock size={11} className="text-gray-400" />
              <span>{order.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium tracking-wide ${statusStyles[order.status]}`}
          >
            {statusShortLabel[order.status] ?? order.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-gray-400 hover:text-[#a89076] rounded-full"
            >
              <MoreVertical
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-40 py-1">
                  <button
                    onClick={() => {
                      setModalConfig({ isOpen: true, type: "pay" });
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <CheckCircle size={16} className="text-emerald-600" />
                    Pagar orden
                  </button>
                  <button
                    onClick={() => {
                      if (canCancel) {
                        setModalConfig({ isOpen: true, type: "cancel" });
                        setShowActions(false);
                      }
                    }}
                    disabled={!canCancel}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                      canCancel
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-300"
                    }`}
                  >
                    <XCircle size={16} />
                    Cancelar orden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="truncate font-semibold">{order.customer}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-600" />
          <span className="text-base font-bold text-emerald-700">
            {order.total}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-gray-500">
            Comisión:{" "}
            <span className="font-semibold text-[#a89076]">
              {order.commission}
            </span>
          </span>
        </div>
      </div>

      <MinimalModal
        isOpen={modalConfig.isOpen}
        title={
          modalConfig.type === "pay"
            ? "Confirmar pago"
            : "Confirmar cancelación"
        }
        message={
          modalConfig.type === "pay"
            ? `¿Deseas proceder con el pago de la orden ${order.id} por un valor de ${order.total}?`
            : `¿Estás seguro de que deseas cancelar la orden ${order.id}?`
        }
        confirmText={
          modalConfig.type === "pay" ? "Pagar ahora" : "Sí, cancelar orden"
        }
        onConfirm={
          modalConfig.type === "pay" ? handlePayWithWompi : handleConfirmCancel
        }
        onCancel={() => setModalConfig({ isOpen: false, type: null })}
      />
    </div>
  );
};

export default function OrderSalesListMov() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const employeeId = localStorage.getItem("employee_id");

  const fetchOrders = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        employee_id: employeeId,
        limit: "100",
        order: "date_order desc",
      });
      const res = await fetch(`${API_URL}/sale_orders?${params}`);
      const result = await res.json();
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders
      .map((o) => mapOdooOrderToView(o))
      .filter(
        (o) =>
          (activeTab === "Todos" || o.status === activeTab) &&
          (searchTerm === "" ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchTerm.toLowerCase())),
      );
  }, [orders, activeTab, searchTerm]);

  return (
    <div className="flex-1 relative w-full bg-[#f5f1e8] min-h-[100dvh] flex flex-col overflow-hidden">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800">Mis pedidos</h1>
        <Bell size={22} className="text-gray-600" />
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-md mx-auto w-full space-y-4">
          <div
            className="bg-white p-4 shadow-sm w-full"
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              clipPath: "inset(0px round 24px)",
            }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar pedido por número o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-[#a89076]"
              />
            </div>
            <div className="flex justify-between gap-2 mt-3">
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refrescar
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-[#a89076] text-white rounded-lg text-sm hover:bg-[#967d63]">
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>

          <div
            className="bg-white shadow-sm w-full"
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              clipPath: "inset(0px round 24px)",
            }}
          >
            <div className="w-full max-w-full overflow-x-auto no-scrollbar border-b border-gray-100">
              <div className="inline-flex">
                {STATUS_FILTERS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`px-3 py-2 text-[11px] whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === value
                        ? "border-[#a89076] text-[#a89076] font-semibold"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 flex items-center justify-center gap-2 text-sm text-gray-600">
                <RefreshCw className="animate-spin" />
                Cargando pedidos...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div
                className="bg-white px-4 py-6 text-center text-sm text-gray-500"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  clipPath: "inset(0px round 24px)",
                }}
              >
                No se encontraron pedidos para los filtros actuales.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onRefresh={fetchOrders}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// src/pages/OrderSalesList.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
    Bell, 
    Search, 
    MoreVertical, 
    Download, 
    Filter, 
    CheckCircle, 
    XCircle,
    RefreshCw 
} from 'lucide-react';
import MinimalModal from '../components/MinimalModal';
import { openWompiUniversal } from "../lib/wompiLoader";

const API_URL = import.meta.env.VITE_API_URL;

interface Order {
    id: string;
    customer: string;
    total: string;
    commission: string;
    status: string;
    date: string;
    amount_total_raw: number;
    raw_state: string;
}

const mapOdooOrderToView = (order: any): Order => {
  let statusText = 'Pendiente';
  const formattedDate = new Date(order.date_order).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });

  switch (order.state) {
    case 'draft': case 'sent': statusText = 'Borrador/Enviado'; break;
    case 'sale': statusText = 'En tránsito'; break;
    case 'done': statusText = 'Entregado'; break;
    case 'cancel': statusText = 'Cancelado'; break;
    default: statusText = 'Pendiente';
  }

  return {
    id: order.name,
    status: statusText,
    date: formattedDate,
    customer: order.partner_id?.[1] || 'Sin cliente',
    total: (order.amount_total || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
    commission: (order.x_commission_amount_sale || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
    amount_total_raw: order.amount_total || 0,
    raw_state: order.state,
  };
};

const statusStyles: Record<string, string> = {
  'Borrador/Enviado': 'bg-yellow-100 text-yellow-800',
  'En tránsito': 'bg-blue-100 text-blue-700',
  'Entregado': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-700',
  'Pendiente': 'bg-gray-100 text-gray-700',
};

const OrderSalesList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Estados para el menú y modales (Tomados de OrdersSalesListMov)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: 'pay' | 'cancel' | null; order: Order | null }>({ 
    isOpen: false, 
    type: null, 
    order: null 
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    const employeeId = localStorage.getItem('employee_id');
    if (!employeeId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ employee_id: employeeId, limit: '100', order: 'date_order desc' });
      const res = await fetch(`${API_URL}/sale_orders?${params}`);
      const result = await res.json();
      if (result.success) setOrders(result.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // --- Lógica de Acciones (Integrada de OrdersSalesListMov) ---
  const handlePayWithWompi = async () => {
    const order = modalConfig.order;
    if (!order) return;
    setModalConfig({ ...modalConfig, isOpen: false });
    setActionLoading(true);
    try {
        const employeeIdStr = window.localStorage.getItem("employee_id");
        const amountInCents = Math.round((order.amount_total_raw || 0) * 100);

        const res = await fetch(`${API_URL}/wompicol/widget-init`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order_id: order.id,
                amount_in_cents: amountInCents,
                currency: "COP",
                employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined,
            }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.message || "Error al iniciar pago");

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
        setActionLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    const order = modalConfig.order;
    if (!order) return;
    setModalConfig({ ...modalConfig, isOpen: false });
    setActionLoading(true);
    try {
        const res = await fetch(`${API_URL}/cancel-sale-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: order.id }),
        });
        const result = await res.json();
        if (result.ok) {
            alert(`Orden ${order.id} cancelada.`);
            fetchOrders();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (err) {
        alert('Error de conexión.');
    } finally {
        setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.map(o => mapOdooOrderToView(o))
      .filter((order) => {
        const matchesTab = activeTab === 'ALL' || order.status === activeTab;
        const term = searchTerm.toLowerCase().trim();
        return matchesTab && (term === '' || order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term));
      });
  }, [orders, activeTab, searchTerm]);

  return (
    <div className="flex-1">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
        <h1 className="text-xl font-semibold text-gray-800">Lista Pedidos</h1>
        <button className="p-1 hover:bg-gray-50 rounded-lg"><Bell size={20} className="text-gray-600" /></button>
      </header>

      <main className="p-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Buscar pedidos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#a89076]" />
            </div>
            <div className="flex items-center gap-3">
               <button onClick={fetchOrders} className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                 <RefreshCw size={20} className={`${loading ? 'animate-spin' : 'text-gray-600'}`} />
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                 <Download size={20} className="text-gray-600" />
                 <span>Exportar</span>
               </button>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
            {['ALL', 'Borrador/Enviado', 'Pendiente', 'En tránsito', 'Entregado', 'Cancelado'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#a89076] font-bold' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'ALL' ? 'Todos' : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a89076]" />}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center"><RefreshCw className="animate-spin inline text-[#a89076]" size={32} /></div>
          ) : (
            <div className="overflow-x-visible"> {/* Cambiado a visible para que el menú no se corte */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Referencia</th>
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Cliente</th>
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Total</th>
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Comisión</th>
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Estado</th>
                    <th className="text-left py-4 px-4 text-gray-600 font-medium">Fecha</th>
                    <th className="text-right py-4 px-4 text-gray-600 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const canCancel = order.status === 'Borrador/Enviado' || order.status === 'Pendiente';
                    return (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-bold text-gray-800">#{order.id}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">{order.total}</td>
                        <td className="py-4 px-4 text-sm font-bold text-green-700">{order.commission}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusStyles[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">{order.date}</td>
                        <td className="py-4 px-4 text-right relative">
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === order.id ? null : order.id);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex items-center justify-center"
                          >
                            <MoreVertical size={20} className={actionLoading && activeMenuId === order.id ? 'animate-spin' : 'text-gray-400'} />
                          </button>
                          
                          {activeMenuId === order.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-40 py-1 text-left">
                                <button 
                                  onClick={() => { setModalConfig({ isOpen: true, type: 'pay', order }); setActiveMenuId(null); }}
                                  className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                  <CheckCircle size={18} className="text-green-600" /> Pagar orden
                                </button>
                                <button 
                                  onClick={() => { if (canCancel) { setModalConfig({ isOpen: true, type: 'cancel', order }); setActiveMenuId(null); } }}
                                  disabled={!canCancel}
                                  className={`w-full px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${canCancel ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
                                >
                                  <XCircle size={18} /> Cancelar orden
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <MinimalModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === 'pay' ? "Confirmar Pago" : "Confirmar Cancelación"}
        message={modalConfig.type === 'pay' 
            ? `¿Deseas proceder con el pago de la orden ${modalConfig.order?.id} por un valor de ${modalConfig.order?.total}?`
            : `¿Estás seguro de que deseas cancelar la orden ${modalConfig.order?.id}?`}
        confirmText={modalConfig.type === 'pay' ? "Pagar ahora" : "Sí, cancelar"}
        onConfirm={modalConfig.type === 'pay' ? handlePayWithWompi : handleConfirmCancel}
        onCancel={() => setModalConfig({ isOpen: false, type: null, order: null })}
      />
    </div>
  );
};

export default OrderSalesList;
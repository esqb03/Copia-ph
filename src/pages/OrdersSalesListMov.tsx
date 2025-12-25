// src/pages/OrdersSalesListMov.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    CheckCircle
} from 'lucide-react';
import MinimalModal from '../components/MinimalModal';
import { openWompiUniversal } from "../lib/wompiLoader"; // Importado de tu lógica de pagos

const API_URL = import.meta.env.VITE_API_URL;

interface Order {
    id: string; 
    customer: string;
    total: string;
    commission: string;
    status: string; 
    date: string;
    raw_state: string;
    amount_total_raw?: number; // Necesario para el cálculo de centavos
}

// --- Función de Mapeo ---
const mapOdooOrderToView = (order: any): Order => {
  let statusText = 'Pendiente';
  const formattedDate = new Date(order.date_order).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });

  switch (order.state) {
    case 'draft':
    case 'sent': statusText = 'Borrador/Enviado'; break;
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
    raw_state: order.state,
    amount_total_raw: order.amount_total || 0,
  };
};

const statusStyles: Record<string, string> = {
  'Borrador/Enviado': 'bg-yellow-100 text-yellow-800',
  'En tránsito': 'bg-blue-100 text-blue-700',
  'Entregado': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-700',
  'Pendiente': 'bg-gray-100 text-gray-700',
};

// --- Componente de Tarjeta ---
const OrderCard: React.FC<{ order: Order; onRefresh: () => void }> = ({ order, onRefresh }) => {
    const [showActions, setShowActions] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: 'pay' | 'cancel' | null }>({ isOpen: false, type: null });
    const [loading, setLoading] = useState(false);

    // Lógica de Pago con Wompi (Adaptada de CreateOrderMov.tsx)
    const handlePayWithWompi = async () => {
        setModalConfig({ isOpen: false, type: null });
        setLoading(true);
        try {
            const employeeIdStr = window.localStorage.getItem("employee_id");
            const amountInCents = Math.round((order.amount_total_raw || 0) * 100); // Conversión a centavos

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
            setLoading(false);
            setShowActions(false);
        }
    };

    const handleConfirmCancel = async () => {
        setModalConfig({ isOpen: false, type: null });
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/cancel-sale-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            alert('Error de conexión.');
        } finally {
            setLoading(false);
            setShowActions(false);
        }
    };

    const canCancel = order.status === 'Borrador/Enviado' || order.status === 'Pendiente';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-center mb-3 border-b pb-2 gap-2">
                <div className="flex items-center gap-1 min-w-0">
                    <div className="relative">
                        <button onClick={() => setShowActions(!showActions)} className="p-1.5 text-gray-400 hover:text-[#a89076] rounded-full">
                            <MoreVertical size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        {showActions && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setShowActions(false)} />
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-40 py-1">
                                    <button 
                                        onClick={() => { setModalConfig({ isOpen: true, type: 'pay' }); setShowActions(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} className="text-green-600" /> Pagar orden
                                    </button>
                                    <button 
                                        onClick={() => { if (canCancel) { setModalConfig({ isOpen: true, type: 'cancel' }); setShowActions(false); } }}
                                        disabled={!canCancel}
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${canCancel ? 'text-red-600 hover:bg-red-50' : 'text-gray-300'}`}
                                    >
                                        <XCircle size={16} /> Cancelar orden
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 truncate"><span className="text-[#a89076]">#</span>{order.id}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[order.status]}`}>{order.status}</span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2 font-semibold truncate"><User size={16} className="text-gray-400" /> {order.customer}</p>
                <p className="flex items-center gap-2 text-base font-bold text-green-700"><DollarSign size={16} /> {order.total}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><Clock size={14} /> {order.date}</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">Comisión: {order.commission}</span>
                </div>
            </div>

            <MinimalModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'pay' ? "Confirmar Pago" : "Confirmar Cancelación"}
                message={modalConfig.type === 'pay' 
                    ? `¿Deseas proceder con el pago de la orden ${order.id} por un valor de ${order.total}?`
                    : `¿Estás seguro de que deseas cancelar la orden ${order.id}?`}
                confirmText={modalConfig.type === 'pay' ? "Pagar ahora" : "Sí, cancelar"}
                onConfirm={modalConfig.type === 'pay' ? handlePayWithWompi : handleConfirmCancel}
                onCancel={() => setModalConfig({ isOpen: false, type: null })}
            />
        </div>
    );
};

// --- Componente Principal ---
export default function OrderSalesListMov() {
    const [activeTab, setActiveTab] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const employeeId = localStorage.getItem('employee_id');

    const fetchOrders = useCallback(async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ employee_id: employeeId, limit: '100', order: 'date_order desc' });
            const res = await fetch(`${API_URL}/sale_orders?${params}`);
            const result = await res.json();
            if (result.success) setOrders(result.orders);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [employeeId]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        return orders.map(o => mapOdooOrderToView(o))
            .filter(o => (activeTab === 'Todos' || o.status === activeTab) &&
                (searchTerm === '' || o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [orders, activeTab, searchTerm]);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30">
                <h1 className="text-xl font-bold text-gray-800">Mis Pedidos</h1>
                <Bell size={22} className="text-gray-600" />
            </header>
            <main className="p-4 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm"><div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Buscar pedido..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 outline-none" />
                </div></div>
                <div className="overflow-x-auto flex border-b border-gray-200 no-scrollbar">
                    {['Todos', 'Borrador/Enviado', 'Pendiente', 'En tránsito', 'Entregado', 'Cancelado'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${activeTab === tab ? 'border-[#a89076] text-[#a89076] font-bold' : 'border-transparent text-gray-500'}`}>{tab}</button>
                    ))}
                </div>
                <div className="space-y-3 pb-20">
                    {loading ? <div className="text-center py-10"><RefreshCw className="animate-spin inline" /></div> :
                     filteredOrders.map(order => <OrderCard key={order.id} order={order} onRefresh={fetchOrders} />)}
                </div>
            </main>
        </div>
    );
}
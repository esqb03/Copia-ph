import React, { useState, useRef, useCallback, useEffect } from "react"; // Añadido useEffect
import { User, Pencil, Bell, Mail, Phone } from "lucide-react";
import ProductSearchCard from "../components/ProductSearchCardMov";
import OrderPanel from "../components/OrderPanel";
import PartnerSelectModal from "../components/PartnerSelectModal";
import MinimalModal from "../components/MinimalModal";
import { openWompiUniversal } from "../lib/wompiLoader";
import { createPortal } from "react-dom"; 
import { refreshProducts } from "../lib/productCache";

// ... (Interfaces y Tipos sin cambios) ...
interface ProductBase { id: number | string; name: string; list_price?: number; price?: number | string; image_512?: string; qty_available: number; default_code?: string; description_sale?: string; [key: string]: any; }
interface CartItemType extends ProductBase { qty: number; }
interface PartnerType { id: number; name: string; email?: string; phone?: string; [key: string]: any; }
interface ModalState { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText: string; isDanger: boolean; showCancel: boolean; }
interface CreateOrderTestProps { onBack: () => void; }
interface PayWithWompiParams { order_id: number | string; amountInCents: number; currency: string; }
type ExpandedSections = { product: boolean; delivery: boolean; address: boolean; payment: boolean; };

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateOrderTest({ onBack }: CreateOrderTestProps) {
  
  // --- LÓGICA DE PERSISTENCIA (INICIO) ---
  
  // Estado del Carrito con lectura inicial de localStorage
  const [cart, setCart] = useState<CartItemType[]>(() => {
    const saved = localStorage.getItem("odoo_pending_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado del Cliente con lectura inicial de localStorage
  const [selectedPartner, setSelectedPartner] = useState<PartnerType | null>(() => {
    const saved = localStorage.getItem("odoo_pending_partner");
    return saved ? JSON.parse(saved) : null;
  });

  // Efecto para guardar el carrito automáticamente ante cualquier cambio
  useEffect(() => {
    localStorage.setItem("odoo_pending_cart", JSON.stringify(cart));
  }, [cart]);

  // Efecto para guardar el cliente automáticamente ante cualquier cambio
  useEffect(() => {
    localStorage.setItem("odoo_pending_partner", JSON.stringify(selectedPartner));
  }, [selectedPartner]);

  // --- LÓGICA DE PERSISTENCIA (FIN) ---

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const cartListRef = useRef<HTMLDivElement>(null);

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({ product: true, delivery: true, address: true, payment: true });
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {}, confirmText: "Aceptar", isDanger: false, showCancel: true });

  const getNumericPrice = useCallback((item: CartItemType): number => {
    if (typeof item.list_price === "number" && item.list_price > 0) return item.list_price;
    if (typeof item.price === "string") { const p = parseFloat(item.price.replace(/[$,\s]/g, "")); return Number.isNaN(p) ? 0 : p; }
    return typeof item.price === "number" ? item.price : 0;
  }, []);

  const computeAmountInCents = useCallback((items: CartItemType[]): number => {
    return Math.round(items.reduce((sum, it) => sum + getNumericPrice(it) * it.qty, 0) * 100);
  }, [getNumericPrice]);

  const toggleSection = useCallback((section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleAdd = useCallback((product: ProductBase) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const handleDecrease = useCallback((product: ProductBase) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.qty <= 1) return prev.filter((i) => i.id !== product.id);
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty - 1 } : i));
      }
      return prev;
    });
  }, []);

  const handleRemove = useCallback((productId: number | string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const handleQtyChange = useCallback((productId: number | string, newQty: number) => {
    if (newQty <= 0) { setCart((prev) => prev.filter((item) => item.id !== productId)); return; }
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item)));
  }, []);

  const payWithWompi = useCallback(async ({ order_id, amountInCents, currency }: PayWithWompiParams) => {
    try {
      const employeeIdStr = window.localStorage.getItem("employee_id");
      const payload = { order_id, amount_in_cents: amountInCents, currency, employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined };
      const res = await fetch(`${API_URL}/wompicol/widget-init`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Error en widget-init");
      const p = data.widgetParams || data.params || data;
      await openWompiUniversal({ currency: p.currency, amount_in_cents: p.amount_in_cents, reference: p.reference, public_key: p.public_key, redirect_url: p.redirect_url, signature: p.signature, customerData: p.customerData });
    } catch (err: any) {
      setModalState({ isOpen: true, title: "Error", message: err?.message || "Error al abrir pago", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "OK", isDanger: true, showCancel: false });
    }
  }, []);

  // Función para limpiar la persistencia una vez la orden se completa
  const clearPersistence = () => {
  localStorage.removeItem("odoo_pending_cart");
  localStorage.removeItem("odoo_pending_partner");
  setCart([]);
  setSelectedPartner(null);
};

const handleFinalizeOrder = useCallback(async () => {
  if (!selectedPartner) {
    setModalState({
      isOpen: true,
      title: "Cliente requerido",
      message: "Selecciona un cliente.",
      onConfirm: () => setModalState(p => ({ ...p, isOpen: false })),
      onCancel: () => {},
      confirmText: "Entendido",
      isDanger: false,
      showCancel: false,
    });
    return;
  }
  if (cart.length === 0) {
    setModalState({
      isOpen: true,
      title: "Carrito vacío",
      message: "Agrega productos.",
      onConfirm: () => setModalState(p => ({ ...p, isOpen: false })),
      onCancel: () => {},
      confirmText: "Entendido",
      isDanger: false,
      showCancel: false,
    });
    return;
  }

  const amountInCents = computeAmountInCents(cart);

  try {
    setOrderSubmitting(true);
    const employeeIdStr = window.localStorage.getItem("employee_id");
    const body = {
      partner_id: selectedPartner.id,
      order_line: cart.map(it => ({
        product_id: it.id,
        product_uom_qty: it.qty,
        price_unit: getNumericPrice(it),
      })),
      employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined,
    };

    const res = await fetch(`${API_URL}/create-sale-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Error al crear orden");
    }

    await refreshProducts();

    setModalState({
      isOpen: true,
      title: "¡Orden creada!",
      message: `Orden ${data.order_id} creada. ¿Pagar ahora?`,
      onConfirm: async () => {
        setModalState(p => ({ ...p, isOpen: false }));
        clearPersistence();
        await payWithWompi({
          order_id: data.order_id,
          amountInCents,
          currency: "COP",
        });
        await refreshProducts();
      },
      onCancel: async () => {
        setModalState(p => ({ ...p, isOpen: false }));
        clearPersistence();
        await refreshProducts();
      },
      confirmText: "Pagar ahora",
      isDanger: false,
      showCancel: true,
    });
  } catch (err: any) {
    setModalState({
      isOpen: true,
      title: "Error",
      message: err?.message || "Error al crear orden",
      onConfirm: () => setModalState(p => ({ ...p, isOpen: false })),
      onCancel: () => {},
      confirmText: "Continuar",
      isDanger: true,
      showCancel: false,
    });
  } finally {
    setOrderSubmitting(false);
  }
}, [cart, selectedPartner, computeAmountInCents, getNumericPrice, payWithWompi]);

  // ... (Resto del Render sin cambios) ...
  return (
    <div className="min-h-screen w-full bg-[#faf6f1] font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 md:sticky md:top-0 md:z-30">
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">Nuevo Pedido</h1>
        <button className="relative p-2 hover:bg-gray-100/80 rounded-full transition-colors" onClick={() => setShowNotifications((s) => !s)}>
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      <main className="p-4 sm:p-6 pb-48">
        <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
          
          {/* Tarjeta Cliente */}
          <div
            className={`shadow-sm border ${
              selectedPartner ? "bg-white border-[#a89076]/40" : "bg-white border-gray-100"
            }`}
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              clipPath: "inset(0px round 24px)",
            }}
          >
            <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#faf6f0] rounded-full flex items-center justify-center border border-[#eaddcf]">
                  <User className="w-4 h-4 text-[#a89076]" />
                </div>
                <h3 className="text-sm font-bold text-gray-700">Cliente</h3>
              </div>
              <button
                onClick={() => setIsPartnerModalOpen(true)}
                className="text-xs font-bold text-[#a89076] hover:text-[#8f7a63] bg-white border border-[#a89076]/30 px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> {selectedPartner ? "Cambiar" : "Seleccionar"}
              </button>
            </div>

            <div className="px-4 pt-3 pb-4 flex flex-col justify-center">
              {selectedPartner ? (
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-base text-gray-900 leading-tight">
                    {selectedPartner.name}
                  </div>
                  <div className="flex flex-col gap-1">
                    {selectedPartner.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={13} className="text-[#a89076]" />
                        <span className="truncate max-w-[260px]">
                          {selectedPartner.email}
                        </span>
                      </div>
                    )}
                    {selectedPartner.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={13} className="text-[#a89076]" />
                        <span>{selectedPartner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic py-1 flex items-center gap-2">
                  ⚠️ Ningún cliente seleccionado
                </div>
              )}
            </div>
          </div>



          <div className="h-6 flex items-center justify-center">
             <div className="h-full w-px border-l-2 border-dashed border-gray-200"></div>
          </div>

          {/* Panel de Orden */}
          <div 
            className="bg-white shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col"
            style={{ borderRadius: "24px", overflow: "hidden", clipPath: "inset(0px round 24px)" }}
          >
            <OrderPanel
                ref={cartListRef} 
                items={cart} 
                onRemove={handleRemove} 
                onQtyChange={handleQtyChange} 
                selectedPartner={selectedPartner} 
                onFinalizeOrder={handleFinalizeOrder} 
                isSubmitting={orderSubmitting} 
                expandedSections={expandedSections} 
                toggleSection={toggleSection} 
                orderDetails={{ orderNumber: "", delivery: { service: "Envío" }, address: "—" }}
                onAddProductsClick={() => setIsProductModalOpen(true)}
            />
          </div>
          
          <div className="h-24" />
        </div>
      </main>

      {/* --- MODALES --- */}
      {isProductModalOpen &&
      createPortal(
        <div className="fixed inset-0 w-full h-full z-[9999] bg-[#faf6f1] lg:hidden overflow-y-auto">
          <div className="min-h-screen flex flex-col pb-20">
            <ProductSearchCard
              onAdd={handleAdd}
              onDecrease={handleDecrease}
              cart={cart}
              setModalState={setModalState}
              onClose={() => setIsProductModalOpen(false)}
            />
          </div>
        </div>,
        document.body
      )}
      
      {isPartnerModalOpen && <PartnerSelectModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} initialPartner={selectedPartner} onPartnerSelect={(p: PartnerType) => setSelectedPartner(p)} />}
      <MinimalModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={modalState.onCancel} confirmText={modalState.confirmText} isDanger={modalState.isDanger} showCancel={modalState.showCancel} />
    </div>
  );
}
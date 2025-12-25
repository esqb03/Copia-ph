import React, { useState, useRef, useCallback, useEffect } from "react";
import { User, Pencil, Bell, Mail, Phone } from "lucide-react";
import ProductSearchCard from "../components/ProductSearchCard"; 
import OrderPanel from "../components/OrderPanel";
import PartnerSelectModal from "../components/PartnerSelectModal";
import MinimalModal from "../components/MinimalModal";
import { openWompiUniversal } from "../lib/wompiLoader";

// ---------------- TIPOS ----------------
interface ProductBase { id: number | string; name: string; list_price?: number; price?: number | string; image_512?: string; qty_available: number; default_code?: string; description_sale?: string; [key: string]: any; }
interface CartItemType extends ProductBase { qty: number; }
interface PartnerType { id: number; name: string; email?: string; phone?: string; [key: string]: any; }
interface ModalState { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText: string; isDanger: boolean; showCancel: boolean; }
interface CreateOrderTestProps { onBack: () => void; }
interface CreateSaleOrderResponse { success?: boolean; message?: string; order_id?: number | string; [key: string]: any; }
interface PayWithWompiParams { order_id: number | string; amountInCents: number; currency: string; }
type ExpandedSections = { product: boolean; delivery: boolean; address: boolean; payment: boolean; };

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateOrderTest({ onBack }: CreateOrderTestProps) {
  
  // --- LÓGICA DE PERSISTENCIA ---
  const [cart, setCart] = useState<CartItemType[]>(() => {
    const saved = localStorage.getItem("odoo_pending_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPartner, setSelectedPartner] = useState<PartnerType | null>(() => {
    const saved = localStorage.getItem("odoo_pending_partner");
    return saved ? JSON.parse(saved) : null;
  });

  // Guardado automático
  useEffect(() => {
    localStorage.setItem("odoo_pending_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("odoo_pending_partner", JSON.stringify(selectedPartner));
  }, [selectedPartner]);

  // Limpieza tras éxito
  const clearPersistence = () => {
    localStorage.removeItem("odoo_pending_cart");
    localStorage.removeItem("odoo_pending_partner");
    setCart([]);
    setSelectedPartner(null);
  };

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const cartListRef = useRef<HTMLDivElement>(null);

  const [expandedSections] = useState<ExpandedSections>({
    product: true, delivery: true, address: true, payment: true,
  });

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false, title: "", message: "",
    onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
    onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
    confirmText: "Aceptar", isDanger: false, showCancel: true,
  });

  // ---------------- HELPERS ----------------
  const getNumericPrice = useCallback((item: CartItemType): number => {
    if (typeof item.list_price === "number" && item.list_price > 0) return item.list_price;
    if (typeof item.price === "string") {
      const p = parseFloat(item.price.replace(/[$,\s]/g, ""));
      return Number.isNaN(p) ? 0 : p;
    }
    return typeof item.price === "number" ? item.price : 0;
  }, []);

  const computeAmountInCents = useCallback((items: CartItemType[]): number => {
    const subtotal = items.reduce((sum, it) => sum + getNumericPrice(it) * it.qty, 0);
    return Math.round(subtotal * 100);
  }, [getNumericPrice]);

  // ---------------- LÓGICA CARRITO ----------------
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
    if (newQty <= 0) { handleRemove(productId); return; }
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item)));
  }, [handleRemove]);

  // ---------------- WOMPI ----------------
  const payWithWompi = useCallback(async ({ order_id, amountInCents, currency }: PayWithWompiParams) => {
    try {
      const employeeIdStr = localStorage.getItem("employee_id");
      const res = await fetch(`${API_URL}/wompicol/widget-init`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id, amount_in_cents: amountInCents, currency, employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Error Wompi Init");
      const p = data.widgetParams || data.params || data;
      await openWompiUniversal({
        currency: p.currency, amount_in_cents: p.amount_in_cents ?? p.amountInCents,
        reference: p.reference, public_key: p.public_key ?? p.publicKey,
        redirect_url: p.redirect_url ?? p.redirectUrl, signature: p.signature, customerData: p.customerData,
      });
    } catch (err: any) {
      setModalState({ isOpen: true, title: "Error", message: err?.message || "Error al abrir pago", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "OK", isDanger: true, showCancel: false });
    }
  }, []);

  // ---------------- FINALIZAR ----------------
  const handleFinalizeOrder = useCallback(async () => {
    if (!selectedPartner) { setModalState({ isOpen: true, title: "Cliente requerido", message: "Selecciona un cliente.", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Entendido", isDanger: false, showCancel: false }); return; }
    if (cart.length === 0) { setModalState({ isOpen: true, title: "Carrito vacío", message: "Agrega productos.", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Entendido", isDanger: false, showCancel: false }); return; }

    const amountInCents = computeAmountInCents(cart);
    try {
      setOrderSubmitting(true);
      const employeeIdStr = localStorage.getItem("employee_id");
      const body = { partner_id: selectedPartner.id, order_line: cart.map(it => ({ product_id: it.id, product_uom_qty: it.qty, price_unit: getNumericPrice(it) })), employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined };
      
      const res = await fetch(`${API_URL}/create-sale-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data: CreateSaleOrderResponse = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Fallo al crear orden");

      setModalState({
        isOpen: true, title: "¡Orden creada!", message: `Orden ${data.order_id} creada. ¿Pagar ahora?`,
        onConfirm: async () => {
          setModalState(p => ({...p, isOpen: false}));
          clearPersistence();
          await payWithWompi({ order_id: data.order_id!, amountInCents, currency: "COP" });
        },
        onCancel: () => { setModalState(p => ({...p, isOpen: false})); clearPersistence(); },
        confirmText: "Pagar ahora", isDanger: false, showCancel: true,
      });
    } catch (err: any) {
      setModalState({ isOpen: true, title: "Error", message: err?.message || "Fallo al crear orden", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Continuar", isDanger: true, showCancel: false });
    } finally { setOrderSubmitting(false); }
  }, [cart, selectedPartner, computeAmountInCents, getNumericPrice, payWithWompi]);

  return (
    <div className="h-full w-full bg-[#faf6f1] flex flex-col font-sans">
      <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-hidden">
        <div className="h-full flex flex-row gap-6 overflow-hidden">
          
          <section className="flex-1 min-w-0 h-full">
            {/* Agregado handleDecrease para consistencia con ProductCard */}
            <ProductSearchCard 
              onAdd={handleAdd} 
              onDecrease={handleDecrease}
              cart={cart}
              setModalState={setModalState} 
            />
          </section>

          <section className="h-full flex flex-col gap-4 basis-[28%] max-w-sm min-w-[260px]">
            <div className={`rounded-[24px] shadow-sm border transition-all duration-300 overflow-hidden ${selectedPartner ? 'bg-white border-[#a89076]/40 ring-1 ring-[#a89076]/10' : 'bg-white border-gray-100'}`}>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#faf6f0] rounded-full flex items-center justify-center border border-[#eaddcf]">
                    <User className="w-4 h-4 text-[#a89076]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">Cliente</h3>
                </div>
                <button onClick={() => setIsPartnerModalOpen(true)} className="text-xs font-bold text-[#a89076] hover:text-[#8f7a63] bg-white border border-[#a89076]/30 px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1">
                  <Pencil className="w-3 h-3" /> {selectedPartner ? 'Cambiar' : 'Seleccionar'}
                </button>
              </div>
              <div className="p-4">
                {selectedPartner ? (
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-base text-gray-900 leading-tight">{selectedPartner.name}</div>
                    <div className="flex flex-col gap-1">
                       {selectedPartner.email && (
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                           <Mail size={13} className="text-[#a89076]" />
                           <span className="truncate">{selectedPartner.email}</span>
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
                  <div className="text-sm text-gray-400 italic py-1 flex items-center gap-2">⚠️ Ningún cliente seleccionado</div> 
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-[24px] shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col overflow-hidden">
              <OrderPanel
                ref={cartListRef}
                items={cart}
                onRemove={handleRemove}
                onQtyChange={handleQtyChange}
                selectedPartner={selectedPartner}
                onFinalizeOrder={handleFinalizeOrder}
                isSubmitting={orderSubmitting}
                expandedSections={expandedSections}
                toggleSection={() => {}} 
                orderDetails={{ orderNumber: "", delivery: { service: "Envío" }, address: "—" }}
              />
            </div>
          </section>
        </div>
      </main>

      {isPartnerModalOpen && (
        <PartnerSelectModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} initialPartner={selectedPartner} onPartnerSelect={(p: PartnerType) => setSelectedPartner(p)} />
      )}

      <MinimalModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={modalState.onCancel} confirmText={modalState.confirmText} isDanger={modalState.isDanger} showCancel={modalState.showCancel} />
    </div>
  );
}
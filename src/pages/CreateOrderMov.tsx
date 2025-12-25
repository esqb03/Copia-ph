import React, { useState, useRef, useCallback } from "react";
import { User, Pencil, Bell, Plus, X } from "lucide-react";
import ProductSearchCard from "../components/ProductSearchCardMov";
import OrderPanel from "../components/OrderPanel";
import PartnerSelectModal from "../components/PartnerSelectModal";
import MinimalModal from "../components/MinimalModal";
import { openWompiUniversal } from "../lib/wompiLoader";
import { createPortal } from "react-dom"; 

// --- Interfaces ---
interface ProductBase { id: number | string; name: string; list_price?: number; price?: number | string; image_512?: string; qty_available: number; default_code?: string; description_sale?: string; [key: string]: any; }
interface CartItemType extends ProductBase { qty: number; }
interface PartnerType { id: number; name: string; email?: string; phone?: string; [key: string]: any; }
interface ModalState { isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText: string; isDanger: boolean; showCancel: boolean; }
interface CreateOrderTestProps { onBack: () => void; }
interface PayWithWompiParams { order_id: number | string; amountInCents: number; currency: string; }
type ExpandedSections = { product: boolean; delivery: boolean; address: boolean; payment: boolean; };

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateOrderTest({ onBack }: CreateOrderTestProps) {
  // --- Estados ---
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerType | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const cartListRef = useRef<HTMLDivElement>(null);

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({ product: true, delivery: true, address: true, payment: true });
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, title: "", message: "", onConfirm: () => {}, onCancel: () => {}, confirmText: "Aceptar", isDanger: false, showCancel: true });

  // --- Helpers de Cálculo ---
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

  // --- Gestión del Carrito ---
  const handleAdd = useCallback((product: ProductBase) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  // NUEVO: Función para restar cantidad
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

  // --- Lógica de Pedido y Pago ---
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

  const handleFinalizeOrder = useCallback(async () => {
    if (!selectedPartner) { setModalState({ isOpen: true, title: "Cliente requerido", message: "Selecciona un cliente.", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Entendido", isDanger: false, showCancel: false }); return; }
    if (cart.length === 0) { setModalState({ isOpen: true, title: "Carrito vacío", message: "Agrega productos.", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Entendido", isDanger: false, showCancel: false }); return; }
    const amountInCents = computeAmountInCents(cart);
    try {
      setOrderSubmitting(true);
      const employeeIdStr = window.localStorage.getItem("employee_id");
      const body = { partner_id: selectedPartner.id, order_line: cart.map(it => ({ product_id: it.id, product_uom_qty: it.qty, price_unit: getNumericPrice(it) })), employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined };
      const res = await fetch(`${API_URL}/create-sale-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Error al crear orden");
      setModalState({ isOpen: true, title: "¡Orden creada!", message: `Orden ${data.order_id} creada. ¿Pagar ahora?`, onConfirm: async () => { setModalState(p => ({...p, isOpen: false})); setCart([]); await payWithWompi({ order_id: data.order_id, amountInCents, currency: "COP" }); }, onCancel: () => { setModalState(p => ({...p, isOpen: false})); setCart([]); }, confirmText: "Pagar ahora", isDanger: false, showCancel: true });
    } catch (err: any) {
      setModalState({ isOpen: true, title: "Error", message: err?.message || "Error al crear orden", onConfirm: () => setModalState(p => ({...p, isOpen: false})), onCancel: () => {}, confirmText: "Continuar", isDanger: true, showCancel: false });
    } finally { setOrderSubmitting(false); }
  }, [cart, selectedPartner, computeAmountInCents, getNumericPrice, payWithWompi]);

  // --- Render ---
  return (
    <div className="h-full w-full bg-[#faf6f1] flex flex-col min-h-screen">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30">
        <h1 className="text-lg font-semibold text-gray-800">Nuevo Pedido</h1>
        <button className="relative p-1 hover:bg-gray-50 rounded-lg" onClick={() => setShowNotifications((s) => !s)}>
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      <main className="p-4 sm:p-6 flex-1 overflow-y-auto pb-48">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#faf6f0] rounded-full flex items-center justify-center"><User className="w-4 h-4 text-[#a89076]" /></div>
                <h3 className="text-sm font-semibold text-gray-800">Cliente:</h3>
              </div>
              <button onClick={() => setIsPartnerModalOpen(true)} className="text-xs text-[#a89076] hover:text-[#967d63] flex items-center gap-1"><Pencil className="w-3 h-3" /> Agregar</button>
            </div>
            <div className="p-4 space-y-1">
              {selectedPartner ? (<><div className="font-semibold text-sm text-gray-900 truncate">{selectedPartner.name}</div><div className="text-xs text-gray-600">ID: <span className="font-mono">{selectedPartner.id}</span></div></>) : ( <div className="text-sm text-red-500">⚠️ Cliente no seleccionado</div> )}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setIsProductModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#a89076]/50 text-[#a89076] hover:bg-[#faf6f1] transition"><Plus className="w-4 h-4" /> Agregar productos</button>
          </div>

          <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            <OrderPanel ref={cartListRef} items={cart} onRemove={handleRemove} onQtyChange={handleQtyChange} selectedPartner={selectedPartner} onFinalizeOrder={handleFinalizeOrder} isSubmitting={orderSubmitting} expandedSections={expandedSections} toggleSection={toggleSection} orderDetails={{ orderNumber: "", delivery: { service: "Envío" }, address: "—" }} />
          </div>
          <div className="h-24" />
        </div>
      </main>

      {/* --- Modales --- */}
      {isProductModalOpen && createPortal(
        <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden z-[50] bg-[#faf6f1] flex flex-col lg:hidden">
          <div className="flex-1 overflow-y-auto pb-20">
            <ProductSearchCard 
                onAdd={handleAdd} 
                onDecrease={handleDecrease} // Conectado
                cart={cart}                 // Conectado
                setModalState={setModalState} 
                onClose={() => setIsProductModalOpen(false)} 
            />
          </div>
        </div>, document.body
      )}
      
      {isPartnerModalOpen && <PartnerSelectModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} initialPartner={selectedPartner} onPartnerSelect={(p: PartnerType) => setSelectedPartner(p)} />}
      <MinimalModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={modalState.onCancel} confirmText={modalState.confirmText} isDanger={modalState.isDanger} showCancel={modalState.showCancel} />
    </div>
  );
}
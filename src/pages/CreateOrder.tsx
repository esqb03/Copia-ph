import React, { useState, useRef, useCallback } from "react";
import { User, Pencil, Bell } from "lucide-react";
import ProductSearchCard from "../components/ProductSearchCard";
import OrderPanel from "../components/OrderPanel";
import PartnerSelectModal from "../components/PartnerSelectModal";
import MinimalModal from "../components/MinimalModal";
import { openWompiUniversal } from "../lib/wompiLoader";

// ---------------- TIPOS ----------------

interface ProductBase {
  id: number | string;
  name: string;
  list_price?: number;
  price?: number | string;
  image_512?: string;
  qty_available: number;
  default_code?: string;
  description_sale?: string;
  [key: string]: any;
}

interface CartItemType extends ProductBase {
  qty: number;
}

interface PartnerType {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  isDanger: boolean;
  showCancel: boolean;
}

interface CreateOrderTestProps {
  onBack: () => void;
}

interface CreateSaleOrderResponse {
  success?: boolean;
  message?: string;
  order_id?: number | string;
  payment_link?: string;
  link_error_details?: string;
  access_token?: string;
  [key: string]: any;
}

interface PayWithWompiParams {
  order_id: number | string;
  amountInCents: number;
  currency: string;
}

type ExpandedSections = {
  product: boolean;
  delivery: boolean;
  address: boolean;
  payment: boolean;
};

// --------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateOrderTest({ onBack }: CreateOrderTestProps) {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerType | null>(null);

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const cartListRef = useRef<HTMLDivElement>(null);

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    product: true,
    delivery: true,
    address: true,
    payment: true,
  });

  const toggleSection = useCallback((section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
    onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
    confirmText: "Aceptar",
    isDanger: false,
    showCancel: true,
  });

  // ---------------- HELPERS PRECIOS / TOTALES ----------------
  const getNumericPrice = useCallback((item: CartItemType): number => {
    if (typeof item.list_price === "number" && item.list_price > 0) {
      return item.list_price;
    }
    if (typeof item.price === "string") {
      const priceString = item.price.replace(/[$,\s]/g, "");
      const numericPrice = parseFloat(priceString);
      return Number.isNaN(numericPrice) ? 0 : numericPrice;
    }
    if (typeof item.price === "number") {
      return item.price;
    }
    return 0;
  }, []);

  const computeAmountInCents = useCallback(
    (items: CartItemType[]): number => {
      const subtotal = items.reduce((sum, it) => sum + getNumericPrice(it) * it.qty, 0);
      return Math.round(subtotal * 100);
    },
    [getNumericPrice]
  );

  // ---------------- LÓGICA DE CARRITO ----------------

  const handleAdd = useCallback(
    (product: ProductBase) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
        }
        return [...prev, { ...product, qty: 1 }];
      });

      if (cartListRef.current) {
        cartListRef.current.scrollTop = cartListRef.current.scrollHeight;
      }
    },
    []
  );

  const handleRemove = useCallback((productId: number | string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const handleQtyChange = useCallback((productId: number | string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  }, []);

  // ---------------- PAGO CON WOMPI ----------------

  const payWithWompi = useCallback(
    async ({ order_id, amountInCents, currency }: PayWithWompiParams) => {
      try {
        const employeeIdStr = window.localStorage.getItem("employee_id");

        const payload = {
          order_id,
          amount_in_cents: amountInCents,
          currency,
          employee_id: employeeIdStr ? parseInt(employeeIdStr, 10) : undefined,
        };

        const res = await fetch(`${API_URL}/wompicol/widget-init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Respuesta no JSON de /wompicol/widget-init: ${text.slice(0, 200)}`);
        }

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || `Error en widget-init: HTTP ${res.status} ${res.statusText}`);
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
        console.error("[WOMPI] payWithWompi error:", err);
        setModalState({
          isOpen: true,
          title: "No se pudo abrir el pago",
          message: err?.message || String(err) || "Error desconocido",
          onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
          onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
          confirmText: "OK",
          isDanger: true,
          showCancel: false,
        });
      }
    },
    []
  );

  // ---------------- CREAR ORDEN + DISPARAR PAGO ----------------

  const handleFinalizeOrder = useCallback(async () => {
    if (!selectedPartner) {
      setModalState({
        isOpen: true,
        title: "Cliente requerido",
        message: "Selecciona un cliente antes de crear la orden.",
        onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
        onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
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
        message: "Agrega al menos un producto para crear la orden.",
        onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
        onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
        confirmText: "Entendido",
        isDanger: false,
        showCancel: false,
      });
      return;
    }

    const amountInCents = computeAmountInCents(cart);
    const currency = "COP";

    try {
      setOrderSubmitting(true);

      const order_line = cart.map((it) => ({
        product_id: it.id,
        product_uom_qty: it.qty,
        name: it.name || "",
        price_unit: getNumericPrice(it),
      }));

      const employeeIdStr = window.localStorage.getItem("employee_id");
      const employee_id = employeeIdStr ? parseInt(employeeIdStr, 10) : undefined;

      const body: any = {
        partner_id: selectedPartner.id,
        order_line,
      };

      if (employee_id && !Number.isNaN(employee_id)) {
        body.employee_id = employee_id;
      }

      const res = await fetch(`${API_URL}/create-sale-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data: CreateSaleOrderResponse;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta no JSON al crear la orden:", text);
        throw new Error("El servidor devolvió una respuesta no válida al crear la orden.");
      }

      if (!res.ok || data?.success === false) {
        const msg = data?.message || `Error HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      }

      const orderId = data.order_id;
      if (!orderId) {
        setModalState({
          isOpen: true,
          title: "Orden creada",
          message:
            "La orden ha sido creada exitosamente, pero no se pudo iniciar el pago en línea (faltó order_id en la respuesta).",
          onConfirm: () => {
            setModalState((p) => ({ ...p, isOpen: false }));
            setCart([]);
          },
          onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
          confirmText: "Aceptar",
          isDanger: false,
          showCancel: false,
        });
        return;
      }

      if (amountInCents <= 0) {
        setModalState({
          isOpen: true,
          title: "Orden creada",
          message: "La orden ha sido creada exitosamente.",
          onConfirm: () => {
            setModalState((p) => ({ ...p, isOpen: false }));
            setCart([]);
          },
          onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
          confirmText: "Aceptar",
          isDanger: false,
          showCancel: false,
        });
        return;
      }

      setModalState({
        isOpen: true,
        title: "¡Orden creada!",
        message: `Orden de Venta ${orderId} creada con éxito. ¿Deseas pagar ahora con Wompi?`,
        onConfirm: async () => {
          setModalState((p) => ({ ...p, isOpen: false }));
          setCart([]);
          await payWithWompi({
            order_id: orderId,
            amountInCents,
            currency,
          });
        },
        onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
        confirmText: "Pagar ahora",
        isDanger: false,
        showCancel: true,
      });
    } catch (err: any) {
      console.error("Error creando la orden:", err);
      setModalState({
        isOpen: true,
        title: "Error",
        message: err?.message || "Ocurrió un error al crear la orden.",
        onConfirm: () => setModalState((p) => ({ ...p, isOpen: false })),
        onCancel: () => setModalState((p) => ({ ...p, isOpen: false })),
        confirmText: "Continuar",
        isDanger: true,
        showCancel: false,
      });
    } finally {
      setOrderSubmitting(false);
    }
  }, [cart, selectedPartner, computeAmountInCents, getNumericPrice, payWithWompi]);

  // Datos “opcionales” para el header/address del OrderPanel
  const orderDetails = {
    orderNumber: "",
    delivery: { service: "Envío" },
    address: "—",
  };

  return (
    <div className="h-full w-full bg-[#faf6f1] flex flex-col">
      {/* HEADER MOBILE */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 lg:hidden">
        <h1 className="text-xl font-semibold text-gray-800">Nuevo Pedido</h1>
        <button
          className="relative p-1 hover:bg-gray-50 rounded-lg"
          onClick={() => setShowNotifications((s) => !s)}
        >
          <Bell size={20} className="text-gray-600" />
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-hidden">
        <div className="h-full flex flex-row gap-6 overflow-hidden">
          {/* IZQUIERDA: Productos */}
          <section className="flex-1 min-w-0 h-full">
            <ProductSearchCard onAdd={handleAdd} setModalState={setModalState} />
          </section>

          {/* DERECHA: Cliente + OrderPanel */}
          <section className="h-full flex flex-col gap-4 basis-[28%] max-w-sm min-w-[260px]">
            {/* Card Cliente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#faf6f0] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#a89076]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">Cliente:</h3>
                </div>

                <button
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="text-xs text-[#a89076] hover:text-[#967d63] flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" /> Agregar
                </button>
              </div>

              <div className="p-4 space-y-1">
                {selectedPartner ? (
                  <>
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {selectedPartner.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      ID: <span className="font-mono">{selectedPartner.id}</span>
                    </div>
                    {selectedPartner.email && (
                      <div className="text-xs text-gray-500 truncate">{selectedPartner.email}</div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-red-500">⚠️ Cliente no seleccionado</div>
                )}
              </div>
            </div>

            {/* ✅ OrderPanel dentro de una Card (igual al patrón de ProductSearchCard) */}
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
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
                orderDetails={orderDetails}
              />
            </div>
          </section>
        </div>
      </main>

      {/* MODAL DE CLIENTE */}
      {isPartnerModalOpen && (
        <PartnerSelectModal
          isOpen={isPartnerModalOpen}
          onClose={() => setIsPartnerModalOpen(false)}
          initialPartner={selectedPartner}
          onPartnerSelect={(p: PartnerType) => setSelectedPartner(p)}
        />
      )}

      {/* MODAL DE MENSAJES */}
      <MinimalModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        confirmText={modalState.confirmText}
        isDanger={modalState.isDanger}
        showCancel={modalState.showCancel}
      />
    </div>
  );
}


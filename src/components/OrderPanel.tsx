import React, { useMemo, forwardRef } from "react";
import { 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Plus, 
  Minus, 
  Box, 
  Truck, 
  CreditCard 
} from "lucide-react";

// --- Tipos (Compatibles con tu código actual) ---
type CartItem = any;
type Partner = any;

type ExpandedSections = {
  product: boolean;
  delivery: boolean;
  address: boolean;
  payment: boolean;
};

type OrderDetailsLike = {
  orderNumber?: string;
  delivery?: { service?: string };
  address?: string;
};

interface OrderPanelProps {
  items: CartItem[];
  onRemove: (productId: number | string) => void;
  onQtyChange: (productId: number | string, newQty: number) => void;
  selectedPartner: Partner | null;
  onFinalizeOrder: () => void;
  isSubmitting: boolean;
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;
  orderDetails?: OrderDetailsLike;
}

// --- Helpers ---
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const getNumericPrice = (item: CartItem): number => {
  if (typeof item.list_price === "number" && item.list_price > 0) return item.list_price;
  if (typeof item.price === "string") {
    const priceString = item.price.replace(/[$,\s]/g, "");
    const numericPrice = parseFloat(priceString);
    return isNaN(numericPrice) ? 0 : numericPrice;
  }
  if (typeof item.price === "number") return item.price;
  return 0;
};

function resolveImageSrc(image_512?: string) {
  if (!image_512 || typeof image_512 !== "string") return null;
  const trimmed = image_512.trim();
  if (trimmed.length < 20) return null;
  if (trimmed.startsWith("data:image/")) return trimmed;
  return `data:image/png;base64,${trimmed}`;
}

// --- Componente Principal ---
const OrderPanel = forwardRef<HTMLDivElement, OrderPanelProps>((props, ref) => {
  const {
    items,
    onRemove,
    onQtyChange,
    onFinalizeOrder,
    isSubmitting,
    expandedSections,
    toggleSection,
    orderDetails,
  } = props;

  // Cálculos
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + getNumericPrice(item) * (item.qty || 0), 0);
  }, [items]);

  const homeDelivery = 0;
  const grandTotal = subtotal + homeDelivery; // Sin impuestos

  return (
    <div ref={ref} className="flex flex-col h-full bg-[#f8f9fa]">
      
      {/* 1. Header del Panel */}
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#faf6f1] flex items-center justify-center text-[#a89076] border border-[#eaddcf]">
            <Box size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Detalle Orden</h2>
            <p className="text-[10px] text-gray-400 font-medium">
              {orderDetails?.orderNumber || "Nueva Orden"}
            </p>
          </div>
        </div>
        <div className="text-xs font-bold text-[#a89076] bg-[#faf6f1] px-2 py-1 rounded-md">
           {items.length} Items
        </div>
      </div>

      {/* 2. Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* SECCIÓN: PRODUCTOS */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => toggleSection("product")}
            className="w-full flex items-center justify-between p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Package size={14} className="text-[#a89076]" /> Productos
            </span>
            {expandedSections.product ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {expandedSections.product && (
            <div className="p-3 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center gap-2 text-gray-300">
                   <Package size={32} strokeWidth={1.5} />
                   <span className="text-xs font-medium">Carrito vacío</span>
                </div>
              ) : (
                items.map((item) => {
                  const unitPrice = getNumericPrice(item);
                  const lineTotal = unitPrice * (item.qty || 0);
                  const imgSrc = resolveImageSrc(item.image_512);

                  return (
                    <div key={item.id} className="flex gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm relative group transition-all hover:shadow-md">
                      {/* Imagen */}
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-1 border border-gray-50 overflow-hidden">
                        {imgSrc ? (
                          <img src={imgSrc} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <Package className="text-gray-300 opacity-50" size={20} />
                        )}
                      </div>

                      {/* Info Central */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight" title={item.name}>
                             {item.name}
                          </h4>
                          <div className="text-[10px] text-gray-400 mt-0.5 font-medium">
                            {formatCurrency(unitPrice)} x unidad
                          </div>
                        </div>
                        <div className="text-xs font-black text-[#a89076]">
                          {formatCurrency(lineTotal)}
                        </div>
                      </div>

                      {/* Controles (Derecha) */}
                      <div className="flex flex-col items-end justify-between pl-1">
                         {/* Eliminar (Discreto) */}
                         <button 
                           onClick={() => onRemove(item.id)}
                           className="text-gray-300 hover:text-red-500 p-1 -mr-1 transition-colors active:scale-90"
                           title="Eliminar"
                         >
                           <Trash2 size={14} />
                         </button>

                         {/* Contador Cápsula (Estilo Premium) */}
                         <div className="flex items-center bg-[#faf6f1] rounded-full p-0.5 border border-[#eaddcf] shadow-sm">
                           <button 
                             onClick={() => onQtyChange(item.id, (item.qty || 0) - 1)}
                             className="w-6 h-6 flex items-center justify-center bg-white text-[#a89076] rounded-full shadow-sm active:scale-90 transition-transform hover:bg-[#a89076] hover:text-white"
                           >
                             <Minus size={10} strokeWidth={3} />
                           </button>
                           
                           <span className="w-7 text-center text-xs font-bold text-gray-700 select-none tabular-nums">
                              {item.qty}
                           </span>
                           
                           <button 
                             onClick={() => onQtyChange(item.id, (item.qty || 0) + 1)}
                             className="w-6 h-6 flex items-center justify-center bg-white text-[#a89076] rounded-full shadow-sm active:scale-90 transition-transform hover:bg-[#a89076] hover:text-white"
                           >
                             <Plus size={10} strokeWidth={3} />
                           </button>
                         </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN: ENVÍO */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
           <button 
             onClick={() => toggleSection("delivery")}
             className="w-full flex items-center justify-between p-4 bg-gray-50/30 hover:bg-gray-50 transition-colors"
           >
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Truck size={16} />
                 </div>
                 <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Envío Estándar</p>
                    <p className="text-[10px] text-gray-500">
                       {orderDetails?.delivery?.service || "Entrega a domicilio"}
                    </p>
                 </div>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Gratis</span>
           </button>
        </div>

        {/* SECCIÓN: TOTALES (Sin Impuestos) */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-2">
               <CreditCard size={14} className="text-[#a89076]" /> Resumen de Pago
            </h3>
            
            <div className="flex justify-between text-xs text-gray-600">
               <span>Subtotal ({items.length} items)</span>
               <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-600">
               <span>Envío</span>
               <span className="font-medium text-green-600">$ 0</span>
            </div>

            {/* Separador */}
            <div className="border-t border-dashed border-gray-200 my-2 pt-2">
               <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-800">Total a Pagar</span>
                  <span className="text-xl font-black text-gray-900 leading-none">{formatCurrency(grandTotal)}</span>
               </div>
            </div>
        </div>
      </div>

      {/* 3. Footer Fijo (Botón de Acción) */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-20 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex gap-3">
             {/* Cancelar (Pequeño) */}
             <button
               onClick={() => {}} // Opcional: Lógica para vaciar
               disabled={isSubmitting || items.length === 0}
               className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
             >
               <Trash2 size={20} />
             </button>

             {/* Procesar (Grande) */}
             <button
                onClick={onFinalizeOrder}
                disabled={isSubmitting || items.length === 0}
                className={`
                   flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg transform transition-all active:scale-[0.98]
                   flex items-center justify-center gap-2
                   ${isSubmitting || items.length === 0
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                     : "bg-[#a89076] text-white shadow-[#a89076]/30 hover:bg-[#967d63]"
                   }
                `}
             >
                {isSubmitting ? "Procesando..." : "PROCESAR PEDIDO"}
             </button>
         </div>
      </div>
    </div>
  );
});

export default OrderPanel;